import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaBuilding,
  FaHome,
  FaChartPie,
  FaMoneyBillWave,
  FaWallet,
  FaExclamationCircle
} from 'react-icons/fa';
import { getProperties } from '../../redux/propertyRedux';

const MetricsGrid = ({ darkMode }) => {
  const dispatch = useDispatch();
  
  // Get data from Redux
  const properties = useSelector(state => state.property?.properties || []);
  const units = useSelector(state => state.unit?.units || []);
  const tenants = useSelector(state => state.tenant?.tenants || []);
  const rentPayments = useSelector(state => state.rentPayment?.rentPayments || []);
  const propertiesLoading = useSelector(state => state.property?.isFetching);
  const currentCompany = useSelector(state => state.company?.currentCompany);

  // Fetch properties on component mount or when company changes
  useEffect(() => {
    if (currentCompany?._id) {
      dispatch(getProperties({ business: currentCompany._id }));
    }
  }, [dispatch, currentCompany?._id]);

  // Calculate metrics from real data
  const totalProperties = properties.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
  const occupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : 0;
  
  // Calculate financial metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const thisMonthPayments = rentPayments.filter(p => {
    const paymentDate = new Date(p.createdAt);
    return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
  });

  const lastMonthPayments = rentPayments.filter(p => {
    const paymentDate = new Date(p.createdAt);
    return paymentDate.getMonth() === previousMonth && paymentDate.getFullYear() === previousYear;
  });
  
  const totalCollected = rentPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const monthlyCollected = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const lastMonthCollected = lastMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstandingBalance = units.reduce((sum, u) => sum + (u.outstandingBalance || 0), 0);

  // Calculate percentage changes
  const monthlyChangePercent = lastMonthCollected > 0 
    ? (((monthlyCollected - lastMonthCollected) / lastMonthCollected) * 100).toFixed(1)
    : 0;
  const monthlyChangeSign = monthlyChangePercent >= 0 ? '+' : '';

  // Occupancy change - track if available
  const propertiesChange = '—';
  const unitsChange = '—';
  const occupancyChange = '—';

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `KSh ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `KSh ${(value / 1000).toFixed(1)}K`;
    }
    return `KSh ${value.toLocaleString()}`;
  };

  const metrics = useMemo(() => [
    { 
      id: 1, 
      label: 'Total Properties', 
      value: totalProperties.toString(), 
      icon: <FaBuilding />, 
      color: 'from-[#1e5a4a] to-[#0f3d2e]', 
      iconBg: 'bg-[#1e5a4a]/20',
      change: propertiesChange,
      loading: propertiesLoading 
    },
    { 
      id: 2, 
      label: 'Total Units', 
      value: totalUnits.toString(), 
      icon: <FaHome />, 
      color: 'from-[#31694E] to-[#1f4a35]',  
      iconBg: 'bg-[#31694E]/25',
      change: unitsChange,
      loading: propertiesLoading 
    },
    { 
      id: 3, 
      label: 'Occupancy Rate', 
      value: `${occupancyRate}%`, 
      icon: <FaChartPie />, 
      color: 'from-[#4a9976] to-[#31694E]', 
      iconBg: 'bg-[#4a9976]/25',
      change: occupancyChange,
      loading: propertiesLoading 
    },
    { 
      id: 4, 
      label: 'Total Collected', 
      value: formatCurrency(totalCollected), 
      icon: <FaMoneyBillWave />, 
      color: 'from-[#E85C0D] to-[#c7490a]', 
      iconBg: 'bg-[#E85C0D]/25',
      change: '—',
      loading: propertiesLoading 
    },
    { 
      id: 5, 
      label: 'This Month', 
      value: formatCurrency(monthlyCollected), 
      icon: <FaWallet />, 
      color: 'from-[#ff8c42] to-[#E85C0D]',  
      iconBg: 'bg-[#ff8c42]/25',
      change: monthlyChangeSign + monthlyChangePercent + '%',
      loading: propertiesLoading 
    },
    { 
      id: 6, 
      label: 'Outstanding Balance', 
      value: formatCurrency(outstandingBalance), 
      icon: <FaExclamationCircle />, 
      color: 'from-[#E85C0D] to-[#d64c06]', 
      iconBg: 'bg-[#E85C0D]/20',
      change: '—',
      loading: propertiesLoading 
    }
  ], [totalProperties, totalUnits, occupancyRate, totalCollected, monthlyCollected, outstandingBalance, monthlyChangePercent, monthlyChangeSign, propertiesLoading, formatCurrency]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {metrics.map((metric) => (
        <div 
          key={metric.id}
          className={`bg-gradient-to-br ${metric.color} rounded-xl p-4 text-white 
                     shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                       metric.loading ? 'opacity-60' : ''
                     }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 ${metric.iconBg} rounded-lg backdrop-blur-sm`}>
              <div className="text-white text-lg">{metric.icon}</div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
              metric.change === '—' ? 'bg-gray-500/35 text-white' : metric.change.startsWith('+') ? 'bg-[#4a9976]/35 text-white' : 'bg-[#E85C0D]/35 text-white'
            }`}>
              {metric.change}
            </span>
          </div>
          <h3 className="text-2xl font-extrabold mb-1 tracking-tight">
            {metric.loading ? '...' : metric.value}
          </h3>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">{metric.label}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;