import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Calendar,
  User,
  Download,
  FileText,
} from "lucide-react";
import GlassCard from "../components/layout/GlassCard";
import { getEvidenceById } from "../services/evidenceService";

export default function EvidenceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidence();
  }, [id]);

  async function loadEvidence() {
    try {
      const data = await getEvidenceById(id);
      setEvidence(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load evidence.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading evidence...
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="text-center py-20 text-red-400">
        Evidence not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate("/evidence")}
        className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
      >
        <ArrowLeft size={18}/>
        Back to Evidence
      </button>

      <div>
        <h1 className="text-3xl font-black text-white">
          Evidence Details
        </h1>

        <p className="text-cyan-300 mt-1">
          Evidence ID: {evidence.evidenceId}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <GlassCard className="lg:col-span-2 p-6 space-y-5">

          <div className="flex items-center gap-3">
            <Shield className="text-cyan-400"/>
            <h2 className="text-xl font-bold">
              Evidence Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <p className="text-gray-400 text-sm">Evidence ID</p>
              <p className="font-semibold">{evidence.evidenceId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Case Number</p>
              <p className="font-semibold">{evidence.caseNumber}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Type</p>
              <p>{evidence.evidenceType}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Status</p>

              <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                {evidence.status}
              </span>
            </div>

          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">
              Description
            </p>

            <div className="rounded-xl bg-[#071929] border border-white/10 p-4">
              {evidence.description || "No description available."}
            </div>
          </div>

        </GlassCard>

        <GlassCard className="p-6 space-y-5">

          <div className="flex items-center gap-3">
            <FileText className="text-cyan-400"/>
            <h2 className="font-bold">
              Evidence Record
            </h2>
          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <Calendar className="text-cyan-400" size={18}/>
              <div>
                <p className="text-xs text-gray-400">Collected</p>
                <p>
                  {evidence.collectionDate || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="text-cyan-400" size={18}/>
              <div>
                <p className="text-xs text-gray-400">Officer</p>
                <p>
                  {evidence.officerName || "N/A"}
                </p>
              </div>
            </div>

          </div>

          <button
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 hover:bg-cyan-500 transition"
          >
            <Download size={18}/>
            Download Evidence
          </button>

        </GlassCard>

      </div>

    </div>
  );
}