import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030B16] text-white">
      <Sidebar open={open} />

      <div className={`transition-all duration-300 ${open ? "ml-64" : "ml-20"}`}>
        <Topbar open={open} setOpen={setOpen} />

        <main className="p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}