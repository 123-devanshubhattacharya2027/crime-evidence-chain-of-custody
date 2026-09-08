import { useEffect, useState } from "react";
import {
  FolderOpen,
  Shield,
  FlaskConical,
  Users,
} from "lucide-react";

import GlassCard from "../components/layout/GlassCard";
import { getDashboardData } from "../services/dashboardService";

export default function Dashboard() {
  const [data, setData] = useState({
    totalCases: 0,
    totalEvidence: 0,
    totalForensics: 0,
    totalUsers: 0,
    recentCases: [],
    recentEvidence: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const dashboard = await getDashboardData();

      setData({
        totalCases: dashboard.totalCases ?? 0,
        totalEvidence: dashboard.totalEvidence ?? 0,
        totalForensics: dashboard.totalForensics ?? 0,
        totalUsers: dashboard.totalUsers ?? 0,
        recentCases: dashboard.recentCases ?? [],
        recentEvidence: dashboard.recentEvidence ?? [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Cases",
      value: data.totalCases,
      icon: FolderOpen,
      color: "text-cyan-400",
    },
    {
      title: "Evidence",
      value: data.totalEvidence,
      icon: Shield,
      color: "text-emerald-400",
    },
    {
      title: "Forensics",
      value: data.totalForensics,
      icon: FlaskConical,
      color: "text-purple-400",
    },
    {
      title: "Users",
      value: data.totalUsers,
      icon: Users,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">
          Crime Evidence Dashboard
        </h1>

        <p className="text-cyan-300 mt-1">
          Live data from ASP.NET Core
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <GlassCard key={card.title} className="p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">{card.title}</p>

                  <h2 className="text-3xl font-black mt-2">
                    {card.value}
                  </h2>
                </div>

                <Icon className={card.color} size={34} />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Recent Data */}
      <div className="grid xl:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-5">
            Recent Cases
          </h2>

          {data.recentCases.length === 0 ? (
            <p className="text-gray-400">No recent cases.</p>
          ) : (
            <div className="space-y-4">
              {data.recentCases.map((c) => (
                <div
                  key={c.id}
                  className="border-b border-white/10 pb-3"
                >
                  <p className="font-semibold">{c.caseNumber}</p>

                  <p className="text-gray-400 text-sm">
                    {c.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-5">
            Recent Evidence
          </h2>

          {data.recentEvidence.length === 0 ? (
            <p className="text-gray-400">No recent evidence.</p>
          ) : (
            <div className="space-y-4">
              {data.recentEvidence.map((e) => (
                <div
                  key={e.id}
                  className="border-b border-white/10 pb-3"
                >
                  <p className="font-semibold">{e.evidenceId}</p>

                  <p className="text-gray-400 text-sm">
                    {e.evidenceType}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}