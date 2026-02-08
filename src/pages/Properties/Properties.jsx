// pages/Properties.js
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaChevronLeft, FaChevronRight, FaGripVertical,
  FaChevronDown, FaChevronUp, FaSpinner, FaTimes, FaBuilding
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { 
  getProperties, 
  deleteProperty,
 
} from '../../redux/propertyRedux';

const Properties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { properties, loading, error, pagination } = useSelector((state) => state.property);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    zone: '',
    category: ''
  });

  const resizingRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 50;

  const columnWidths = {
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
  };

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
// In your Properties page component

// Fetch properties on component mount and when filters change
useEffect(() => {
  const fetchProperties = async () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      status: filters.status,
      zone: filters.zone,
      category: filters.category
    };
    
    await dispatch(getProperties(params));
  };
  
  fetchProperties();
}, [dispatch, currentPage, searchTerm, filters]);

// Or if you want to handle it in a function:
const fetchProperties = () => {
  const params = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: filters.status,
    zone: filters.zone,
    category: filters.category
  };
  
  dispatch(getProperties(params));
};

// Handle search
const handleSearch = (e) => {
  e.preventDefault();
  setCurrentPage(1);
  fetchProperties();
};

// Handle filter change
const handleFilterChange = (filterName, value) => {
  setFilters(prev => ({ ...prev, [filterName]: value }));
  setCurrentPage(1);
};


  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle property selection
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
      setSelectedProperties(properties.map(p => p._id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  // Handle row click - navigate to detail or expand
  const handleRowClick = (propertyId, e) => {
    // Don't navigate if clicking on checkbox or action buttons
    if (e.target.type === 'checkbox' || e.target.closest('.action-buttons')) {
      return;
    }
    
    if (expandedRow === propertyId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(propertyId);
    }
  };

  // Handle delete property
  const handleDelete = async (propertyId) => {
    try {
      await dispatch(deleteProperty(propertyId)).unwrap();
      toast.success('Property deleted successfully');
      setShowDeleteConfirm(null);
      
      // Refresh the list if we're on the last page with only one property
      if (properties.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          ...filters
        };
        dispatch(getProperties(params));
      }
    } catch (err) {
      toast.error(err || 'Failed to delete property');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) {
      toast.error('No properties selected');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProperties.length} properties? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete all selected properties
      for (const propertyId of selectedProperties) {
        await dispatch(deleteProperty(propertyId));
      }
      
      toast.success(`${selectedProperties.length} properties deleted successfully`);
      setSelectedProperties([]);
      setSelectAll(false);
      
      // Refresh the list
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...filters
      };
      dispatch(getProperties(params));
    } catch (err) {
      toast.error('Failed to delete some properties');
    }
  };

  // Handle export (placeholder)
  const handleExport = () => {
    toast.info('Export feature coming soon');
  };

  // Column resizing
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
      
      // Update column widths
      columnWidths[columnKey] = newWidth;
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

  // Row styling
  const getRowClass = (index) => {
    return index % 2 === 0 
      ? 'bg-white hover:bg-gray-50' 
      : 'bg-[#e8f4f5] hover:bg-gray-50';
  };



 
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      zone: '',
      category: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get primary landlord name
  const getPrimaryLandlord = (landlords) => {
    if (!landlords || landlords.length === 0) return 'N/A';
    const primary = landlords.find(l => l.isPrimary);
    return primary ? primary.name : landlords[0].name;
  };

  // Get full address
  const getFullAddress = (property) => {
    const parts = [
      property.roadStreet,
      property.estateArea,
      property.townCityState
    ].filter(part => part && part.trim() !== '');
    return parts.join(', ') || property.address || 'N/A';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'closed': return 'bg-red-100 text-red-800 border border-red-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'residential': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'commercial': return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'mixed use': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil((pagination?.total || 0) / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="pt-1 px-2 flex-shrink-0">
          {/* Search and Filters Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Filter dropdowns */}
            <select 
              className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="closed">Closed</option>
            </select>

            <select 
              className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={filters.zone}
              onChange={(e) => handleFilterChange('zone', e.target.value)}
            >
              <option value="">All Zones</option>
              <option value="Nairobi CBD">Nairobi CBD</option>
              <option value="Westlands">Westlands</option>
              <option value="Kilimani">Kilimani</option>
              <option value="Karen">Karen</option>
              <option value="Mombasa Road">Mombasa Road</option>
              <option value="Thika Road">Thika Road</option>
            </select>

            <select 
              className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Mixed Use">Mixed Use</option>
              <option value="Industrial">Industrial</option>
              <option value="Agricultural">Agricultural</option>
            </select>

            {/* Search input with button */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search by code, name, or LR number..."
                  className="w-full pl-10 pr-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>

            {/* Clear filters button */}
            {(filters.status || filters.zone || filters.category || searchTerm) && (
              <button 
                onClick={clearFilters}
                className="px-3 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FaTimes className="text-xs" />
                <span>Clear Filters</span>
              </button>
            )}

            {/* Action buttons */}
            <Link to="/properties/add">
              <button className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
                <FaPlus className="text-xs" />
                <span>Add Property</span>
              </button>
            </Link>
           
            <button 
              onClick={handleExport}
              className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FaFileExport className="text-xs" />
              <span>Export</span>
            </button>
            
            {selectedProperties.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="px-4 py-1 text-xs bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm"
              >
                <FaTrash className="text-xs" />
                <span>Delete ({selectedProperties.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Boxed Table Design with adjustable columns */}
        <div className="flex-1 px-2 pb-2 overflow-hidden">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-3xl text-emerald-600 mb-4" />
                <p className="text-gray-600">Loading properties...</p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto flex-1">
                <table 
                  className="min-w-full text-xs border-collapse border border-gray-200 font-bold"
                  ref={tableRef}
                  style={{ 
                    tableLayout: 'fixed',
                    backgroundColor: '#dfebed'
                  }}
                >
                  <thead>
                    <tr className="bg-[#a5c9b7] sticky top-0 z-10">
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
                      
                      {/* Expand/Collapse column */}
                      <th className="px-3 py-1 text-left font-bold text-gray-800 border border-gray-200"
                          style={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
                        {/* Empty for expand button */}
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
                            backgroundColor: '#a5c9b7'
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
                    {properties && properties.length > 0 ? (
                      properties.map((property, index) => (
                        <React.Fragment key={property._id}>
                          {/* Main row */}
                          <tr 
                            className={`hover:bg-gray-50 hover:text-black cursor-pointer transition-colors duration-150 ${getRowClass(index)}`}
                            onClick={(e) => handleRowClick(property._id, e)}
                          >
                            {/* Checkbox */}
                            <td 
                              className="px-3 py-1 border border-gray-200 align-top" 
                              style={{ width: '50px' }}
                              onClick={handleCheckboxClick}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProperties.includes(property._id)}
                                onChange={() => handleSelectProperty(property._id)}
                                onClick={handleCheckboxClick}
                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              />
                            </td>
                            
                            {/* Expand/Collapse button */}
                            <td className="px-1 py-1 border border-gray-200 align-top text-center"
                                style={{ width: '40px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedRow(expandedRow === property._id ? null : property._id);
                                }}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {expandedRow === property._id ? (
                                  <FaChevronUp className="text-gray-600 text-xs" />
                                ) : (
                                  <FaChevronDown className="text-gray-600 text-xs" />
                                )}
                              </button>
                            </td>
                            
                            {/* Property Code */}
                            <td 
                              className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ width: `${columnWidths.code}px` }}
                              title={property.propertyCode}
                            >
                              {property.propertyCode}
                            </td>
                            
                            {/* Property Name */}
                            <td 
                              className="px-3 py-1 text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ width: `${columnWidths.name}px` }}
                              title={property.propertyName}
                            >
                              {property.propertyName}
                            </td>
                            
                            {/* Landlord */}
                            <td 
                              className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ width: `${columnWidths.landlord}px` }}
                              title={getPrimaryLandlord(property.landlords)}
                            >
                              {getPrimaryLandlord(property.landlords)}
                            </td>
                            
                            {/* Category */}
                            <td 
                              className="px-3 py-1 border border-gray-200 align-top"
                              style={{ width: `${columnWidths.category}px` }}
                            >
                              <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-bold whitespace-nowrap ${getCategoryColor(property.category)}`}>
                                {property.category || 'N/A'}
                              </span>
                            </td>
                            
                            {/* Zone */}
                            <td 
                              className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ width: `${columnWidths.zone}px` }}
                              title={property.zoneRegion}
                            >
                              {property.zoneRegion || 'N/A'}
                            </td>
                            
                            {/* Location */}
                            <td 
                              className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ width: `${columnWidths.location}px` }}
                              title={getFullAddress(property)}
                            >
                              {getFullAddress(property)}
                            </td>
                            
                            {/* Total Units */}
                            <td 
                              className="px-3 py-1 text-center font-bold text-gray-900 border border-gray-200 align-top"
                              style={{ width: `${columnWidths.totalUnits}px` }}
                            >
                              {property.totalUnits || 0}
                            </td>
                            
                            {/* Occupied Units */}
                            <td 
                              className="px-3 py-1 text-center border border-gray-200 align-top"
                              style={{ width: `${columnWidths.occupiedUnits}px` }}
                            >
                              <span className="font-bold text-green-700">{property.occupiedUnits || 0}</span>
                            </td>
                            
                            {/* Vacant Units */}
                            <td 
                              className="px-3 py-1 text-center border border-gray-200 align-top"
                              style={{ width: `${columnWidths.vacantUnits}px` }}
                            >
                              <span className="font-bold text-red-700">{property.vacantUnits || 0}</span>
                            </td>
                            
                            {/* Unit Measurement */}
                            <td 
                              className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                              style={{ width: `${columnWidths.area}px` }}
                            >
                              Sq Meter
                            </td>
                            
                            {/* Gross Area */}
                            <td 
                              className="px-3 py-1 text-right font-bold text-gray-900 border border-gray-200 align-top"
                              style={{ width: `${columnWidths.grossArea}px` }}
                            >
                              {property.grossArea || '0'}
                            </td>
                            
                            {/* Net Area */}
                            <td 
                              className="px-3 py-1 text-right font-bold text-gray-900 border border-gray-200 align-top"
                              style={{ width: `${columnWidths.netArea}px` }}
                            >
                              {property.netArea || '0'}
                            </td>
                            
                            {/* Field Officer */}
                            <td 
                              className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                              style={{ width: `${columnWidths.fieldOfficer}px` }}
                              title={property.fieldOfficer}
                            >
                              {property.fieldOfficer || 'N/A'}
                            </td>
                            
                            {/* Date Acquired */}
                            <td 
                              className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                              style={{ width: `${columnWidths.dateAcquired}px` }}
                            >
                              {formatDate(property.dateAcquired)}
                            </td>
                            
                            {/* Status */}
                            <td 
                              className="px-3 py-1 border border-gray-200 align-top"
                              style={{ width: `${columnWidths.status}px` }}
                            >
                              <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-bold whitespace-nowrap ${getStatusColor(property.status)}`}>
                                {property.status || 'N/A'}
                              </span>
                            </td>
                          </tr>
                          
                          {/* Expanded row details */}
                          {expandedRow === property._id && (
                            <tr className={`${getRowClass(index)}`}>
                              <td colSpan={columns.length + 2} className="p-4 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {/* Property Details */}
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Property Details</h4>
                                    <div>
                                      <span className="text-xs text-gray-500">Property Type:</span>
                                      <p className="text-sm font-medium">{property.propertyType || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Specification:</span>
                                      <p className="text-sm font-medium">{property.specification || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Floors:</span>
                                      <p className="text-sm font-medium">{property.numberOfFloors || '0'}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">LR Number:</span>
                                      <p className="text-sm font-medium">{property.lrNumber || 'N/A'}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Financial Details */}
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Financial Details</h4>
                                    <div>
                                      <span className="text-xs text-gray-500">Let/Manage:</span>
                                      <p className="text-sm font-medium">{property.letManage || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Account Ledger:</span>
                                      <p className="text-sm font-medium">{property.accountLedgerType || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Invoice Prefix:</span>
                                      <p className="text-sm font-medium">{property.invoicePrefix || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">M-Pesa Paybill:</span>
                                      <p className="text-sm font-medium">{property.mpesaPaybill ? 'Yes' : 'No'}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Contact Details */}
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Contact Details</h4>
                                    {property.landlords && property.landlords.length > 0 ? (
                                      property.landlords.map((landlord, idx) => (
                                        <div key={idx} className="mb-2">
                                          <p className="text-sm font-medium">
                                            {landlord.name} {landlord.isPrimary && '(Primary)'}
                                          </p>
                                          {landlord.contact && (
                                            <p className="text-xs text-gray-600">{landlord.contact}</p>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-gray-500">No landlords added</p>
                                    )}
                                    {property.specificContactInfo && (
                                      <div>
                                        <span className="text-xs text-gray-500">Additional Contact:</span>
                                        <p className="text-sm font-medium">{property.specificContactInfo}</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Actions */}
                                  <div className="space-y-3">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Actions</h4>
                                    <div className="flex flex-wrap gap-2 action-buttons">
                                      <Link to={`/properties/${property._id}`}>
                                        <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full">
                                          <FaEye /> View Details
                                        </button>
                                      </Link>
                                      <Link to={`/properties/edit/${property._id}`}>
                                        <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors w-full">
                                          <FaEdit /> Edit Property
                                        </button>
                                      </Link>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowDeleteConfirm(property._id);
                                        }}
                                        className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors w-full"
                                      >
                                        <FaTrash /> Delete Property
                                      </button>
                                    </div>
                                    
                                    {/* Quick Stats */}
                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                      <h4 className="font-bold text-gray-800 text-sm mb-2">Quick Stats</h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-blue-50 p-2 rounded">
                                          <p className="text-xs text-gray-600">Occupancy Rate</p>
                                          <p className="text-sm font-bold">
                                            {property.totalUnits > 0 
                                              ? `${Math.round((property.occupiedUnits / property.totalUnits) * 100)}%`
                                              : '0%'}
                                          </p>
                                        </div>
                                        <div className="bg-green-50 p-2 rounded">
                                          <p className="text-xs text-gray-600">Vacancy Rate</p>
                                          <p className="text-sm font-bold">
                                            {property.totalUnits > 0 
                                              ? `${Math.round((property.vacantUnits / property.totalUnits) * 100)}%`
                                              : '0%'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      // Empty state row
                      <tr>
                        <td 
                          colSpan={columns.length + 2}
                          className="px-3 py-4 text-center text-gray-500 border border-gray-200"
                          style={{ backgroundColor: '#dfebed' }}
                        >
                          <div className="flex flex-col items-center justify-center py-8">
                            <FaBuilding className="text-4xl text-gray-300 mb-4" />
                            <div className="text-lg font-bold text-gray-400 mb-2">No properties found</div>
                            <div className="text-sm text-gray-500 mb-4">
                              {searchTerm || filters.status || filters.zone || filters.category
                                ? 'Try adjusting your search or filters'
                                : 'Get started by adding your first property'}
                            </div>
                            <Link to="/properties/add">
                              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                Add New Property
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer with pagination */}
        {!loading && properties && properties.length > 0 && (
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between mt-2 px-1 py-2 border-t border-gray-200 bg-white">
              <div className="text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="font-bold">
                    Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                    <span className="font-bold">{Math.min(currentPage * itemsPerPage, pagination?.total || 0)}</span> of{' '}
                    <span className="font-bold">{pagination?.total || 0}</span> properties
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
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                          onClick={() => setCurrentPage(page)}
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
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                >
                  Next
                  <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Property
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resizing overlay */}
        {isResizing && (
          <div className="fixed inset-0 z-50 cursor-col-resize" style={{ cursor: 'col-resize' }} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Properties;