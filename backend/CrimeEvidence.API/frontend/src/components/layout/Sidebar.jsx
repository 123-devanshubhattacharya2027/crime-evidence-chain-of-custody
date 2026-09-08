import {
  LayoutDashboard,
  FolderOpen,
  Shield,
  FlaskConical,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", roles: ["Admin", "Investigator", "Forensic"] },
  { label: "Cases", icon: FolderOpen, path: "/cases", roles: ["Admin", "Investigator"] },
  { label: "Evidence", icon: Shield, path: "/evidence", roles: ["Admin", "Investigator", "Forensic"] },
  { label: "Forensics", icon: FlaskConical, path: "/forensics", roles: ["Admin", "Forensic"] },
  { label: "Users", icon: Users, path: "/users", roles: ["Admin"] },
];

export default function Sidebar({ open }) {
  const user = getCurrentUser();

  const visibleItems = items.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300
        bg-[#04101E]/98 backdrop-blur-2xl
        border-r border-cyan-500/35
        shadow-[8px_0_35px_rgba(34,211,238,0.15)]
        ${open ? "w-64" : "w-20"}`}
    >
      <div className="h-full flex flex-col">

        {/* Logo */}
        <div className="h-24 border-b border-cyan-500/25 flex items-center justify-center bg-gradient-to-b from-[#0A2238] via-[#081A2F] to-transparent">
          {open ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.45)]">
                <span className="text-2xl font-black text-white">CE</span>
              </div>

              <h1 className="mt-3 text-lg font-black text-white">
                Crime Evidence
              </h1>

              <p className="text-[10px] text-cyan-300 uppercase tracking-[0.35em]">
                Command Center
              </p>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.45)]">
              <span className="text-xl font-black text-white">CE</span>
            </div>
          )}
        </div>

        {/* User */}
        {open && user && (
          <div className="px-4 py-4 border-b border-cyan-500/20">
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-cyan-300">{user.role}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 mt-3">
          {visibleItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `group relative flex items-center ${
                  open ? "gap-3 px-4 justify-start" : "justify-center"
                } py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                    : "text-gray-300 hover:bg-cyan-500/10 hover:border hover:border-cyan-500/25 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                  )}

                  <Icon
                    size={22}
                    className={`transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />

                  {open && (
                    <span className="font-medium tracking-wide">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {open && (
          <div className="p-4 border-t border-cyan-500/20">
            <div className="rounded-2xl border border-emerald-400/25 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 p-4 backdrop-blur-md">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em]">
                System Status
              </p>

              <p className="text-emerald-400 font-semibold mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Secure Connection
              </p>

              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}