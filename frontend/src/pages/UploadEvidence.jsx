import { useEffect, useState } from "react";
import { Upload, File, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/layout/GlassCard";
import { getCases } from "../services/caseService";
import { uploadEvidence } from "../services/evidenceService";

export default function UploadEvidence() {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    caseId: "",
    evidenceId: "",
    evidenceType: "Document",
    description: "",
  });

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      const data = await getCases();
      setCases(data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e) {
    setFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("caseId", form.caseId);
      formData.append("evidenceId", form.evidenceId);
      formData.append("evidenceType", form.evidenceType);
      formData.append("description", form.description);

      await uploadEvidence(formData);

      alert("Evidence uploaded successfully.");
      navigate("/evidence");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-white">
          Upload Evidence
        </h1>

        <p className="text-cyan-300">
          Store evidence securely in the backend
        </p>
      </div>

      <GlassCard className="p-6">

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label>Case</label>

            <select
              name="caseId"
              value={form.caseId}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3"
            >
              <option value="">Select Case</option>

              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label>Evidence ID</label>

              <input
                name="evidenceId"
                value={form.evidenceId}
                onChange={handleChange}
                required
                placeholder="EV-2026-001"
                className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3"
              />
            </div>

            <div>
              <label>Evidence Type</label>

              <select
                name="evidenceType"
                value={form.evidenceType}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3"
              >
                <option>Document</option>
                <option>Fingerprint</option>
                <option>DNA</option>
                <option>Weapon</option>
                <option>Digital</option>
              </select>
            </div>

          </div>

          <div>
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3"
            />
          </div>

          <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-8 text-center">

            <Upload className="mx-auto text-cyan-400 mb-3" size={42}/>

            <label className="cursor-pointer">

              <span className="text-cyan-300">
                Click to choose evidence file
              </span>

              <input
                type="file"
                onChange={handleFile}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-400 mt-2">
              PDF, JPG, PNG, MP4, ZIP
            </p>

            {file && (
              <div className="mt-4 flex items-center justify-center gap-3 bg-[#071929] rounded-xl p-3">

                <File className="text-cyan-400"/>

                <span className="text-sm">{file.name}</span>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                >
                  <X className="text-red-400"/>
                </button>

              </div>
            )}

          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-xl bg-cyan-600 py-3 font-semibold hover:bg-cyan-500 disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Evidence"}
          </button>

        </form>

      </GlassCard>

    </div>
  );
}