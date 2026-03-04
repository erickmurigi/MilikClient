import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FinancialOverview = ({ darkMode }) => {
  const units = useSelector(state => state.unit?.units || []);
  const tenants = useSelector(state => state.tenant?.tenants || []);
  const rentPayments = useSelector(state => state.rentPayment?.rentPayments || []);
  const maintenances = useSelector(state => state.maintenance?.maintenances || []);
  const propertyExpenses = useSelector(state => state.expenseProperty?.expenseProperties || []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();

  const parseDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatMoney = (value) => {
    if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `KSh ${(value / 1000).toFixed(1)}K`;
    return `KSh ${Math.round(value).toLocaleString()}`;
  };

  const formatShort = (value) => `KSh ${(value / 1000000).toFixed(1)}M`;

  const percentageDelta = (currentValue, previousValue) => {
    if (!previousValue) return currentValue > 0 ? '+100.0%' : '0.0%';
    const delta = ((currentValue - previousValue) / previousValue) * 100;
    return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
  };

  const financialData = useMemo(() => {
    const revenueByMonth = new Array(12).fill(0);
    const expenseByMonth = new Array(12).fill(0);

    rentPayments.forEach(payment => {
      const date = parseDate(payment.paymentDate || payment.createdAt);
      if (!date || date.getFullYear() !== currentYear) return;
      revenueByMonth[date.getMonth()] += Number(payment.amount || 0);
    });

    propertyExpenses.forEach(expense => {
      const date = parseDate(expense.date || expense.createdAt);
      if (!date || date.getFullYear() !== currentYear) return;
      expenseByMonth[date.getMonth()] += Number(expense.amount || 0);
    });

    maintenances.forEach(maintenance => {
      const date = parseDate(maintenance.completedDate || maintenance.createdAt);
      if (!date || date.getFullYear() !== currentYear) return;
      const cost = Number(maintenance.actualCost || maintenance.estimatedCost || 0);
      expenseByMonth[date.getMonth()] += cost;
    });

    return MONTHS.map((month, index) => {
      const revenue = revenueByMonth[index];
      const expenses = expenseByMonth[index];
      return {
        month,
        revenue,
        expenses,
        net: revenue - expenses
      };
    });
  }, [rentPayments, propertyExpenses, maintenances, currentYear]);

  const thisMonthRevenue = financialData[currentMonthIndex]?.revenue || 0;
  const thisMonthExpenses = financialData[currentMonthIndex]?.expenses || 0;
  const thisMonthNet = thisMonthRevenue - thisMonthExpenses;
  const previousMonthRevenue = financialData[Math.max(currentMonthIndex - 1, 0)]?.revenue || 0;

  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
  const vacantUnits = units.filter(u => u.status === 'vacant').length;
  const totalUnits = units.length;
  const averageRent = totalUnits > 0
    ? units.reduce((sum, unit) => sum + Number(unit.rent || 0), 0) / totalUnits
    : 0;

  const totalExpected = occupiedUnits * averageRent;
  const vacancyRate = totalUnits > 0 ? (vacantUnits / totalUnits) * 100 : 0;

  const overduePaymentsCount = rentPayments.filter(payment => {
    const dueDate = parseDate(payment.dueDate);
    if (!dueDate) return false;
    return dueDate < now && !payment.isConfirmed;
  }).length;

  const outstandingFromUnits = units.reduce((sum, unit) => sum + Number(unit.outstandingBalance || 0), 0);
  const outstandingFromTenants = tenants.reduce((sum, tenant) => sum + Math.max(Number(tenant.balance || 0), 0), 0);
  const outstandingBalance = outstandingFromUnits > 0 ? outstandingFromUnits : outstandingFromTenants;

  const ytdProfit = financialData.reduce((sum, month) => sum + month.net, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded-lg shadow-lg border text-xs ${
          darkMode
            ? 'bg-gray-900 border-gray-700 text-white'
            : 'bg-white border-[#31694E]/20'
        }`}>
          <p className="font-bold mb-1 text-[10px] uppercase tracking-wide">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-0.5 last:mb-0">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[9px] font-bold">{entry.name}:</span>
              </div>
              <span className="font-bold ml-3 text-[9px]">{formatMoney(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center space-x-3 mt-2 text-[9px]">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-2.5 h-2.5 rounded-full mr-1.5 shadow-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-4`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
        <div>
          <h2 className={`text-sm font-extrabold uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>Financial Overview</h2>
          <p className={`text-xs mt-0.5 font-medium hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Last 12 months
          </p>
        </div>
        <div className="flex space-x-1.5 mt-2 md:mt-0">
          <button className="px-2 py-1 text-[10px] bg-gradient-to-r from-[#31694E] to-[#1f4a35] text-white font-bold rounded-lg hover:shadow-md transition-all uppercase tracking-wide hidden sm:block">
            Export Report
          </button>
          <button className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${
            darkMode
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-[#31694E]/20 text-gray-700 hover:bg-gray-50'
          } transition-all uppercase tracking-wide hidden sm:block`}>
            View Details
          </button>
        </div>
      </div>

      {/* Chart Section - Full Width */}
      <div className="w-full" style={{ height: '320px', minHeight: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={financialData || []}
                margin={{ top: 5, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#31694E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#31694E" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85C0D" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E85C0D" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a9976" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4a9976" stopOpacity={0.1} />
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
                  fontSize={9}
                  fontWeight={600}
                />
                <YAxis
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  fontSize={9}
                  fontWeight={600}
                  width={35}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
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
                  stroke="#31694E"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#E85C0D"
                  strokeWidth={2}
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="#4a9976"
                  strokeWidth={2}
                  fill="url(#colorNet)"
                  name="Net Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialOverview;
