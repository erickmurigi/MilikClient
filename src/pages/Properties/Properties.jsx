// pages/Properties.js
import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaChevronLeft, FaChevronRight, FaGripVertical
} from 'react-icons/fa';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [columnWidths, setColumnWidths] = useState({
    code: 100,
    name: 180,
    landlord: 150,
    category: 120,
    zone: 120,
    location: 180,
    totalUnits: 100,
    occupiedUnits: 100,
    vacantUnits: 100,
    area: 140,
    grossArea: 120,
    netArea: 120,
    fieldOfficer: 120,
    dateAcquired: 140,
    status: 120,
  });
  
  const resizingRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 10;

  // Sample properties data matching the screenshot structure
  const properties = [
    {
      id: 1,
      code: 'A00213A',
      name: 'KITUI HEIGHTS RESIDENTIAL COMPLEX',
      status: 'Active',
      type: 'Residential',
      region: 'NAIROBI',
      zone: 'Westlands',
      fieldOfficer: 'John Doe',
      acquiredFrom: 'Direct Purchase',
      dateAcquired: '2023-01-15',
      area: 'Sq Meter',
      landlord: 'Anna Wangari',
      category: 'Residential',
      location: 'Nairobi CBD, Moi Avenue',
      totalUnits: '50',
      occupiedUnits: '33',
      vacantUnits: '17',
      grossArea: '2500',
      netArea: '2300'
    },
    {
      id: 2,
      code: '24323',
      name: 'ARDHI HOUSE COMMERCIAL CENTER',
      status: 'Active',
      type: 'Commercial',
      region: 'KENYA',
      zone: 'Mombasa',
      fieldOfficer: 'Jane Smith',
      acquiredFrom: 'Lease Agreement',
      dateAcquired: '2022-05-20',
      area: 'Sq Meter',
      landlord: 'ARDHI Holdings Ltd',
      category: 'Commercial',
      location: 'Mombasa Road, Nairobi',
      totalUnits: '20',
      occupiedUnits: '7',
      vacantUnits: '13',
      grossArea: '1500',
      netArea: '1400'
    },
    {
      id: 3,
      code: '01',
      name: 'BASIL TOWERS MIXED-USE DEVELOPMENT',
      status: 'Pending',
      type: 'Mixed Use',
      region: 'NAIROBI',
      zone: 'Kilimani',
      fieldOfficer: 'Mike Johnson',
      acquiredFrom: 'Joint Venture',
      dateAcquired: '2023-03-10',
      area: 'Sq Feet',
      landlord: 'Stan Group Holdings',
      category: 'Commercial',
      location: 'Kilimani Road, Nairobi',
      totalUnits: '30',
      occupiedUnits: '18',
      vacantUnits: '12',
      grossArea: '1800',
      netArea: '1650'
    },
    {
      id: 4,
      code: 'A00117A',
      name: 'BLESSING MALL SHOPPING CENTER',
      status: 'Active',
      type: 'Commercial',
      region: 'KENYA',
      zone: 'Thika',
      fieldOfficer: 'Sarah Chen',
      acquiredFrom: 'Acquisition',
      dateAcquired: '2021-11-05',
      area: 'Sq Meter',
      landlord: 'Andrew Kamau Enterprises',
      category: 'Commercial',
      location: 'Thika Town, Kiambu Road',
      totalUnits: '45',
      occupiedUnits: '40',
      vacantUnits: '5',
      grossArea: '3200',
      netArea: '3000'
    },
    {
      id: 5,
      code: '00E',
      name: 'BLUE SKY PLAZA OFFICE BUILDING',
      status: 'Inactive',
      type: 'Commercial',
      region: 'KENYA',
      zone: 'Kisumu',
      fieldOfficer: 'Robert Kim',
      acquiredFrom: 'Inheritance',
      dateAcquired: '2020-08-12',
      area: 'Sq Feet',
      landlord: 'Allan Nyerere Properties',
      category: 'Commercial',
      location: 'Kisumu CBD, Oginga Odinga Street',
      totalUnits: '25',
      occupiedUnits: '15',
      vacantUnits: '10',
      grossArea: '2000',
      netArea: '1850'
    },
    {
      id: 6,
      code: '123E',
      name: 'CAMON COURT APARTMENT COMPLEX',
      status: 'Active',
      type: 'Residential',
      region: 'KENYA',
      zone: 'Nakuru',
      fieldOfficer: 'David Omondi',
      acquiredFrom: 'Purchase',
      dateAcquired: '2022-12-01',
      area: 'Sq Feet',
      landlord: 'Joe Huid Real Estate',
      category: 'Residential',
      location: 'Nakuru Town, Kenyatta Avenue',
      totalUnits: '40',
      occupiedUnits: '35',
      vacantUnits: '5',
      grossArea: '2800',
      netArea: '2600'
    },
    {
      id: 7,
      code: '003B',
      name: 'CID APARTMENTS RESIDENTIAL BLOCK',
      status: 'Active',
      type: 'Residential',
      region: 'KENYA',
      zone: 'Eldoret',
      fieldOfficer: 'Mary Atieno',
      acquiredFrom: 'Direct Sale',
      dateAcquired: '2023-02-28',
      area: 'Sq Feet',
      landlord: 'CID Properties Ltd',
      category: 'Residential',
      location: 'Eldoret Town, Uganda Road',
      totalUnits: '35',
      occupiedUnits: '30',
      vacantUnits: '5',
      grossArea: '2400',
      netArea: '2200'
    },
    {
      id: 8,
      code: '46',
      name: 'CITE TOWERS OFFICE COMPLEX',
      status: 'Active',
      type: 'Commercial',
      region: 'KENYA',
      zone: 'Nairobi',
      fieldOfficer: 'Peter Maina',
      acquiredFrom: 'Lease',
      dateAcquired: '2022-07-15',
      area: 'Sq Feet',
      landlord: 'Eddah Wanjiru Investments',
      category: 'Commercial',
      location: 'Upper Hill, Nairobi',
      totalUnits: '60',
      occupiedUnits: '55',
      vacantUnits: '5',
      grossArea: '4000',
      netArea: '3800'
    },
    {
      id: 9,
      code: '002D',
      name: 'DFGH COMPLEX MIXED-USE BUILDING',
      status: 'Pending',
      type: 'Mixed Use',
      region: 'KENYA',
      zone: 'Kitui',
      fieldOfficer: 'James Kariuki',
      acquiredFrom: 'Partnership',
      dateAcquired: '2023-04-22',
      area: 'Sq Feet',
      landlord: 'Cal Investments Group',
      category: 'Mixed Use',
      location: 'Kitui Town, Mwingi Road',
      totalUnits: '28',
      occupiedUnits: '20',
      vacantUnits: '8',
      grossArea: '1900',
      netArea: '1750'
    },
    {
      id: 10,
      code: '011B',
      name: 'EDWIN RESIDENCE APARTMENT BLOCK',
      status: 'Active',
      type: 'Residential',
      region: 'KENYA',
      zone: 'Machakos',
      fieldOfficer: 'Elizabeth Wangoi',
      acquiredFrom: 'Purchase Agreement',
      dateAcquired: '2022-09-10',
      area: 'Sq Feet',
      landlord: 'Edwin Ruto Holdings',
      category: 'Residential',
      location: 'Machakos Town, Nairobi-Mombasa Highway',
      totalUnits: '22',
      occupiedUnits: '20',
      vacantUnits: '2',
      grossArea: '1600',
      netArea: '1500'
    }
  ];

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'landlord', label: 'Landlord' },
    { key: 'category', label: 'Category' },
    { key: 'zone', label: 'Zone' },
    { key: 'location', label: 'Location' },
    { key: 'totalUnits', label: 'Total Units' },
    { key: 'occupiedUnits', label: 'Occupied' },
    { key: 'vacantUnits', label: 'Vacant' },
    { key: 'area', label: 'Unit Measurement' },
    { key: 'grossArea', label: 'Gross Area' },
    { key: 'netArea', label: 'Net Area' },
    { key: 'fieldOfficer', label: 'Field Officer' },
    { key: 'dateAcquired', label: 'Date Acquired' },
    { key: 'status', label: 'Status' }
  ];

  const handleSelectProperty = (id) => {
    setSelectedProperties(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  // Fixed column resizing handlers - using requestAnimationFrame for smooth updates
  const startResizing = (columnKey, e) => {
    e.preventDefault();
    setIsResizing(true);
    resizingRef.current = {
      columnKey,
      startX: e.clientX,
      startWidth: columnWidths[columnKey]
    };
    
    const handleMouseMove = (e) => {
      if (!resizingRef.current) return;
      
      const { columnKey, startX, startWidth } = resizingRef.current;
      const diff = e.clientX - startX;
      const newWidth = Math.max(80, startWidth + diff);
      
      // Update state immediately for smooth visual feedback
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth
      }));
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      resizingRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Function to apply zebra striping pattern
  const getRowClass = (index) => {
    return index % 2 === 0 
      ? 'bg-white hover:bg-gray-50' 
      : 'bg-gray-50 hover:bg-gray-100';
  };

  // Pagination logic
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = properties.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Code</option>
            <option>Landlord</option>
            <option>Category</option>
            <option>Zone</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Region/Zone</option>
            <option>Nairobi</option>
            <option>Mombasa</option>
            <option>Kisumu</option>
            <option>Eldoret</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Field Officer</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
            <option>Mike Johnson</option>
          </select>

          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <button className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
            <FaPlus className="text-xs" />
            <span>Add Property</span>
          </button>
          
          <button className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <FaFileExport className="text-xs" />
            <span>Export</span>
          </button>
          
          <button className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <FaEllipsisH className="text-xs" />
            <span>More</span>
          </button>
        </div>

        {/* Boxed Table Design with adjustable columns - FIXED */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table 
              className="min-w-full text-xs border-collapse border border-gray-200"
              ref={tableRef}
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr className="bg-[#f1f9fa]">
                  {/* Checkbox column */}
                  <th className="px-3 py-1 text-left font-semibold text-gray-700 border border-gray-200"
                      style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      onClick={handleCheckboxClick}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  
                  {/* Adjustable columns with resizers */}
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className="relative px-3 py-1 text-left font-semibold text-gray-700 border border-gray-200"
                      style={{ 
                        width: `${columnWidths[column.key]}px`,
                        minWidth: '80px',
                        position: 'relative'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{column.label}</span>
                        <div 
                          className="w-2 h-4 ml-1 cursor-col-resize hover:bg-gray-300 flex items-center justify-center"
                          onMouseDown={(e) => startResizing(column.key, e)}
                          title="Drag to resize"
                        >
                          <FaGripVertical className="text-gray-400 text-xs" />
                        </div>
                      </div>
                      
                      {/* Resizer line */}
                      <div 
                        className={`absolute top-0 right-0 w-[3px] h-full cursor-col-resize z-10 ${
                          isResizing && resizingRef.current?.columnKey === column.key 
                            ? 'bg-blue-500' 
                            : 'hover:bg-blue-400 bg-transparent'
                        }`}
                        onMouseDown={(e) => startResizing(column.key, e)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentProperties.map((property, index) => (
                  <tr 
                    key={property.id}
                    className={`hover:bg-gray-50 hover:text-black cursor-pointer transition-colors duration-150 ${getRowClass(index)}`}
                  >
                    {/* Checkbox */}
                    <td 
                      className="px-3 py-1 border border-gray-200 align-top" 
                      style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}
                      onClick={handleCheckboxClick}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => handleSelectProperty(property.id)}
                        onClick={handleCheckboxClick}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    
                    {/* Code */}
                    <td 
                      className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.code}px` }}
                      title={property.code}
                    >
                      {property.code}
                    </td>
                    
                    {/* Name - Now shows full name in single line */}
                    <td 
                      className="px-3 py-1 text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.name}px` }}
                      title={property.name}
                    >
                      {property.name}
                    </td>
                    
                    {/* Landlord */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.landlord}px` }}
                      title={property.landlord}
                    >
                      {property.landlord}
                    </td>
                    
                    {/* Category */}
                    <td 
                      className="px-3 py-1 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.category}px` }}
                    >
                      <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-medium whitespace-nowrap ${
                        property.category === 'Residential' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : property.category === 'Commercial'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {property.category}
                      </span>
                    </td>
                    
                    {/* Zone */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.zone}px` }}
                      title={property.zone}
                    >
                      {property.zone}
                    </td>
                    
                    {/* Location */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.location}px` }}
                      title={property.location}
                    >
                      {property.location}
                    </td>
                    
                    {/* Total Units */}
                    <td 
                      className="px-3 py-1 text-center font-medium text-gray-900 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.totalUnits}px` }}
                    >
                      {property.totalUnits}
                    </td>
                    
                    {/* Occupied Units */}
                    <td 
                      className="px-3 py-1 text-center border border-gray-200 align-top"
                      style={{ width: `${columnWidths.occupiedUnits}px` }}
                    >
                      <span className="font-medium text-green-600">{property.occupiedUnits}</span>
                    </td>
                    
                    {/* Vacant Units */}
                    <td 
                      className="px-3 py-1 text-center border border-gray-200 align-top"
                      style={{ width: `${columnWidths.vacantUnits}px` }}
                    >
                      <span className="font-medium text-red-600">{property.vacantUnits}</span>
                    </td>
                    
                    {/* Unit Measurement */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                      style={{ width: `${columnWidths.area}px` }}
                    >
                      {property.area}
                    </td>
                    
                    {/* Gross Area */}
                    <td 
                      className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.grossArea}px` }}
                    >
                      {property.grossArea}
                    </td>
                    
                    {/* Net Area */}
                    <td 
                      className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.netArea}px` }}
                    >
                      {property.netArea}
                    </td>
                    
                    {/* Field Officer */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.fieldOfficer}px` }}
                      title={property.fieldOfficer}
                    >
                      {property.fieldOfficer}
                    </td>
                    
                    {/* Date Acquired */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                      style={{ width: `${columnWidths.dateAcquired}px` }}
                    >
                      {property.dateAcquired}
                    </td>
                    
                    {/* Status */}
                    <td 
                      className="px-3 py-1 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.status}px` }}
                    >
                      <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-medium whitespace-nowrap ${
                        property.status === 'Active'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : property.status === 'Pending'
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with pagination */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, properties.length)}</span> of <span className="font-medium">{properties.length}</span> properties
              </span>
              {selectedProperties.length > 0 && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-200">
                  {selectedProperties.length} selected
                </span>
              )}
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-0.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft size={10} />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-2 py-0.5 min-w-[32px] text-xs rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-1 text-gray-400 text-xs">...</span>;
                }
                return null;
              })}
            </div>
            
            <button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-0.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>

        {/* Resizing overlay */}
        {isResizing && (
          <div className="fixed inset-0 z-50 cursor-col-resize" style={{ cursor: 'col-resize' }} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Properties;