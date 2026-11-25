export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl
        bg-[#0A1B2E]/95
        border border-cyan-500/25
        backdrop-blur-2xl
        shadow-[0_12px_35px_rgba(0,0,0,.45)]
        transition-all duration-300
        hover:border-cyan-400/50
        hover:shadow-[0_18px_45px_rgba(34,211,238,.18)]
        ${className}
      `}
    >
      {/* Top glowing line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

      {/* Soft cyan glow */}
      <div className="absolute -top-10 right-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {children}
    </div>
  );
}