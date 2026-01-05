// pages/Landlords.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaUserPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave,FaBuilding
} from 'react-icons/fa';

const Landlords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLandlord, setSelectedLandlord] = useState(null);

  // Sample landlord data
  const landlords = [
    {
      id: 1,
      name: 'John Kamau',
      email: 'john@example.com',
      phone: '+254712345678',
      idNumber: '12345678',
      address: 'Westlands, Nairobi',
      propertiesCount: 5,
      unitsCount: 25,
      totalRevenue: 'KSh 850,000',
      joinDate: '2023-01-15',
      status: 'active'
    },
    // Add more sample data
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-black">Landlords Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all property owners</p>
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
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg flex items-center space-x-2">
              <FaUserPlus />
              <span>Add Landlord</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-100 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Landlords</p>
                <p className="text-2xl font-bold dark:text-gray-600">120</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FaUserPlus className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-100 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Landlords</p>
                <p className="text-2xl font-bold dark:text-gray-600">112</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FaUserPlus className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-100 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Properties</p>
                <p className="text-2xl font-bold dark:text-gray-600">420</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-100 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold dark:text-gray-600">KSh 25.4M</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <FaMoneyBillWave className="text-amber-600 dark:text-amber-400 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-100 rounded-xl p-4 mb-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search landlords by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent">
                <option>Sort by: Recent</option>
                <option>Sort by: Name</option>
                <option>Sort by: Properties</option>
              </select>
            </div>
          </div>
        </div>

        {/* Landlords Table */}
        <div className="bg-white dark:bg-gray-100 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Landlord
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Properties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {landlords.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-gray-50 dark:hover:bg-gray-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {landlord.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium dark:text-black">{landlord.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-600">
                            ID: {landlord.idNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm dark:text-black">{landlord.email}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{landlord.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm dark:text-black">{landlord.propertiesCount} Properties</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{landlord.unitsCount} Units</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {landlord.totalRevenue}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Monthly</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        landlord.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {landlord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                          <FaEye />
                        </button>
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg">
                          <FaEdit />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
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
      </div>
    </DashboardLayout>
  );
};

export default Landlords;