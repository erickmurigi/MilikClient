// DashboardLayout.jsx
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileInvoice, FaReceipt, FaCoins, FaBook, FaChartBar,
  FaCreditCard, FaExchangeAlt, FaMoneyBillWave, FaHandHolding,
  FaCalendarAlt, FaWallet, FaUniversity, FaCog,
  FaExclamationTriangle, FaCalculator, FaPhone,
  FaFile, FaSave, FaFileExport, FaPrint, FaSignOutAlt,
  FaHome, FaPlus, FaInfo, FaSquare, FaCheck,
  FaUser, FaUsers, FaAddressCard, FaTag, FaClipboard,
  FaHandshake, FaChartLine, FaChartPie, FaFileAlt,
  FaToolbox, FaDatabase, FaWrench, FaHeadset, FaInfoCircle
} from "react-icons/fa";
import "./dashboard.css";
import TabManager from "../../components/Layout/TabManager";
import ModuleTabManager from "../../components/Layout/ModuleTabManager";
import Navbar from "../../components/Dashboard/Navbar";
import StartMenu from "../../components/StartMenu/StartMenu";
const DashboardLayout = ({ children, lockContentScroll = false }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`${
        lockContentScroll ? "h-screen overflow-hidden" : "min-h-screen"
      } ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}
    >
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
      <div className="fixed top-[88px] left-0 right-0 z-40">
        <TabManager darkMode={darkMode} />
      </div>

      {/* MAIN CONTENT: keep it white and remove h-screen */}
      <div
        className={`flex flex-1 pt-36 bg-white ${
          lockContentScroll ? "h-full min-h-0 overflow-hidden pb-9" : "min-h-screen pb-20"
        }`}
      >
        <main
          className={`flex-1 pt-4 overflow-x-hidden bg-white ${
            lockContentScroll
              ? "overflow-y-hidden min-h-0 h-full"
              : "overflow-y-auto min-h-[calc(100vh-9rem)]"
          }`}
        >
          <div
            className={`max-w-full ${
              lockContentScroll ? "h-full min-h-0" : "min-h-[calc(100vh-9rem)]"
            }`}
          >
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;
              if (typeof child.type === "string") return child;
              return React.cloneElement(child, { darkMode });
            })}
          </div>
        </main>
      </div>

      {/* Bottom Module Tabs */}
      <ModuleTabManager darkMode={darkMode} />
    </div>
  );
};

const TopToolbar = ({ darkMode, setDarkMode }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoveredFinancialItem, setHoveredFinancialItem] = useState(null); // Track hovered submenu items
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
    "rental-invoices-list": "/invoices/rental",
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
      icon: FaFile,
      submenu: [
        { id: "new-property", label: "New Property", icon: FaPlus, shortcut: "Ctrl+N" },
        { id: "open", label: "Open", icon: FaFile, shortcut: "Ctrl+O" },
        { id: "save", label: "Save", icon: FaSave, shortcut: "Ctrl+S" },
        { type: "separator" },
        { id: "export", label: "Export Reports", icon: FaFileExport, shortcut: "Ctrl+E" },
        { id: "print", label: "Print", icon: FaPrint, shortcut: "Ctrl+P" },
        { type: "separator" },
        { id: "exit", label: "Exit", icon: FaSignOutAlt, shortcut: "Alt+F4" },
      ],
    },
    {
      id: "properties",
      label: "Properties",
      icon: FaHome,
      submenu: [
        { id: "properties-list", label: "Properties Listing", icon: FaHome },
        { id: "add-property", label: "Add New Property", icon: FaPlus },
        { id: "property-details", label: "Property Details", icon: FaInfo },
        { type: "separator" },
        { id: "units-spaces", label: "Units/Spaces Management", icon: FaSquare },
        { id: "availability", label: "Availability Status", icon: FaCheck },
        { id: "property-status", label: "Property Specific Status", icon: FaTag },
      ],
    },
    {
      id: "landlord",
      label: "Landlord",
      icon: FaUser,
      submenu: [
        { id: "landlord-list", label: "Landlord Listing", icon: FaUser },
        { id: "add-landlord", label: "Add New Landlord", icon: FaPlus },
        { id: "landlord-details", label: "Landlord Details", icon: FaAddressCard },
      ],
    },
    {
      id: "units",
      label: "Units",
      icon: FaSquare,
      submenu: [
        { id: "units-list", label: "Units Listing", icon: FaSquare },
        { id: "add-unit", label: "Add New Unit", icon: FaPlus },
        { id: "space-types", label: "Space Types", icon: FaTag },
        { id: "unit-status", label: "Unit Status Dashboard", icon: FaCheck },
      ],
    },
    {
      id: "tenants",
      label: "Tenants",
      icon: FaUsers,
      submenu: [
        { id: "tenants-list", label: "Tenants Listing", icon: FaUsers },
        { id: "add-tenant", label: "Add New Tenant", icon: FaPlus },
        { type: "separator" },
        { id: "tenant-agreements", label: "Tenant Agreements", icon: FaClipboard },
        { id: "lease-management", label: "Lease Management", icon: FaHandshake },
        { type: "separator" },
        { id: "tenant-ledger", label: "Tenant Ledger", icon: FaBook },
        { id: "tenant-financing", label: "Tenants Financing", icon: FaReceipt },
        { id: "tenant-journals", label: "Tenants Journals", icon: FaClipboard },
      ],
    },
    {
      id: "financial",
      label: "Financial",
      icon: FaMoneyBillWave,
      submenu: [
        { id: "rental-invoicing", label: "Rental Invoicing", hasSubmenu: true, icon: FaFileInvoice, category: "invoicing", categoryColor: "#4F46E5" },
        { id: "rental-receipting", label: "Rental Receipting", hasSubmenu: true, icon: FaReceipt, category: "receipting", categoryColor: "#10B981" },
        { type: "separator" },
        { id: "payment-vouchers", label: "Payment Vouchers", icon: FaCreditCard, category: "expenses", categoryColor: "#FF8C00" },
        { id: "consolidate-pvs", label: "Consolidate PVs", icon: FaCoins, category: "expenses", categoryColor: "#FF8C00" },
        { type: "separator" },
        { id: "expenses", label: "Expenses", hasSubmenu: true, icon: FaMoneyBillWave, category: "expenses", categoryColor: "#FF8C00" },
        { id: "landlord-payments", label: "Landlord Payments", hasSubmenu: true, icon: FaHandHolding, category: "landlord", categoryColor: "#8B5CF6" },
        { id: "service-providers", label: "Service Providers", icon: FaCog, category: "landlord", categoryColor: "#8B5CF6" },
        { type: "separator" },
        { id: "accounts", label: "Accounts", icon: FaUniversity, category: "ledger", categoryColor: "#0B3B2E" },
        { id: "transactions", label: "Transactions", icon: FaExchangeAlt, category: "ledger", categoryColor: "#0B3B2E" },
        { id: "ledger-entries", label: "Ledger Entries", icon: FaBook, category: "ledger", categoryColor: "#0B3B2E" },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: FaChartBar,
      submenu: [
        { id: "rental-collection", label: "Rental Collection Report", icon: FaChartBar },
        { id: "paid-balance", label: "Paid & Balance Report", icon: FaChartLine },
        { id: "aged-analysis", label: "Aged Analysis", icon: FaChartPie },
        { type: "separator" },
        { id: "landlord-statements", label: "Landlord Statements", icon: FaFileAlt },
        { id: "commission-reports", label: "Commission Reports", icon: FaMoneyBillWave },
        { id: "tax-reports", label: "Tax Reports", icon: FaBook },
        { id: "tenant-summary", label: "Tenant Summary", icon: FaUsers },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      icon: FaToolbox,
      submenu: [
        { id: "settings", label: "Settings", icon: FaCog },
        { id: "users", label: "Users", icon: FaUsers },
        { id: "backup", label: "Backup/Restore", icon: FaDatabase },
        { id: "import-export", label: "Import/Export", icon: FaExchangeAlt },
        { type: "separator" },
        { id: "meter-readings", label: "Meter Readings", icon: FaCog },
        { id: "maintenance", label: "Maintenance Management", icon: FaWrench },
        { id: "inspections", label: "Inspections", icon: FaClipboard },
      ],
    },
    {
      id: "help",
      label: "Help",
      icon: FaInfoCircle,
      submenu: [
        { id: "documentation", label: "Documentation", icon: FaBook },
        { id: "support", label: "Support", icon: FaHeadset },
        { id: "about", label: "About", icon: FaInfoCircle },
      ],
    },
  ];

  const nestedSubmenus = {
    "rental-invoicing": [
      { id: "rental-invoices-list", label: "Rental Invoices", icon: FaFileInvoice },
      { id: "new-invoice", label: "Create New Invoice", icon: FaFileInvoice },
      { id: "increase-bill", label: "Increase Bill", icon: FaChartBar },
      { id: "reduce-bill", label: "Reduce Bill", icon: FaChartBar },
      { id: "late-penalties", label: "Late Penalties - Invoices", icon: FaExclamationTriangle },
      { type: "separator" },
      { id: "rental-invoices-vat", label: "Rental Invoices V.A.T", icon: FaFileInvoice },
      { id: "withholding-vat", label: "Withholding V.A.T", icon: FaCalculator },
      { id: "withholding-tax", label: "Withholding Tax", icon: FaCalculator },
      { id: "rental-aged-analysis", label: "Rental Aged Analysis", icon: FaChartBar },
      { id: "landlord-invoices", label: "Landlord Invoices", icon: FaFileInvoice },
    ],
    "rental-receipting": [
      { id: "rental-receipts", label: "Rental Receipts", icon: FaReceipt },
      { id: "slip-collection", label: "Slip Collection", icon: FaWallet },
      { id: "mpesa-import", label: "M-Pesa Batch Import", icon: FaPhone },
      { id: "tenant-prepayments", label: "Tenants Prepayments", icon: FaCoins },
      { id: "instant-receipts", label: "Instant Receipts", icon: FaReceipt },
      { id: "landlord-receipt", label: "Landlord Receipt", icon: FaReceipt },
    ],
    expenses: [
      { id: "expense-requisition", label: "Expense Requisition", icon: FaFileInvoice },
      { id: "notes-payable", label: "Notes Payable", icon: FaCreditCard },
      { id: "payment-vouchers-list", label: "Payment Vouchers", icon: FaMoneyBillWave },
      { id: "consolidate-pvs-list", label: "Consolidate PVs", icon: FaCoins },
      { id: "notes-payment-vouchers", label: "Notes Payment Vouchers", icon: FaCreditCard },
    ],
    "landlord-payments": [
      { id: "landlord-standing-orders", label: "Landlord Standing Orders", icon: FaCalendarAlt },
      { id: "landlord-advancement", label: "Landlord Advancement", icon: FaMoneyBillWave },
      { id: "landlord-jvs", label: "Landlord J.Vs", icon: FaBook },
      { id: "batch-landlord-jvs", label: "Batch Landlord J.Vs", icon: FaBook },
    ],
  };

  const handleMenuItemClick = (menuId) => {
    const route = routeConfig[menuId];
    if (route) {
      navigate(route);
      setActiveMenu(null);
      setHoveredFinancialItem(null);
    }
  };

  // Universal menu colors and info for all menu categories
  const menuColorMap = {
    // File menu
    "file": { color: "#6366F1", label: "File Operations", icon: FaFile },
    // Properties menu
    "properties": { color: "#3B82F6", label: "Properties", icon: FaHome },
    // Landlord menu  
    "landlord": { color: "#F59E0B", label: "Landlord Management", icon: FaUser },
    // Units menu
    "units": { color: "#8B5CF6", label: "Units & Spaces", icon: FaSquare },
    // Tenants menu
    "tenants": { color: "#EC4899", label: "Tenants", icon: FaUsers },
    // Reports menu
    "reports": { color: "#10B981", label: "Reports & Analytics", icon: FaChartBar },
    // Tools menu
    "tools": { color: "#06B6D4", label: "Tools & Settings", icon: FaToolbox },
    // Help menu
    "help": { color: "#8B5CF6", label: "Help & Support", icon: FaInfoCircle },
    // Financial sub-categories
    "rental-invoicing": { color: "#4F46E5", label: "Rental Invoicing", icon: FaFileInvoice },
    "rental-receipting": { color: "#10B981", label: "Rental Receipting", icon: FaReceipt },
    "expenses": { color: "#FF8C00", label: "Expenses", icon: FaMoneyBillWave },
    "landlord-payments": { color: "#8B5CF6", label: "Landlord Payments", icon: FaHandHolding },
  };

  // Professional Dropdown Component - Works for all menus
  const ProfessionalDropdown = ({ menuId, items }) => {
    const menuInfo = menuColorMap[menuId] || { color: "#0B3B2E", label: menuId.toUpperCase(), icon: FaCog };
    const MenuIcon = menuInfo.icon;

    return (
      <div
        className={`absolute left-full top-0 w-96 shadow-2xl z-50 rounded-lg overflow-hidden border pointer-events-auto ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
        style={{ marginLeft: "0px" }}
        onMouseEnter={() => setHoveredFinancialItem(menuId)}
        onMouseLeave={() => setHoveredFinancialItem(null)}
      >
        {/* Category Header */}
        <div
          style={{ backgroundColor: menuInfo.color }}
          className="px-5 py-4 text-white flex items-center space-x-3"
        >
          <MenuIcon size={22} className="flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold leading-tight">{menuInfo.label}</h3>
            <p className="text-xs opacity-90">Quick Access</p>
          </div>
        </div>

        {/* Menu Items Container */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} max-h-96 overflow-y-auto`}>
          {items.map((item, idx) => (
            <React.Fragment key={item.id || `sep-${idx}`}>
              {item.type === "separator" ? (
                <div className={`h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"} mx-3 my-2`} />
              ) : (
                <button
                  onClick={() => {
                    handleMenuItemClick(item.id);
                    setHoveredFinancialItem(null);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-medium flex items-center space-x-3 transition-all duration-150 border-l-4 ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700 hover:text-white border-l-transparent"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent border-l-transparent"
                  }`}
                >
                  {item.icon && (
                    <span
                      className="flex-shrink-0 transition-transform duration-150"
                      style={{ color: "#FF8C00" }}
                    >
                      <item.icon size={16} />
                    </span>
                  )}
                  <div className="flex-1">
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className={`ml-2 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs opacity-50 transition-opacity`}
                    style={{ color: menuInfo.color }}
                  >
                    →
                  </span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footer Accent */}
        <div style={{ backgroundColor: menuInfo.color }} className="h-1.5" />
      </div>
    );
  };

  // Financial Dropdown Component - Color-coded for Financial tab
  const FinancialDropdown = ({ categoryId, items }) => {
    const category = menuColorMap[categoryId] || { color: "#0B3B2E", label: "Financial", icon: FaBook };

    return (
      <div
        className={`absolute left-full top-0 w-96 shadow-2xl z-50 rounded-lg overflow-hidden border pointer-events-auto ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
        style={{ marginLeft: "0px" }}
        onMouseEnter={() => setHoveredFinancialItem(categoryId)}
        onMouseLeave={() => setHoveredFinancialItem(null)}
      >
        {/* Category Header */}
        <div
          style={{ backgroundColor: category.color }}
          className="px-5 py-4 text-white flex items-center space-x-3"
        >
          <category.icon size={22} className="flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold leading-tight">{category.label}</h3>
            <p className="text-xs opacity-90">Financial Operations</p>
          </div>
        </div>

        {/* Menu Items Container */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} max-h-96 overflow-y-auto`}>
          {items.map((item, idx) => (
            <React.Fragment key={item.id || `sep-${idx}`}>
              {item.type === "separator" ? (
                <div className={`h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"} mx-3 my-2`} />
              ) : (
                <button
                  onClick={() => {
                    handleMenuItemClick(item.id);
                    setHoveredFinancialItem(null);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-medium flex items-center space-x-3 transition-all duration-150 border-l-4 ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700 hover:text-white border-l-transparent"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent border-l-transparent"
                  }`}
                >
                  {item.icon && (
                    <span
                      className="flex-shrink-0 transition-transform duration-150"
                      style={{ color: category.color }}
                    >
                      <item.icon size={16} />
                    </span>
                  )}
                  <span>{item.label}</span>
                  <span
                    className={`text-xs opacity-50 transition-opacity`}
                    style={{ color: category.color }}
                  >
                    →
                  </span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footer Accent */}
        <div style={{ backgroundColor: category.color }} className="h-1.5" />
      </div>
    );
  };

  let separatorCounter = 0;
  const renderMenuItem = (item, index) => {
    if (item.type === "separator") {
      return (
        <div
          key={`sep-${index}`}
          className={`h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"} my-1`}
        />
      );
    }

    if (item.hasSubmenu) {
      return (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setHoveredFinancialItem(item.id)}
          onMouseLeave={() => {
            // Small delay to allow cursor to cross to dropdown without losing hover
            setTimeout(() => setHoveredFinancialItem(null), 50);
          }}
        >
          {/* Parent Button */}
          <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-all duration-200 ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon && (
                <span 
                  style={{ color: activeMenu === "financial" ? (item.categoryColor || "#666") : "#FF8C00" }}
                  className="transition-transform duration-200"
                >
                  <item.icon size={16} />
                </span>
              )}
              <span>{item.label}</span>
            </div>
            <span className="text-xs">▶</span>
          </button>

          {/* Invisible bridge to prevent gap hover loss */}
          {hoveredFinancialItem === item.id && nestedSubmenus[item.id] && (
            <div
              className="absolute left-full top-0 w-2 h-full pointer-events-auto"
              onMouseEnter={() => setHoveredFinancialItem(item.id)}
              onMouseLeave={() => {
                setTimeout(() => setHoveredFinancialItem(null), 50);
              }}
            />
          )}

          {/* Submenu rendering */}
          {nestedSubmenus[item.id] && hoveredFinancialItem === item.id && (
            activeMenu === "financial" ? (
              <FinancialDropdown
                categoryId={item.id}
                items={nestedSubmenus[item.id]}
              />
            ) : (
              <ProfessionalDropdown
                menuId={item.id}
                items={nestedSubmenus[item.id]}
              />
            )
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleMenuItemClick(item.id)}
        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-all duration-200 ${
          darkMode
            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center space-x-3">
          {item.icon && (
            <span 
              style={{ color: activeMenu === "financial" ? (item.categoryColor || "#666") : "#FF8C00" }}
              className="transition-transform duration-200"
            >
              <item.icon size={16} />
            </span>
          )}
          <span>{item.label}</span>
        </div>
        {item.shortcut && (
          <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {item.shortcut}
          </span>
        )}
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
                  <React.Fragment key={subItem.id || `submenu-${item.id}-${index}`}>{renderMenuItem(subItem, index)}</React.Fragment>
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
