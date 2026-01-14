// pages/Units.js
import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaChevronLeft, FaChevronRight, FaGripVertical
} from 'react-icons/fa';

const Units = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [columnWidths, setColumnWidths] = useState({
    id: 120,
    unitNo: 140,
    property: 180,
    tenant: 160,
    area: 140,
    rentUnit: 140,
    marketRent: 140,
    currentRent: 140,
    unitType: 120,
    status: 120,
    vacantFrom: 140,
    detailed: 100,
  });
  
  const resizingRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 10;

  // Sample units data matching the screenshot structure with property grouping
  const unitsData = [
    // Property Group 1: A1, KH KENYA
    {
      isGroupHeader: true,
      propertyName: 'A1, KH KENYA, f/a: edwin (2 Units)',
      groupId: 'property-1'
    },
    {
      id: '4423425',
      unitNo: 'SERVICE CHA...',
      property: 'A1',
      tenant: 'R.R',
      area: '0.00',
      rentUnit: 'Ksh 0.00',
      marketRent: 'Ksh 0.00',
      currentRent: 'Ksh 0.00',
      unitType: 'Commercial',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-1'
    },
    {
      id: '4423424',
      unitNo: 'WATER',
      property: 'A1',
      tenant: 'MAN VICTOR',
      area: '0.00',
      rentUnit: 'Ksh 0.00',
      marketRent: 'Ksh 0.00',
      currentRent: 'Ksh 0.00',
      unitType: 'Utility',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-1'
    },
    
    // Property Group 2: AAA, PARKLANDS KENYA
    {
      isGroupHeader: true,
      propertyName: 'AAA, PARKLANDS KENYA, f/a: David Waweruyi, vic (2 Units)',
      groupId: 'property-2'
    },
    {
      id: '3778019',
      unitNo: '√',
      property: 'AAA',
      tenant: 'MATOBORI DENNIS',
      area: '0.00',
      rentUnit: 'Ksh 15,000',
      marketRent: 'Ksh 16,000',
      currentRent: 'Ksh 15,000',
      unitType: 'Residential',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-2'
    },
    {
      id: '3778018',
      unitNo: 'ZA',
      property: 'AAA',
      tenant: 'BLACK RAVEN',
      area: '0.00',
      rentUnit: 'Ksh 12,500',
      marketRent: 'Ksh 13,500',
      currentRent: 'Ksh 12,500',
      unitType: 'Commercial',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-2'
    },
    
    // Property Group 3: ALL PURPOSE APARTMENT
    {
      isGroupHeader: true,
      propertyName: 'ALL PURPOSE APARTMENT, COMMERCIAL_RESIDENTIAL Commercial/Residential, KENYA, f/a: David Waweruyi, vic (2 Units)',
      groupId: 'property-3'
    },
    {
      id: '5180166',
      unitNo: '6',
      property: 'ALL PURPOSE APARTMENT',
      tenant: 'IAN WAWERU',
      area: '0.00',
      rentUnit: 'Ksh 20,000',
      marketRent: 'Ksh 22,000',
      currentRent: 'Ksh 20,000',
      unitType: 'Residential',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-3'
    },
    {
      id: '5180167',
      unitNo: '7',
      property: 'ALL PURPOSE APARTMENT',
      tenant: 'EDTR JANE',
      area: '0.00',
      rentUnit: 'Ksh 18,500',
      marketRent: 'Ksh 20,000',
      currentRent: 'Ksh 18,500',
      unitType: 'Residential',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-3'
    },
    
    // Property Group 4: ALPHA APARTMENT
    {
      isGroupHeader: true,
      propertyName: 'ALPHA APARTMENT, EZEN KENYA NAIROBI MOI LANGATA (3 Units)',
      groupId: 'property-4'
    },
    {
      id: '5070726',
      unitNo: '24',
      property: 'ALPHA APARTMENT',
      tenant: '-',
      area: '0.00',
      rentUnit: 'Ksh 25,000',
      marketRent: 'Ksh 27,000',
      currentRent: 'Ksh 0.00',
      unitType: 'Residential',
      status: 'Vacant',
      vacantFrom: '2023-11-01',
      detailed: 'View',
      propertyId: 'property-4'
    },
    {
      id: '5070727',
      unitNo: '25',
      property: 'ALPHA APARTMENT',
      tenant: 'FREEMAN MORGAN',
      area: '0.00',
      rentUnit: 'Ksh 22,000',
      marketRent: 'Ksh 24,000',
      currentRent: 'Ksh 22,000',
      unitType: 'Residential',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-4'
    },
    {
      id: '5070728',
      unitNo: '27',
      property: 'ALPHA APARTMENT',
      tenant: 'DDEWWT MACHUNGO',
      area: '0.00',
      rentUnit: 'Ksh 21,500',
      marketRent: 'Ksh 23,500',
      currentRent: 'Ksh 21,500',
      unitType: 'Residential',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-4'
    },
    
    // Additional units for pagination
    {
      id: '5070729',
      unitNo: '28',
      property: 'ALPHA APARTMENT',
      tenant: 'JANE DOE',
      area: '75.50',
      rentUnit: 'Ksh 24,000',
      marketRent: 'Ksh 26,000',
      currentRent: 'Ksh 24,000',
      unitType: 'Residential',
      status: 'Occupied',
      vacantFrom: '-',
      detailed: 'View',
      propertyId: 'property-4'
    },
    {
      id: '5070730',
      unitNo: '29',
      property: 'ALPHA APARTMENT',
      tenant: '-',
      area: '80.00',
      rentUnit: 'Ksh 26,000',
      marketRent: 'Ksh 28,000',
      currentRent: 'Ksh 0.00',
      unitType: 'Residential',
      status: 'Vacant',
      vacantFrom: '2023-12-15',
      detailed: 'View',
      propertyId: 'property-4'
    }
  ];

  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'unitNo', label: 'Unit/Space No' },
    { key: 'property', label: 'Property/Facility' },
    { key: 'tenant', label: 'Current Tenant' },
    { key: 'area', label: 'Area(Sqr Ft/Mtr)' },
    { key: 'rentUnit', label: 'Rent/Unit Area (Kshs)' },
    { key: 'marketRent', label: 'Mkt. Rent (Kshs)' },
    { key: 'currentRent', label: 'Current Rent (Kshs)' },
    { key: 'unitType', label: 'Unit Type' },
    { key: 'status', label: 'Status' },
    { key: 'vacantFrom', label: 'Vacant from' },
    { key: 'detailed', label: 'Detailed' }
  ];

  const handleSelectUnit = (id) => {
    if (!id) return; // Skip group headers
    setSelectedUnits(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUnits([]);
    } else {
      // Only select actual unit rows, not group headers
      const unitIds = unitsData.filter(unit => !unit.isGroupHeader).map(unit => unit.id);
      setSelectedUnits(unitIds);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  // Column resizing handlers
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

  // Function to apply zebra striping pattern (skip group headers)
  const getRowClass = (index, isGroupHeader) => {
    if (isGroupHeader) return 'bg-blue-50 hover:bg-blue-100';
    
    return index % 2 === 0 
      ? 'bg-white hover:bg-gray-50' 
      : 'bg-gray-50 hover:bg-gray-100';
  };

  // Pagination logic
  const totalPages = Math.ceil(unitsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUnits = unitsData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row - Identical to Properties page */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Property</option>
            <option>A1, KH KENYA</option>
            <option>AAA, PARKLANDS</option>
            <option>ALL PURPOSE APARTMENT</option>
            <option>ALPHA APARTMENT</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Status</option>
            <option>Occupied</option>
            <option>Vacant</option>
            <option>Maintenance</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Unit Type</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Utility</option>
            <option>Mixed Use</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Field Officer</option>
            <option>David Waweruyi</option>
            <option>Edwin</option>
            <option>Jane Smith</option>
          </select>

          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search units..."
              className="w-full pl-10 pr-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <button className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
            <FaPlus className="text-xs" />
            <span>Add Unit</span>
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

        {/* Boxed Table Design with adjustable columns - Identical styling */}
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
                {currentUnits.map((unit, index) => {
                  const isGroupHeader = unit.isGroupHeader;
                  
                  return (
                    <tr 
                      key={isGroupHeader ? unit.groupId : unit.id}
                      className={`transition-colors duration-150 ${getRowClass(index, isGroupHeader)} ${
                        !isGroupHeader ? 'hover:bg-gray-50 hover:text-black cursor-pointer' : ''
                      }`}
                      onClick={() => !isGroupHeader && handleSelectUnit(unit.id)}
                    >
                      {/* Checkbox - Only show for unit rows, not group headers */}
                      <td 
                        className="px-3 py-1 border border-gray-200 align-top" 
                        style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}
                        onClick={!isGroupHeader ? handleCheckboxClick : undefined}
                      >
                        {!isGroupHeader && (
                          <input
                            type="checkbox"
                            checked={selectedUnits.includes(unit.id)}
                            onChange={() => handleSelectUnit(unit.id)}
                            onClick={handleCheckboxClick}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        )}
                      </td>
                      
                      {/* Group Header Row */}
                      {isGroupHeader ? (
                        <td 
                          colSpan={columns.length}
                          className="px-3 py-2 font-semibold text-gray-800 border border-gray-200 bg-blue-50"
                        >
                          {unit.propertyName}
                        </td>
                      ) : (
                        <>
                          {/* Id */}
                          <td 
                            className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ width: `${columnWidths.id}px` }}
                            title={unit.id}
                          >
                            {unit.id}
                          </td>
                          
                          {/* Unit/Space No */}
                          <td 
                            className="px-3 py-1 text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ width: `${columnWidths.unitNo}px` }}
                            title={unit.unitNo}
                          >
                            {unit.unitNo}
                          </td>
                          
                          {/* Property/Facility */}
                          <td 
                            className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ width: `${columnWidths.property}px` }}
                            title={unit.property}
                          >
                            {unit.property}
                          </td>
                          
                          {/* Current Tenant */}
                          <td 
                            className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ width: `${columnWidths.tenant}px` }}
                            title={unit.tenant}
                          >
                            {unit.tenant}
                          </td>
                          
                          {/* Area(Sqr Ft/Mtr) */}
                          <td 
                            className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap"
                            style={{ width: `${columnWidths.area}px` }}
                          >
                            {unit.area}
                          </td>
                          
                          {/* Rent/Unit Area (Kshs) */}
                          <td 
                            className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap"
                            style={{ width: `${columnWidths.rentUnit}px` }}
                          >
                            {unit.rentUnit}
                          </td>
                          
                          {/* Mkt. Rent (Kshs) */}
                          <td 
                            className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap"
                            style={{ width: `${columnWidths.marketRent}px` }}
                          >
                            {unit.marketRent}
                          </td>
                          
                          {/* Current Rent (Kshs) */}
                          <td 
                            className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap"
                            style={{ width: `${columnWidths.currentRent}px` }}
                          >
                            {unit.currentRent}
                          </td>
                          
                          {/* Unit Type */}
                          <td 
                            className="px-3 py-1 border border-gray-200 align-top"
                            style={{ width: `${columnWidths.unitType}px` }}
                          >
                            <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-medium whitespace-nowrap ${
                              unit.unitType === 'Residential' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : unit.unitType === 'Commercial'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                              {unit.unitType}
                            </span>
                          </td>
                          
                          {/* Status */}
                          <td 
                            className="px-3 py-1 border border-gray-200 align-top"
                            style={{ width: `${columnWidths.status}px` }}
                          >
                            <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-medium whitespace-nowrap ${
                              unit.status === 'Occupied'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : unit.status === 'Vacant'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                              {unit.status}
                            </span>
                          </td>
                          
                          {/* Vacant from */}
                          <td 
                            className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ width: `${columnWidths.vacantFrom}px` }}
                            title={unit.vacantFrom}
                          >
                            {unit.vacantFrom}
                          </td>
                          
                          {/* Detailed */}
                          <td 
                            className="px-3 py-1 border border-gray-200 align-top"
                            style={{ width: `${columnWidths.detailed}px` }}
                          >
                            <button 
                              className="px-2 py-0.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // View detailed logic
                              }}
                            >
                              {unit.detailed}
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with pagination - Identical styling */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, unitsData.length)}</span> of <span className="font-medium">{unitsData.length}</span> units
              </span>
              {selectedUnits.length > 0 && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-200">
                  {selectedUnits.length} selected
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

export default Units;