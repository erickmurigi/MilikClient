import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import MetricsGrid from '../../components/Dashboard/MetricsGrid';
import PropertiesOverview from '../../components/Dashboard/PropertiesOverview';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import FinancialOverview from '../../components/Dashboard/FinancialOverview';
import QuickActions from '../../components/Dashboard/QuickActions';
import AlertBanner from '../../components/Dashboard/AlertBanner';
import './dashboard.css';

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Alert Banner */}
      <AlertBanner />

      {/* Metrics Grid */}
      <MetricsGrid />

      {/* Charts and Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Properties Overview */}
        <div className="lg:col-span-2">
          <PropertiesOverview />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Financial Overview */}
      <div className="mb-8">
        <FinancialOverview />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </DashboardLayout>
  );
};

export default Dashboard;