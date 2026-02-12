import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaThLarge, FaBuilding, FaCog } from "react-icons/fa";

const StartMenu = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const location = useLocation();

  // Close menu whenever route changes (helps keep UI clean)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close when clicking outside of the whole start-menu area
  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    // pointerdown is more consistent than mousedown/click for overlays
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const tiles = [
    {
      label: "Company Setup",
      to: "/company-setup",
      icon: <FaBuilding className="text-2xl text-green-700" />,
      boxClass:
        "bg-gradient-to-br from-emerald-100 to-green-200 hover:from-emerald-200 hover:to-green-300",
    },
    {
      label: "Modules",
      to: "/moduleDashboard",
      icon: <FaCog className="text-2xl text-indigo-700" />,
      boxClass:
        "bg-gradient-to-br from-indigo-100 to-purple-200 hover:from-indigo-200 hover:to-purple-300",
    },
  ];

  return (
    <div ref={rootRef}>
      {/* Start Button - Bottom Center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-200"
          aria-label="Open start menu"
        >
          <FaThLarge className="text-xl" />
        </button>
      </div>

      {/* Start Menu Popup */}
      {open && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[420px] max-w-[92vw] z-[9999]">
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-gray-800">
                Milik System Menu
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {tiles.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl hover:scale-[1.03] transition-all ${t.boxClass}`}
                  onClick={() => {
                    // optional: keep this for safety, route-change effect also closes it
                    setOpen(false);
                    // console.log("Navigating to:", t.to); // debug if needed
                  }}
                >
                  {t.icon}
                  <span className="mt-2 text-sm font-semibold text-gray-800 text-center">
                    {t.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-5 text-[11px] text-gray-500">
              Current route: <span className="font-semibold">{location.pathname}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartMenu;
