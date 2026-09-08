import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import { getCurrentUser, logout } from "../../services/authService";

export default function Topbar({ open, setOpen }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 right-0 h-20 z-40 transition-all duration-300
        bg-[#071523]/98 backdrop-blur-2xl
        border-b border-cyan-500/30
        shadow-[0_8px_30px_rgba(34,211,238,0.12)]
        ${open ? "left-64" : "left-20"}`}
    >
      <div className="h-full flex items-center justify-between px-6 lg:px-8">

        {/* Left Section */}
        <div className="flex items-center gap-5 flex-1">

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl text-cyan-300 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block">
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-400">
              Command Center
            </p>

            <h2 className="text-lg font-bold text-white">
              National Evidence Network
            </h2>
          </div>

          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 ml-6">

          {/* Notification */}
          <button className="relative h-11 w-11 rounded-xl border border-cyan-500/20 bg-[#0A2238] hover:bg-cyan-500/15 hover:border-cyan-400 transition flex items-center justify-center shadow-md">
            <Bell size={20} className="text-cyan-300" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.9)]"></span>
          </button>

          {/* Settings */}
          <button className="h-11 w-11 rounded-xl border border-cyan-500/20 bg-[#0A2238] hover:bg-cyan-500/15 hover:border-cyan-400 transition flex items-center justify-center shadow-md">
            <Settings size={20} className="text-cyan-300" />
          </button>

          {/* User Card */}
          <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-[#0A4D68] to-[#0B7AA3] px-3 py-2 shadow-[0_0_25px_rgba(34,211,238,0.35)]">
            <div className="h-9 w-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>

            <div className="hidden xl:block text-left">
              <p className="text-sm font-semibold leading-none text-white">
                {user?.fullName || user?.name || "Guest User"}
              </p>

              <p className="text-[11px] text-cyan-100 mt-1">
                {user?.role || "No Role"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="h-11 w-11 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/25 hover:border-red-400 transition flex items-center justify-center shadow-md"
          >
            <LogOut size={20} className="text-red-300" />
          </button>

        </div>
      </div>
    </header>
  );
}