import React from 'react';
import { FaMoneyBillWave, FaTools, FaFileContract, FaUsers } from 'react-icons/fa';

const RecentActivity = ({ darkMode }) => {
  const recentActivities = [
    { id: 1, type: 'payment', title: 'Rent Payment Received', description: 'John Doe paid KSh 25,000 for Unit B12', time: '10 min ago', color: 'green' },
    { id: 2, type: 'maintenance', title: 'Maintenance Request', description: 'Leak reported in Unit A5', time: '45 min ago', color: 'blue' },
    { id: 3, type: 'lease', title: 'Lease Expiring Soon', description: 'Lease for Unit C3 expires in 14 days', time: '2 hours ago', color: 'orange' },
    { id: 4, type: 'tenant', title: 'New Tenant Added', description: 'Sarah Johnson added to Unit D7', time: '5 hours ago', color: 'purple' }
  ];

  const getIcon = (type, color) => {
    const colorClasses = {
      green: 'text-emerald-600',
      blue: 'text-blue-600',
      orange: 'text-orange-600',
      purple: 'text-purple-600'
    };

    const bgClasses = {
      green: 'bg-emerald-100 dark:bg-emerald-900/30',
      blue: 'bg-blue-100 dark:bg-blue-900/30',
      orange: 'bg-orange-100 dark:bg-orange-900/30',
      purple: 'bg-purple-100 dark:bg-purple-900/30'
    };

    const icons = {
      payment: <FaMoneyBillWave className={colorClasses[color]} />,
      maintenance: <FaTools className={colorClasses[color]} />,
      lease: <FaFileContract className={colorClasses[color]} />,
      tenant: <FaUsers className={colorClasses[color]} />
    };

    return (
      <div className={`p-2 rounded-lg ${bgClasses[color]}`}>
        {icons[type]}
      </div>
    );
  };

  const borderClasses = {
    green: 'border-emerald-500',
    blue: 'border-blue-500',
    orange: 'border-orange-500',
    purple: 'border-purple-500'
  };

  return (
    <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Recent Activity</h2>
        <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
          Mark all read
        </button>
      </div>
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div 
            key={activity.id}
            className={`p-4 rounded-xl border-l-4 ${
              borderClasses[activity.color]
            } ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
          >
            <div className="flex items-start space-x-3">
              {getIcon(activity.type, activity.color)}
              <div className="flex-1">
                <h4 className="font-semibold dark:text-white">{activity.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;