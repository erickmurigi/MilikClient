import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaHome,
  FaBuilding,
  FaKey,
  FaFileInvoiceDollar,
  FaBoxes,
  FaUsers,
  FaFolderOpen,
  FaCogs,
  FaUserShield,
  FaExchangeAlt,
  FaCalculator,
  FaStickyNote,
  FaEnvelope,
  FaSms,
  FaQuestionCircle,
  FaUserCircle,
  FaSignOutAlt,
  FaThLarge,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const StartMenu = ({ darkMode = false }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      const a = anchorRef.current;
      const m = menuRef.current;
      if (m && m.contains(e.target)) return;
      if (a && a.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const primary = useMemo(
    () => [
      { label: "Milik Property Management System", to: "/moduleDashboard" },
      { label: "Financial Accounts", icon: <FaUsers />, to: "/tenants" },
      { label: "Ven-Door", icon: <FaKey />, to: "/vendors" },
      { label: "Inventory Management", icon: <FaBoxes />, to: "/inventory" },
      { label: "Document Management", icon: <FaFolderOpen />, to: "/documents" },
    ],
    []
  );

  const secondaryTop = useMemo(
    () => [
      { label: "SMS Manager", icon: <FaSms />, onClick: () => alert("SMS Manager coming soon") },
      { label: "Email Manager", icon: <FaEnvelope />, onClick: () => alert("Email Manager coming soon") },
      { label: "Sticky Notes", icon: <FaStickyNote />, onClick: () => alert("Sticky Notes coming soon") },
      { label: "Calculator", icon: <FaCalculator />, onClick: () => window.open("https://www.google.com/search?q=calculator", "_blank") },
      { label: "Help", icon: <FaQuestionCircle />, onClick: () => alert("Help coming soon") },
    ],
    []
  );

  const secondaryBottom = useMemo(
    () => [
      { label: "Company Setup",to: "/company-setup", icon: <FaCogs />, onClick: () => { window.dispatchEvent(new Event("milik:open-company-setup")); setOpen(false); } },
        { label: "System Setup",to: "/system-setup", icon: <FaCogs />, onClick: () => { window.dispatchEvent(new Event("milik:open-system-setup")); setOpen(false); } },
      
      { label: "Switch Company", icon: <FaExchangeAlt />, onClick: () => alert("Switch Company coming soon") },
    ],
    []
  );

  const onSignOut = () => {
    // you can later clear auth context/storage here
    setOpen(false);
    navigate("/home");
  };

  return (
    <>
      {/* Start button - bottom center */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[120]">
        <button
          ref={anchorRef}
          onClick={() => setOpen((v) => !v)}
          className={[
            "group relative flex items-center gap-2 rounded-2xl px-4 py-2 shadow-lg border",
            "backdrop-blur-xl transition active:scale-[0.98]",
            darkMode
              ? "bg-white/25 border-white/20 text-white"
              : "bg-white/70 border-slate-200 text-slate-900",
          ].join(" ")}
          aria-label="Open Start Menu"
        >
          <span className="h-10 w-10 rounded-2xl bg-[#0f766e] text-white flex items-center justify-center shadow-inner">
            <FaThLarge />
          </span>
          <span className="text-sm font-extrabold tracking-wide">Start</span>

          <span className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-white/10" />
        </button>

        {/* Popup attached to button */}
        {open && (
          <div
            ref={menuRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-[60px] w-[92vw] max-w-[760px]"
          >
            <div
              className={[
                "rounded-3xl border shadow-2xl overflow-hidden",
                "backdrop-blur-2xl",
                darkMode
                  ? "border-white/15 bg-black/30"
                  : "border-white/40 bg-white/70",
              ].join(" ")}
            >
              {/* Top bar */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-[#0f766e] to-[#22c55e] flex items-center justify-center text-white">
                    <FaHome />
                  </div>
                  <div>
                    <div className={darkMode ? "text-white font-extrabold" : "text-slate-900 font-extrabold"}>
                      JOHN DOE
                    </div>
                    <div className={darkMode ? "text-white/70 text-xs" : "text-slate-600 text-xs"}>
                      Quick access to modules & tools
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-xl px-3 py-2 text-xs font-semibold border transition",
                    darkMode
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-slate-200 text-slate-700 hover:bg-white",
                  ].join(" ")}
                >
                  Close
                </button>
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left: primary list (like screenshot) */}
                <div className={["md:col-span-2 p-4", darkMode ? "bg-white/5" : "bg-white/40"].join(" ")}>
                  <div className={darkMode ? "text-white/80 text-xs font-bold mb-3" : "text-slate-700 text-xs font-bold mb-3"}>
                    MODULES
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {primary.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={[
                          "flex items-center gap-3 rounded-2xl px-3 py-3 border transition",
                          darkMode
                            ? "border-white/10 hover:bg-white/10 text-white"
                            : "border-slate-200 hover:bg-white text-slate-900",
                        ].join(" ")}
                      >
                        <span className="h-10 w-10 rounded-2xl bg-[#0f766e] text-white flex items-center justify-center">
                          {item.icon}
                        </span>
                        <div className="text-sm font-semibold">{item.label}</div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 h-px bg-black/10" />

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {secondaryBottom.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={item.onClick}
                        className={[
                          "flex items-center gap-2 rounded-2xl px-3 py-3 border text-left transition",
                          darkMode
                            ? "border-white/10 hover:bg-white/10 text-white"
                            : "border-slate-200 hover:bg-white text-slate-900",
                        ].join(" ")}
                      >
                        <span className="h-9 w-9 rounded-2xl bg-slate-900/90 text-white flex items-center justify-center">
                          {item.icon}
                        </span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right: quick tools (like screenshot right column) */}
                <div className={["p-4", darkMode ? "bg-black/10" : "bg-white/55"].join(" ")}>
                  <div className={darkMode ? "text-white/80 text-xs font-bold mb-3" : "text-slate-700 text-xs font-bold mb-3"}>
                    TOOLS
                  </div>

                  <div className="space-y-2">
                    {secondaryTop.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        className={[
                          "w-full flex items-center gap-3 rounded-2xl px-3 py-3 border transition",
                          darkMode
                            ? "border-white/10 hover:bg-white/10 text-white"
                            : "border-slate-200 hover:bg-white text-slate-900",
                        ].join(" ")}
                      >
                        <span className="h-10 w-10 rounded-2xl bg-[#0f766e] text-white flex items-center justify-center">
                          {item.icon}
                        </span>
                        <div className="text-sm font-semibold">{item.label}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 h-px bg-black/10" />

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => alert("My Account coming soon")}
                      className={[
                        "w-full flex items-center gap-3 rounded-2xl px-3 py-3 border transition",
                        darkMode
                          ? "border-white/10 hover:bg-white/10 text-white"
                          : "border-slate-200 hover:bg-white text-slate-900",
                      ].join(" ")}
                    >
                      <span className="h-10 w-10 rounded-2xl bg-slate-900/90 text-white flex items-center justify-center">
                        <FaUserCircle />
                      </span>
                      <div className="text-sm font-semibold">My Account</div>
                    </button>

                    <button
                      onClick={onSignOut}
                      className={[
                        "w-full flex items-center gap-3 rounded-2xl px-3 py-3 border transition",
                        darkMode
                          ? "border-white/10 hover:bg-white/10 text-white"
                          : "border-slate-200 hover:bg-white text-slate-900",
                      ].join(" ")}
                    >
                      <span className="h-10 w-10 rounded-2xl bg-red-600/90 text-white flex items-center justify-center">
                        <FaSignOutAlt />
                      </span>
                      <div className="text-sm font-semibold">Sign Out</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Small “pointer” like attached popover */}
              <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-4 w-4 rotate-45 border border-white/30 bg-white/70 backdrop-blur-xl" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StartMenu;
