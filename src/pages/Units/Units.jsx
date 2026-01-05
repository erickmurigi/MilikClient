// pages/Units.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaHome, FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaUser, FaBuilding, FaDoorOpen, FaTools, FaCalendarAlt, FaMoneyBillWave
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Units = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Sample units data
  const units = [
    {
      id: 1,
      unitNumber: 'A101',
      property: 'Milik Towers',
      type: '2-Bedroom',
      size: '850 sq ft',
      rent: 'KSh 45,000',
      deposit: 'KSh 90,000',
      status: 'occupied',
      tenant: 'Michael Otieno',
      lastPayment: '2024-01-01',
      nextPayment: '2024-02-01',
      amenities: ['Parking', 'Balcony', 'Security']
    },
    {
      id: 2,
      unitNumber: 'A102',
      property: 'Milik Towers',
      type: '1-Bedroom',
      size: '650 sq ft',
      rent: 'KSh 32,000',
      deposit: 'KSh 64,000',
      status: 'vacant',
      tenant: null,
      lastPayment: null,
      nextPayment: null,
      amenities: ['Parking', 'Balcony']
    },
    {
      id: 3,
      unitNumber: 'B201',
      property: 'Westgate Apartments',
      type: 'Studio',
      size: '450 sq ft',
      rent: 'KSh 25,000',
      deposit: 'KSh 50,000',
      status: 'occupied',
      tenant: 'Grace Wanjiru',
      lastPayment: '2024-01-05',
      nextPayment: '2024-02-05',
      amenities: ['Parking']
    },
    {
      id: 4,
      unitNumber: 'C301',
      property: 'Garden Villas',
      type: '3-Bedroom',
      size: '1200 sq ft',
      rent: 'KSh 85,000',
      deposit: 'KSh 170,000',
      status: 'maintenance',
      tenant: null,
      lastPayment: null,
      nextPayment: null,
      amenities: ['Parking', 'Garden', 'Pool', 'Security']
    },
    {
      id: 5,
      unitNumber: 'D101',
      property: 'CBD Business Center',
      type: 'Office',
      size: '800 sq ft',
      rent: 'KSh 65,000',
      deposit: 'KSh 130,000',
      status: 'occupied',
      tenant: 'Tech Solutions Ltd',
      lastPayment: '2024-01-10',
      nextPayment: '2024-02-10',
      amenities: ['Parking', 'WiFi', 'Meeting Room']
    },
    {
      id: 6,
      unitNumber: 'E201',
      property: 'Riverside Suites',
      type: 'Penthouse',
      size: '2000 sq ft',
      rent: 'KSh 180,000',
      deposit: 'KSh 360,000',
      status: 'occupied',
      tenant: 'James Wangari',
      lastPayment: '2024-01-15',
      nextPayment: '2024-02-15',
      amenities: ['Parking', 'Pool', 'Gym', 'Concierge', 'Security']
    }
  ];

  const statusColors = {
    occupied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    vacant: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    renovation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  const typeColors = {
    '1-Bedroom': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    '2-Bedroom': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    '3-Bedroom': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'Studio': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Office': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    'Penthouse': 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Units Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all rental units across properties</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
              >
                List
              </button>
            </div>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center space-x-2">
              <FaFilter />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center space-x-2">
              <FaDownload />
              <span>Export</span>
            </button>
            <Link to="/units/add">
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg flex items-center space-x-2 hover:shadow-lg">
                <FaPlus />
                <span>Add Unit</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Units</p>
                <p className="text-2xl font-bold dark:text-white">75</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FaHome className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Occupied Units</p>
                <p className="text-2xl font-bold dark:text-white">41</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FaUser className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vacant Units</p>
                <p className="text-2xl font-bold dark:text-white">34</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FaDoorOpen className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Under Maintenance</p>
                <p className="text-2xl font-bold dark:text-white">12</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <FaTools className="text-amber-600 dark:text-amber-400 text-xl" />
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
                placeholder="Search units by number, property, or tenant..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>All Properties</option>
                <option>Milik Towers</option>
                <option>Westgate Apartments</option>
                <option>Garden Villas</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>All Status</option>
                <option>Occupied</option>
                <option>Vacant</option>
                <option>Maintenance</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white">
                <option>All Types</option>
                <option>1-Bedroom</option>
                <option>2-Bedroom</option>
                <option>3-Bedroom</option>
                <option>Studio</option>
                <option>Office</option>
              </select>
            </div>
          </div>
        </div>

        {/* Units Grid/Table View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Unit Header */}
                <div className={`p-4 ${unit.status === 'occupied' ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 
                  unit.status === 'vacant' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                  'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">Unit {unit.unitNumber}</h3>
                      <p className="text-white/80 text-sm">{unit.property}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white`}>
                      {unit.status}
                    </span>
                  </div>
                </div>

                {/* Unit Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${typeColors[unit.type] || 'bg-gray-100 text-gray-800'}`}>
                        {unit.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Size</p>
                      <p className="font-medium dark:text-white">{unit.size}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{unit.rent}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Deposit: {unit.deposit}</p>
                  </div>

                  {unit.tenant ? (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-semibold">
                            {unit.tenant.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">{unit.tenant}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Current Tenant</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Last Payment:</span>
                          <span className="font-medium">{unit.lastPayment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Payment:</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{unit.nextPayment}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400">This unit is available for rent</p>
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.amenities.map((amenity, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link to={`/units/${unit.id}`} className="flex-1">
                      <button className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm">
                        View Details
                      </button>
                    </Link>
                    {unit.status === 'vacant' && (
                      <Link to={`/tenants/add?unit=${unit.id}`} className="flex-1">
                        <button className="w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm hover:shadow-lg">
                          Add Tenant
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Unit Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rent
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
                  {units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium dark:text-white">Unit {unit.unitNumber}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {unit.type} • {unit.size}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm dark:text-white">{unit.property}</div>
                      </td>
                      <td className="px-6 py-4">
                        {unit.tenant ? (
                          <div>
                            <div className="font-medium dark:text-white">{unit.tenant}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Next: {unit.nextPayment}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">No tenant</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium dark:text-white">{unit.rent}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Monthly</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[unit.status]}`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link to={`/units/${unit.id}`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                              <FaEye />
                            </button>
                          </Link>
                          <Link to={`/units/${unit.id}/edit`}>
                            <button className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg">
                              <FaEdit />
                            </button>
                          </Link>
                          {unit.status === 'vacant' && (
                            <Link to={`/tenants/add?unit=${unit.id}`}>
                              <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg">
                                <FaUser />
                              </button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1 to 6 of 75 units
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg">
              Previous
            </button>
            <button className="px-3 py-1 bg-emerald-500 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg">2</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg">3</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg">Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Units;