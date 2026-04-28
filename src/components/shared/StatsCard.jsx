export default function StatsCard({ title, icon: Icon, value, subtitle, color = "blue", children }) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-700 border-blue-500/20",
    purple: "from-purple-600 to-purple-700 border-purple-500/20",
    emerald: "from-emerald-600 to-emerald-700 border-emerald-500/20",
    pink: "from-pink-600 to-pink-700 border-pink-500/20",
    cyan: "from-cyan-600 to-cyan-700 border-cyan-500/20",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wide">{title}</h2>
        {Icon && <Icon className="w-5 h-5 text-white/80" />}
      </div>
      {value && <p className="text-4xl font-black mb-2">{value}</p>}
      {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
      {children}
    </div>
  );
}
