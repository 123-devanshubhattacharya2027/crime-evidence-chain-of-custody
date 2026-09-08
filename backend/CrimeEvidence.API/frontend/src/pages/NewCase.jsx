import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import GlassCard from "../components/layout/GlassCard";
import { createCase } from "../services/caseService";

export default function NewCase() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    caseNumber: "",
    title: "",
    description: "",
    crimeType: "",
    priority: "Medium",
    status: "Open",
    location: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      await createCase(form);

      alert("Case created successfully.");

      navigate("/cases");
    } catch (err) {
      console.error(err);
      alert("Failed to create case.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate("/cases")}
        className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
      >
        <ArrowLeft size={18}/>
        Back to Cases
      </button>

      <div>
        <h1 className="text-3xl font-black text-white">
          Create New Case
        </h1>

        <p className="text-cyan-300 mt-1">
          Register a new crime case in the Evidence Management System
        </p>
      </div>

      <GlassCard className="p-6">

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm text-gray-300">
                Case Number
              </label>

              <input
                name="caseNumber"
                value={form.caseNumber}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3 focus:border-cyan-400 outline-none"
                placeholder="CASE-2026-001"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Crime Type
              </label>

              <input
                name="crimeType"
                value={form.crimeType}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3 focus:border-cyan-400 outline-none"
                placeholder="Robbery"
              />
            </div>

          </div>

          <div>
            <label className="text-sm text-gray-300">
              Case Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3 focus:border-cyan-400 outline-none"
              placeholder="Bank Robbery Investigation"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3 focus:border-cyan-400 outline-none"
              placeholder="Enter case details..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Location
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3 focus:border-cyan-400 outline-none"
              placeholder="New Delhi"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm text-gray-300">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3 focus:border-cyan-400 outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl bg-[#071929] border border-white/10 px-4 py-3 focus:border-cyan-400 outline-none"
              >
                <option>Open</option>
                <option>Under Investigation</option>
                <option>Closed</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold hover:bg-cyan-500 transition disabled:opacity-60"
          >
            <Save size={18}/>

            {loading ? "Saving..." : "Create Case"}
          </button>

        </form>

      </GlassCard>

    </div>
  );
}