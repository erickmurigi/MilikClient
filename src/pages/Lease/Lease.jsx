// pages/Leases.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaCalendarAlt, FaUser, FaHome, FaMoneyBillWave
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Leases = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample leases data
  const leases = [
    {
      code: 'LEASE-001',
      leaseNumber: '2023-001',
      tenant: 'MICHAEL O...',
      unit: 'A101 - Mil...',
      status: 'Active',
      type: '12 Months',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      rentAmount: 'KSh 45,000',
      deposit: 'KSh 90,000',
      paymentStatus: 'Current',
      renewalDate: '2024-04-30'
    },
    {
      code: 'LEASE-002',
      leaseNumber: '2023-002',
      tenant: 'GRACE WA...',
      unit: 'B201 - Wes...',
      status: 'Active',
      type: '12 Months',
      startDate: '2023-08-15',
      endDate: '2024-08-14',
      rentAmount: 'KSh 25,000',
      deposit: 'KSh 50,000',
      paymentStatus: 'Overdue',
      renewalDate: '2024-07-15'
    },
    {
      code: 'LEASE-003',
      leaseNumber: '2023-003',
      tenant: 'JAMES WA...',
      unit: 'E201 - Riv...',
      status: 'Active',
      type: '12 Months',
      startDate: '2023-12-01',
      endDate: '2024-11-30',
      rentAmount: 'KSh 180,000',
      deposit: 'KSh 360,000',
      paymentStatus: 'Current',
      renewalDate: '2024-10-30'
    },
    {
      code: 'LEASE-004',
      leaseNumber: '2023-004',
      tenant: 'TECH SO...',
      unit: 'D101 - CBD...',
      status: 'Active',
      type: '12 Months',
      startDate: '2023-10-01',
      endDate: '2024-09-30',
      rentAmount: 'KSh 65,000',
      deposit: 'KSh 130,000',
      paymentStatus: 'Partial',
      renewalDate: '2024-08-30'
    },
    {
      code: 'LEASE-005',
      leaseNumber: '2023-005',
      tenant: 'SARAH MO...',
      unit: 'C102 - Mil...',
      status: 'Active',
      type: '12 Months',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      rentAmount: 'KSh 38,000',
      deposit: 'KSh 76,000',
      paymentStatus: 'Current',
      renewalDate: '2024-11-30'
    },
    {
      code: 'LEASE-006',
      leaseNumber: '2023-006',
      tenant: 'DAVID KI...',
      unit: 'F301 - Gar...',
      status: 'Expiring',
      type: '12 Months',
      startDate: '2023-07-01',
      endDate: '2024-06-30',
      rentAmount: 'KSh 55,000',
      deposit: 'KSh 110,000',
      paymentStatus: 'Partial',
      renewalDate: '2024-05-30'
    }
  ];

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row - Exactly like Properties page */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Lease Code</option>
            <option>Lease Number...</option>
            <option>Tenant...</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Status</option>
            <option>Active</option>
            <option>Expiring</option>
            <option>Expired</option>
            <option>Terminated</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Payment Status</option>
            <option>Current</option>
            <option>Overdue</option>
            <option>Partial</option>
            <option>Completed</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Property</option>
            <option>Milik Towers</option>
            <option>Westgate Apartments</option>
            <option>Garden Villas</option>
            <option>CBD Business Center</option>
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
            <span>Create Lease</span>
          </button>
          
          <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded flex items-center gap-1">
            <FaEdit className="text-xs" />
            <span>Edit Lease</span>
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
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Lease Details</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Tenant & Unit</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Status</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Financials</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Timeline</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {leases.map((lease, index) => {
                const daysRemaining = calculateDaysRemaining(lease.endDate);
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                    <td className="px-3 py-2 whitespace-nowrap font-medium">{lease.code}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div>
                        <div className="font-medium">#{lease.leaseNumber}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-[11px]">{lease.type}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <FaUser className="text-gray-500 text-[11px]" />
                          <span className="font-medium text-[11px]">{lease.tenant}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaHome className="text-gray-500 text-[11px]" />
                          <span className="text-[11px]">{lease.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div>
                        <span className={`px-2 py-1 text-[11px] rounded ${
                          lease.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                            : lease.status === 'Expiring'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900'
                            : 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                        }`}>
                          {lease.status}
                        </span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 text-[10px] rounded ${
                            lease.paymentStatus === 'Current' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900'
                              : lease.paymentStatus === 'Overdue'
                              ? 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900'
                          }`}>
                            {lease.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <div>
                          <div className="font-medium text-emerald-600 dark:text-emerald-700">{lease.rentAmount}</div>
                          <div className="text-gray-500 dark:text-gray-400">Monthly</div>
                        </div>
                        <div>
                          <div className="font-medium">{lease.deposit}</div>
                          <div className="text-gray-500 dark:text-gray-400">Deposit</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="grid grid-cols-2 gap-1 text-center text-[11px]">
                        <div>
                          <div className="font-medium">{lease.startDate}</div>
                          <div className="text-gray-500 dark:text-gray-400">Start</div>
                        </div>
                        <div>
                          <div className={`font-medium ${daysRemaining < 30 ? 'text-red-600 dark:text-red-700' : ''}`}>
                            {lease.endDate}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}
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
                );
              })}
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

export default Leases;