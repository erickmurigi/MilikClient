import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import MetricsGrid from '../../components/Dashboard/MetricsGrid';
import PropertiesOverview from '../../components/Dashboard/PropertiesOverview';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import FinancialOverview from '../../components/Dashboard/FinancialOverview';
import QuickActions from '../../components/Dashboard/QuickActions';
import useSocket from '../../utils/socketService';
import { getProperties } from '../../redux/propertyRedux';
import { getUnits } from '../../redux/unitRedux';
import { getTenants } from '../../redux/tenantsRedux';
import {
  getExpenseProperties,
  getLeases,
  getMaintenances,
  getNotifications,
  getRentPayments
} from '../../redux/apiCalls';
import './dashboard.css';

const Dashboard = ({ darkMode }) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const currentCompany = useSelector(state => state.company?.currentCompany);
  const currentUser = useSelector(state => state.user?.user);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!currentCompany?._id) return;

    const businessId = currentCompany._id;

    const refreshDashboardData = async () => {
      dispatch(getProperties({ business: businessId }));
      dispatch(getUnits({ business: businessId }));
      dispatch(getTenants({ business: businessId }));

      await Promise.allSettled([
        getRentPayments(dispatch, businessId),
        getMaintenances(dispatch, businessId),
        getLeases(dispatch, businessId),
        getNotifications(dispatch, businessId),
        getExpenseProperties(dispatch, businessId)
      ]);
    };

    refreshDashboardData();
    const intervalId = setInterval(refreshDashboardData, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch, currentCompany?._id]);

  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket || !currentCompany?._id) return;

    // Join company room for receiving company-level broadcasts
    socket.emit('joinCompany', { 
      companyId: currentCompany._id,
      userId: currentUser?._id 
    });

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      console.log('New notification received:', notification);
      // Trigger a refresh of notifications to ensure consistency
      getNotifications(dispatch, currentCompany._id);
    };

    // Listen for new rent payments
    const handleNewPayment = (payment) => {
      console.log('New payment received:', payment);
      // Trigger a refresh of rent payments and financial data
      getRentPayments(dispatch, currentCompany._id);
    };

    // Listen for new maintenance requests
    const handleNewMaintenance = (maintenance) => {
      console.log('New maintenance received:', maintenance);
      // Trigger a refresh of maintenance data
      getMaintenances(dispatch, currentCompany._id);
    };

    // Listen for new leases
    const handleNewLease = (lease) => {
      console.log('New lease received:', lease);
      // Trigger a refresh of lease data
      getLeases(dispatch, currentCompany._id);
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('payment:new', handleNewPayment);
    socket.on('maintenance:new', handleNewMaintenance);
    socket.on('lease:new', handleNewLease);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('payment:new', handleNewPayment);
      socket.off('maintenance:new', handleNewMaintenance);
      socket.off('lease:new', handleNewLease);
    };
  }, [socket, currentCompany?._id, currentUser?._id, dispatch]);

  return (
    <DashboardLayout>
      <div className="flex flex-1 p-4 bg-white">
        {/* Sidebar/Quick Actions - Fixed width */}
        <div className="p-0">
          <div className="pr-4 h-full mt-0">
            <QuickActions darkMode={darkMode} />
          </div>
        </div>
        <div className={`flex-1 overflow-auto space-y-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {/* Metrics Grid - Priority 1 */}
          <MetricsGrid darkMode={darkMode} />

          {/* Properties Overview & Activity/Financial Column - Priority 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Properties Overview - Left side */}
            <div className="lg:col-span-3">
              <PropertiesOverview darkMode={darkMode} />
            </div>

            {/* Right Column - Recent Activity & Financial Overview */}
            <div className="lg:col-span-2 space-y-6">
              <RecentActivity darkMode={darkMode} />
              <FinancialOverview darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;