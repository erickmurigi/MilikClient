import React from 'react';
import { FaBuilding, FaUsers, FaFileContract, FaMoneyBillWave, FaTools, FaReceipt } from 'react-icons/fa';

const QuickActions = ({ darkMode }) => {
  const actions = [
    { icon: <FaBuilding />, label: 'Add Property', color: 'emerald' },
    { icon: <FaUsers />, label: 'Add Tenant', color: 'blue' },
    { icon: <FaFileContract />, label: 'Create Lease', color: 'purple' },
    { icon: <FaMoneyBillWave />, label: 'Record Payment', color: 'green' },
    { icon: <FaTools />, label: 'Log Maintenance', color: 'orange' },
    { icon: <FaReceipt />, label: 'Generate Invoice', color: 'red' }
  ];

  const getColorClasses = (color, isBg = false) => {
    const classes = {
      emerald: isBg 
        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
        : 'border-emerald-200',
      blue: isBg 
        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
        : 'border-blue-200',
      purple: isBg 
        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
        : 'border-purple-200',
      green: isBg 
        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
        : 'border-green-200',
      orange: isBg 
        ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' 
        : 'border-orange-200',
      red: isBg 
        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
        : 'border-red-200'
    };
    return classes[color] || classes.emerald;
  };

  return (
    <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
      <h2 className="text-xl font-bold dark:text-black mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            } transition-colors group`}
          >
            <div className={`p-3 rounded-lg mb-3 ${getColorClasses(action.color, true)} group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium dark:text-gray-600">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;