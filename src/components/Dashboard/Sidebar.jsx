import React, { useState } from 'react';
import {
  FaTachometerAlt,
  FaBuilding,
  FaLayerGroup,
  FaUsers,
  FaFileContract,
  FaDoorOpen,
  FaTools,
  FaClipboardCheck,
  FaReceipt,
  FaTint,
  FaBolt,
  FaWallet,
  FaCommentDots,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaPiggyBank,
  FaRandom,
  FaBookOpen,
  FaChartLine,
  FaCog,
  FaClipboardList,
  FaExchangeAlt,
  FaUsersCog,
  FaSearch,
  FaChevronDown,
  FaAngleRight,
  FaTimes,
  FaSyncAlt
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab, darkMode }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const menuItems = {
    client: [
      { id: 'dashboard', name: 'Dashboard', icon: <FaTachometerAlt />, badge: null }
    ],
    properties: [
      { id: 'properties', name: 'Properties', icon: <FaBuilding />, badge: 30 },
      { id: 'units', name: 'Units', icon: <FaLayerGroup />, badge: 75 },
      { id: 'tenants', name: 'Tenants', icon: <FaUsers />, badge: 41 },
      { id: 'leases', name: 'Leases', icon: <FaFileContract />, badge: 40 },
      { id: 'vacants', name: 'Vacants', icon: <FaDoorOpen />, badge: null },
      { id: 'maintenances', name: 'Maintenances', icon: <FaTools />, badge: null },
      { id: 'inspections', name: 'Inspections', icon: <FaClipboardCheck />, badge: null }
    ],
    utilities: [
      { id: 'invoices', name: 'Invoices', icon: <FaReceipt />, badge: 43 },
      { id: 'water-billings', name: 'Water Billings', icon: <FaTint />, badge: null },
      { id: 'electricity-billings', name: 'Electricity Billings', icon: <FaBolt />, badge: null }
    ],
    financial: [
      { id: 'arrears', name: 'Arrears', icon: <FaTint />, badge: null },
      { id: 'wallet-transactions', name: 'Wallet Transactions', icon: <FaWallet />, badge: null },
      { id: 'payment-messages', name: 'Payment Messages', icon: <FaCommentDots />, badge: 2 },
      { id: 'mpesa-transactions', name: 'M-PESA Transactions', icon: <FaMoneyBillWave />, badge: 190 },
      { id: 'expenses', name: 'Expenses', icon: <FaWallet />, badge: null, hasSubmenu: true },
      { id: 'rent-updates', name: 'Rent Update Notices', icon: <FaFileInvoiceDollar />, badge: null },
      { id: 'communications', name: 'Communications', icon: <FaEnvelope />, badge: null },
      { id: 'accounts', name: 'Accounts', icon: <FaPiggyBank />, badge: null },
      { id: 'transactions', name: 'Transactions', icon: <FaRandom />, badge: null },
      { id: 'ledger-entries', name: 'Ledger Entries', icon: <FaBookOpen />, badge: null }
    ],
    reports: [
      { id: 'reports', name: 'Reports', icon: <FaChartLine />, badge: null, hasSubmenu: true }
    ],
    system: [
      { id: 'settings', name: 'Settings', icon: <FaCog />, badge: null },
      { id: 'inspection-templates', name: 'Inspection Templates', icon: <FaClipboardList />, badge: null },
      { id: 'business-transactions', name: 'Business Transactions', icon: <FaExchangeAlt />, badge: null },
      { id: 'users', name: 'Users', icon: <FaUsersCog />, badge: null },
      { id: 'billings', name: 'Billings', icon: <FaFileInvoiceDollar />, badge: null }
    ]
  };

  const submenuItems = {
    expenses: ['All Expenses', 'All Recurrings'],
    reports: [
      'Tenant Summary', 'Leases', 'Tenant Payment Insight', 'Charges Breakdown', 
      'Agency Reports', 'Rent Roll', 'Arrears Report', 'Income & Expense', 
      'Balance Sheet', 'Trial Balance', 'Cash Flow', 'VAT Summary', 'Top Tenants', 'High-Risk Tenants'
    ]
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const MenuItem = ({ item, section, darkMode }) => {
  const isActive = activeTab === item.id;
  const hasSubmenu = item.hasSubmenu;
  const isExpanded = expandedSections[item.id];

  return (
    <li>
      <button
        onClick={() => {
          if (hasSubmenu) {
            toggleSection(item.id);
          } else {
            setActiveTab(item.id);
            setIsOpen(false);
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? darkMode 
              ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-800'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : darkMode
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className={`${isActive 
            ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
            : darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {item.icon}
          </span>
          <span className={`font-medium `}>
            {item.name}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {item.badge && (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              item.badge > 0 && item.name === 'Invoices'
                ? darkMode 
                  ? 'bg-red-900 text-red-200'
                  : 'bg-red-100 text-red-800'
                : darkMode
                ? 'bg-emerald-900 text-emerald-200'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {item.badge}
            </span>
          )}
          {hasSubmenu && (
            <FaChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </div>
      </button>

      {hasSubmenu && isExpanded && submenuItems[item.id] && (
        <ul className="ml-10 mt-1 space-y-1 animate-slideDown">
          {submenuItems[item.id].map((subItem, idx) => (
            <li key={idx}>
              <button className={`flex items-center space-x-2 px-3 py-2 text-sm hover:text-emerald-600 transition-colors
                ${darkMode ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'}`}>
                <FaAngleRight className="text-xs" />
                <span>{subItem}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

  return (
    <>
      {/* Mobile Overlay */}
        {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-xl lg:shadow-none
      `}>
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
              <FaBuilding className="text-white text-sm" />
            </div>
            <div>
              <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Milik PMS</h2>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Professional Edition</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaTimes className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="search"
                placeholder="Search tenant or unit..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border
                         ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none`}
              />
              <FaSearch className={`absolute left-3 top-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>

          {/* Menu Sections */}
          {Object.entries(menuItems).map(([section, items]) => (
            <div key={section} className="mb-6">
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {section}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => (
                  <MenuItem key={item.id} item={item} section={section} />
                ))}
              </ul>
            </div>
          ))}

          {/* Update Tasks Button */}
          <div className="mt-8 px-3">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 
                             bg-gradient-to-r from-emerald-500 to-green-500 text-white 
                             font-semibold rounded-lg hover:shadow-lg hover:from-emerald-600 
                             hover:to-green-600 transform hover:-translate-y-0.5 
                             transition-all duration-200">
              <FaSyncAlt className="animate-spin" />
              <span>Update Pending Tasks</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;