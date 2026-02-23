// pages/ModulesDashboard/ModulesDashboard.jsx
import React, { useMemo, useState } from "react";
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
} from "react-icons/fa";

const ModulesDashboard = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | coming | locked

  // Replace these later with real values from auth / backend
  const companyName = "Milik Corporation";
  const userInitials = "MK";

  const modules = useMemo(
    () => [
      // ===== ACTIVE / AVAILABLE NOW =====
      {
        id: "property",
        title: "Milik Property Management",
        category: "Real Estate",
        status: "active",
        route: "/dashboard",
        icon: 
          <img src="/logo.png" alt="Milik" className="h-8 w-10" />,
        accent: "from-emerald-600 to-green-700",
      },
      {
        id: "accounts",
        title: "Accounts & Finance",
        category: "Finance",
        status: "active",
        route: "/financial/accounts",
        icon: <FaChartLine className="text-2xl" />,
        accent: "from-indigo-600 to-purple-700",
      },
      {
        id: "inventory",
        title: "Inventory",
        category: "Operations",
        status: "active",
        route: "/inventory",
        icon: <FaWarehouse className="text-2xl" />,
        accent: "from-sky-600 to-cyan-600",
      },
      {
        id: "crm",
        title: "CRM",
        category: "Sales",
        status: "active",
        route: "/crm",
        icon: <FaUsers className="text-2xl" />,
        accent: "from-rose-600 to-red-700",
      },
      {
        id: "security",
        title: "Security",
        category: "Security and Services",
        status: "active",
        route: "/security",
        icon: <FaShieldAlt className="text-2xl" />,
        accent: "from-gray-700 to-gray-900",
      },
      {
        id: "pos",
        title: "POS & Billing",
        category: "Commerce",
        status: "active",
        route: "/pos",
        icon: <FaStore className="text-2xl" />,
        accent: "from-lime-600 to-emerald-700",
      },
      {
        id: "Ven-Door",
        title: "Ven-Door",
        category: "Commerce",
        status: "active",
        route: "/ven-door",
        icon: <FaStore className="text-2xl" />,
        accent: "from-lime-600 to-emerald-700",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return modules
      .filter((m) => {
        const matchesSearch =
          !q ||
          m.title.toLowerCase().includes(q) ||
          m.subtitle.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q);

        const matchesFilter = filter === "all" ? true : m.status === filter;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        // show active first, then coming, then locked
        const order = { active: 0, coming: 1, locked: 2 };
        return (order[a.status] ?? 9) - (order[b.status] ?? 9);
      });
  }, [modules, search, filter]);

  const handleOpen = (m) => {
    if (m.status === "active") {
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
    <div className="min-h-screen bg-[#f4f7f6]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow">
                <img src="/logo.png" alt="Milik" className="h-7 w-7 object-contain" />
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold text-slate-900">Your Modules</div>
              <div className="text-xs text-slate-600">Click a module to launch</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules..."
                className="w-72 rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition" title="Notifications">
              <FaBell className="text-slate-600" />
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <div className="text-sm font-bold text-slate-900">{companyName}</div>
                <div className="text-xs text-slate-600">Signed in</div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-extrabold flex items-center justify-center">
                {userInitials}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-5 py-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "coming", label: "Coming Soon" },
              { key: "locked", label: "Locked" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={[
                  "px-4 py-2 rounded-2xl text-sm font-extrabold border transition",
                  filter === t.key
                    ? "bg-emerald-700 text-white border-emerald-700 shadow"
                    : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="sm:hidden">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules..."
                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>

        {/* Launcher grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => handleOpen(m)}
              className={[
                "group relative text-left rounded-3xl border bg-white p-4 shadow-sm hover:shadow-xl transition overflow-hidden",
                m.status === "active" ? "border-emerald-100 hover:border-emerald-300" : "border-slate-200 hover:border-slate-300",
                m.status !== "active" ? "opacity-95" : "",
              ].join(" ")}
            >
              {/* watermark logo */}
              <img
                src="/logo.png"
                alt=""
                className="pointer-events-none absolute -right-1 -bottom-6 h-28 w-29 opacity-[0.19] rotate-5"
              />

              {/* top row */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={[
                    "h-12 w-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow",
                    m.accent,
                  ].join(" ")}
                >
                  {m.icon}
                </div>

                <div className="flex items-center gap-2">
                  {m.tag ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700">
                      {m.tag}
                    </span>
                  ) : null}
                  <StatusPill status={m.status} />
                </div>
              </div>

              {/* text */}
              <div className="mt-3">
                <div className="text-sm font-extrabold text-slate-900">{m.title}</div>
                <div className="text-xs text-slate-600 mt-1 leading-snug">{m.subtitle}</div>
                <div className="mt-2 text-[11px] font-bold text-slate-500">
                  Category: <span className="text-slate-700">{m.category}</span>
                </div>
              </div>

              {/* bottom action */}
              <div className="mt-4 flex items-center justify-between">
                {m.status === "locked" ? (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600">
                    <FaLock />
                    Upgrade to unlock
                  </div>
                ) : m.status === "coming" ? (
                  <div className="text-xs font-extrabold text-amber-700">In development</div>
                ) : (
                  <div className="text-xs font-extrabold text-emerald-700">Launch module</div>
                )}

                <div
                  className={[
                    "h-9 w-9 rounded-2xl flex items-center justify-center border transition",
                    m.status === "active"
                      ? "border-emerald-200 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"
                      : "border-slate-200 text-slate-500 group-hover:bg-slate-900 group-hover:text-white",
                  ].join(" ")}
                  title="Open"
                >
                  <FaArrowRight />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 text-xs text-slate-500">
        </div>
      </main>
    </div>
  );
};

export default ModulesDashboard;
