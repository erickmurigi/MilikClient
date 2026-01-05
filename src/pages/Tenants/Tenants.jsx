// pages/Tenants.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaUsers, FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaPhone, FaEnvelope, FaHome, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample tenants data
  const tenants = [
    {
      id: 1,
      name: 'Michael Otieno',
      email: 'michael@example.com',
      phone: '+254712345678',
      idNumber: '12345678',
      unit: 'A101 - Milik Towers',
      rent: 'KSh 45,000',
      balance: 'KSh 0',
      status: 'current',
      leaseStart: '2023-06-01',
      leaseEnd: '2024-05-31',
      emergencyContact: '+254723456789',
      paymentMethod: 'M-PESA'
    },
    {
      id: 2,
      name: 'Grace Wanjiru',
      email: 'grace@example.com',
      phone: '+254723456789',
      idNumber: '23456789',
      unit: 'B201 - Westgate Apartments',
      rent: 'KSh 25,000',
      balance: 'KSh 15,000',
      status: 'overdue',
      leaseStart: '2023-08-15',
      leaseEnd: '2024-08-14',
      emergencyContact: '+254734567890',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 3,
      name: 'James Wangari',
      email: 'james@example.com',
      phone: '+254734567890',
      idNumber: '34567890',
      unit: 'E201 - Riverside Suites',
      rent: 'KSh 180,000',
      balance: 'KSh 0',
      status: 'current',
      leaseStart: '2023-12-01',
      leaseEnd: '2024-11-30',
      emergencyContact: '+254745678901',
      paymentMethod: 'Cheque'
    },
    {
      id: 4,
      name: 'Tech Solutions Ltd',
      email: 'info@techsolutions.co.ke',
      phone: '+254745678901',
      idNumber: 'COMP456789',
      unit: 'D101 - CBD Business Center',
      rent: 'KSh 65,000',
      balance: 'KSh 32,500',
      status: 'partial',
      leaseStart: '2023-10-01',
      leaseEnd: '2024-09-30',
      emergencyContact: '+254756789012',
      paymentMethod: 'Corporate Account'
    },
    {
      id: 5,
      name: 'Sarah Mohamed',
      email: 'sarah@example.com',
      phone: '+254756789012',
      idNumber: '45678901',
      unit: 'C102 - Milik Towers',
      rent: 'KSh 38,000',
      balance: 'KSh 0',
      status: 'current',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      emergencyContact: '+254767890123',
      paymentMethod: 'M-PESA'
    },
    {
      id: 6,
      name: 'David Kimani',
      email: 'david@example.com',
      phone: '+254767890123',
      idNumber: '56789012',
      unit: 'F301 - Garden Villas',
      rent: 'KSh 55,000',
      balance: 'KSh 27,500',
      status: 'notice',
      leaseStart: '2023-07-01',
      leaseEnd: '2024-06-30',
      emergencyContact: '+254778901234',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const statusColors = {
    current: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    partial: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    notice: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'current': return '✅';
      case 'overdue': return '⚠️';
      case 'partial': return '⏳';
      case 'notice': return '📝';
      default: return '📌';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Tenants Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all tenant information and records</p>
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
            <Link to="/tenants/add">
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg flex items-center space-x-2 hover:shadow-lg">
                <FaPlus />
                <span>Add Tenant</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tenants</p>
                <p className="text-2xl font-bold dark:text-white">41</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Tenants</p>
                <p className="text-2xl font-bold dark:text-white">35</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FaUsers className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Payments</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">6</p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <FaExclamationCircle className="text-red-600 dark:text-red-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rent Due</p>
                <p className="text-2xl font-bold dark:text-white">KSh 2.89M</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-amber-600 dark:text-amber-400 text-xl" />
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
                placeholder="Search tenants by name, phone, email, or unit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>All Status</option>
                <option>Current</option>
                <option>Overdue</option>
                <option>Notice Period</option>
                <option>Moving Out</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>All Properties</option>
                <option>Milik Towers</option>
                <option>Westgate Apartments</option>
                <option>Garden Villas</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>Sort by: Recent</option>
                <option>Sort by: Name</option>
                <option>Sort by: Rent Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Unit & Rent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lease Period
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
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {tenant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium dark:text-white">{tenant.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {tenant.idNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm dark:text-white">
                        <div className="flex items-center mb-1">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {tenant.email}
                        </div>
                        <div className="flex items-center">
                          <FaPhone className="mr-2 text-gray-400" />
                          {tenant.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium dark:text-white flex items-center">
                          <FaHome className="mr-2 text-gray-400" />
                          {tenant.unit}
                        </div>
                        <div className="mt-2">
                          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {tenant.rent}
                          </div>
                          <div className={`text-sm ${tenant.balance !== 'KSh 0' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            Balance: {tenant.balance}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span className="dark:text-white">Start: {tenant.leaseStart}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          <span className="dark:text-white">End: {tenant.leaseEnd}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getStatusIcon(tenant.status)}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[tenant.status]}`}>
                          {tenant.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {tenant.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link to={`/tenants/${tenant.id}`}>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg" title="View Details">
                            <FaEye />
                          </button>
                        </Link>
                        <Link to={`/tenants/${tenant.id}/edit`}>
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg" title="Edit">
                            <FaEdit />
                          </button>
                        </Link>
                        <Link to={`/leases?tenant=${tenant.id}`}>
                          <button className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg" title="View Lease">
                            📄
                          </button>
                        </Link>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-4">Tenant Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Avg. Tenancy Duration:</span>
                <span className="font-bold">18 months</span>
              </div>
              <div className="flex justify-between">
                <span>Renewal Rate:</span>
                <span className="font-bold">78%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Payment Delay:</span>
                <span className="font-bold">3.2 days</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-4">Payment Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>On-time Payments:</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="flex justify-between">
                <span>Late Payments:</span>
                <span className="font-bold">12%</span>
              </div>
              <div className="flex justify-between">
                <span>Default Rate:</span>
                <span className="font-bold">3%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                Send Rent Reminders
              </button>
              <button className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                Generate Tenant Reports
              </button>
              <button className="w-full py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                Update Lease Agreements
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tenants;