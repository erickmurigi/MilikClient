// pages/Leases.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaFileContract, FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaCalendarAlt, FaUser, FaHome, FaMoneyBillWave, FaExclamationTriangle, FaCheckCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Leases = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample leases data
  const leases = [
    {
      id: 1,
      leaseNumber: 'LEASE-2023-001',
      tenant: 'Michael Otieno',
      unit: 'A101 - Milik Towers',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      duration: '12 months',
      rentAmount: 'KSh 45,000',
      securityDeposit: 'KSh 90,000',
      status: 'active',
      renewalDate: '2024-04-30',
      paymentStatus: 'current',
      documents: ['Lease Agreement', 'ID Copy', 'Guarantor Form']
    },
    {
      id: 2,
      leaseNumber: 'LEASE-2023-002',
      tenant: 'Grace Wanjiru',
      unit: 'B201 - Westgate Apartments',
      startDate: '2023-08-15',
      endDate: '2024-08-14',
      duration: '12 months',
      rentAmount: 'KSh 25,000',
      securityDeposit: 'KSh 50,000',
      status: 'active',
      renewalDate: '2024-07-15',
      paymentStatus: 'overdue',
      documents: ['Lease Agreement', 'ID Copy']
    },
    {
      id: 3,
      leaseNumber: 'LEASE-2023-003',
      tenant: 'James Wangari',
      unit: 'E201 - Riverside Suites',
      startDate: '2023-12-01',
      endDate: '2024-11-30',
      duration: '12 months',
      rentAmount: 'KSh 180,000',
      securityDeposit: 'KSh 360,000',
      status: 'active',
      renewalDate: '2024-10-30',
      paymentStatus: 'current',
      documents: ['Lease Agreement', 'ID Copy', 'Employment Letter']
    },
    {
      id: 4,
      leaseNumber: 'LEASE-2023-004',
      tenant: 'Tech Solutions Ltd',
      unit: 'D101 - CBD Business Center',
      startDate: '2023-10-01',
      endDate: '2024-09-30',
      duration: '12 months',
      rentAmount: 'KSh 65,000',
      securityDeposit: 'KSh 130,000',
      status: 'active',
      renewalDate: '2024-08-30',
      paymentStatus: 'partial',
      documents: ['Lease Agreement', 'Company Registration']
    },
    {
      id: 5,
      leaseNumber: 'LEASE-2023-005',
      tenant: 'Sarah Mohamed',
      unit: 'C102 - Milik Towers',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      duration: '12 months',
      rentAmount: 'KSh 38,000',
      securityDeposit: 'KSh 76,000',
      status: 'active',
      renewalDate: '2024-11-30',
      paymentStatus: 'current',
      documents: ['Lease Agreement', 'ID Copy']
    },
    {
      id: 6,
      leaseNumber: 'LEASE-2023-006',
      tenant: 'David Kimani',
      unit: 'F301 - Garden Villas',
      startDate: '2023-07-01',
      endDate: '2024-06-30',
      duration: '12 months',
      rentAmount: 'KSh 55,000',
      securityDeposit: 'KSh 110,000',
      status: 'expiring',
      renewalDate: '2024-05-30',
      paymentStatus: 'partial',
      documents: ['Lease Agreement', 'ID Copy', 'Bank Statement']
    },
    {
      id: 7,
      leaseNumber: 'LEASE-2023-007',
      tenant: 'Linda Akinyi',
      unit: 'G401 - Westgate Apartments',
      startDate: '2022-03-01',
      endDate: '2023-02-28',
      duration: '12 months',
      rentAmount: 'KSh 42,000',
      securityDeposit: 'KSh 84,000',
      status: 'expired',
      renewalDate: '2023-01-28',
      paymentStatus: 'completed',
      documents: ['Lease Agreement', 'ID Copy']
    },
    {
      id: 8,
      leaseNumber: 'LEASE-2023-008',
      tenant: 'Robert Omondi',
      unit: 'H501 - Milik Towers',
      startDate: '2023-09-01',
      endDate: '2024-02-29',
      duration: '6 months',
      rentAmount: 'KSh 48,000',
      securityDeposit: 'KSh 96,000',
      status: 'terminated',
      renewalDate: 'N/A',
      paymentStatus: 'refunded',
      documents: ['Lease Agreement', 'Termination Letter']
    }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    expiring: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    expired: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    terminated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const paymentColors = {
    current: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Lease Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all lease agreements and renewals</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center space-x-2">
              <FaFilter />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center space-x-2">
              <FaDownload />
              <span>Export</span>
            </button>
            <Link to="/leases/create">
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg flex items-center space-x-2 hover:shadow-lg">
                <FaPlus />
                <span>Create Lease</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Leases</p>
                <p className="text-2xl font-bold dark:text-white">40</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</p>
                <p className="text-2xl font-bold dark:text-white">8</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <FaExclamationTriangle className="text-amber-600 dark:text-amber-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rent Value</p>
                <p className="text-2xl font-bold dark:text-white">KSh 2.9M</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Renewal Rate</p>
                <p className="text-2xl font-bold dark:text-white">78%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FaFileContract className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search leases by number, tenant, or unit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Expiring</option>
                <option>Expired</option>
                <option>Terminated</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>All Properties</option>
                <option>Milik Towers</option>
                <option>Westgate Apartments</option>
                <option>Garden Villas</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>Sort by: End Date</option>
                <option>Sort by: Start Date</option>
                <option>Sort by: Rent Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leases Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lease Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tenant & Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Financials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leases.map((lease) => {
                  const daysRemaining = calculateDaysRemaining(lease.endDate);
                  return (
                    <tr key={lease.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium dark:text-white">{lease.leaseNumber}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {lease.duration} • {lease.documents.length} documents
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium dark:text-white flex items-center">
                            <FaUser className="mr-2 text-gray-400" />
                            {lease.tenant}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                            <FaHome className="mr-2" />
                            {lease.unit}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            {lease.rentAmount}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Deposit: {lease.securityDeposit}
                          </div>
                          <div className="mt-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${paymentColors[lease.paymentStatus]}`}>
                              {lease.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            <span className="dark:text-white">Start: {lease.startDate}</span>
                          </div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            <span className={`dark:text-white ${daysRemaining < 30 ? 'text-red-600 dark:text-red-400' : ''}`}>
                              End: {lease.endDate} ({daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'})
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[lease.status]}`}>
                            {lease.status.toUpperCase()}
                          </span>
                          {lease.renewalDate !== 'N/A' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Renewal: {lease.renewalDate}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link to={`/leases/${lease.id}`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg" title="View Details">
                              <FaEye />
                            </button>
                          </Link>
                          <Link to={`/leases/${lease.id}/edit`}>
                            <button className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg" title="Edit">
                              <FaEdit />
                            </button>
                          </Link>
                          {lease.status === 'expiring' && (
                            <button className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg" title="Renew">
                              🔄
                            </button>
                          )}
                          <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lease Status Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h3 className="font-bold dark:text-white mb-4">Lease Status Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Leases</span>
                  <span className="text-sm font-semibold">40 (71%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</span>
                  <span className="text-sm font-semibold">8 (14%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expired</span>
                  <span className="text-sm font-semibold">5 (9%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: '9%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Terminated</span>
                  <span className="text-sm font-semibold">3 (5%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-4">Lease Management Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-white/20 rounded-lg hover:bg-white/30 transition flex items-center justify-center space-x-2">
                <FaFileContract />
                <span>Generate New Lease</span>
              </button>
              <button className="w-full py-3 bg-white/20 rounded-lg hover:bg-white/30 transition flex items-center justify-center space-x-2">
                <FaCalendarAlt />
                <span>Send Renewal Reminders</span>
              </button>
              <button className="w-full py-3 bg-white/20 rounded-lg hover:bg-white/30 transition flex items-center justify-center space-x-2">
                <FaDownload />
                <span>Export All Leases</span>
              </button>
              <button className="w-full py-3 bg-white/20 rounded-lg hover:bg-white/30 transition flex items-center justify-center space-x-2">
                <FaExclamationTriangle />
                <span>Review Expiring Leases</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leases;