import React, { useMemo, useState } from "react";
import {
  FaBuilding,
  FaSitemap,
  FaMoneyCheckAlt,
  FaEnvelope,
  FaSms,
  FaUsers,
  FaThLarge,
  FaUserClock,
  FaHistory,
} from "react-icons/fa";

const tabs = [
  { key: "details", label: "COMPANY DETAILS", icon: <FaBuilding /> },
  { key: "structure", label: "COMPANY STRUCTURE", icon: <FaSitemap /> },
  { key: "payments", label: "PAYMENT INTEGRATION", icon: <FaMoneyCheckAlt /> },
  { key: "email", label: "EMAIL INTEGRATION", icon: <FaEnvelope /> },
  { key: "sms", label: "SMS INTEGRATION", icon: <FaSms /> },
  { key: "users", label: "USERS", icon: <FaUsers /> },
  { key: "modules", label: "MODULES CONFIGURATION", icon: <FaThLarge /> },
  { key: "sessions", label: "USER SESSIONS", icon: <FaUserClock /> },
  { key: "activities", label: "USER ACTIVITIES", icon: <FaHistory /> },
];

const Card = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm">
    <div className="p-4 border-b border-slate-200">
      <div className="text-sm font-extrabold text-slate-900">{title}</div>
      {subtitle ? <div className="text-xs text-slate-600 mt-1">{subtitle}</div> : null}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition"
  />
);

export default function CompanySetupPage() {
  const [active, setActive] = useState("details");

  // placeholder state (we’ll wire to backend later)
  const [company, setCompany] = useState({
    companyName: "",
    legalName: "",
    email: "",
    phone: "",
    currency: "KES",
    country: "Kenya",
    city: "Nairobi",
    address: "",
    fiscalStartMonth: "January",
    rentDueDay: "5",
  });

  const months = useMemo(
    () => [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ],
    []
  );

  const renderTab = () => {
    switch (active) {
      case "details":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Company Profile" subtitle="Basic property management company information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Company Name</label>
                  <Input
                    value={company.companyName}
                    onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                    placeholder="Milik Property Management"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Legal Name</label>
                  <Input
                    value={company.legalName}
                    onChange={(e) => setCompany({ ...company, legalName: e.target.value })}
                    placeholder="Milik Property Management Ltd"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Email</label>
                  <Input
                    type="email"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    placeholder="admin@milik.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Phone</label>
                  <Input
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    placeholder="0700 000 000"
                  />
                </div>
              </div>
            </Card>

            <Card title="Defaults & Fiscal Period" subtitle="System-wide defaults used in statements and reports">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Currency</label>
                  <Select
                    value={company.currency}
                    onChange={(e) => setCompany({ ...company, currency: e.target.value })}
                  >
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                    <option value="UGX">UGX</option>
                    <option value="TZS">TZS</option>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Fiscal Start Month</label>
                  <Select
                    value={company.fiscalStartMonth}
                    onChange={(e) => setCompany({ ...company, fiscalStartMonth: e.target.value })}
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Default Rent Due Day</label>
                  <Input
                    type="number"
                    min="1"
                    max="28"
                    value={company.rentDueDay}
                    onChange={(e) => setCompany({ ...company, rentDueDay: e.target.value })}
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Country</label>
                  <Input
                    value={company.country}
                    onChange={(e) => setCompany({ ...company, country: e.target.value })}
                    placeholder="Kenya"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <Input
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    placeholder="Nairobi"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Address</label>
                  <Input
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    placeholder="Kasarani, Nairobi"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button className="rounded-xl bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition">
                  Save Changes
                </button>
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <Card title="Coming Soon" subtitle="We’ll implement this tab next.">
            <div className="text-sm text-slate-700">
              This section is ready for wiring. Tell me which tab you want next and we’ll build it fully.
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#dfebed]">
      <div className="mx-auto max-w-[1200px] px-4 py-5">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold text-slate-900">Company Setup</div>
            <div className="text-sm text-slate-600">
              Configure your company, integrations, users and modules.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition">
              Export Settings
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition">
              View Audit Log
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={[
                    "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-extrabold transition border",
                    isActive
                      ? "bg-[#0f766e] text-white border-[#0f766e]"
                      : "bg-white/70 text-slate-800 border-slate-200 hover:bg-white",
                  ].join(" ")}
                >
                  <span className="text-sm">{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-4">{renderTab()}</div>
      </div>
    </div>
  );
}
