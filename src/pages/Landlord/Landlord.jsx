// pages/Landlords.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaEnvelope, FaPhone, FaBuilding
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Landlords = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample landlords data
  const landlords = [
    {
      code: 'L001',
      name: 'JOHN KAMAU',
      status: 'Active',
      email: 'john@example...',
      phone: '+254712345678',
      idNumber: '12345678',
      properties: '5',
      units: '25',
      totalRevenue: 'KSh 850,000',
      joinDate: '2023-01-15'
    },
    {
      code: 'L002',
      name: 'SARAH WAN...',
      status: 'Active',
      email: 'sarah@exam...',
      phone: '+254723456789',
      idNumber: '23456789',
      properties: '3',
      units: '12',
      totalRevenue: 'KSh 450,000',
      joinDate: '2023-03-20'
    },
    {
      code: 'L003',
      name: 'DAVID OCH...',
      status: 'Active',
      email: 'david@exa...',
      phone: '+254734567890',
      idNumber: '34567890',
      properties: '8',
      units: '18',
      totalRevenue: 'KSh 1,200,000',
      joinDate: '2023-05-10'
    },
    {
      code: 'L004',
      name: 'MARY ATI...',
      status: 'Active',
      email: 'mary@exam...',
      phone: '+254745678901',
      idNumber: '45678901',
      properties: '6',
      units: '16',
      totalRevenue: 'KSh 950,000',
      joinDate: '2023-02-28'
    },
    {
      code: 'L005',
      name: 'JAMES MU...',
      status: 'Active',
      email: 'james@exa...',
      phone: '+254756789012',
      idNumber: '56789012',
      properties: '4',
      units: '6',
      totalRevenue: 'KSh 1,800,000',
      joinDate: '2023-04-15'
    },
    {
      code: 'L006',
      name: 'FATMA ALI',
      status: 'Active',
      email: 'fatma@exa...',
      phone: '+254767890123',
      idNumber: '67890123',
      properties: '2',
      units: '10',
      totalRevenue: 'KSh 320,000',
      joinDate: '2023-06-22'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row - Exactly like Properties page */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Landlord Code</option>
            <option>Name...</option>
            <option>ID Number...</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Properties Count</option>
            <option>1-5 Properties</option>
            <option>6-10 Properties</option>
            <option>10+ Properties</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Join Date</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last Year</option>
          </select>

          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-2 top-1.5 text-gray-500 text-xs" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <button className="px-2 py-1 text-xs bg-emerald-500 text-white rounded flex items-center gap-1">
            <FaPlus className="text-xs" />
            <span>Add Landlord</span>
          </button>
          
          <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded flex items-center gap-1">
            <FaEdit className="text-xs" />
            <span>Edit Landlord</span>
          </button>
          
          <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded flex items-center gap-1">
            <FaEllipsisH className="text-xs" />
            <span>More Actions</span>
          </button>
          
          <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded flex items-center gap-1">
            <FaFileExport className="text-xs" />
            <span>Print & Export</span>
          </button>
        </div>

        {/* Table - Minimal spacing, exact match */}
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-200">
              <tr>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Code</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Landlord</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Status</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Contact</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Properties</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Revenue</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {landlords.map((landlord, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                  <td className="px-3 py-2 whitespace-nowrap font-medium">{landlord.code}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{landlord.name}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-[11px]">ID: {landlord.idNumber}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-[11px] rounded ${
                      landlord.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                        : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                    }`}>
                      {landlord.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FaEnvelope className="text-gray-500 text-[11px]" />
                        <span className="text-[11px]">{landlord.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaPhone className="text-gray-500 text-[11px]" />
                        <span className="text-[11px]">{landlord.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="grid grid-cols-2 gap-1 text-center text-[11px]">
                      <div>
                        <div className="font-medium">{landlord.properties}</div>
                        <div className="text-gray-500 dark:text-gray-400">Properties</div>
                      </div>
                      <div>
                        <div className="font-medium">{landlord.units}</div>
                        <div className="text-gray-500 dark:text-gray-400">Units</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-emerald-600 dark:text-emerald-700 text-[11px]">{landlord.totalRevenue}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-[11px]">Monthly</div>
                      <div className="text-gray-500 dark:text-gray-400 text-[10px]">Joined: {landlord.joinDate}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-100 rounded" title="View">
                        <FaEye className="text-xs" />
                      </button>
                      <button className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-100 rounded" title="Edit">
                        <FaEdit className="text-xs" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-100 rounded" title="Delete">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer/Pagination - Minimal spacing */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-600 dark:text-gray-400">
          <div>
            Displaying 1 - 50 of 120 Records Per Page: 50
          </div>
          <div className="flex items-center gap-4">
            <div>Page 1 of 3</div>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">
                Previous
              </button>
              <button className="px-2 py-1 bg-emerald-500 text-white rounded">1</button>
              <button className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">2</button>
              <button className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">3</button>
              <button className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Landlords;