// pages/Tenants.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaPhone, FaEnvelope, FaUser, FaCalendarAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample tenants data matching the exact structure
  const tenants = [
    {
      code: 'T001',
      name: 'MICHAEL O...',
      status: 'Active',
      phone: '+254712345678',
      email: 'michael@...',
      unit: 'A101 - Milik...',
      rent: 'KSh 45,000',
      balance: 'KSh 0',
      lastPayment: '2024-01-01',
      nextPayment: '2024-02-01'
    },
    {
      code: 'T002',
      name: 'GRACE WAN...',
      status: 'Overdue',
      phone: '+254723456789',
      email: 'grace@exa...',
      unit: 'B201 - West...',
      rent: 'KSh 25,000',
      balance: 'KSh 15,000',
      lastPayment: '2024-01-05',
      nextPayment: '2024-02-05'
    },
    {
      code: 'T003',
      name: 'JAMES WA...',
      status: 'Active',
      phone: '+254734567890',
      email: 'james@ex...',
      unit: 'E201 - Riv...',
      rent: 'KSh 180,000',
      balance: 'KSh 0',
      lastPayment: '2024-01-15',
      nextPayment: '2024-02-15'
    },
    {
      code: 'T004',
      name: 'TECH SOL...',
      status: 'Partial',
      phone: '+254745678901',
      email: 'info@tec...',
      unit: 'D101 - CBD...',
      rent: 'KSh 65,000',
      balance: 'KSh 32,500',
      lastPayment: '2024-01-10',
      nextPayment: '2024-02-10'
    },
    {
      code: 'T005',
      name: 'SARAH MO...',
      status: 'Active',
      phone: '+254756789012',
      email: 'sarah@ex...',
      unit: 'C102 - Mil...',
      rent: 'KSh 38,000',
      balance: 'KSh 0',
      lastPayment: '2024-01-01',
      nextPayment: '2024-02-01'
    },
    {
      code: 'T006',
      name: 'DAVID KI...',
      status: 'Notice',
      phone: '+254767890123',
      email: 'david@ex...',
      unit: 'F301 - Gar...',
      rent: 'KSh 55,000',
      balance: 'KSh 27,500',
      lastPayment: '2024-01-01',
      nextPayment: '2024-02-01'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row - Exactly like Properties page */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Tenant Code</option>
            <option>Name...</option>
            <option>ID Number...</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Status</option>
            <option>Active</option>
            <option>Overdue</option>
            <option>Notice</option>
            <option>Moved Out</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Property</option>
            <option>Milik Towers</option>
            <option>Westgate Apartments</option>
            <option>Garden Villas</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Payment Status</option>
            <option>Current</option>
            <option>Overdue</option>
            <option>Partial</option>
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
            <span>Add Tenant</span>
          </button>
          
          <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded flex items-center gap-1">
            <FaEdit className="text-xs" />
            <span>Edit Tenant</span>
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
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Tenant Name</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Status</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Contact</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Unit & Payments</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tenants.map((tenant, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                  <td className="px-3 py-2 whitespace-nowrap font-medium">{tenant.code}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-[11px]">ID: 12345678</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-[11px] rounded ${
                      tenant.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                        : tenant.status === 'Overdue'
                        ? 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                        : tenant.status === 'Partial'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FaPhone className="text-gray-500 text-[11px]" />
                        <span className="text-[11px]">{tenant.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEnvelope className="text-gray-500 text-[11px]" />
                        <span className="text-[11px]">{tenant.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="font-medium text-[11px]">{tenant.unit}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">Unit</div>
                      </div>
                      <div>
                        <div className="font-medium text-emerald-600 dark:text-emerald-700 text-[11px]">{tenant.rent}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">Monthly Rent</div>
                      </div>
                      <div className="col-span-2">
                        <div className="grid grid-cols-2 gap-1 text-center text-[11px]">
                          <div>
                            <div className="font-medium">Last: {tenant.lastPayment}</div>
                            <div className="text-gray-500 dark:text-gray-400">Payment</div>
                          </div>
                          <div>
                            <div className="font-medium text-emerald-600 dark:text-emerald-700">Next: {tenant.nextPayment}</div>
                            <div className="text-gray-500 dark:text-gray-400">Due</div>
                          </div>
                        </div>
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
            Displaying 1 - 50 of 156 Records Per Page: 50
          </div>
          <div className="flex items-center gap-4">
            <div>Page 1 of 4</div>
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

export default Tenants;