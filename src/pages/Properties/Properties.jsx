// pages/Properties.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaBuilding, FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaMapMarkerAlt, FaUsers, FaHome, FaChartLine, FaCalendarAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample properties data
  const properties = [
    {
      id: 1,
      name: 'Milik Towers',
      address: 'Kilimani, Nairobi',
      landlord: 'John Kamau',
      type: 'Apartment',
      units: 24,
      occupied: 18,
      vacant: 6,
      totalRent: 'KSh 1,200,000',
      status: 'active',
      rating: 4.5,
      lastInspection: '2024-01-15'
    },
    {
      id: 2,
      name: 'Westgate Apartments',
      address: 'Westlands, Nairobi',
      landlord: 'Sarah Wanjiku',
      type: 'Commercial',
      units: 12,
      occupied: 8,
      vacant: 4,
      totalRent: 'KSh 850,000',
      status: 'active',
      rating: 4.2,
      lastInspection: '2024-01-10'
    },
    {
      id: 3,
      name: 'Garden Villas',
      address: 'Karen, Nairobi',
      landlord: 'David Ochieng',
      type: 'Residential',
      units: 8,
      occupied: 6,
      vacant: 2,
      totalRent: 'KSh 1,500,000',
      status: 'maintenance',
      rating: 4.8,
      lastInspection: '2024-01-05'
    },
    {
      id: 4,
      name: 'CBD Business Center',
      address: 'CBD, Nairobi',
      landlord: 'Mary Atieno',
      type: 'Commercial',
      units: 16,
      occupied: 12,
      vacant: 4,
      totalRent: 'KSh 2,100,000',
      status: 'active',
      rating: 4.3,
      lastInspection: '2024-01-12'
    },
    {
      id: 5,
      name: 'Riverside Suites',
      address: 'Riverside Drive, Nairobi',
      landlord: 'James Mutua',
      type: 'Luxury',
      units: 6,
      occupied: 4,
      vacant: 2,
      totalRent: 'KSh 3,200,000',
      status: 'active',
      rating: 4.9,
      lastInspection: '2024-01-08'
    },
    {
      id: 6,
      name: 'Mombasa Beach Resort',
      address: 'Nyali, Mombasa',
      landlord: 'Fatma Ali',
      type: 'Vacation',
      units: 10,
      occupied: 3,
      vacant: 7,
      totalRent: 'KSh 900,000',
      status: 'seasonal',
      rating: 4.1,
      lastInspection: '2023-12-20'
    }
  ];

  const propertyTypes = ['All', 'Apartment', 'Commercial', 'Residential', 'Luxury', 'Vacation', 'Industrial'];
  const statuses = ['All', 'active', 'maintenance', 'renovation', 'seasonal', 'closed'];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Properties Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all properties and their details</p>
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
            <Link to="/properties/add">
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg flex items-center space-x-2 hover:shadow-lg">
                <FaPlus />
                <span>Add Property</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <FaBuilding />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">+2.3%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">30</h3>
            <p className="text-white/90 text-sm">Total Properties</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <FaHome />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">+5.1%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">75</h3>
            <p className="text-white/90 text-sm">Total Units</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <FaChartLine />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">+1.8%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">53.3%</h3>
            <p className="text-white/90 text-sm">Occupancy Rate</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <FaUsers />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">KSh 2.9M</h3>
            <p className="text-white/90 text-sm">Monthly Collection</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-100 rounded-xl p-4 mb-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-800" />
              <input
                type="text"
                placeholder="Search properties by name, address, or landlord..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-black">
                {propertyTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-black">
                {statuses.map(status => (
                  <option key={status} value={status.toLowerCase()}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid/Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white dark:bg-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Property Image/Header */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    property.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : property.status === 'maintenance'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">{property.name}</h3>
                  <p className="text-white/80 text-sm">{property.type}</p>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="flex items-center text-gray-300 dark:text-gray-600 mb-4">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="text-sm">{property.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-600">Landlord</p>
                    <p className="font-medium dark:text-black">{property.landlord}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-600">Units</p>
                    <p className="font-medium dark:text-black">{property.units} total</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-600">Occupancy</p>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full" 
                          style={{ width: `${(property.occupied / property.units) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium dark:text-gray-500">{property.occupied}/{property.units}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-600">Monthly Rent</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{property.totalRent}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>Last inspected: {property.lastInspection}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">★</span>
                    <span>{property.rating}/5</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link to={`/properties/${property.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg flex items-center justify-center space-x-2">
                      <FaEye />
                      <span>View</span>
                    </button>
                  </Link>
                  <Link to={`/properties/${property.id}/edit`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-500 rounded-lg flex items-center justify-center space-x-2">
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                  </Link>
                  <Link to={`/units?property=${property.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-600 rounded-lg flex items-center justify-center space-x-2">
                      <FaHome />
                      <span>Units</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1 to 6 of 30 properties
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

export default Properties;