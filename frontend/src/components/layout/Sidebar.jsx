
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  ShieldCheck,
  FlaskConical,
  Users,
  FileUp,
  ScanLine,
  Fingerprint,
  ArrowLeftRight,
} from "lucide-react";
import { getCurrentUser } from "../../services/authService";

const items = [
  {
    label: "Command Center",
    section: "OVERVIEW",
    icon: LayoutDashboard,
    path: "/",
    roles: ["ADMIN", "INVESTIGATING_OFFICER", "EVIDENCE_OFFICER", "FORENSIC_OFFICER", "SENIOR_OFFICER"],
  },
  {
    label: "Case Management",
    section: "INVESTIGATIONS",
    icon: FolderOpen,
    path: "/cases",
    roles: ["ADMIN", "INVESTIGATING_OFFICER", "SENIOR_OFFICER"],
  },
  {
    label: "Evidence Register",
    section: "EVIDENCE CONTROL",
    icon: ShieldCheck,
    path: "/evidence",
    roles: ["ADMIN", "INVESTIGATING_OFFICER", "EVIDENCE_OFFICER", "FORENSIC_OFFICER", "SENIOR_OFFICER"],
  },
  {
    label: "Upload Evidence",
    section: "EVIDENCE CONTROL",
    icon: FileUp,
    path: "/evidence/upload",
    roles: ["ADMIN", "INVESTIGATING_OFFICER", "EVIDENCE_OFFICER", "SENIOR_OFFICER"],
  },
  {
    label: "Scan Evidence",
    section: "EVIDENCE CONTROL",
    icon: ScanLine,
    path: "/evidence/scan",
    roles: ["ADMIN", "INVESTIGATING_OFFICER", "EVIDENCE_OFFICER", "SENIOR_OFFICER"],
  },
  {
    label: "Chain of Custody",
    section: "EVIDENCE CONTROL",
    icon: ArrowLeftRight,
    path: "/custody",
    roles: ["ADMIN", "INVESTIGATING_OFFICER", "EVIDENCE_OFFICER", "FORENSIC_OFFICER", "SENIOR_OFFICER"],
  },
  {
    label: "Forensic Laboratory",
    section: "LABORATORY",
    icon: FlaskConical,
    path: "/forensics",
    roles: ["ADMIN", "FORENSIC_OFFICER", "SENIOR_OFFICER"],
  },
  {
    label: "Officer Directory",
    section: "ADMINISTRATION",
    icon: Users,
    path: "/users",
    roles: ["ADMIN", "SENIOR_OFFICER"],
  },
];

export default function Sidebar({ collapsed, mobileOpen, onNavigate }) {
  const user = getCurrentUser();
  const role = String(user?.role || "").replaceAll(" ", "_").toUpperCase();

  const visible = items.filter((item) => item.roles.includes(role));

  let currentSection = "";

  return (
    <aside
      className={`app-sidebar ${collapsed ? "is-collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >
      <div className="flex items-center gap-3 px-5 h-[76px] border-b border-white/10">
        <div className="brand-mark">
          <Fingerprint size={22} />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-wide text-[#e8e1d2]">
              EVIDENCE CONTROL
            </div>
            <div className="text-[9px] uppercase tracking-[.19em] text-[#a09e91] mt-1">
              Forensic operations
            </div>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-[10px] uppercase tracking-[.14em] text-[#858477] mb-2">
            Authenticated officer
          </div>

          <div className="text-sm font-semibold text-[#e8e1d2] truncate">
            {user?.fullName || user?.name || "Signed-in officer"}
          </div>

          <div className="text-[11px] text-[#c58b43] mt-1">
            {user?.role || "Officer account"}
          </div>
        </div>
      )}

      <nav className="px-3 py-3 overflow-y-auto flex-1">
        {visible.map(({ label, section, icon: Icon, path }) => {
          const showSection = !collapsed && currentSection !== section;
          currentSection = section;

          return (
            <div key={path}>
              {showSection && (
                <div className="sidebar-section">
                  {section}
                </div>
              )}

              <NavLink
                to={path}
                end={path === "/"}
                title={collapsed ? label : undefined}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""} ${
                    collapsed ? "justify-center px-0" : ""
                  }`
                }
              >
                <Icon className="nav-icon" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        {!collapsed && (
          <div className="rounded-lg border border-[#858b68]/25 bg-[#858b68]/10 p-3">
            <div className="flex items-center gap-2 text-xs text-[#aab28d]">
              <span className="w-2 h-2 rounded-full bg-[#91a47b]" />
              Secure workspace
            </div>
            <p className="text-[10px] text-[#a09e91] mt-2 leading-4">
              Evidence operations and records management.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
