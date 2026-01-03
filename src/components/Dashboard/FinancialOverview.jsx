import React from 'react';
import { FaChartBar } from 'react-icons/fa';

const FinancialOverview = ({ darkMode }) => {
  return (
    <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Financial Overview</h2>
        <div className="flex items-center space-x-4">
          <select className={`px-4 py-2 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium rounded-lg hover:shadow-lg">
            Export Report
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Chart Area */}
        <div className="md:col-span-3">
          <div className={`h-64 rounded-xl ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          } flex items-center justify-center`}>
            {/* Placeholder for chart */}
            <div className="text-center">
              <FaChartBar className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Revenue Chart</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Visual representation of financial data</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-emerald-50'
          } border border-emerald-200 dark:border-emerald-800`}>
            <div className="text-sm text-emerald-800 dark:text-emerald-300 mb-1">Total Expected</div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">KSh 2.9M</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">This month</div>
          </div>

          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-blue-50'
          } border border-blue-200 dark:border-blue-800`}>
            <div className="text-sm text-blue-800 dark:text-blue-300 mb-1">Collected</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">KSh 4,700</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">This month</div>
          </div>

          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-amber-50'
          } border border-amber-200 dark:border-amber-800`}>
            <div className="text-sm text-amber-800 dark:text-amber-300 mb-1">Outstanding</div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">KSh 2.89M</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">Pending collection</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;