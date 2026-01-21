// pages/Properties.js
import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaChevronLeft, FaChevronRight, FaGripVertical
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [columnWidths, setColumnWidths] = useState({
    code: 100,
    name: 200,
    landlord: 160,
    category: 130,
    zone: 120,
    location: 180,
    totalUnits: 110,
    occupiedUnits: 110,
    vacantUnits: 110,
    area: 140,
    grossArea: 130,
    netArea: 130,
    fieldOfficer: 140,
    dateAcquired: 140,
    status: 120,
  });
  
  const resizingRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 50; // Changed to 50 per page

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
    // Add more properties to fill 50 per page...
  ];

  // Add more properties to make it 50+ for pagination demonstration
  for (let i = 6; i <= 60; i++) {
    const statuses = ['Active', 'Pending', 'Inactive'];
    const types = ['Residential', 'Commercial', 'Mixed Use'];
    const zones = ['Westlands', 'Mombasa', 'Kilimani', 'Thika', 'Kisumu', 'Nakuru', 'Eldoret', 'Nairobi'];
    const categories = ['Residential', 'Commercial', 'Mixed Use'];
    const areas = ['Sq Meter', 'Sq Feet'];
    
    properties.push({
      id: i,
      code: `PROP${String(i).padStart(3, '0')}`,
      name: `PROPERTY ${i} BUILDING COMPLEX`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      region: 'KENYA',
      zone: zones[Math.floor(Math.random() * zones.length)],
      fieldOfficer: `Officer ${i}`,
      acquiredFrom: 'Direct Purchase',
      dateAcquired: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      area: areas[Math.floor(Math.random() * areas.length)],
      landlord: `Landlord ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      location: `Location ${i}`,
      totalUnits: String(Math.floor(Math.random() * 100) + 10),
      occupiedUnits: String(Math.floor(Math.random() * 80) + 10),
      vacantUnits: String(Math.floor(Math.random() * 20) + 1),
      grossArea: String(Math.floor(Math.random() * 5000) + 1000),
      netArea: String(Math.floor(Math.random() * 4000) + 800)
    });
  }

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
      : 'bg-[#e8f4f5] hover:bg-gray-50'; // Changed to lighter blue for alternate rows
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
      <div className="flex flex-col h-full">
        <div className="pt-1 px-2 flex-shrink-0">
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
            <Link to="/properties/new">
              <button className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
                <FaPlus className="text-xs" />
                <span>Add Property</span>
              </button>
            </Link>
           
            <button className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <FaFileExport className="text-xs" />
              <span>Export</span>
            </button>
            
            <button className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <FaEllipsisH className="text-xs" />
              <span>More</span>
            </button>
          </div>
        </div>

        {/* Boxed Table Design with adjustable columns - FIXED */}
        <div className="flex-1 px-2 pb-2 overflow-hidden">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table 
                className="min-w-full text-xs border-collapse border border-gray-200 font-bold"
                ref={tableRef}
                style={{ 
                  tableLayout: 'fixed',
                  backgroundColor: '#dfebed' // Set table background to #dfebed
                }}
              >
                <thead>
                  <tr className="bg-[#a5c9b7] sticky top-0 z-10"> {/* Darker blue for header */}
                    {/* Checkbox column */}
                    <th className="px-3 py-1 text-left font-bold text-gray-800 border border-gray-200"
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
                        className="relative px-3 py-1 text-left font-bold text-gray-800 border border-gray-200"
                        style={{ 
                          width: `${columnWidths[column.key]}px`,
                          minWidth: '80px',
                          position: 'relative',
                          backgroundColor: '#a5c9b7' // Ensure header cells have same background
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
                  {currentProperties.length > 0 ? (
                    currentProperties.map((property, index) => (
                      <tr 
                        key={property.id}
                        className={`hover:bg-gray-50 hover:text-black cursor-pointer transition-colors duration-150 ${getRowClass(index)}`}
                      >
                        {/* Checkbox */}
                        <td 
                          className="px-3 py-1 border bg-[#a5c9b7] border-gray-200 align-top" 
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
                          className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: `${columnWidths.code}px` }}
                          title={property.code}
                        >
                          {property.code}
                        </td>
                        
                        {/* Name - Now shows full name in single line */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: `${columnWidths.name}px` }}
                          title={property.name}
                        >
                          {property.name}
                        </td>
                        
                        {/* Landlord */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: `${columnWidths.landlord}px` }}
                          title={property.landlord}
                        >
                          {property.landlord}
                        </td>
                        
                        {/* Category */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] border border-gray-200 align-top"
                          style={{ width: `${columnWidths.category}px` }}
                        >
                          <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-bold whitespace-nowrap ${
                            property.category === 'Residential' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : property.category === 'Commercial'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          }`}>
                            {property.category}
                          </span>
                        </td>
                        
                        {/* Zone */}
                        <td 
                          className="px-3 py-1  bg-[#a5c9b7] font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: `${columnWidths.zone}px` }}
                          title={property.zone}
                        >
                          {property.zone}
                        </td>
                        
                        {/* Location */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: `${columnWidths.location}px` }}
                          title={property.location}
                        >
                          {property.location}
                        </td>
                        
                        {/* Total Units */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] text-center font-bold text-gray-900 border border-gray-200 align-top"
                          style={{ width: `${columnWidths.totalUnits}px` }}
                        >
                          {property.totalUnits}
                        </td>
                        
                        {/* Occupied Units */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] text-center border border-gray-200 align-top"
                          style={{ width: `${columnWidths.occupiedUnits}px` }}
                        >
                          <span className="font-bold text-green-700">{property.occupiedUnits}</span>
                        </td>
                        
                        {/* Vacant Units */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] text-center border border-gray-200 align-top"
                          style={{ width: `${columnWidths.vacantUnits}px` }}
                        >
                          <span className="font-bold text-red-700">{property.vacantUnits}</span>
                        </td>
                        
                        {/* Unit Measurement */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                          style={{ width: `${columnWidths.area}px` }}
                        >
                          {property.area}
                        </td>
                        
                        {/* Gross Area */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] text-right font-bold text-gray-900 border border-gray-200 align-top"
                          style={{ width: `${columnWidths.grossArea}px` }}
                        >
                          {property.grossArea}
                        </td>
                        
                        {/* Net Area */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] text-right font-bold text-gray-900 border border-gray-200 align-top"
                          style={{ width: `${columnWidths.netArea}px` }}
                        >
                          {property.netArea}
                        </td>
                        
                        {/* Field Officer */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: `${columnWidths.fieldOfficer}px` }}
                          title={property.fieldOfficer}
                        >
                          {property.fieldOfficer}
                        </td>
                        
                        {/* Date Acquired */}
                        <td 
                          className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                          style={{ width: `${columnWidths.dateAcquired}px` }}
                        >
                          {property.dateAcquired}
                        </td>
                        
                        {/* Status */}
                        <td 
                          className="px-3 py-1  bg-[#a5c9b7] border border-gray-200 align-top"
                          style={{ width: `${columnWidths.status}px` }}
                        >
                          <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-bold whitespace-nowrap ${
                            property.status === 'Active'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : property.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Empty state row
                    <tr>
                      <td 
                        colSpan={columns.length + 1}
                        className="px-3 py-4 text-center text-gray-500 border border-gray-200"
                        style={{ backgroundColor: '#dfebed' }}
                      >
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="text-lg font-bold text-gray-400 mb-2">No properties found</div>
                          <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer with pagination */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mt-2 px-1 py-2 border-t border-gray-200 bg-white">
            <div className="text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <span className="font-bold">
                  Showing <span className="font-bold">{startIndex + 1}</span> to <span className="font-bold">{Math.min(endIndex, properties.length)}</span> of <span className="font-bold">{properties.length}</span> properties
                </span>
                {selectedProperties.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-300">
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
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
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
                        className={`px-3 py-1.5 min-w-[32px] text-xs rounded-lg border transition-colors font-bold ${
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
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
              >
                Next
                <FaChevronRight size={10} />
              </button>
            </div>
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