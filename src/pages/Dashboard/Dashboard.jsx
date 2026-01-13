import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import MetricsGrid from '../../components/Dashboard/MetricsGrid';
import PropertiesOverview from '../../components/Dashboard/PropertiesOverview';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import FinancialOverview from '../../components/Dashboard/FinancialOverview';
import QuickActions from '../../components/Dashboard/QuickActions';
import AlertBanner from '../../components/Dashboard/AlertBanner';
import './dashboard.css';

const Dashboard = ({ darkMode }) => {
  return (
    
      <DashboardLayout>
        <div className="flex flex-1"> {/* Add pt-20 (5rem) for navbar height */}
        {/* Sidebar/Quick Actions - Fixed width */}
        <div className="p-0">
          <div className="pr-4 h-full mt-0"> {/* Add mt-2 for spacing */}
            <QuickActions darkMode={darkMode} />
          </div>
        </div>
        <div className={`flex-1 overflow-auto space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
         
          {/* Metrics Grid */}
          <MetricsGrid darkMode={darkMode} />

          {/* Financial Overview */}
          <FinancialOverview darkMode={darkMode} />

         {/* Charts and Data Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties Overview */}
          <div className="lg:col-span-2">
            <PropertiesOverview darkMode={darkMode} />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity darkMode={darkMode} />
          </div>
         </div>

        
        {/* Quick Actions */}
             </div>
             </div>
    </DashboardLayout>
  );
};
 
export default Dashboard;