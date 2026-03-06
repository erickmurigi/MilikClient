// pages/ModulesDashboard/ModulesDashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaChartLine,
  FaWarehouse,
  FaHotel,
  FaUsers,
  FaMobileAlt,
  FaShieldAlt,
  FaTools,
  FaClipboardList,
  FaChartPie,
  FaHandshake,
  FaStore,
  FaProjectDiagram,
  FaBell,
  FaSearch,
  FaLock,
  FaArrowRight,
  FaFire,
  FaStar,
  FaClock,
  FaRocket,
  FaChevronRight,
  FaGripVertical,
  FaEllipsisV,
} from "react-icons/fa";

const ModulesDashboard = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | coming | locked
  const [hoveredModule, setHoveredModule] = useState(null);
  const [recentModules, setRecentModules] = useState([]);

  // Replace these later with real values from auth / backend
  const companyName = "Milik Corporation";
  const userInitials = "MK";

  // Load recent modules from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentModules") || "[]");
    setRecentModules(recent.slice(0, 3));
  }, []);

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

  // Filter modules based on search and filter state
  const filtered = useMemo(() => {
    let result = modules;
    
    // Apply status filter
    if (filter !== "all") {
      result = result.filter(m => m.status === filter);
    }
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(searchLower) ||
        (m.subtitle && m.subtitle.toLowerCase().includes(searchLower)) ||
        (m.description && m.description.toLowerCase().includes(searchLower)) ||
        m.category.toLowerCase().includes(searchLower)
      );
    }
    
    return result;
  }, [modules, search, filter]);

  const featuredModules = useMemo(() => filtered.filter(m => m.isFeatured), [filtered]);
  const regularModules = useMemo(() => filtered.filter(m => !m.isFeatured), [filtered]);

  const categories = useMemo(() => {
    const cats = {};
    regularModules.forEach(m => {
      if (!cats[m.category]) cats[m.category] = [];
      cats[m.category].push(m);
    });
    return cats;
  }, [regularModules]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl blur opacity-40 group-hover:opacity-60 transition"></div>
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center shadow-lg">
                <img src="/logo.png" alt="Milik" className="h-7 w-7 object-contain" />
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-xl font-black text-slate-900 tracking-tight">Your Workspace</div>
              <div className="text-xs text-slate-600 font-medium">Choose a module to begin</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules, features..."
                className="w-80 rounded-2xl border border-slate-200/60 bg-white/60 pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 transition"
              />
            </div>

            <button className="relative p-3 rounded-2xl bg-white/60 border border-slate-200/60 hover:bg-white hover:border-emerald-200 transition group" title="Notifications">
              <FaBell className="text-slate-600 group-hover:text-emerald-600 transition" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow">3</span>
            </button>

            <div className="flex items-center gap-3 ml-2">
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-slate-900">{companyName}</div>
                <div className="text-xs text-emerald-600 font-medium">Active subscription</div>
              </div>
              <button className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition"></div>
                <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-black text-sm flex items-center justify-center shadow-lg">
                  {userInitials}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="relative max-w-[1400px] mx-auto px-6 py-8">
        {/* Mobile Search */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Hero Section - Featured Module */}
        {featuredModules.length > 0 && !search && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FaFire className="text-orange-500 text-xl" />
              <h2 className="text-xl font-black text-slate-900">Featured Module</h2>
            </div>
            
            {featuredModules.map(module => (
              <button
                key={module.id}
                onClick={() => handleOpen(module)}
                className="group relative w-full text-left rounded-3xl border-2 border-white bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Decorative Elements */}
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <img src="/logo.png" alt="" className="pointer-events-none absolute -right-4 -bottom-10 h-48 w-48 opacity-[0.08] rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500" />

                <div className="relative grid md:grid-cols-[1fr,auto] gap-8 items-center">
                  {/* Left Content */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${module.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {module.icon}
                      </div>
                      <div>
                        <StatusPill status={module.status} />
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">{module.title}</h3>
                    <p className="text-base text-slate-600 font-medium mb-2">{module.subtitle}</p>
                    <p className="text-sm text-slate-500 max-w-2xl">{module.description}</p>

                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-emerald-600" />
                        <div>
                          <div className="text-lg font-black text-slate-900">{module.stats.users}</div>
                          <div className="text-xs text-slate-500">Active Users</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <FaRocket className="text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-lg font-black text-emerald-600">{module.stats.growth}</div>
                          <div className="text-xs text-slate-500">Growth</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${module.accent} rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition`}></div>
                      <div className={`relative px-8 py-4 rounded-2xl bg-gradient-to-br ${module.accent} text-white font-black text-center shadow-lg group-hover:scale-105 transition-transform flex flex-col items-center gap-2`}>
                        <FaRocket className="text-2xl" />
                        <div className="text-sm">Launch Now</div>
                        <FaChevronRight className="text-lg" />
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Most Popular</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Recently Accessed (if any) */}
        {recentModules.length > 0 && !search && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FaClock className="text-blue-500" />
              <h2 className="text-lg font-black text-slate-900">Recently Accessed</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recentModules.map(recentId => {
                const module = modules.find(m => m.id === recentId);
                if (!module) return null;
                return (
                  <button
                    key={module.id}
                    onClick={() => handleOpen(module)}
                    className="group relative text-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all"
                  >
                    <div className={`mx-auto h-12 w-12 rounded-xl bg-gradient-to-br ${module.accent} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform mb-2`}>
                      {module.icon}
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-2">{module.title}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {[
            { key: "all", label: "All Modules", icon: <FaGripVertical /> },
            { key: "active", label: "Active", icon: <FaStar /> },
            { key: "coming", label: "Coming Soon", icon: <FaClock /> },
            { key: "locked", label: "Locked", icon: <FaLock /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={[
                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black border-2 transition-all",
                filter === t.key
                  ? "bg-gradient-to-br from-emerald-600 to-green-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/30 scale-105"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300",
              ].join(" ")}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* All Modules by Category */}
        <div className="space-y-10">
          {Object.entries(categories).map(([category, categoryModules]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black text-slate-900">{category}</h2>
                <div className="text-sm text-slate-500 font-medium">{categoryModules.length} modules</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categoryModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleOpen(m)}
                    onMouseEnter={() => setHoveredModule(m.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                    className={[
                      "group relative text-left rounded-3xl border-2 bg-white p-6 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden",
                      hoveredModule === m.id ? "border-emerald-300 scale-[1.02]" : "border-slate-100 hover:border-slate-200",
                    ].join(" ")}
                  >
                    {/* Animated Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Watermark */}
                    <img
                      src="/logo.png"
                      alt=""
                      className="pointer-events-none absolute -right-2 -bottom-8 h-32 w-32 opacity-[0.06] rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500"
                    />

                    {/* Content */}
                    <div className="relative">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${m.accent} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          {m.icon}
                        </div>
                        <StatusPill status={m.status} />
                      </div>

                      {/* Text */}
                      <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{m.title}</h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3 line-clamp-2">{m.subtitle}</p>

                      {/* Stats */}
                      {m.stats && (
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1.5">
                            <FaUsers className="text-slate-400 text-xs" />
                            <span className="text-xs font-bold text-slate-700">{m.stats.users}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-emerald-600">{m.stats.growth}</span>
                          </div>
                        </div>
                      )}

                      {/* Bottom Action */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {m.status === "locked" ? (
                          <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                            <FaLock className="text-xs" />
                            Premium
                          </div>
                        ) : m.status === "coming" ? (
                          <div className="flex items-center gap-2 text-xs font-black text-amber-600">
                            <FaClock className="text-xs" />
                            Soon
                          </div>
                        ) : (
                          <div className="text-xs font-black text-emerald-600">Open Module</div>
                        )}

                        <div
                          className={[
                            "h-9 w-9 rounded-xl flex items-center justify-center border-2 transition-all",
                            m.status === "active"
                              ? "border-emerald-200 text-emerald-600 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white group-hover:scale-110"
                              : "border-slate-200 text-slate-400",
                          ].join(" ")}
                        >
                          <FaArrowRight className="text-sm" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
              <FaSearch className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No modules found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">Need help? <button className="font-bold text-emerald-600 hover:text-emerald-700">Contact Support</button></p>
        </div>
      </main>
    </div>
  );
};

export default ModulesDashboard;
