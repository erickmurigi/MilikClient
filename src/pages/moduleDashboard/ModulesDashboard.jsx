// pages/ModulesDashboard/ModulesDashboard.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaWarehouse,
  FaUsers,
  FaShieldAlt,
  FaHandshake,
  FaStore,
  FaArrowRight,
} from "react-icons/fa";

const ModulesDashboard = () => {
  const navigate = useNavigate();
  const [hoveredModule, setHoveredModule] = useState(null);

  const modules = useMemo(
    () => [
      // ===== FEATURED / MOST POPULAR =====
      {
        id: "property",
        title: "Milik Property Management",
        subtitle: "Manage properties, tenants, leases & rent payments",
        description: "Complete property management solution with tenant tracking, lease management, and automated billing.",
        category: "Real Estate",
        status: "active",
        route: "/dashboard",
        icon: <img src="/logo.png" alt="Milik" className="h-8 w-10" />,
        accent: "from-emerald-600 via-green-600 to-teal-600",
        isFeatured: true,
        stats: { users: "12.5k", growth: "+23%" },
      },

      // ===== ACTIVE / AVAILABLE NOW =====
      {
        id: "accounts",
        title: "Accounts & Finance",
        subtitle: "Financial management & accounting",
        description: "Track income, expenses, generate reports, and manage your company's finances efficiently.",
        category: "Finance",
        status: "active",
        route: "/financial/accounts",
        icon: <FaChartLine className="text-2xl" />,
        accent: "from-indigo-600 via-purple-600 to-pink-600",
        stats: { users: "8.2k", growth: "+18%" },
      },
      {
        id: "inventory",
        title: "Inventory",
        subtitle: "Stock management & warehousing",
        description: "Real-time inventory tracking, stock alerts, and automated reordering for efficient warehouse management.",
        category: "Operations",
        status: "active",
        route: "/inventory",
        icon: <FaWarehouse className="text-2xl" />,
        accent: "from-sky-600 via-blue-600 to-cyan-600",
        stats: { users: "6.7k", growth: "+15%" },
      },
      {
        id: "crm",
        title: "CRM",
        subtitle: "Customer relationship management",
        description: "Build stronger customer relationships with advanced CRM tools, sales pipeline, and analytics.",
        category: "Sales",
        status: "active",
        route: "/crm",
        icon: <FaUsers className="text-2xl" />,
        accent: "from-rose-600 via-red-600 to-orange-600",
        stats: { users: "9.4k", growth: "+32%" },
      },
      {
        id: "security",
        title: "Security",
        subtitle: "Access control & monitoring",
        description: "Advanced security features including access control, visitor management, and real-time monitoring.",
        category: "Security and Services",
        status: "active",
        route: "/security",
        icon: <FaShieldAlt className="text-2xl" />,
        accent: "from-gray-700 via-slate-700 to-gray-900",
        stats: { users: "5.1k", growth: "+12%" },
      },
      {
        id: "pos",
        title: "POS & Billing",
        subtitle: "Point of sale system",
        description: "Fast and reliable POS system with inventory sync, payment processing, and receipt generation.",
        category: "Commerce",
        status: "active",
        route: "/pos",
        icon: <FaStore className="text-2xl" />,
        accent: "from-lime-600 via-green-600 to-emerald-600",
        stats: { users: "7.8k", growth: "+28%" },
      },
      {
        id: "vendoor",
        title: "Ven-Door",
        subtitle: "Vendor management portal",
        description: "Streamline vendor relationships, purchase orders, and supplier communications in one place.",
        category: "Commerce",
        status: "active",
        route: "/ven-door",
        icon: <FaHandshake className="text-2xl" />,
        accent: "from-amber-600 via-orange-600 to-red-600",
        stats: { users: "4.3k", growth: "+19%" },
      },
    ],
    []
  );

  const handleOpen = (m) => {
    if (m.status === "active") {
      // Save to recent modules
      const recent = JSON.parse(localStorage.getItem("recentModules") || "[]");
      const updated = [m.id, ...recent.filter(id => id !== m.id)].slice(0, 5);
      localStorage.setItem("recentModules", JSON.stringify(updated));
      
      navigate(m.route);
      return;
    }
    if (m.status === "coming") {
      alert(`${m.title} is coming soon! Stay tuned for updates.`);
      return;
    }
    if (m.status === "locked") {
      alert(`${m.title} is a premium module. Upgrade your plan to unlock it.`);
      return;
    }
  };

  const StatusPill = ({ status }) => {
    const base = "px-2.5 py-1 rounded-full text-xs font-bold";
    if (status === "active") return <span className={`${base} bg-emerald-100 text-emerald-700`}>Active</span>;
    if (status === "coming") return <span className={`${base} bg-amber-100 text-amber-800`}>Coming</span>;
    return <span className={`${base} bg-slate-200 text-slate-700`}>Locked</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-8 text-6xl md:text-8xl font-black tracking-[0.25em] text-emerald-900/5 select-none">MILIK</div>
      </div>

      {/* Main Content */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 md:py-20">
        {/* Page Title Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/80 px-5 py-3 shadow-sm mb-6">
            <img src="/logo.png" alt="Milik" className="h-9 w-9 object-contain" />
            <span className="text-xs md:text-sm font-extrabold tracking-[0.2em] text-emerald-700">MILIK ECOSYSTEM</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-3 tracking-tight">
            MILIK Modules Page
          </h1>
          <p className="text-lg md:text-xl text-slate-700 font-semibold">
            Your Workspace Powered by MILIK
          </p>
        </div>

        {/* Module Grid - 2 columns on desktop, 1 on mobile */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => handleOpen(m)}
                onMouseEnter={() => setHoveredModule(m.id)}
                onMouseLeave={() => setHoveredModule(null)}
                className={[
                  "group relative text-left rounded-3xl border-2 bg-white/95 p-8 md:p-10 transition-all duration-300 overflow-hidden",
                  "hover:shadow-2xl active:scale-95",
                  hoveredModule === m.id 
                    ? "border-emerald-400 shadow-2xl scale-[1.02] md:scale-[1.03]" 
                    : "border-emerald-100 shadow-lg hover:border-emerald-300",
                ].join(" ")}
              >
                {/* Animated Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                {/* Decorative Watermark */}
                <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute top-4 right-4 text-[10px] font-extrabold tracking-[0.18em] text-emerald-700/50">MILIK</div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon and Status */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div
                      className={`h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br ${m.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}
                    >
                      <div className="text-3xl md:text-4xl">{m.icon}</div>
                    </div>
                    <div className="text-right">
                      <StatusPill status={m.status} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                    {m.title}
                  </h3>

                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700 mb-2">
                    MILIK Module
                  </p>

                  {/* Subtitle */}
                  <p className="text-sm md:text-base text-slate-600 font-medium mb-2 leading-relaxed">
                    {m.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-slate-500 mb-6 md:mb-8 line-clamp-2 flex-grow leading-relaxed">
                    {m.description}
                  </p>

                  {/* Bottom Section - Stats and Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    {/* Stats */}
                    {m.stats && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <FaUsers className="text-slate-400 text-sm" />
                          <span className="text-xs md:text-sm font-bold text-slate-700">
                            {m.stats.users}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50">
                          <span className="text-xs md:text-sm font-bold text-emerald-600">
                            {m.stats.growth}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Arrow Action */}
                    <div
                      className={[
                        "h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center border-2 transition-all",
                        m.status === "active"
                          ? "border-emerald-200 text-emerald-600 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white group-hover:scale-110"
                          : "border-slate-200 text-slate-400",
                      ].join(" ")}
                    >
                      <FaArrowRight className="text-sm md:text-base" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Empty State */}
      </div>
    );
};

export default ModulesDashboard;
