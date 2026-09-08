import { useEffect, useState } from "react";
import { FolderOpen, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/layout/GlassCard";
import { getCases } from "../services/caseService";

export default function Cases() {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    setFilteredCases(
      cases.filter(
        (c) =>
          c.title?.toLowerCase().includes(value) ||
          c.caseNumber?.toLowerCase().includes(value)
      )
    );
  }, [search, cases]);

  async function loadCases() {
    setLoading(true);
    setError("");

    try {
      const data = await getCases();

      setCases(Array.isArray(data) ? data : []);
      setFilteredCases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Cases API Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load cases.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white">Case Management</h1>
          <p className="text-cyan-300 mt-1">Connected to ASP.NET Core API</p>
        </div>

        <button
          onClick={() => navigate("/cases/new")}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 hover:bg-cyan-500 transition"
        >
          <Plus size={18} />
          New Case
        </button>
      </div>

      <GlassCard className="p-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case number or title..."
            className="w-full rounded-xl bg-[#071929] border border-white/10 pl-11 pr-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading cases...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            {error}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="p-10 text-center">
            <FolderOpen className="mx-auto mb-3 text-cyan-400" size={40} />
            <p className="text-gray-400">No cases found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-white/5">
                <tr className="text-left text-sm text-gray-300">
                  <th className="p-4">Case Number</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Evidence</th>
                </tr>
              </thead>

              <tbody>
                {filteredCases.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-white/10 hover:bg-white/5 transition cursor-pointer"
                  >
                    <td className="p-4 font-semibold text-cyan-300">
                      {item.caseNumber}
                    </td>

                    <td className="p-4">{item.title}</td>

                    <td className="p-4">
                      <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-sm text-cyan-300">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {item.evidenceCount ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </GlassCard>

    </div>
  );
}