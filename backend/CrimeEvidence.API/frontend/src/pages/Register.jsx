import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Investigator",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await register(form);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030B16] text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#071929] border border-white/10 rounded-3xl p-8 space-y-5"
      >
        <div className="text-center">
          <h1 className="text-3xl font-black">Create Account</h1>
          <p className="text-cyan-300 mt-2">
            National Evidence Network
          </p>
        </div>

        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
          className="w-full rounded-xl bg-[#04101C] border border-white/10 px-4 py-3 outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full rounded-xl bg-[#04101C] border border-white/10 px-4 py-3 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full rounded-xl bg-[#04101C] border border-white/10 px-4 py-3 outline-none"
          required
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
          className="w-full rounded-xl bg-[#04101C] border border-white/10 px-4 py-3"
        >
          <option>Admin</option>
          <option>Investigator</option>
          <option>Forensic</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-semibold"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}