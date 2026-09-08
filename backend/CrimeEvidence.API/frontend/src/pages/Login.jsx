import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch {
      setError("Invalid email or password");
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
          <h1 className="text-3xl font-black">Crime Evidence</h1>
          <p className="text-cyan-300 mt-2">Login to continue</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-300">
            {error}
          </div>
        )}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-semibold"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-300">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}