
import { Menu, Bell, Search, LogOut, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/authService";

const titles = {
  "/": ["Command Center", "Forensic operations and case intelligence"],
  "/cases": ["Case Management", "Investigation records and case tracking"],
  "/cases/new": ["New Investigation", "Create an official case record"],
  "/evidence": ["Evidence Register", "Evidence inventory and identification"],
  "/evidence/upload": ["Evidence Intake", "Register and upload collected evidence"],
  "/evidence/scan": ["Evidence Scanner", "Identify and retrieve evidence records"],
  "/forensics": ["Forensic Laboratory", "Examination and laboratory records"],
  "/users": ["Officer Directory", "Authorized system personnel"],
};

export default function Topbar({ onToggle, onMobileMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const title =
    titles[location.pathname] ||
    (location.pathname.startsWith("/evidence/")
      ? ["Evidence Details", "Evidence record and chain-of-custody history"]
      : ["Evidence Control", "Forensic operations"]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = (user?.fullName || user?.name || "Officer")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="app-topbar">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenu}
          className="mobile-menu btn-secondary !min-h-9 !px-2"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <button
          onClick={onToggle}
          className="hidden lg:inline-flex btn-secondary !min-h-9 !px-2"
          aria-label="Collapse sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <div className="text-sm font-bold text-[#e8e1d2] truncate">
            {title[0]}
          </div>
          <div className="hidden sm:block text-[11px] text-[#a09e91] mt-1 truncate">
            {title[1]}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-[#48483e] bg-[#23241f] px-3 h-9 text-xs text-[#a09e91]">
          <Search size={15} className="text-[#c58b43]" />
          <span>Record search</span>
        </div>

        <button
          type="button"
          className="relative h-9 w-9 grid place-items-center rounded-lg border border-[#48483e] bg-[#23241f] text-[#c8c1b2] hover:text-[#c58b43]"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#c58b43]" />
        </button>

        <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
          <div className="h-9 w-9 grid place-items-center rounded-full bg-[#c58b43]/15 border border-[#c58b43]/30 text-[#d9a45e] text-xs font-bold">
            {initials}
          </div>

          <div className="text-right max-w-[130px]">
            <div className="text-xs font-semibold text-[#e8e1d2] truncate">
              {user?.fullName || user?.name || "Officer"}
            </div>
            <div className="text-[10px] text-[#a09e91] mt-1 flex items-center justify-end gap-1">
              <ShieldCheck size={11} />
              {user?.role || "Account"}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
          className="h-9 w-9 grid place-items-center rounded-lg border border-[#c87968]/25 bg-[#c87968]/10 text-[#c87968] hover:bg-[#c87968]/20"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
