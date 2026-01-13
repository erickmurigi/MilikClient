// pages/Units.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaHome, FaUser, FaDoorOpen, FaCalendarAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Units = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample units data matching the exact structure
  const units = [
    {
      code: 'U001',
      unitNumber: 'A101',
      property: 'Milik Towers',
      type: '2-Bedroom',
      size: '850 sq ft',
      status: 'Occupied',
      tenant: 'Michael Otieno',
      rent: 'KSh 45,000',
      lastMaintenance: '2024-01-15',
      nextInspection: '2024-02-15'
    },
    {
      code: 'U002',
      unitNumber: 'A102',
      property: 'Milik Towers',
      type: '1-Bedroom',
      size: '650 sq ft',
      status: 'Vacant',
      tenant: null,
      rent: 'KSh 32,000',
      lastMaintenance: '2024-01-10',
      nextInspection: '2024-03-10'
    },
    {
      code: 'U003',
      unitNumber: 'B201',
      property: 'Westgate Apartments',
      type: 'Studio',
      size: '450 sq ft',
      status: 'Occupied',
      tenant: 'Grace Wanjiru',
      rent: 'KSh 25,000',
      lastMaintenance: '2024-01-05',
      nextInspection: '2024-02-05'
    },
    {
      code: 'U004',
      unitNumber: 'C301',
      property: 'Garden Villas',
      type: '3-Bedroom',
      size: '1200 sq ft',
      status: 'Maintenance',
      tenant: null,
      rent: 'KSh 85,000',
      lastMaintenance: '2024-01-20',
      nextInspection: '2024-03-20'
    },
    {
      code: 'U005',
      unitNumber: 'D101',
      property: 'CBD Business Center',
      type: 'Office',
      size: '800 sq ft',
      status: 'Occupied',
      tenant: 'Tech Solutions Ltd',
      rent: 'KSh 65,000',
      lastMaintenance: '2024-01-12',
      nextInspection: '2024-02-12'
    },
    {
      code: 'U006',
      unitNumber: 'E201',
      property: 'Riverside Suites',
      type: 'Penthouse',
      size: '2000 sq ft',
      status: 'Occupied',
      tenant: 'James Wangari',
      rent: 'KSh 180,000',
      lastMaintenance: '2024-01-18',
      nextInspection: '2024-02-18'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row - Exactly like Properties page */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Unit Code</option>
            <option>Unit Number...</option>
            <option>Property...</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Status</option>
            <option>Occupied</option>
            <option>Vacant</option>
            <option>Maintenance</option>
            <option>Renovation</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Property</option>
            <option>Milik Towers</option>
            <option>Westgate Apartments</option>
            <option>Garden Villas</option>
            <option>CBD Business Center</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Unit Type</option>
            <option>1-Bedroom</option>
            <option>2-Bedroom</option>
            <option>3-Bedroom</option>
            <option>Studio</option>
            <option>Office</option>
            <option>Penthouse</option>
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
            <span>Add Unit</span>
          </button>
          
          <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded flex items-center gap-1">
            <FaEdit className="text-xs" />
            <span>Edit Unit</span>
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
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Unit Details</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Property</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Status</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Tenant & Rent</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Maintenance</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {units.map((unit, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                  <td className="px-3 py-2 whitespace-nowrap font-medium">{unit.code}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="font-medium">Unit {unit.unitNumber}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-[11px]">
                        {unit.type} • {unit.size}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium">{unit.property}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-[11px] rounded ${
                      unit.status === 'Occupied' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                        : unit.status === 'Vacant'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900'
                    }`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      {unit.tenant ? (
                        <>
                          <div className="flex items-center gap-1 mb-1">
                            <FaUser className="text-gray-500 text-[11px]" />
                            <span className="font-medium text-[11px]">{unit.tenant}</span>
                          </div>
                          <div className="text-emerald-600 dark:text-emerald-700 font-medium text-[11px]">
                            {unit.rent}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1">
                          <FaDoorOpen className="text-gray-500 text-[11px]" />
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">Available</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="grid grid-cols-2 gap-1 text-center text-[11px]">
                      <div>
                        <div className="font-medium">{unit.lastMaintenance}</div>
                        <div className="text-gray-500 dark:text-gray-400">Last Maint.</div>
                      </div>
                      <div>
                        <div className="font-medium text-emerald-600 dark:text-emerald-700">{unit.nextInspection}</div>
                        <div className="text-gray-500 dark:text-gray-400">Next Inspect.</div>
                      </div>
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
            Displaying 1 - 50 of 248 Records Per Page: 50
          </div>
          <div className="flex items-center gap-4">
            <div>Page 1 of 5</div>
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

export default Units;