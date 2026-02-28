// DashboardLayout.jsx
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";
import TabManager from "../../components/Layout/TabManager";
import Navbar from "../../components/Dashboard/Navbar";
import StartMenu from "../../components/StartMenu/StartMenu";
const DashboardLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#FFFFFF',
            color: darkMode ? '#FFFFFF' : '#374151',
            border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
          },
        }}
      />

      {/* Fixed Navbar */}
      <div className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <TopToolbar darkMode={darkMode} />
      </div>

      {/* Tabs */}
      <div className="fixed top-22 left-0 right-0 z-40">
        <TabManager darkMode={darkMode} />
      </div>

      {/* MAIN CONTENT: keep it white and remove h-screen */}
      <div className="flex flex-1 pt-28 bg-white min-h-screen">
        <main className="flex-1 pt-4 overflow-y-auto overflow-x-hidden bg-white min-h-[calc(100vh-7rem)]">
          <div className="max-w-full min-h-[calc(100vh-7rem)]">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;
              if (typeof child.type === "string") return child;
              return React.cloneElement(child, { darkMode });
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

const TopToolbar = ({ darkMode, setDarkMode }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const navigate = useNavigate();

  // Route configurations
  const routeConfig = {
    "new-property": "/properties/new",
    open: "/files/open",
    save: "/files/save",
    export: "/reports/export",
    print: "/print",
    exit: "/logout",
    "landlord-list": "/landlords",
    "add-landlord": "/landlords/new",
    "properties-list": "/properties",
    "add-property": "/properties/new",
    "property-details": "/properties/details",
    "units-spaces": "/units",
    availability: "/availability",
    "property-status": "/properties/status",
    "units-list": "/units",
    "add-unit": "/units/new",
    "space-types": "/units/space-types",
    "unit-status": "/units/status",
    "tenants-list": "/tenants",
    "add-tenant": "/tenants/new",
    "tenant-agreements": "/agreements",
    "lease-management": "/leases",
    "tenant-ledger": "/tenants/ledger",
    "tenant-financing": "/tenants/financing",
    "tenant-journals": "/tenants/journals",
    "payment-vouchers": "/financial/payment-vouchers",
    "consolidate-pvs": "/financial/consolidate-pvs",
    "service-providers": "/financial/service-providers",
    accounts: "/financial/accounts",
    transactions: "/financial/transactions",
    "ledger-entries": "/financial/ledger-entries",
    "new-invoice": "/invoices/new",
    "increase-bill": "/invoices/increase",
    "reduce-bill": "/invoices/reduce",
    "late-penalties": "/invoices/late-penalties",
    "rental-invoices-vat": "/invoices/vat",
    "withholding-vat": "/invoices/withholding-vat",
    "withholding-tax": "/invoices/withholding-tax",
    "rental-aged-analysis": "/reports/rental-aged-analysis",
    "landlord-invoices": "/invoices/landlord",
    "rental-receipts": "/receipts",
    "slip-collection": "/receipts/slips",
    "mpesa-import": "/receipts/mpesa-import",
    "tenant-prepayments": "/receipts/prepayments",
    "instant-receipts": "/receipts/instant",
    "landlord-receipt": "/receipts/landlord",
    "expense-requisition": "/expenses/requisition",
    "notes-payable": "/expenses/notes-payable",
    "payment-vouchers-list": "/expenses/payment-vouchers",
    "consolidate-pvs-list": "/expenses/consolidate-pvs",
    "notes-payment-vouchers": "/expenses/notes-payment-vouchers",
    "landlord-standing-orders": "/landlords/standing-orders",
    "landlord-advancement": "/landlords/advancement",
    "landlord-jvs": "/landlords/journals",
    "batch-landlord-jvs": "/landlords/batch-journals",
    "rental-collection": "/reports/rental-collection",
    "paid-balance": "/reports/paid-balance",
    "aged-analysis": "/reports/aged-analysis",
    "landlord-statements": "/reports/landlord-statements",
    "commission-reports": "/reports/commissions",
    "tax-reports": "/reports/tax",
    "tenant-summary": "/reports/tenant-summary",
    settings: "/settings",
    users: "/users",
    backup: "/tools/backup",
    "import-export": "/tools/import-export",
    "meter-readings": "/meter-readings",
    maintenance: "/maintenance",
    inspections: "/inspections",
    documentation: "/help/documentation",
    support: "/help/support",
    about: "/help/about",
  };

  const mainMenuItems = [
    {
      id: "file",
      label: "File",
      submenu: [
        { id: "new-property", label: "New Property", shortcut: "Ctrl+N" },
        { id: "open", label: "Open", shortcut: "Ctrl+O" },
        { id: "save", label: "Save", shortcut: "Ctrl+S" },
        { type: "separator" },
        { id: "export", label: "Export Reports", shortcut: "Ctrl+E" },
        { id: "print", label: "Print", shortcut: "Ctrl+P" },
        { type: "separator" },
        { id: "exit", label: "Exit", shortcut: "Alt+F4" },
      ],
    },
    {
      id: "properties",
      label: "Properties",
      submenu: [
        { id: "properties-list", label: "Properties Listing" },
        { id: "add-property", label: "Add New Property" },
        { id: "property-details", label: "Property Details" },
        { type: "separator" },
        { id: "units-spaces", label: "Units/Spaces Management" },
        { id: "availability", label: "Availability Status" },
        { id: "property-status", label: "Property Specific Status" },
      ],
    },
    {
      id: "landlord",
      label: "landlord",
      submenu: [
        { id: "landlord-list", label: "Landlord Listing" },
        { id: "add-landlord", label: "Add New Landlord" },
        { id: "landlord-details", label: "Landlord Details" },
      ],
    },
    {
      id: "units",
      label: "Units",
      submenu: [
        { id: "units-list", label: "Units Listing" },
        { id: "add-unit", label: "Add New Unit" },
        { id: "space-types", label: "Space Types" },
        { id: "unit-status", label: "Unit Status Dashboard" },
      ],
    },
    {
      id: "tenants",
      label: "Tenants",
      submenu: [
        { id: "tenants-list", label: "Tenants Listing" },
        { id: "add-tenant", label: "Add New Tenant" },
        { type: "separator" },
        { id: "tenant-agreements", label: "Tenant Agreements" },
        { id: "lease-management", label: "Lease Management" },
        { type: "separator" },
        { id: "tenant-ledger", label: "Tenant Ledger" },
        { id: "tenant-financing", label: "Tenants Financing" },
        { id: "tenant-journals", label: "Tenants Journals" },
      ],
    },
    {
      id: "financial",
      label: "Financial",
      submenu: [
        { id: "rental-invoicing", label: "Rental Invoicing", hasSubmenu: true },
        { id: "rental-receipting", label: "Rental Receipting", hasSubmenu: true },
        { type: "separator" },
        { id: "payment-vouchers", label: "Payment Vouchers" },
        { id: "consolidate-pvs", label: "Consolidate PVs" },
        { type: "separator" },
        { id: "expenses", label: "Expenses", hasSubmenu: true },
        { id: "landlord-payments", label: "Landlord Payments", hasSubmenu: true },
        { id: "service-providers", label: "Service Providers" },
        { type: "separator" },
        { id: "accounts", label: "Accounts" },
        { id: "transactions", label: "Transactions" },
        { id: "ledger-entries", label: "Ledger Entries" },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      submenu: [
        { id: "rental-collection", label: "Rental Collection Report" },
        { id: "paid-balance", label: "Paid & Balance Report" },
        { id: "aged-analysis", label: "Aged Analysis" },
        { type: "separator" },
        { id: "landlord-statements", label: "Landlord Statements" },
        { id: "commission-reports", label: "Commission Reports" },
        { id: "tax-reports", label: "Tax Reports" },
        { id: "tenant-summary", label: "Tenant Summary" },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      submenu: [
        { id: "settings", label: "Settings" },
        { id: "users", label: "Users" },
        { id: "backup", label: "Backup/Restore" },
        { id: "import-export", label: "Import/Export" },
        { type: "separator" },
        { id: "meter-readings", label: "Meter Readings" },
        { id: "maintenance", label: "Maintenance Management" },
        { id: "inspections", label: "Inspections" },
      ],
    },
    {
      id: "help",
      label: "Help",
      submenu: [
        { id: "documentation", label: "Documentation" },
        { id: "support", label: "Support" },
        { id: "about", label: "About" },
      ],
    },
  ];

  const nestedSubmenus = {
    "rental-invoicing": [
      { id: "new-invoice", label: "New Tenant Invoicing" },
      { id: "increase-bill", label: "Increase Bill" },
      { id: "reduce-bill", label: "Reduce Bill" },
      { id: "late-penalties", label: "Late Penalties - Invoices" },
      { type: "separator" },
      { id: "rental-invoices-vat", label: "Rental Invoices V.A.T" },
      { id: "withholding-vat", label: "Withholding V.A.T" },
      { id: "withholding-tax", label: "Withholding Tax" },
      { id: "rental-aged-analysis", label: "Rental Aged Analysis" },
      { id: "landlord-invoices", label: "Landlord Invoices" },
    ],
    "rental-receipting": [
      { id: "rental-receipts", label: "Rental Receipts" },
      { id: "slip-collection", label: "Slip Collection" },
      { id: "mpesa-import", label: "M-Pesa Batch Import" },
      { id: "tenant-prepayments", label: "Tenants Prepayments" },
      { id: "instant-receipts", label: "Instant Receipts" },
      { id: "landlord-receipt", label: "Landlord Receipt" },
    ],
    expenses: [
      { id: "expense-requisition", label: "Expense Requisition" },
      { id: "notes-payable", label: "Notes Payable" },
      { id: "payment-vouchers-list", label: "Payment Vouchers" },
      { id: "consolidate-pvs-list", label: "Consolidate PVs" },
      { id: "notes-payment-vouchers", label: "Notes Payment Vouchers" },
    ],
    "landlord-payments": [
      { id: "landlord-standing-orders", label: "Landlord Standing Orders" },
      { id: "landlord-advancement", label: "Landlord Advancement" },
      { id: "landlord-jvs", label: "Landlord J.Vs" },
      { id: "batch-landlord-jvs", label: "Batch Landlord J.Vs" },
    ],
  };

  const handleMenuItemClick = (menuId) => {
    const route = routeConfig[menuId];
    if (route) {
      navigate(route);
      setActiveMenu(null);
      setActiveSubMenu(null);
    }
  };

  const renderMenuItem = (item) => {
    if (item.type === "separator") {
      return (
        <div
          key={`sep-${Math.random()}`}
          className={`h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"} my-1`}
        />
      );
    }

    if (item.hasSubmenu) {
      return (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setActiveSubMenu(item.id)}
          onMouseLeave={() => setTimeout(() => setActiveSubMenu(null), 100)}
        >
          <button
            className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <span>{item.label}</span>
            <span className="text-xs">▶</span>
          </button>
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleMenuItemClick(item.id)}
        className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center ${
          darkMode
            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <span>{item.label}</span>
        {item.shortcut && (
          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {item.shortcut}
          </span>
        )}
      </button>
    );
  };

  const renderNestedMenuItem = (item) => {
    if (item.type === "separator") {
      return (
        <div
          key={`sep-${Math.random()}`}
          className={`h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"} my-1`}
        />
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleMenuItemClick(item.id)}
        className={`w-full text-left px-4 py-2 text-sm ${
          darkMode
            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        {item.label}
      </button>
    );
  };

  return (
    <div className="relative bg-[#a5c9b7]">
      {/* REMOVED: <Navbar darkMode={darkMode} />  (this is where the old Start button was coming from) */}
    <Navbar />
     <StartMenu />
      <div className={`flex items-center ${darkMode ? "bg-gray-800" : "bg-[#0A400C]"}`}>
        {/* Application Logo/Title */}
        <div
          className={`px-4 py-2 ${darkMode ? "bg-gray-900" : "bg-gray-100"} border-r ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <Link to="/dashboard" className="flex items-center space-x-2 no-underline">
            <img src="/logo.png" alt="Milik Logo" className="h-6 w-10 mr-0" />
          </Link>
        </div>

        {/* Main Menu Items */}
        {mainMenuItems.map((item) => (
          <div key={item.id} className="relative group">
            <button
              onClick={() => {
                setActiveMenu(activeMenu === item.id ? null : item.id);
                setActiveSubMenu(null);
              }}
              className={`px-4 py-2 text-sm font-bold text-white transition-colors ${
                activeMenu === item.id
                  ? darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-emerald-700 text-white"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-emerald-700 hover:text-gray-100"
              }`}
            >
              {item.label}
            </button>

            {/* Main Dropdown Menu */}
            {activeMenu === item.id && item.submenu && (
              <div
                className={`absolute left-0 top-full mt-0 w-64 shadow-lg z-50 border ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                {item.submenu.map((subItem, index) => (
                  <React.Fragment key={subItem.id || index}>{renderMenuItem(subItem)}</React.Fragment>
                ))}
              </div>
            )}

            {/* Nested Submenu */}
            {activeMenu === item.id && activeSubMenu && nestedSubmenus[activeSubMenu] && (
              <div
                className={`absolute left-full top-0 w-64 shadow-lg z-50 border ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-emerald-700 border-gray-200"
                }`}
              >
                {nestedSubmenus[activeSubMenu].map((nestedItem, nestedIndex) => (
                  <React.Fragment key={nestedItem.id || nestedIndex}>
                    {renderNestedMenuItem(nestedItem)}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Quick Actions Toolbar */}
        <div className="flex items-center space-x-1 px-4 py-1 text-xs">
          <button
            onClick={() => navigate("/tenants/new")}
            className={`p-2 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-500 text-gray-200"}`}
            title="Add Tenant"
          >
            + Tenant
          </button>
          <button
            onClick={() => navigate("/invoices/new")}
            className={`p-2 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-500 text-gray-200"}`}
            title="New Invoice"
          >
            + Invoice
          </button>
          <button
            onClick={() => navigate("/receipts")}
            className={`p-2 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-500 text-gray-200"}`}
            title="Receive Payment"
          >
            + Payment
          </button>
          <div className={`h-6 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"} mx-2`} />
          <button
            onClick={() => window.location.reload()}
            className={`p-2 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-500 text-gray-200"}`}
            title="Refresh"
          >
            ↻
          </button>
          <button
            onClick={() => navigate("/settings")}
            className={`p-2 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-500 text-gray-200"}`}
            title="Settings"
          >
            ⚙
          </button>

          {/* Optional: Dark mode toggle if you want it here */}
          {typeof setDarkMode === "function" && (
            <button
              onClick={() => setDarkMode((v) => !v)}
              className={`p-2 rounded ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-500 text-gray-200"}`}
              title="Toggle Theme"
            >
              {darkMode ? "☀" : "🌙"}
            </button>
          )}
        </div>
      </div>

      {/* Close menu when clicking outside */}
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}
    </div>
  );
};

export default DashboardLayout;
