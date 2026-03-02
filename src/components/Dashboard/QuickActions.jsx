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
        bg: darkMode ? 'bg-[#31694E]/20 border-[#31694E]/40' : 'bg-[#31694E]/10 border-[#31694E]/20',
        text: darkMode ? 'text-[#31694E]' : 'text-[#1f4a35]',
        hover: darkMode ? 'hover:bg-[#31694E]/30' : 'hover:bg-[#31694E]/20'
      },
      blue: {
        bg: darkMode ? 'bg-blue-900/20 border-blue-800/40' : 'bg-blue-50 border-blue-200/50',
        text: darkMode ? 'text-blue-400' : 'text-blue-700',
        hover: darkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100'
      },
      purple: {
        bg: darkMode ? 'bg-purple-900/20 border-purple-800/40' : 'bg-purple-50 border-purple-200/50',
        text: darkMode ? 'text-purple-400' : 'text-purple-700',
        hover: darkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-100'
      },
      orange: {
        bg: darkMode ? 'bg-[#E85C0D]/20 border-[#E85C0D]/40' : 'bg-[#E85C0D]/10 border-[#E85C0D]/20',
        text: darkMode ? 'text-[#E85C0D]' : 'text-[#d64c06]',
        hover: darkMode ? 'hover:bg-[#E85C0D]/30' : 'hover:bg-[#E85C0D]/20'
      },
      red: {
        bg: darkMode ? 'bg-red-900/20 border-red-800/40' : 'bg-red-50 border-red-200/50',
        text: darkMode ? 'text-red-400' : 'text-red-700',
        hover: darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
      }
    };
    
    return colorMap[color] ? colorMap[color][type] : colorMap.green[type];
  };

  return (
    <div className={`h-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-[#f8faf9]'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-[#31694E]/10'} p-4`}>
      <div className="mb-3">
        <h3 className={`font-extrabold text-sm tracking-tight uppercase ${darkMode ? 'text-white' : 'text-[#1f4a35]'} mb-3`}>
          Quick Access Links
        </h3>
        
        {/* Search bar */}
        <div className="relative mb-3">
          <input
            type="search"
            placeholder="Search..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs font-medium ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-[#31694E]/20 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-[#31694E] focus:border-transparent outline-none transition-all`}
          />
          <FaSearch className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-[#31694E]/50'} text-xs`} />
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {quickLinks.map((link, index) => (
          <button
            key={link.id}
            className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 
                      flex items-center space-x-2 ${getColorClasses(link.color, 'bg')} ${getColorClasses(link.color, 'hover')} hover:shadow-sm`}
          >
            <span className={`${getColorClasses(link.color, 'text')} text-sm`}>
              {link.icon}
            </span>
            <span className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} uppercase tracking-tight`}>
              {link.label}
            </span>
          </button>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="mt-4 pt-3 border-t-2 border-[#31694E]/20">
        <h4 className={`text-xs font-extrabold mb-3 uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-[#1f4a35]'}`}>System Metrics</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-3 rounded-lg border-l-3 border-[#31694E] ${darkMode ? 'bg-gray-700/50' : 'bg-[#31694E]/5'} hover:shadow-sm transition-all`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-bold uppercase text-[10px] tracking-wide mb-1`}>Active Units</div>
            <div className={`font-extrabold text-lg ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>753</div>
          </div>
          <div className={`p-3 rounded-lg border-l-3 border-blue-500 ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} hover:shadow-sm transition-all`}>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-bold uppercase text-[10px] tracking-wide mb-1`}>Rental Collection</div>
            <div className={`font-extrabold text-lg ${darkMode ? 'text-white' : 'text-blue-900'}`}>KSh 100K</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;