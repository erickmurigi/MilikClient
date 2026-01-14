// pages/Landlords.js
import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaChevronLeft, FaChevronRight, FaGripVertical
} from 'react-icons/fa';

const Landlords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLandlords, setSelectedLandlords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [columnWidths, setColumnWidths] = useState({
    id: 80,
    code: 100,
    name: 180,
    pin: 120,
    regId: 140,
    address: 180,
    location: 150,
    email: 180,
    phone: 140,
    active: 100,
    archived: 100,
    portal: 120,
  });
  
  const resizingRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 10;

  // Sample landlords data matching the provided structure
  const landlords = [
    {
      id: 1,
      code: 'LL001',
      name: 'Anna Wangari',
      pin: 'A123456789X',
      regId: 'ID12345678',
      address: '123 Moi Avenue, Nairobi',
      location: 'Nairobi CBD',
      email: 'anna.wangari@email.com',
      phone: '+254 712 345 678',
      activeProperties: '5',
      archivedProperties: '2',
      portalAccess: 'Enabled'
    },
    {
      id: 2,
      code: 'LL002',
      name: 'ARDHI Holdings Ltd',
      pin: 'B987654321Y',
      regId: 'B123456789',
      address: 'Mombasa Road, Nairobi',
      location: 'Mombasa Road',
      email: 'info@ardhiholdings.co.ke',
      phone: '+254 720 987 654',
      activeProperties: '12',
      archivedProperties: '3',
      portalAccess: 'Enabled'
    },
    {
      id: 3,
      code: 'LL003',
      name: 'Stan Group Holdings',
      pin: 'C456789123Z',
      regId: 'PP45678912',
      address: 'Kilimani Road, Nairobi',
      location: 'Kilimani',
      email: 'contact@stangroup.com',
      phone: '+254 733 456 789',
      activeProperties: '8',
      archivedProperties: '1',
      portalAccess: 'Disabled'
    },
    {
      id: 4,
      code: 'LL004',
      name: 'Andrew Kamau Enterprises',
      pin: 'D321654987W',
      regId: 'ID98765432',
      address: 'Kiambu Road, Thika',
      location: 'Thika',
      email: 'andrew@kamauenterprises.com',
      phone: '+254 711 222 333',
      activeProperties: '7',
      archivedProperties: '0',
      portalAccess: 'Enabled'
    },
    {
      id: 5,
      code: 'LL005',
      name: 'Allan Nyerere Properties',
      pin: 'E555666777X',
      regId: 'PP11223344',
      address: 'Oginga Odinga Street, Kisumu',
      location: 'Kisumu CBD',
      email: 'allan@nyerereproperties.co.ke',
      phone: '+254 722 333 444',
      activeProperties: '4',
      archivedProperties: '1',
      portalAccess: 'Enabled'
    },
    {
      id: 6,
      code: 'LL006',
      name: 'Joe Huid Real Estate',
      pin: 'F999888777Z',
      regId: 'ID55667788',
      address: 'Kenyatta Avenue, Nakuru',
      location: 'Nakuru',
      email: 'joe@huidrealestate.com',
      phone: '+254 733 444 555',
      activeProperties: '9',
      archivedProperties: '2',
      portalAccess: 'Enabled'
    },
    {
      id: 7,
      code: 'LL007',
      name: 'CID Properties Ltd',
      pin: 'G777888999A',
      regId: 'CID123456',
      address: 'Uganda Road, Eldoret',
      location: 'Eldoret',
      email: 'info@cidproperties.com',
      phone: '+254 744 555 666',
      activeProperties: '6',
      archivedProperties: '1',
      portalAccess: 'Disabled'
    },
    {
      id: 8,
      code: 'LL008',
      name: 'Eddah Wanjiru Investments',
      pin: 'H111222333B',
      regId: 'ID33445566',
      address: 'Upper Hill, Nairobi',
      location: 'Upper Hill',
      email: 'eddah@wanjiruinvestments.com',
      phone: '+254 755 666 777',
      activeProperties: '15',
      archivedProperties: '4',
      portalAccess: 'Enabled'
    },
    {
      id: 9,
      code: 'LL009',
      name: 'Cal Investments Group',
      pin: 'I444555666C',
      regId: 'CAL001122',
      address: 'Mwingi Road, Kitui',
      location: 'Kitui',
      email: 'contact@calinvestments.com',
      phone: '+254 766 777 888',
      activeProperties: '3',
      archivedProperties: '0',
      portalAccess: 'Enabled'
    },
    {
      id: 10,
      code: 'LL010',
      name: 'Edwin Ruto Holdings',
      pin: 'J777666555D',
      regId: 'ID77889900',
      address: 'Nairobi-Mombasa Highway, Machakos',
      location: 'Machakos',
      email: 'info@edwinrutoholdings.com',
      phone: '+254 777 888 999',
      activeProperties: '11',
      archivedProperties: '2',
      portalAccess: 'Enabled'
    },
    {
      id: 11,
      code: 'LL011',
      name: 'Prime Real Estate Ltd',
      pin: 'K222333444E',
      regId: 'PRIME001',
      address: 'Westlands, Nairobi',
      location: 'Westlands',
      email: 'sales@primerealestate.co.ke',
      phone: '+254 788 999 000',
      activeProperties: '18',
      archivedProperties: '5',
      portalAccess: 'Enabled'
    },
    {
      id: 12,
      code: 'LL012',
      name: 'Heritage Properties',
      pin: 'L888999000F',
      regId: 'HER001122',
      address: 'Karen Road, Nairobi',
      location: 'Karen',
      email: 'admin@heritageproperties.com',
      phone: '+254 799 000 111',
      activeProperties: '14',
      archivedProperties: '3',
      portalAccess: 'Disabled'
    }
  ];

  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'code', label: 'Landlord Code' },
    { key: 'name', label: 'Landlord Name' },
    { key: 'pin', label: 'PIN No.' },
    { key: 'regId', label: 'Reg No./ID/PPT #' },
    { key: 'address', label: 'Address' },
    { key: 'location', label: 'Location' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Nos.' },
    { key: 'active', label: 'Active Properties' },
    { key: 'archived', label: 'Archived Properties' },
    { key: 'portal', label: 'Portal Access' }
  ];

  const handleSelectLandlord = (id) => {
    setSelectedLandlords(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLandlords([]);
    } else {
      setSelectedLandlords(landlords.map(l => l.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  // Fixed column resizing handlers
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

  // Function to apply zebra striping pattern
  const getRowClass = (index) => {
    return index % 2 === 0 
      ? 'bg-white hover:bg-gray-50' 
      : 'bg-gray-50 hover:bg-gray-100';
  };

  // Pagination logic
  const totalPages = Math.ceil(landlords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLandlords = landlords.slice(startIndex, endIndex);

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
            <option>Landlord Code</option>
            <option>Landlord Name</option>
            <option>PIN No.</option>
            <option>Location</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Portal Access</option>
            <option>Enabled</option>
            <option>Disabled</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Properties Count</option>
            <option>1-5 Properties</option>
            <option>6-10 Properties</option>
            <option>10+ Properties</option>
          </select>

          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
            <option>Location</option>
            <option>Nairobi CBD</option>
            <option>Mombasa Road</option>
            <option>Kilimani</option>
            <option>Westlands</option>
            <option>Karen</option>
          </select>

          {/* Search input */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search landlords..."
              className="w-full pl-10 pr-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <button className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
            <FaPlus className="text-xs" />
            <span>Add Landlord</span>
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

        {/* Boxed Table Design with adjustable columns */}
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
                {currentLandlords.map((landlord, index) => (
                  <tr 
                    key={landlord.id}
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
                        checked={selectedLandlords.includes(landlord.id)}
                        onChange={() => handleSelectLandlord(landlord.id)}
                        onClick={handleCheckboxClick}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    
                    {/* Id */}
                    <td 
                      className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top text-center"
                      style={{ width: `${columnWidths.id}px` }}
                    >
                      {landlord.id}
                    </td>
                    
                    {/* Landlord Code */}
                    <td 
                      className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.code}px` }}
                      title={landlord.code}
                    >
                      {landlord.code}
                    </td>
                    
                    {/* Landlord Name */}
                    <td 
                      className="px-3 py-1 text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.name}px` }}
                      title={landlord.name}
                    >
                      {landlord.name}
                    </td>
                    
                    {/* PIN No. */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.pin}px` }}
                      title={landlord.pin}
                    >
                      {landlord.pin}
                    </td>
                    
                    {/* Reg No./ID/PPT # */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.regId}px` }}
                      title={landlord.regId}
                    >
                      {landlord.regId}
                    </td>
                    
                    {/* Address */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.address}px` }}
                      title={landlord.address}
                    >
                      {landlord.address}
                    </td>
                    
                    {/* Location */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.location}px` }}
                      title={landlord.location}
                    >
                      {landlord.location}
                    </td>
                    
                    {/* Email */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.email}px` }}
                      title={landlord.email}
                    >
                      {landlord.email}
                    </td>
                    
                    {/* Phone Nos. */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.phone}px` }}
                      title={landlord.phone}
                    >
                      {landlord.phone}
                    </td>
                    
                    {/* Active Properties */}
                    <td 
                      className="px-3 py-1 text-center font-medium text-gray-900 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.active}px` }}
                    >
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium border border-green-200">
                        {landlord.activeProperties}
                      </span>
                    </td>
                    
                    {/* Archived Properties */}
                    <td 
                      className="px-3 py-1 text-center font-medium text-gray-900 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.archived}px` }}
                    >
                      <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                        {landlord.archivedProperties}
                      </span>
                    </td>
                    
                    {/* Portal Access */}
                    <td 
                      className="px-3 py-1 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.portal}px` }}
                    >
                      <span className={`inline-flex items-center px-2 py-0 rounded text-xs font-medium whitespace-nowrap ${
                        landlord.portalAccess === 'Enabled'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}>
                        {landlord.portalAccess}
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
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, landlords.length)}</span> of <span className="font-medium">{landlords.length}</span> landlords
              </span>
              {selectedLandlords.length > 0 && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-200">
                  {selectedLandlords.length} selected
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

export default Landlords;