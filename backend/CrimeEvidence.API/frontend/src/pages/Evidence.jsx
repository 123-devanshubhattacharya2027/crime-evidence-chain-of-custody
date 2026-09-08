import { useEffect, useState } from "react";
import { Search, Shield, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/layout/GlassCard";
import { getEvidence } from "../services/evidenceService";

export default function Evidence() {
  const navigate = useNavigate();

  const [evidence, setEvidence] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvidence();
  }, []);

  useEffect(() => {
    let data = [...evidence];

    if (typeFilter !== "All") {
      data = data.filter((e) => e.evidenceType === typeFilter);
    }

    if (search.trim()) {
      const value = search.toLowerCase();

      data = data.filter(
        (e) =>
          e.evidenceId?.toLowerCase().includes(value) ||
          e.caseNumber?.toLowerCase().includes(value)
      );
    }

    setFiltered(data);
  }, [search, typeFilter, evidence]);

  async function loadEvidence() {
    try {
      const data = await getEvidence();
      setEvidence(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const types = [
    "All",
    "DNA",
    "Fingerprint",
    "Weapon",
    "Digital",
    "Document",
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-white">
          Evidence Management
        </h1>

        <p className="text-cyan-300 mt-1">
          Connected to PostgreSQL through ASP.NET Core
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">

        <GlassCard className="p-4 md:col-span-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Evidence ID or Case Number"
              className="w-full rounded-xl bg-[#071929] border border-white/10 pl-10 pr-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={18} className="text-cyan-300"/>
            <span>Evidence Type</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl bg-[#071929] border border-white/10 px-3 py-2 outline-none"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </GlassCard>

      </div>

      <GlassCard className="overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading evidence...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Shield className="mx-auto mb-3 text-cyan-400" size={40}/>
            <p className="text-gray-400">No evidence found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-white/5 text-left text-sm text-gray-300">
                <tr>
                  <th className="p-4">Evidence ID</th>
                  <th className="p-4">Case</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/evidence/${item.id}`)}
                    className="border-t border-white/10 hover:bg-white/5 cursor-pointer transition"
                  >
                    <td className="p-4 font-semibold text-cyan-300">
                      {item.evidenceId}
                    </td>

                    <td className="p-4">{item.caseNumber}</td>

                    <td className="p-4">{item.evidenceType}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm border ${
                          item.status === "Verified"
                            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                            : "border-yellow-500/30 bg-yellow-500/15 text-yellow-300"
                        }`}
                      >
                        {item.status}
                      </span>
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