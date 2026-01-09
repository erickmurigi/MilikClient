// QuickActions.js
import React from 'react';
import { 
  FaUserPlus, 
  FaFileInvoiceDollar, 
  FaMoneyBillWave, 

  FaUserEdit,
  FaFileAlt,
  FaRandom,
  FaExchangeAlt,
  FaUsersCog,
  FaSearch
} from 'react-icons/fa';

const QuickActions = ({ darkMode }) => {
  const quickLinks = [
    { id: 'add-tenant', icon: <FaUserPlus />, label: 'ADD TENANT', color: 'green' },
    { id: 'rental-invoices', icon: <FaFileInvoiceDollar />, label: 'RENTAL INVOICES LISTING', color: 'blue' },
    { id: 'rental-invoice-booking', icon: <FaFileAlt />, label: 'RENTAL INVOICE BOOKING', color: 'purple' },
    { id: 'debit-note', icon: <FaFileAlt />, label: 'GO TO DEBIT NOTE', color: 'orange' },
    { id: 'credit-note', icon: <FaMoneyBillWave />, label: 'GO TO CREDIT NOTE', color: 'red' },
    { id: 'rental-receipts', icon: <FaFileInvoiceDollar />, label: 'RENTAL RECEIPTS LISTING', color: 'green' },
    { id: 'rental-receipt', icon: <FaMoneyBillWave />, label: 'GO TO RENTAL RECEIPT', color: 'blue' },
    { id: 'rental-aged-analysis', icon: <FaUserEdit />, label: 'RENTAL AGED ANALYSIS', color: 'purple' },
    { id: 'paid-balance', icon: <FaFileAlt />, label: 'PAID & BALANCE REPORT', color: 'orange' },
    { id: 'tenant-financing', icon: <FaRandom />, label: 'TENANTS FINANCING', color: 'red' },
    { id: 'tenant-journals', icon: <FaExchangeAlt />, label: 'TENANTS JOURNALS', color: 'green' },
    { id: 'batch-tenant-jvs', icon: <FaUsersCog />, label: 'BATCH TENANTS J.Vs', color: 'blue' },
  ];

  const getColorClasses = (color, type = 'bg') => {
    const colorMap = {
      green: {
        bg: darkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200',
        text: darkMode ? 'text-emerald-300' : 'text-emerald-700',
        hover: darkMode ? 'hover:bg-emerald-900/50' : 'hover:bg-emerald-100'
      },
      blue: {
        bg: darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200',
        text: darkMode ? 'text-blue-300' : 'text-blue-700',
        hover: darkMode ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100'
      },
      purple: {
        bg: darkMode ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200',
        text: darkMode ? 'text-purple-300' : 'text-purple-700',
        hover: darkMode ? 'hover:bg-purple-900/50' : 'hover:bg-purple-100'
      },
      orange: {
        bg: darkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200',
        text: darkMode ? 'text-orange-300' : 'text-orange-700',
        hover: darkMode ? 'hover:bg-orange-900/50' : 'hover:bg-orange-100'
      },
      red: {
        bg: darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200',
        text: darkMode ? 'text-red-300' : 'text-red-700',
        hover: darkMode ? 'hover:bg-red-900/50' : 'hover:bg-red-100'
      }
    };
    
    return colorMap[color] ? colorMap[color][type] : colorMap.green[type];
  };

  return (
    <div className={`h-full rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow p-4`}>
      <div className="mb-4">
        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>QUICK ACCESS LINKS</h3>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search..."
            className={`w-full pl-10 pr-4 py-2 rounded border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none`}
          />
          <FaSearch className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`} />
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {quickLinks.map((link, index) => (
          <button
            key={link.id}
            className={`w-full text-left px-3 py-2.5 rounded border text-sm font-medium transition-all duration-200 
                      flex items-center space-x-3 ${getColorClasses(link.color, 'bg')} ${getColorClasses(link.color, 'hover')}`}
          >
            <span className={getColorClasses(link.color, 'text')}>
              {link.icon}
            </span>
            <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
              {link.label}
            </span>
          </button>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>SYSTEM METRICS</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Active Units</div>
            <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>753</div>
          </div>
          <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Rental Collection</div>
            <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>× 100,000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;