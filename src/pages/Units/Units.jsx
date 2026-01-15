// pages/Units.js
import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaChevronLeft, FaChevronRight, FaGripVertical,
  FaTimes, FaSave
} from 'react-icons/fa';

const Units = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  
  // Form state for the modal
  const [formData, setFormData] = useState({
    property: '',
    specifiedFloor: '',
    generalFloorNo: '',
    unitSpaceNo: '',
    ownerOccupied: 'No',
    rentPerUnitArea: '',
    marketRent: '',
    areaSqFt: '',
    chargeFreq: '',
    electricityAccountNo: '',
    waterAccountNo: '',
    electricityMeterNo: '',
    waterMeterNo: ''
  });

  // Services/Utilities state
  const [services, setServices] = useState([
    { service: '', costPerArea: '', totalCost: '', checked: false }
  ]);

  // Extra meters state
  const [extraMeters, setExtraMeters] = useState([
    { meterNo: '', readingSetup: false }
  ]);
  
  const columnWidths = useState({
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
  })[0];
  
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
      
      // Note: columnWidths is not a state variable in this version
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle services changes
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    
    // If it's a checkbox, toggle the checked state
    if (field === 'checked') {
      updatedServices[index].checked = value;
    }
    
    // If cost per area changes, calculate total cost if area is available
    if (field === 'costPerArea' && formData.areaSqFt) {
      const cost = parseFloat(value) || 0;
      const area = parseFloat(formData.areaSqFt) || 0;
      updatedServices[index].totalCost = (cost * area).toFixed(2);
    }
    
    setServices(updatedServices);
  };

  // Add new service row
  const addServiceRow = () => {
    setServices([...services, { service: '', costPerArea: '', totalCost: '', checked: false }]);
  };

  // Remove service row
  const removeServiceRow = (index) => {
    if (services.length > 1) {
      const updatedServices = services.filter((_, i) => i !== index);
      setServices(updatedServices);
    }
  };

  // Handle extra meters changes
  const handleMeterChange = (index, field, value) => {
    const updatedMeters = [...extraMeters];
    updatedMeters[index][field] = value;
    setExtraMeters(updatedMeters);
  };

  // Add new meter row
  const addMeterRow = () => {
    setExtraMeters([...extraMeters, { meterNo: '', readingSetup: false }]);
  };

  // Remove meter row
  const removeMeterRow = (index) => {
    if (extraMeters.length > 1) {
      const updatedMeters = extraMeters.filter((_, i) => i !== index);
      setExtraMeters(updatedMeters);
    }
  };

  // Handle form submission
  const handleAddUnitSubmit = (e) => {
    e.preventDefault();
    
    // Check for required fields
    if (!formData.property || !formData.unitSpaceNo) {
      // Show error
      console.log('Please fill in required fields');
      return;
    }
    
    console.log('Adding unit:', formData);
    console.log('Services:', services);
    console.log('Extra meters:', extraMeters);
    
    // Here you would typically make an API call to add the unit
    // For now, we'll just close the modal and reset the form
    setShowAddUnitModal(false);
    
    // Reset form
    setFormData({
      property: '',
      specifiedFloor: '',
      generalFloorNo: '',
      unitSpaceNo: '',
      ownerOccupied: 'No',
      rentPerUnitArea: '',
      marketRent: '',
      areaSqFt: '',
      chargeFreq: '',
      electricityAccountNo: '',
      waterAccountNo: '',
      electricityMeterNo: '',
      waterMeterNo: ''
    });
    
    setServices([{ service: '', costPerArea: '', totalCost: '', checked: false }]);
    setExtraMeters([{ meterNo: '', readingSetup: false }]);
  };

  // Sample properties for dropdown
  const properties = [
    'A1, KH KENYA',
    'AAA, PARKLANDS KENYA',
    'ALL PURPOSE APARTMENT',
    'ALPHA APARTMENT',
    'BASIL TOWERS',
    'BLUE SKY PLAZA'
  ];

  // Charge frequencies
  const chargeFrequencies = [
    'Monthly',
    'Quarterly',
    'Semi-Annually',
    'Annually',
    'One-time'
  ];

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row */}
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
          <button 
            onClick={() => setShowAddUnitModal(true)}
            className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
          >
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

        {/* Boxed Table Design */}
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
                  
                  {/* Columns */}
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
                          {/* Render unit cells */}
                          <td className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                            {unit.id}
                          </td>
                          <td className="px-3 py-1 text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                            {unit.unitNo}
                          </td>
                          <td className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                            {unit.property}
                          </td>
                          <td className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                            {unit.tenant}
                          </td>
                          <td className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap">
                            {unit.area}
                          </td>
                          <td className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap">
                            {unit.rentUnit}
                          </td>
                          <td className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap">
                            {unit.marketRent}
                          </td>
                          <td className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap">
                            {unit.currentRent}
                          </td>
                          <td className="px-3 py-1 border border-gray-200 align-top">
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
                          <td className="px-3 py-1 border border-gray-200 align-top">
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
                          <td className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                            {unit.vacantFrom}
                          </td>
                          <td className="px-3 py-1 border border-gray-200 align-top">
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

        {/* Footer with pagination */}
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

        {/* Add Unit Modal */}
        {showAddUnitModal && (
          <div className="fixed inset-0  bg-black/50
  backdrop-blur-md
  backdrop-saturate-300 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Add New Unit/Space</h2>
                  <p className="text-xs text-gray-600">Fill in the unit details below</p>
                </div>
                <button
                  onClick={() => setShowAddUnitModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleAddUnitSubmit}>
                  {/* Basic Information Section */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Property *
                        </label>
                        <select
                          name="property"
                          value={formData.property}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        >
                          <option value="">Select Property</option>
                          {properties.map(property => (
                            <option key={property} value={property}>{property}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Specified Floor
                        </label>
                        <input
                          type="text"
                          name="specifiedFloor"
                          value={formData.specifiedFloor}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., Ground Floor"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          General Floor No.
                        </label>
                        <input
                          type="number"
                          name="generalFloorNo"
                          value={formData.generalFloorNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., 1, 2, 3..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unit/Space No. *
                        </label>
                        <input
                          type="text"
                          name="unitSpaceNo"
                          value={formData.unitSpaceNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., A101, 201, etc."
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Owner Occupied?
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="ownerOccupied"
                              value="Yes"
                              checked={formData.ownerOccupied === 'Yes'}
                              onChange={handleInputChange}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="ownerOccupied"
                              value="No"
                              checked={formData.ownerOccupied === 'No'}
                              onChange={handleInputChange}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* AREA/SPACE MANAGEMENT & COSTING Section */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">AREA/SPACE MANAGEMENT & COSTING</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Rent Per Unit Area (Ksh)
                        </label>
                        <input
                          type="number"
                          name="rentPerUnitArea"
                          value={formData.rentPerUnitArea}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Market Rent (Ksh)
                        </label>
                        <input
                          type="number"
                          name="marketRent"
                          value={formData.marketRent}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Area (Sq Ft)
                        </label>
                        <input
                          type="number"
                          name="areaSqFt"
                          value={formData.areaSqFt}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Charge Freq.
                        </label>
                        <select
                          name="chargeFreq"
                          value={formData.chargeFreq}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">Select Frequency</option>
                          {chargeFrequencies.map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Service Charge/Utility/Amenity Table */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-medium text-gray-700">Service Charge/Utility/Amenity</h4>
                        <button
                          type="button"
                          onClick={addServiceRow}
                          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                        >
                          Add Service
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-8">
                                <input type="checkbox" className="rounded" />
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Service Charge/Utility/Amenity</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Cost Per Area</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Total Cost</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-16">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {services.map((service, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="checkbox"
                                    checked={service.checked}
                                    onChange={(e) => handleServiceChange(index, 'checked', e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="text"
                                    value={service.service}
                                    onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    placeholder="e.g., Water, Electricity, etc."
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="number"
                                    value={service.costPerArea}
                                    onChange={(e) => handleServiceChange(index, 'costPerArea', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    placeholder="0.00"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="text"
                                    value={service.totalCost}
                                    readOnly
                                    className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  {services.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeServiceRow(index)}
                                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  {/* UTILITY ACCOUNT & METER NO. Section */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">UTILITY ACCOUNT & METER NO.</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Electricity Ac/No.
                        </label>
                        <input
                          type="text"
                          name="electricityAccountNo"
                          value={formData.electricityAccountNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Electricity account number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Water Ac/No.
                        </label>
                        <input
                          type="text"
                          name="waterAccountNo"
                          value={formData.waterAccountNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Water account number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Electricity Meter/No.
                        </label>
                        <input
                          type="text"
                          name="electricityMeterNo"
                          value={formData.electricityMeterNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Electricity meter number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Water Meter/No.
                        </label>
                        <input
                          type="text"
                          name="waterMeterNo"
                          value={formData.waterMeterNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Water meter number"
                        />
                      </div>
                    </div>
                    
                    {/* Extra Meter Numbers */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-medium text-gray-700">Extra Meter Numbers</h4>
                        <button
                          type="button"
                          onClick={addMeterRow}
                          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                        >
                          Add Meter
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-8">
                                <input type="checkbox" className="rounded" />
                              </th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Meter No</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-24">Reading Setup</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-16">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {extraMeters.map((meter, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="text"
                                    value={meter.meterNo}
                                    onChange={(e) => handleMeterChange(index, 'meterNo', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    placeholder="Meter number"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={meter.readingSetup}
                                      onChange={(e) => handleMeterChange(index, 'readingSetup', e.target.checked)}
                                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="ml-2 text-xs">Enabled</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 border-b">
                                  {extraMeters.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeMeterRow(index)}
                                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  {/* Error Message */}
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">
                      The form has errors (click for details...)
                    </p>
                  </div>
                </form>
              </div>
              
              {/* Modal Footer */}
              <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                <div className="text-xs text-gray-500">
                  Fields marked with * are required
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUnitModal(false)}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset form logic
                      setFormData({
                        property: '',
                        specifiedFloor: '',
                        generalFloorNo: '',
                        unitSpaceNo: '',
                        ownerOccupied: 'No',
                        rentPerUnitArea: '',
                        marketRent: '',
                        areaSqFt: '',
                        chargeFreq: '',
                        electricityAccountNo: '',
                        waterAccountNo: '',
                        electricityMeterNo: '',
                        waterMeterNo: ''
                      });
                      setServices([{ service: '', costPerArea: '', totalCost: '', checked: false }]);
                      setExtraMeters([{ meterNo: '', readingSetup: false }]);
                    }}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddUnitSubmit}
                    className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave /> Save Unit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Units;