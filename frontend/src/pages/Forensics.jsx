import { useEffect, useState } from "react";
import { FlaskConical, Clock, CheckCircle2 } from "lucide-react";
import GlassCard from "../components/layout/GlassCard";
import { getForensicJobs } from "../services/forensicService";

export default function Forensics() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const data = await getForensicJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">
          Forensic Laboratory
        </h1>

        <p className="text-cyan-300 mt-1">
          Live forensic examination records from ASP.NET Core
        </p>
      </div>

      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading forensic jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center">
            <FlaskConical className="mx-auto text-cyan-400 mb-3" size={42} />
            <p className="text-gray-400">No forensic jobs found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 hover:bg-white/5 transition"
              >
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-bold text-lg">
                      {job.examinationType}
                    </h3>

                    <p className="text-gray-400 mt-1">
                      Evidence: {job.evidenceId}
                    </p>

                    <div className="flex gap-5 mt-4 text-sm text-gray-400">

                      <span className="flex items-center gap-2">
                        <Clock size={16}/>
                        {job.assignedDate}
                      </span>

                      <span className="flex items-center gap-2">
                        <FlaskConical size={16}/>
                        {job.analystName}
                      </span>

                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm border ${
                      job.status === "Completed"
                        ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                        : "border-yellow-500/30 bg-yellow-500/15 text-yellow-300"
                    }`}
                  >
                    {job.status}
                  </span>

                </div>

                {job.status === "Completed" && (
                  <div className="mt-4 flex items-center gap-2 text-emerald-300 text-sm">
                    <CheckCircle2 size={16}/>
                    Report Available
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}