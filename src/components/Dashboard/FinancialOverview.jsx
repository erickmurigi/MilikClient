import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const FinancialOverview = ({ darkMode }) => {
  // Fake data for the last 12 months
  const financialData = [
    { month: 'Jan', revenue: 2500000, expenses: 800000, net: 1700000 },
    { month: 'Feb', revenue: 2650000, expenses: 850000, net: 1800000 },
    { month: 'Mar', revenue: 2700000, expenses: 900000, net: 1800000 },
    { month: 'Apr', revenue: 2800000, expenses: 920000, net: 1880000 },
    { month: 'May', revenue: 2850000, expenses: 950000, net: 1900000 },
    { month: 'Jun', revenue: 2900000, expenses: 1000000, net: 1900000 },
    { month: 'Jul', revenue: 2950000, expenses: 1050000, net: 1900000 },
    { month: 'Aug', revenue: 3000000, expenses: 1100000, net: 1900000 },
    { month: 'Sep', revenue: 3100000, expenses: 1150000, net: 1950000 },
    { month: 'Oct', revenue: 3200000, expenses: 1200000, net: 2000000 },
    { month: 'Nov', revenue: 3300000, expenses: 1250000, net: 2050000 },
    { month: 'Dec', revenue: 3400000, expenses: 1300000, net: 2100000 },
  ];

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return `KSh ${(value / 1000000).toFixed(1)}M`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200'
        }`}>
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.name}:
                </span>
              </div>
              <span className="font-medium ml-4">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center space-x-6 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Financial Overview</h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Revenue, expenses, and net profit over the last 12 months
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
          <select className={`px-4 py-2 text-xs rounded-lg border text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Year to Date</option>
            <option>Custom Range</option>
          </select>
          <div className="flex space-x-2">
            <button className="px-1 py-2 text-xs bg-gradient-to-r from-[#497285] to-[#497285] text-white font-medium rounded-lg hover:shadow-lg transition-shadow">
              Export Report
            </button>
            <button className={`px-4 py-2 text-xs font-medium rounded-lg border ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-3">
          <div className="h-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={financialData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#497285" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#497285" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f78536" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f78536" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={darkMode ? '#374151' : '#e5e7eb'} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  fontSize={12}
                  tickFormatter={(value) => `KSh ${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: darkMode ? '#4b5563' : '#d1d5db', strokeWidth: 1 }}
                />
                <Legend 
                  content={renderLegend}
                  wrapperStyle={{ paddingTop: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorNet)"
                  name="Net Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-2">
          {/* Total Expected */}
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } border border-emerald-200 dark:border-[#2b4450] shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-[#2b4450] dark:text-[#2b4450]">
                Total Expected
              </div>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="text-emerald-600 dark:text-[#2b4450] font-bold">↑</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-[#2b4450] dark:text-[#2b4450]">
              KSh 2.9M
            </div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-emerald-600 dark:text-[#497285] mr-2">
                +12.5% from last month
              </span>
            </div>
          </div>

          {/* Collected */}
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } border border-blue-200 dark:border-[#2b4450] shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-[#2b4450] dark:[#2b4450]">
                Collected
              </div>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">→</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-[#2b4450] dark:text-[#2b4450]">
              KSh 4,700
            </div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-[#2b4450] dark:text-[#497285]">
                Updated today
              </span>
            </div>
          </div>

          {/* Outstanding */}
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-white'
          } border border-amber-200 dark:border-[#2b4450] shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-amber-800 dark:text-[#2b4450]">
                Outstanding
              </div>
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="text-amber-600 dark:text-[#497285] font-bold">⚠</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700 dark:text-[#2b4450]">
              KSh 2.89M
            </div>
            <div className="flex items-center mt-2">
              <span className="text-xs text-amber-600 dark:text-[#497285] mr-2">
                +15.2% from last month
              </span>
              <button className="text-xs bg-amber-100 dark:bg-amber-900/50 text-[#497285] dark:text-[#497285] px-2 py-1 rounded">
                Review
              </button>
            </div>
          </div>

          
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="text-center">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Avg. Rent
          </div>
          <div className="text-lg font-bold dark:text-white">KSh 38,700</div>
        </div>
        <div className="text-center">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Late Payments
          </div>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">14</div>
        </div>
        <div className="text-center">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Vacancy Rate
          </div>
          <div className="text-lg font-bold dark:text-white">8.3%</div>
        </div>
        <div className="text-center">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            YTD Profit
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">KSh 21.5M</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;