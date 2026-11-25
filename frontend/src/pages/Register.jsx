
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await register(form);

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#0b1625]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111f31] p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="brand-mark">
            <ShieldCheck size={22} />
          </div>

          <div>
            <div className="font-bold text-slate-100">
              Crime Evidence Management
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Secure account registration
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-100">
          Create an account
        </h1>

        <p className="text-sm text-slate-400 mt-2 mb-6">
          Register as a customer to access the system.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-300"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-300"
          >
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="fullName">
              Full name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              className="form-control"
              placeholder="Enter your full name"
              required
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="regEmail">
              Email address
            </label>

            <input
              id="regEmail"
              name="email"
              type="email"
              autoComplete="email"
              className="form-control"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="regPassword">
              Password
            </label>

            <input
              id="regPassword"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              className="form-control"
              placeholder="Create a password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-6 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create customer account"}
        </button>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-sky-400 font-semibold hover:text-sky-300"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
