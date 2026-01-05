import React from 'react';
import {
  FaBuilding,
  FaHome,
  FaChartPie,
  FaMoneyBillWave,
  FaWallet,
  FaExclamationCircle
} from 'react-icons/fa';

const MetricsGrid = ({ darkMode }) => {
  const metrics = [
    { 
      id: 1, 
      label: 'Total Properties', 
      value: '30', 
      icon: <FaBuilding />, 
      color: 'from-emerald-500 to-green-800', 
      change: '+2.3%' 
    },
    { 
      id: 2, 
      label: 'Total Units', 
      value: '75', 
      icon: <FaHome />, 
       color: 'from-emerald-500 to-green-800',  
      change: '+5.1%' 
    },
    { 
      id: 3, 
      label: 'Occupancy Rate', 
      value: '53.3%', 
      icon: <FaChartPie />, 
       color: 'from-emerald-500 to-green-800', 
      change: '+1.8%' 
    },
    { 
      id: 4, 
      label: 'Monthly Collection', 
      value: 'KSh 2.9M', 
      icon: <FaMoneyBillWave />, 
      color: 'from-emerald-500 to-green-800', 
      change: '+12.5%' 
    },
    { 
      id: 5, 
      label: 'Collected This Month', 
      value: 'KSh 4,700', 
      icon: <FaWallet />, 
       color: 'from-emerald-500 to-green-800',  
      change: '-23.4%' 
    },
    { 
      id: 6, 
      label: 'Outstanding Balance', 
      value: 'KSh 2.89M', 
      icon: <FaExclamationCircle />, 
       color: 'from-emerald-500 to-green-800', 
      change: '+15.2%' 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {metrics.map((metric) => (
        <div 
          key={metric.id}
          className={`bg-gradient-to-br ${metric.color} rounded-2xl p-5 text-white 
                     shadow-lg hover:shadow-xl transition-shadow duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              {metric.icon}
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
              {metric.change}
            </span>
          </div>
          <h3 className="text-1xl font-bold mb-1 leading-tight">{metric.value}</h3>
          <p className="text-white/90 text-sm font-medium">{metric.label}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;