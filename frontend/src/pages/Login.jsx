import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, LockKeyhole, Mail } from "lucide-react";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Check your credentials and API connection.");
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <section className="auth-aside">
        <div className="flex items-center gap-3"><div className="brand-mark !w-12 !h-12">CE</div><div><div className="font-bold text-white">Crime Evidence</div><div className="text-[10px] tracking-[.18em] uppercase text-slate-500 mt-1">Management System</div></div></div>
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-3 py-1.5 text-xs text-sky-300"><ShieldCheck size={14}/> Secure case operations</div>
          <h1 className="mt-7 text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-white">Evidence integrity.<br/><span className="text-sky-400">Accountable investigations.</span></h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">A central workspace for case records, evidence tracking, chain-of-custody activity and forensic examination workflows.</p>
        </div>
        <div className="text-xs text-slate-600">Restricted system · Authorised personnel only</div>
      </section>
      <section className="flex items-center justify-center py-12">
        <form onSubmit={handleSubmit} className="auth-card">
          <div className="mb-8"><div className="text-xs font-semibold uppercase tracking-[.16em] text-sky-400">Officer portal</div><h2 className="mt-3 text-2xl font-bold text-slate-100">Sign in to your account</h2><p className="mt-2 text-sm text-slate-400">Enter your registered credentials to continue.</p></div>
          {error && <div role="alert" className="mb-5 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{error}</div>}
          <label className="field-label" htmlFor="email">Email address</label>
          <div className="relative mb-5"><Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/><input id="email" type="email" autoComplete="username" required placeholder="officer@department.gov" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="form-control !pl-10"/></div>
          <label className="field-label" htmlFor="password">Password</label>
          <div className="relative mb-6"><LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/><input id="password" type="password" autoComplete="current-password" required placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="form-control !pl-10"/></div>
          <button disabled={loading} type="submit" className="btn-primary w-full !h-11">{loading ? "Signing in…" : "Sign in securely"}</button>
          <p className="mt-6 text-center text-xs text-slate-500">Need an account? <Link to="/register" className="font-semibold text-sky-400 hover:text-sky-300">Register</Link></p>
        </form>
      </section>
    </div>
  );
}
