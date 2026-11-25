using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrimeEvidence.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEvidenceFileMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "Evidences",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Evidences",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "Evidences",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "FileSize",
                table: "Evidences",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StoredFileName",
                table: "Evidences",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UploadedAt",
                table: "Evidences",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UploadedBy",
                table: "Evidences",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "FileSize",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "StoredFileName",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "UploadedAt",
                table: "Evidences");

            migrationBuilder.DropColumn(
                name: "UploadedBy",
                table: "Evidences");
        }
    }
}
