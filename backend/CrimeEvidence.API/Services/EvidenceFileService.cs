
using CrimeEvidence.API.Data;
using CrimeEvidence.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CrimeEvidence.API.Services;

public class EvidenceFileService
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    private const long MaxFileSize = 10 * 1024 * 1024;

    private static readonly Dictionary<string, (string ContentType, byte[] Signature)> AllowedFiles =
        new(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"] = (
                "application/pdf",
                new byte[] { 0x25, 0x50, 0x44, 0x46, 0x2D }),

            [".jpg"] = (
                "image/jpeg",
                new byte[] { 0xFF, 0xD8, 0xFF }),

            [".jpeg"] = (
                "image/jpeg",
                new byte[] { 0xFF, 0xD8, 0xFF }),

            [".png"] = (
                "image/png",
                new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A })
        };

    public EvidenceFileService(
        ApplicationDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // Upload file against an existing evidence record.
    public async Task<Evidence> UploadAsync(
        IFormFile file,
        int caseId,
        string evidenceNumber,
        int uploadedBy)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException(
                "Please select a valid file.");

        if (file.Length > MaxFileSize)
            throw new ArgumentException(
                "File size cannot exceed 10 MB.");

        // Validate extension.
        var extension = Path.GetExtension(file.FileName);

        if (string.IsNullOrWhiteSpace(extension) ||
            !AllowedFiles.TryGetValue(extension, out var fileInfo))
        {
            throw new ArgumentException(
                "Only PDF, JPG, JPEG and PNG files are allowed.");
        }

        // Verify evidence and selected case.
        var evidence = await _context.Evidences
            .FirstOrDefaultAsync(e =>
                e.EvidenceNumber == evidenceNumber &&
                e.CaseId == caseId);

        if (evidence == null)
            throw new ArgumentException(
                "Evidence not found in the selected case.");

        // Only one file is allowed per evidence record.
        if (!string.IsNullOrWhiteSpace(evidence.FilePath))
            throw new ArgumentException(
                "A file is already attached to this evidence.");

        // Verify uploader exists.
        var uploaderExists = await _context.Users
            .AnyAsync(u => u.Id == uploadedBy);

        if (!uploaderExists)
            throw new ArgumentException(
                "Uploader account not found.");

        // Validate actual file signature.
        await using var inputStream = file.OpenReadStream();

        var signature = new byte[fileInfo.Signature.Length];

        var bytesRead = await inputStream.ReadAsync(
            signature.AsMemory(0, signature.Length));

        if (bytesRead != fileInfo.Signature.Length ||
            !signature.SequenceEqual(fileInfo.Signature))
        {
            throw new ArgumentException(
                "File content does not match its extension.");
        }

        // Private storage outside wwwroot.
        var uploadFolder = Path.Combine(
            _environment.ContentRootPath,
            "PrivateStorage",
            "EvidenceFiles");

        Directory.CreateDirectory(uploadFolder);

        // Generate a random physical filename.
        var storedFileName =
            $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";

        var physicalPath = Path.Combine(
            uploadFolder,
            storedFileName);

        // Store only the filename in the database.
        var relativePath = storedFileName;

        try
        {
            await using (var outputStream = new FileStream(
                physicalPath,
                FileMode.CreateNew,
                FileAccess.Write,
                FileShare.None))
            {
                inputStream.Position = 0;

                await inputStream.CopyToAsync(outputStream);
            }

            // Save file metadata.
            evidence.FileName = Path.GetFileName(file.FileName);
            evidence.StoredFileName = storedFileName;
            evidence.FilePath = relativePath;
            evidence.ContentType = fileInfo.ContentType;
            evidence.FileSize = file.Length;
            evidence.UploadedAt = DateTime.UtcNow;
            evidence.UploadedBy = uploadedBy;

            await _context.SaveChangesAsync();

            return evidence;
        }
        catch
        {
            // Remove physical file if database save fails.
            if (File.Exists(physicalPath))
                File.Delete(physicalPath);

            throw;
        }
    }

    // Download file from private storage.
    public async Task<(Stream Stream, string ContentType, string FileName)?>
        DownloadAsync(int evidenceId)
    {
        var evidence = await _context.Evidences
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == evidenceId);

        if (evidence == null ||
            string.IsNullOrWhiteSpace(evidence.FilePath))
        {
            return null;
        }

        // Resolve private storage directory.
        var storageRoot = Path.GetFullPath(
            Path.Combine(
                _environment.ContentRootPath,
                "PrivateStorage",
                "EvidenceFiles"));

        // Resolve actual file path.
        var physicalPath = Path.GetFullPath(
            Path.Combine(
                storageRoot,
                evidence.FilePath));

        // Prevent directory traversal.
        var relative = Path.GetRelativePath(
            storageRoot,
            physicalPath);

        if (relative == ".." ||
            relative.StartsWith(
                ".." + Path.DirectorySeparatorChar,
                StringComparison.Ordinal) ||
            Path.IsPathRooted(relative))
        {
            throw new InvalidOperationException(
                "Invalid evidence storage path.");
        }

        if (!File.Exists(physicalPath))
        {
            throw new FileNotFoundException(
                "Evidence file is missing from private storage.");
        }

        var stream = new FileStream(
            physicalPath,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read);

        return (
            stream,
            evidence.ContentType ?? "application/octet-stream",
            evidence.FileName ?? "evidence-file"
        );
    }
}
