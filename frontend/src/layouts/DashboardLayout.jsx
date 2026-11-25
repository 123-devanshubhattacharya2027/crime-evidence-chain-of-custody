import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className={`app-main ${collapsed ? "is-expanded" : ""}`}>
        <Topbar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          onMobileMenu={() => setMobileOpen(true)}
        />
        <main className="app-content"><Outlet /></main>
      </div>
    </div>
  );
}
