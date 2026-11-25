
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  ShieldCheck,
  FolderClock,
  FolderCheck,
  ArrowUpRight,
  Plus,
  Upload,
  ScanLine,
  Activity,
  FlaskConical,
  Clock3,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { getDashboardData } from "../services/dashboardService";
import { getEvidence } from "../services/evidenceService";
import { getCases } from "../services/caseService";

const initialStats = {
  totalCases: 0,
  totalEvidence: 0,
  openCases: 0,
  closedCases: 0,
};

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const value = String(status || "Unknown");
  const normalized = value.toLowerCase();

  let color = "border-[#777C61]/30 bg-[#777C61]/10 text-[#B0B894]";

  if (normalized.includes("open") || normalized.includes("collect")) {
    color = "border-[#C58B43]/30 bg-[#C58B43]/10 text-[#D9A45E]";
  } else if (
    normalized.includes("closed") ||
    normalized.includes("resolved") ||
    normalized.includes("complete")
  ) {
    color = "border-[#91A47B]/30 bg-[#91A47B]/10 text-[#A8BA91]";
  } else if (
    normalized.includes("pending") ||
    normalized.includes("examination") ||
    normalized.includes("progress")
  ) {
    color = "border-[#B49A70]/30 bg-[#B49A70]/10 text-[#D0B68B]";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${color}`}
    >
      {value}
    </span>
  );
}

function SectionHeading({ title, subtitle, action, to }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <h2 className="text-sm font-bold text-[#E8E1D2]">{title}</h2>
        <p className="text-[11px] text-[#A09E91] mt-1">{subtitle}</p>
      </div>

      {action && (
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C58B43] hover:text-[#D9A45E]"
        >
          {action}
          <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center">
      <FolderOpen className="mx-auto text-[#777C61]" size={27} />
      <p className="mt-3 text-xs text-[#A09E91]">{message}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="py-10 text-center text-xs text-[#A09E91]">
      Loading records...
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [evidence, setEvidence] = useState([]);
  const [cases, setCases] = useState([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [evidenceLoading, setEvidenceLoading] = useState(true);
  const [casesLoading, setCasesLoading] = useState(true);

  const [statsError, setStatsError] = useState("");
  const [evidenceError, setEvidenceError] = useState("");
  const [casesError, setCasesError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const result = await getDashboardData();

        if (!active) return;

        setStats({
          totalCases: result.totalCases ?? 0,
          totalEvidence: result.totalEvidence ?? 0,
          openCases: result.openCases ?? 0,
          closedCases: result.closedCases ?? 0,
        });
      } catch (error) {
        if (!active) return;

        setStatsError(
          error.response?.data?.message ||
          "Dashboard statistics could not be loaded."
        );
      } finally {
        if (active) setStatsLoading(false);
      }
    }

    async function loadEvidence() {
      try {
        const result = await getEvidence();

        if (!active) return;

        setEvidence(Array.isArray(result) ? result : []);
      } catch (error) {
        if (!active) return;

        setEvidenceError(
          error.response?.data?.message ||
          "Evidence records could not be loaded."
        );
      } finally {
        if (active) setEvidenceLoading(false);
      }
    }

    async function loadCases() {
      try {
        const result = await getCases();

        if (!active) return;

        setCases(Array.isArray(result) ? result : []);
      } catch (error) {
        if (!active) return;

        setCasesError(
          error.response?.data?.message ||
          "Case records could not be loaded."
        );
      } finally {
        if (active) setCasesLoading(false);
      }
    }

    loadStats();
    loadEvidence();
    loadCases();

    return () => {
      active = false;
    };
  }, []);

  const recentEvidence = [...evidence]
    .sort(
      (a, b) =>
        new Date(b.collectedAt || 0).getTime() -
        new Date(a.collectedAt || 0).getTime()
    )
    .slice(0, 5);

  const recentCases = cases.slice(0, 5);

  const statCards = [
    {
      label: "Total investigations",
      value: stats.totalCases,
      note: "Registered case records",
      icon: FolderOpen,
      color: "#C58B43",
    },
    {
      label: "Evidence collected",
      value: stats.totalEvidence,
      note: "Items in evidence register",
      icon: ShieldCheck,
      color: "#858B68",
    },
    {
      label: "Open investigations",
      value: stats.openCases,
      note: "Currently open cases",
      icon: FolderClock,
      color: "#D2A15B",
    },
    {
      label: "Closed investigations",
      value: stats.closedCases,
      note: "Cases marked closed",
      icon: FolderCheck,
      color: "#91A47B",
    },
  ];

  return (
    <div className="space-y-7">

      {/* PAGE INTRODUCTION */}

      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#91A47B]" />
            <span className="text-[10px] uppercase tracking-[.18em] text-[#A09E91]">
              Investigation intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E8E1D2]">
            Command Center
          </h1>

          <p className="text-xs sm:text-sm text-[#A09E91] mt-2">
            Overview of investigations, evidence and forensic operations.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="btn-secondary"
          title="Refresh dashboard"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </section>

      {/* API STATUS */}

      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#858B68]/30 bg-[#858B68]/10 px-3 py-1.5 text-[#B0B894]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#91A47B]" />
          Connected dashboard services
        </span>

        <span className="text-[#858477]">
          Data retrieved from your backend APIs
        </span>
      </div>

      {/* STATISTICS */}

      {statsError && (
        <div className="flex items-center gap-2 rounded-lg border border-[#C87968]/30 bg-[#C87968]/10 p-3 text-xs text-[#D99A8C]">
          <AlertCircle size={16} />
          {statsError}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="stat-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="stat-label">{card.label}</p>

                  <div className="stat-value tabular-nums">
                    {statsLoading
                      ? "—"
                      : Number(card.value).toLocaleString("en-IN")}
                  </div>
                </div>

                <div
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{
                    backgroundColor: `${card.color}18`,
                    color: card.color,
                  }}
                >
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-3 text-[10px] text-[#858477]">
                {card.note}
              </p>
            </div>
          );
        })}
      </section>

      {/* QUICK ACTIONS */}

      <section>
        <SectionHeading
          title="Operational shortcuts"
          subtitle="Access frequently used evidence and investigation workflows"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/cases/new"
            className="panel p-4 flex items-center gap-3 hover:border-[#C58B43]/40 transition-colors"
          >
            <div className="h-10 w-10 grid place-items-center rounded-lg bg-[#C58B43]/10 text-[#C58B43]">
              <Plus size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#E8E1D2]">
                New investigation
              </p>
              <p className="text-[10px] text-[#A09E91] mt-1">
                Register a case
              </p>
            </div>
            <ArrowUpRight size={15} className="ml-auto text-[#858477]" />
          </Link>

          <Link
            to="/evidence/upload"
            className="panel p-4 flex items-center gap-3 hover:border-[#C58B43]/40 transition-colors"
          >
            <div className="h-10 w-10 grid place-items-center rounded-lg bg-[#858B68]/15 text-[#AAB28D]">
              <Upload size={19} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#E8E1D2]">
                Evidence intake
              </p>
              <p className="text-[10px] text-[#A09E91] mt-1">
                Upload evidence
              </p>
            </div>
            <ArrowUpRight size={15} className="ml-auto text-[#858477]" />
          </Link>

          <Link
            to="/evidence/scan"
            className="panel p-4 flex items-center gap-3 hover:border-[#C58B43]/40 transition-colors"
          >
            <div className="h-10 w-10 grid place-items-center rounded-lg bg-[#C58B43]/10 text-[#C58B43]">
              <ScanLine size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#E8E1D2]">
                Evidence scanner
              </p>
              <p className="text-[10px] text-[#A09E91] mt-1">
                Identify evidence
              </p>
            </div>
            <ArrowUpRight size={15} className="ml-auto text-[#858477]" />
          </Link>
        </div>
      </section>

      {/* RECENT RECORDS */}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* EVIDENCE REGISTER */}

        <div className="panel p-5">
          <SectionHeading
            title="Recent evidence"
            subtitle="Latest collected evidence records"
            action="View register"
            to="/evidence"
          />

          {evidenceLoading ? (
            <LoadingState />
          ) : evidenceError ? (
            <div className="py-6 text-xs text-[#D99A8C]">
              {evidenceError}
            </div>
          ) : recentEvidence.length === 0 ? (
            <EmptyState message="No evidence records found." />
          ) : (
            <div className="space-y-1">
              {recentEvidence.map((item) => (
                <Link
                  to={`/evidence/${item.id}`}
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/[0.035] transition-colors"
                >
                  <div className="h-9 w-9 shrink-0 grid place-items-center rounded-lg bg-[#858B68]/10 text-[#AAB28D]">
                    <ShieldCheck size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#E8E1D2] truncate">
                      {item.name || "Unnamed evidence"}
                    </p>

                    <p className="text-[10px] text-[#858477] mt-1 truncate">
                      {item.evidenceNumber || `Evidence #${item.id}`}
                      {" · "}
                      {item.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-[9px] text-[#858477]">
                      {formatDate(item.collectedAt)}
                    </span>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-[#858477]"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CASE MONITORING */}

        <div className="panel p-5">
          <SectionHeading
            title="Investigation monitoring"
            subtitle="Recently registered case records"
            action="View cases"
            to="/cases"
          />

          {casesLoading ? (
            <LoadingState />
          ) : casesError ? (
            <div className="py-6 text-xs text-[#D99A8C]">
              {casesError}
            </div>
          ) : recentCases.length === 0 ? (
            <EmptyState message="No investigation records found." />
          ) : (
            <div className="space-y-1">
              {recentCases.map((item) => (
                <Link
                  to={`/cases`}
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/[0.035] transition-colors"
                >
                  <div className="h-9 w-9 shrink-0 grid place-items-center rounded-lg bg-[#C58B43]/10 text-[#C58B43]">
                    <FolderOpen size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#E8E1D2] truncate">
                      {item.title || "Untitled investigation"}
                    </p>

                    <p className="text-[10px] text-[#858477] mt-1 truncate">
                      {item.caseNumber || `Case #${item.id}`}
                      {" · "}
                      {item.evidenceCount ?? 0} evidence items
                    </p>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <StatusBadge status={item.status} />
                    <span className="text-[9px] text-[#858477]">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-[#858477]"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OPERATIONAL FOOTER */}

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 grid place-items-center rounded-lg bg-[#858B68]/10 text-[#AAB28D]">
              <FlaskConical size={20} />
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#E8E1D2]">
                Forensic operations
              </h3>
              <p className="text-[10px] text-[#A09E91] mt-1">
                Access examination and laboratory records.
              </p>
            </div>
          </div>

          <Link to="/forensics" className="btn-secondary">
            <Activity size={15} />
            Open laboratory
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 text-[10px] text-[#77766B]">
        <Clock3 size={12} />
        Statistics and records are fetched from the configured backend.
      </div>

    </div>
  );
}
