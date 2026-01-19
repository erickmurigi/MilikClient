// pages/Landlords.js
import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaFilter, FaDownload, FaSearch, FaEdit, FaTrash, FaEye,
  FaEllipsisH, FaFileExport, FaChevronLeft, FaChevronRight, FaGripVertical,
  FaTimes, FaSave, FaPaperclip, FaDownload as FaDownloadIcon, FaTrashAlt
} from 'react-icons/fa';

const Landlords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLandlords, setSelectedLandlords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [showAddLandlordModal, setShowAddLandlordModal] = useState(false);
  
  // Form state for the modal
  const [formData, setFormData] = useState({
    landlordCode: '',
    landlordType: 'Individual',
    landlordName: '',
    regId: '',
    taxPin: '',
    postalAddress: '',
    email: '',
    phoneNumber: '',
    location: ''
  });

  const [attachments, setAttachments] = useState([]);
  
  const columnWidths = useState({
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
  })[0];
  
  const resizingRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 10;
  const fileInputRef = useRef(null);

  // Sample landlords data (same as before)
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
  
    { key: 'code', label: 'Landlord Code' },
    { key: 'name', label: 'Landlord Name' },
   
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
      
      // Note: columnWidths is not a state variable in this version
      // You may want to convert it to state if you need dynamic resizing
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleAddLandlordSubmit = (e) => {
    e.preventDefault();
    console.log('Adding landlord:', formData);
    console.log('Attachments:', attachments);
    // Here you would typically make an API call to add the landlord
    // For now, we'll just close the modal and reset the form
    setShowAddLandlordModal(false);
    // Reset form
    setFormData({
      landlordCode: '',
      landlordType: 'Individual',
      landlordName: '',
      regId: '',
      taxPin: '',
      postalAddress: '',
      email: '',
      phoneNumber: '',
      location: ''
    });
    setAttachments([]);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      dateTime: new Date().toLocaleString(),
      file: file
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle attachment download
  const handleDownload = (attachment) => {
    // Create a download link
    const url = URL.createObjectURL(attachment.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle attachment delete
  const handleDeleteAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-[#a5c9b7]">
        {/* Search and Filters Row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {/* Filter dropdowns */}
          <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-[#a1e6c3] shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
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
          <button 
            onClick={() => setShowAddLandlordModal(true)}
            className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
          >
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
        <div className="bg-[#a5c9b7] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table 
              className="min-w-full text-xs border-collapse bg-[#a5c9b7] border border-gray-200"
              ref={tableRef}
              style={{ tableLayout: 'fixed' }}
            >
              {/* Table header */}
              <thead>
                <tr className="bg-[#a5c9b7]">
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
              
              {/* Table body */}
              <tbody>
                {currentLandlords.map((landlord, index) => (
                  <tr 
                    key={landlord.id}
                    className={`hover:bg-white-100 hover:text-black bg-[#a5c9b7] cursor-pointer transition-colors duration-150 ${getRowClass(index)}`}
                  >
                    <td 
                      className="px-3 py-1 border  bg-[#a5c9b7] border-gray-200 align-top" 
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
                    
                    {/* Table cells for each column */}
                    
                    <td className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                      {landlord.code}
                    </td>
                    <td className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                      {landlord.name}
                    </td>
                    
                    <td className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                      {landlord.regId}
                    </td>
                    <td className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                      {landlord.address}
                    </td>
                    <td className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                      {landlord.location}
                    </td>
                    <td className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                      {landlord.email}
                    </td>
                    <td className="px-3 py-1 bg-[#a5c9b7] font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                      {landlord.phone}
                    </td>
                    <td className="px-3 py-1 bg-[#a5c9b7] text-center font-bold text-gray-900 border border-gray-200 align-top">
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium border border-green-200">
                        {landlord.activeProperties}
                      </span>
                    </td>
                    <td className="px-3 py-1  bg-[#a5c9b7] text-center font-bold text-gray-900 border border-gray-200 align-top">
                      <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                        {landlord.archivedProperties}
                      </span>
                    </td>
                    <td className="px-3 py-1 bg-[#a5c9b7] border border-gray-200 align-top">
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

        {/* Add Landlord Modal */}
        {showAddLandlordModal && (
          <div className="fixed inset-0 bg-black/50
  backdrop-blur-md
  backdrop-saturate-300 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Add New Landlord</h2>
                  <p className="text-xs text-gray-600">Fill in the landlord details below</p>
                </div>
                <button
                  onClick={() => setShowAddLandlordModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleAddLandlordSubmit}>
                  {/* Section: General Information */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b">General Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Landlord Code
                        </label>
                        <input
                          type="text"
                          name="landlordCode"
                          value={formData.landlordCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., LL001"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Landlord Type *
                        </label>
                        <select
                          name="landlordType"
                          value={formData.landlordType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        >
                          <option value="Individual">Individual</option>
                          <option value="Company">Company</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Trust">Trust</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Landlord Name *
                        </label>
                        <input
                          type="text"
                          name="landlordName"
                          value={formData.landlordName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Enter landlord name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Reg/ID NO. *
                        </label>
                        <input
                          type="text"
                          name="regId"
                          value={formData.regId}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="ID number or registration number"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tax/PIN NO. *
                        </label>
                        <input
                          type="text"
                          name="taxPin"
                          value={formData.taxPin}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., A123456789X"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Section: Address Information */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b">Address Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Postal Address
                        </label>
                        <input
                          type="text"
                          name="postalAddress"
                          value={formData.postalAddress}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Physical or postal address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Email address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="+254 XXX XXX XXX"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g., Nairobi CBD, Westlands, etc."
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Section: Attachments */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b">Attachments</h3>
                    
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                      >
                        <FaPaperclip className="text-xs" />
                        Add
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setAttachments([])}
                        className="px-4 py-2 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      >
                        <FaTrashAlt className="text-xs" />
                        Delete All
                      </button>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple
                      />
                    </div>
                    
                    {/* Attachments Table */}
                    {attachments.length > 0 ? (
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Name</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Size</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Date & Time</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attachments.map((attachment) => (
                              <tr key={attachment.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border-b">{attachment.name}</td>
                                <td className="px-3 py-2 border-b">{attachment.size}</td>
                                <td className="px-3 py-2 border-b">{attachment.dateTime}</td>
                                <td className="px-3 py-2 border-b">
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleDownload(attachment)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Download"
                                    >
                                      <FaDownloadIcon />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAttachment(attachment.id)}
                                      className="text-red-600 hover:text-red-800"
                                      title="Delete"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm border border-gray-200 rounded-lg">
                        No attachments added yet
                      </div>
                    )}
                  </div>
                  
                  {/* Section Heading */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800">LANDLORD DETAILS</h3>
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
                    onClick={() => setShowAddLandlordModal(false)}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset form logic
                      setFormData({
                        landlordCode: '',
                        landlordType: 'Individual',
                        landlordName: '',
                        regId: '',
                        taxPin: '',
                        postalAddress: '',
                        email: '',
                        phoneNumber: '',
                        location: ''
                      });
                      setAttachments([]);
                    }}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddLandlordSubmit}
                    className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave /> Save Landlord
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

export default Landlords;