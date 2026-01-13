// pages/Properties.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample properties data matching the screenshot structure
  const properties = [
    {
      code: 'A00213A',
      name: 'ANNA A...',
      status: 'ANN WAN...',
      type: 'Residential',
      region: 'NAIROBI, ...',
      fieldOfficer: '34',
      acquiredFrom: '1',
      dateAcquired: '33',
      area: 'Sq Meter'
    },
    {
      code: '24323',
      name: 'ARDHI...',
      status: 'ARDHI HO...',
      type: '',
      region: 'KENYA',
      fieldOfficer: '7',
      acquiredFrom: '7',
      dateAcquired: '0',
      area: 'Sq Meter'
    },
    {
      code: '01',
      name: 'BASIL...',
      status: 'STAN',
      type: '',
      region: '',
      fieldOfficer: '1',
      acquiredFrom: '1',
      dateAcquired: '0',
      area: 'Sq Feet'
    },
    {
      code: 'A00117A',
      name: 'BLES...',
      status: 'ANDREW',
      type: 'Commercial',
      region: 'KENYA',
      fieldOfficer: '4',
      acquiredFrom: '4',
      dateAcquired: '0',
      area: 'Sq Meter'
    },
    {
      code: '00E',
      name: 'BLUE...',
      status: 'ALLAN NY...',
      type: 'Commercial',
      region: 'KENYA',
      fieldOfficer: '0',
      acquiredFrom: '0',
      dateAcquired: '0',
      area: 'Sq Feet'
    },
    {
      code: '123E',
      name: 'CAMON',
      status: 'JOE HUI',
      type: '',
      region: 'KENYA',
      fieldOfficer: '2',
      acquiredFrom: '1',
      dateAcquired: '1',
      area: 'Sq Feet'
    },
    {
      code: '003B',
      name: 'CID A...',
      status: 'CID',
      type: '',
      region: 'KENYA',
      fieldOfficer: '1',
      acquiredFrom: '0',
      dateAcquired: '1',
      area: 'Sq Feet'
    },
    {
      code: '46',
      name: 'CITE',
      status: 'EDDAH',
      type: '',
      region: 'KENYA',
      fieldOfficer: '2',
      acquiredFrom: '0',
      dateAcquired: '2',
      area: 'Sq Feet'
    },
    {
      code: '002D',
      name: 'DFGH...',
      status: 'CAL',
      type: '',
      region: 'KENYA',
      fieldOfficer: '0',
      acquiredFrom: '0',
      dateAcquired: '0',
      area: 'Sq Feet'
    },
    {
      code: '011B',
      name: 'EDWI...',
      status: 'EDWIN RI...',
      type: 'Residential',
      region: 'KENYA',
      fieldOfficer: '0',
      acquiredFrom: '0',
      dateAcquired: '0',
      area: 'Sq Feet'
    },
    {
      code: '011D',
      name: 'EDWEV...',
      status: 'EDWIN RI...',
      type: 'Residential',
      region: 'KENYA',
      fieldOfficer: '0',
      acquiredFrom: '0',
      dateAcquired: '0',
      area: 'Sq Feet'
    },
    {
      code: 'A00055A',
      name: 'GRAFF',
      status: 'ALBERT',
      type: 'Residential',
      region: 'KENYA',
      fieldOfficer: '2',
      acquiredFrom: '2',
      dateAcquired: '0',
      area: 'Sq Feet'
    },
    {
      code: '00J',
      name: 'HGC',
      status: 'ALLAN NY...',
      type: '',
      region: 'KENYA',
      fieldOfficer: '2',
      acquiredFrom: '0',
      dateAcquired: '2',
      area: 'Sq Feet'
    },
    {
      code: '123C',
      name: 'HUEJOE',
      status: 'JOE HUI',
      type: '',
      region: 'KENYA',
      fieldOfficer: '1',
      acquiredFrom: '0',
      dateAcquired: '1',
      area: 'Sq Feet'
    },
    {
      code: '002L',
      name: 'INTERIM',
      status: 'CAL',
      type: '',
      region: 'KENYA',
      fieldOfficer: '2',
      acquiredFrom: '2',
      dateAcquired: '0',
      area: 'Sq Feet'
    },
    {
      code: '123D',
      name: 'UYTR...',
      status: 'JOE HUI',
      type: '',
      region: 'KENYA',
      fieldOfficer: '0',
      acquiredFrom: '0',
      dateAcquired: '0',
      area: 'Sq Feet'
    }
  ];

  // Filter options matching the screenshot
  const filterOptions = [
    { label: 'Code', value: 'code' },
    { label: 'Landlord...', value: 'landlord' },
    { label: 'Status', value: 'status' },
    { label: 'Acquired From...', value: 'acquiredFrom' },
    { label: 'Region/Zone', value: 'region' },
    { label: 'Region/Zone...', value: 'regionZone' },
    { label: 'Field Officer', value: 'fieldOfficer' },
    { label: 'Field Officer...', value: 'fieldOfficerDetail' },
    { label: 'Date Acquired', value: 'dateAcquired' },
    { label: 'File Officers', value: 'fileOfficers' },
    { label: 'Filter Options', value: 'filterOptions' },
    { label: 'Filters', value: 'filters' }
  ];

  return (
    <DashboardLayout>
      <div className="p-0">
       
        {/* Search and Filters Row - Exactly like screenshot */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Code</option>
            <option>Landlord...</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Status</option>
            <option>Acquired From...</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Region/Zone</option>
            <option>Region/Zone...</option>
          </select>
          
          <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-200 dark:text-gray-800">
            <option>Field Officer</option>
            <option>Field Officer...</option>
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
            <span>Add Property</span>
          </button>
          
          <button className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded flex items-center gap-1">
            <FaEdit className="text-xs" />
            <span>Edit Property</span>
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
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Name</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Status</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Region/Zone</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700">Field Officer</th>
                <th className="px-3 py-2 text-left border-b dark:border-gray-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {properties.map((property, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-100">
                  <td className="px-3 py-2 whitespace-nowrap">{property.code}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{property.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{property.status}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{property.type}</div>
                      <div className="text-gray-500 dark:text-gray-400">{property.region}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <div>
                        <div className="font-medium">{property.fieldOfficer}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Field Officer</div>
                      </div>
                      <div>
                        <div className="font-medium">{property.acquiredFrom}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Acquired From</div>
                      </div>
                      <div>
                        <div className="font-medium">{property.dateAcquired}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Date Acquired</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-gray-500 dark:text-gray-400">{property.area}</div>
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

export default Properties;