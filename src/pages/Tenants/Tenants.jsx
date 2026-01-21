// pages/Tenants.js
import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaSearch, FaEllipsisH, FaFileExport, 
  FaChevronLeft, FaChevronRight, FaGripVertical,
  FaFile, FaPaperclip, FaTimes, FaSave
} from 'react-icons/fa';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  
  // Form state for the modal
  const [formData, setFormData] = useState({
    accountNumber: '',
    tenantType: 'Individual',
    surname: '',
    otherNames: '',
    gender: '',
    idNo: '',
    taxPin: '',
    postalAddress: '',
    email: '',
    postalCode: '',
    town: 'NAIROBI',
    mobileNumber: '',
    verifyMobileNumber: '',
    country: 'Kenya',
    emergencyContactName1: '',
    emergencyPhone1: '',
    emergencyRelationship1: '',
    emergencyEmail1: '',
    emergencyContactName2: '',
    emergencyPhone2: '',
    emergencyRelationship2: '',
    emergencyEmail2: ''
  });
  
  const [columnWidths, setColumnWidths] = useState({
    tntId: 100,
    lseId: 100,
    unitNo: 90,
    acNo: 120,
    tenantName: 160,
    acBal: 120,
    phone: 130,
    rent: 200,
    leaseType: 140,
    paymentFreq: 120,
    leaseStart: 110,
    leaseEnd: 110,
    leaseTerm: 100,
    daysToExpire: 120,
    property: 150,
    email: 180,
    attachedFiles: 120,
  });
  
  const resizingRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 50; // Changed to 50 per page

  // Sample tenants data (same as before)
  const tenants = [
    {
      id: 1,
      tntId: 'TNT001',
      lseId: 'LSE001',
      unitNo: 'A-101',
      acNo: 'ACC001',
      tenantName: 'John Kamau',
      acBal: '15,000',
      phone: '+254 712 345 678',
      rent: '25,000',
      leaseType: 'Residential',
      paymentFreq: 'Monthly',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      leaseTerm: '1 Year',
      daysToExpire: 45,
      property: 'KITUI HEIGHTS RESIDENTIAL COMPLEX',
      email: 'john.kamau@email.com',
      attachedFiles: 3
    },
    {
      id: 2,
      tntId: 'TNT002',
      lseId: 'LSE002',
      unitNo: 'B-205',
      acNo: 'ACC002',
      tenantName: 'Sarah Wanjiku',
      acBal: '0',
      phone: '+254 723 456 789',
      rent: '45,000',
      leaseType: 'Commercial',
      paymentFreq: 'Quarterly',
      leaseStart: '2023-06-01',
      leaseEnd: '2024-05-31',
      leaseTerm: '2 Years',
      daysToExpire: 120,
      property: 'ARDHI HOUSE COMMERCIAL CENTER',
      email: 'sarah.wanjiku@company.com',
      attachedFiles: 5
    },
    {
      id: 3,
      tntId: 'TNT003',
      lseId: 'LSE003',
      unitNo: 'C-301',
      acNo: 'ACC003',
      tenantName: 'Mike Johnson',
      acBal: '-5,000',
      phone: '+254 734 567 890',
      rent: '30,000',
      leaseType: 'Mixed Use',
      paymentFreq: 'Monthly',
      leaseStart: '2024-02-15',
      leaseEnd: '2025-02-14',
      leaseTerm: '1 Year',
      daysToExpire: 380,
      property: 'BASIL TOWERS MIXED-USE DEVELOPMENT',
      email: 'mike.johnson@tech.com',
      attachedFiles: 2
    },
    {
      id: 4,
      tntId: 'TNT004',
      lseId: 'LSE004',
      unitNo: 'SH-012',
      acNo: 'ACC004',
      tenantName: 'Tech Solutions Ltd',
      acBal: '120,000',
      phone: '+254 745 678 901',
      rent: '85,000',
      leaseType: 'Commercial',
      paymentFreq: 'Annually',
      leaseStart: '2023-01-01',
      leaseEnd: '2025-12-31',
      leaseTerm: '3 Years',
      daysToExpire: 720,
      property: 'BLESSING MALL SHOPPING CENTER',
      email: 'accounts@techsolutions.co.ke',
      attachedFiles: 8
    },
    {
      id: 5,
      tntId: 'TNT005',
      lseId: 'LSE005',
      unitNo: 'OF-501',
      acNo: 'ACC005',
      tenantName: 'Legal Partners Advocates',
      acBal: '0',
      phone: '+254 756 789 012',
      rent: '120,000',
      leaseType: 'Commercial',
      paymentFreq: 'Monthly',
      leaseStart: '2024-03-01',
      leaseEnd: '2026-02-28',
      leaseTerm: '2 Years',
      daysToExpire: 430,
      property: 'BLUE SKY PLAZA OFFICE BUILDING',
      email: 'info@legalpartners.co.ke',
      attachedFiles: 4
    },
    {
      id: 6,
      tntId: 'TNT006',
      lseId: 'LSE006',
      unitNo: 'APT-306',
      acNo: 'ACC006',
      tenantName: 'Grace Achieng',
      acBal: '8,500',
      phone: '+254 767 890 123',
      rent: '18,000',
      leaseType: 'Residential',
      paymentFreq: 'Monthly',
      leaseStart: '2024-01-15',
      leaseEnd: '2024-12-14',
      leaseTerm: '11 Months',
      daysToExpire: 30,
      property: 'CAMON COURT APARTMENT COMPLEX',
      email: 'grace.achieng@email.com',
      attachedFiles: 1
    },
    {
      id: 7,
      tntId: 'TNT007',
      lseId: 'LSE007',
      unitNo: 'B-107',
      acNo: 'ACC007',
      tenantName: 'David Omondi',
      acBal: '0',
      phone: '+254 778 901 234',
      rent: '22,000',
      leaseType: 'Residential',
      paymentFreq: 'Monthly',
      leaseStart: '2024-04-01',
      leaseEnd: '2025-03-31',
      leaseTerm: '1 Year',
      daysToExpire: 330,
      property: 'CID APARTMENTS RESIDENTIAL BLOCK',
      email: 'david.omondi@email.com',
      attachedFiles: 2
    },
    {
      id: 8,
      tntId: 'TNT008',
      lseId: 'LSE008',
      unitNo: 'SUITE-800',
      acNo: 'ACC008',
      tenantName: 'Global Finance Bank',
      acBal: '450,000',
      phone: '+254 789 012 345',
      rent: '300,000',
      leaseType: 'Commercial',
      paymentFreq: 'Quarterly',
      leaseStart: '2022-07-01',
      leaseEnd: '2027-06-30',
      leaseTerm: '5 Years',
      daysToExpire: 1200,
      property: 'CITE TOWERS OFFICE COMPLEX',
      email: 'facilities@globalfinancebank.com',
      attachedFiles: 12
    },
    {
      id: 9,
      tntId: 'TNT009',
      lseId: 'LSE009',
      unitNo: 'M-209',
      acNo: 'ACC009',
      tenantName: 'Restaurant Delight',
      acBal: '-12,000',
      phone: '+254 790 123 456',
      rent: '65,000',
      leaseType: 'Mixed Use',
      paymentFreq: 'Monthly',
      leaseStart: '2024-02-01',
      leaseEnd: '2025-01-31',
      leaseTerm: '1 Year',
      daysToExpire: 350,
      property: 'DFGH COMPLEX MIXED-USE BUILDING',
      email: 'info@restaurantdelight.com',
      attachedFiles: 6
    },
    {
      id: 10,
      tntId: 'TNT010',
      lseId: 'LSE010',
      unitNo: 'A-503',
      acNo: 'ACC010',
      tenantName: 'Mary Wambui',
      acBal: '0',
      phone: '+254 701 234 567',
      rent: '20,000',
      leaseType: 'Residential',
      paymentFreq: 'Monthly',
      leaseStart: '2024-05-01',
      leaseEnd: '2025-04-30',
      leaseTerm: '1 Year',
      daysToExpire: 390,
      property: 'EDWIN RESIDENCE APARTMENT BLOCK',
      email: 'mary.wambui@email.com',
      attachedFiles: 3
    }
    // Add more tenants for pagination demonstration
  ];

  // Add more tenants to make it 50+ for pagination demonstration
  for (let i = 11; i <= 60; i++) {
    const leaseTypes = ['Residential', 'Commercial', 'Mixed Use'];
    const paymentFreqs = ['Monthly', 'Quarterly', 'Annually'];
    const properties = [
      'KITUI HEIGHTS RESIDENTIAL COMPLEX',
      'ARDHI HOUSE COMMERCIAL CENTER',
      'BASIL TOWERS MIXED-USE DEVELOPMENT',
      'BLESSING MALL SHOPPING CENTER',
      'BLUE SKY PLAZA OFFICE BUILDING',
      'CAMON COURT APARTMENT COMPLEX',
      'CID APARTMENTS RESIDENTIAL BLOCK',
      'CITE TOWERS OFFICE COMPLEX',
      'DFGH COMPLEX MIXED-USE BUILDING',
      'EDWIN RESIDENCE APARTMENT BLOCK'
    ];
    
    tenants.push({
      id: i,
      tntId: `TNT${String(i).padStart(3, '0')}`,
      lseId: `LSE${String(i).padStart(3, '0')}`,
      unitNo: `U-${Math.floor(Math.random() * 500) + 100}`,
      acNo: `ACC${String(i).padStart(3, '0')}`,
      tenantName: `Tenant ${i} Name`,
      acBal: `${(Math.random() > 0.5 ? '-' : '')}${Math.floor(Math.random() * 50000)}`,
      phone: `+254 7${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      rent: `${Math.floor(Math.random() * 300000) + 10000}`,
      leaseType: leaseTypes[Math.floor(Math.random() * leaseTypes.length)],
      paymentFreq: paymentFreqs[Math.floor(Math.random() * paymentFreqs.length)],
      leaseStart: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
      leaseEnd: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-28`,
      leaseTerm: `${Math.floor(Math.random() * 5) + 1} Year${Math.floor(Math.random() * 5) + 1 > 1 ? 's' : ''}`,
      daysToExpire: Math.floor(Math.random() * 365) + 1,
      property: properties[Math.floor(Math.random() * properties.length)],
      email: `tenant${i}@example.com`,
      attachedFiles: Math.floor(Math.random() * 10)
    });
  }

  const columns = [
    { key: 'tntId', label: 'Tnt Id' },
    { key: 'lseId', label: 'Lse Id' },
    { key: 'unitNo', label: 'Unit No.' },
    { key: 'acNo', label: 'Ac/No./Code' },
    { key: 'tenantName', label: 'Tenant Name' },
    { key: 'acBal', label: 'A/c Bal. (Kshs)' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'rent', label: 'Rent .Ksh' },
    { key: 'leaseType', label: 'Lease Variation Type' },
    { key: 'paymentFreq', label: 'Payment Frequency' },
    { key: 'leaseStart', label: 'Lease Start' },
    { key: 'leaseEnd', label: 'Lease End' },
    { key: 'leaseTerm', label: 'Lease Term' },
    { key: 'daysToExpire', label: 'Days To Expire' },
    { key: 'property', label: 'Property' },
    { key: 'email', label: 'Email' },
    { key: 'attachedFiles', label: 'Attached Files' }
  ];

  const handleSelectTenant = (id) => {
    setSelectedTenants(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(tenants.map(t => t.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  // Column resizing handler
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
      ? 'bg-[#a5c9b7] hover:bg-[#94bba9]' 
      : 'bg-[#b4d4c6] hover:bg-[#a3c2b5]';
  };

  // Function to determine account balance color
  const getBalanceColor = (balance) => {
    if (balance.startsWith('-')) {
      return 'text-red-700 bg-red-100 border-red-300';
    } else if (parseFloat(balance.replace(/,/g, '')) > 0) {
      return 'text-orange-700 bg-orange-100 border-orange-300';
    }
    return 'text-green-700 bg-green-100 border-green-300';
  };

  // Function to determine days to expire color
  const getDaysToExpireColor = (days) => {
    if (days <= 30) {
      return 'text-red-700 bg-red-100 border-red-300';
    } else if (days <= 90) {
      return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    }
    return 'text-green-700 bg-green-100 border-green-300';
  };

  // Pagination logic
  const totalPages = Math.ceil(tenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenants = tenants.slice(startIndex, endIndex);

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
  const handleAddTenantSubmit = (e) => {
    e.preventDefault();
    
    // Check for required fields
    const requiredFields = ['tenantType', 'surname', 'otherNames', 'idNo', 'taxPin', 'town', 'mobileNumber', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      // You can show an error message here
      return;
    }
    
    console.log('Adding tenant:', formData);
    
    // Here you would typically make an API call to add the tenant
    // For now, we'll just close the modal and reset the form
    setShowAddTenantModal(false);
    
    // Reset form
    setFormData({
      accountNumber: '',
      tenantType: 'Individual',
      surname: '',
      otherNames: '',
      gender: '',
      idNo: '',
      taxPin: '',
      postalAddress: '',
      email: '',
      postalCode: '',
      town: 'NAIROBI',
      mobileNumber: '',
      verifyMobileNumber: '',
      country: 'Kenya',
      emergencyContactName1: '',
      emergencyPhone1: '',
      emergencyRelationship1: '',
      emergencyEmail1: '',
      emergencyContactName2: '',
      emergencyPhone2: '',
      emergencyRelationship2: '',
      emergencyEmail2: ''
    });
  };

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other'];

  // Town options
  const townOptions = [
    'NAIROBI',
    'MOMBASA',
    'KISUMU',
    'NAKURU',
    'ELDORET',
    'THIKA',
    'MALINDI',
    'KITALE',
    'GARISSA',
    'KAKAMEGA'
  ];

  // Relationship options
  const relationshipOptions = [
    'Spouse',
    'Parent',
    'Sibling',
    'Child',
    'Relative',
    'Friend',
    'Colleague',
    'Other'
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-0">
        {/* Search and Filters Row */}
        <div className="flex-shrink-0 pt-1 px-2">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Filter dropdowns */}
            <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
              <option>Tenant Name</option>
              <option>Tenant ID</option>
              <option>Lease ID</option>
              <option>Unit No.</option>
            </select>

            <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
              <option>Account Balance</option>
              <option>Credit Balance</option>
              <option>Zero Balance</option>
              <option>Arrears</option>
            </select>

            <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
              <option>Lease Type</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Mixed Use</option>
            </select>

            <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
              <option>Payment Frequency</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Annually</option>
            </select>

            <select className="px-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500">
              <option>Lease Expiry</option>
              <option>Expiring in 30 days</option>
              <option>Expiring in 90 days</option>
              <option>More than 90 days</option>
            </select>

            {/* Search input */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search tenants..."
                className="w-full pl-10 pr-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <button 
              onClick={() => setShowAddTenantModal(true)}
              className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <FaPlus className="text-xs" />
              <span>Add Tenant</span>
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
        </div>

        {/* Boxed Table Design with adjustable columns */}
        <div className="flex-1 px-2 pb-2 overflow-hidden">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table 
                className="min-w-full text-xs border-collapse border border-gray-200 font-bold"
                ref={tableRef}
                style={{ 
                  tableLayout: 'fixed',
                  backgroundColor: '#a5c9b7' // Main table background
                }}
              >
                <thead>
                  <tr className="bg-[#8db6a3] sticky top-0 z-10"> {/* Darker green for header */}
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
                    
                    {/* Columns */}
                    {columns.map((column) => (
                      <th 
                        key={column.key}
                        className="relative px-3 py-1 text-left font-bold text-gray-800 border border-gray-200"
                        style={{ 
                          width: `${columnWidths[column.key]}px`,
                          minWidth: '80px',
                          position: 'relative',
                          backgroundColor: '#8db6a3' // Ensure header cells have same background
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
                  {currentTenants.length > 0 ? (
                    currentTenants.map((tenant, index) => (
                      <tr 
                        key={tenant.id}
                        className={`hover:bg-[#c7dfd3] hover:text-black cursor-pointer transition-colors duration-150 ${getRowClass(index)}`}
                      >
                        {/* Checkbox */}
                        <td 
                          className="px-3 py-1 border border-gray-200 align-top" 
                          style={{ width: '50px', minWidth: '50px', maxWidth: '50px' }}
                          onClick={handleCheckboxClick}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTenants.includes(tenant.id)}
                            onChange={() => handleSelectTenant(tenant.id)}
                            onClick={handleCheckboxClick}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        
                        {/* Render tenant cells */}
                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {tenant.tntId}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {tenant.lseId}
                        </td>
                        <td className="px-3 py-1 text-center font-bold text-gray-900 border border-gray-200 align-top">
                          {tenant.unitNo}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {tenant.acNo}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {tenant.tenantName}
                        </td>
                        <td className="px-3 py-1 text-right font-bold border border-gray-200 align-top">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getBalanceColor(tenant.acBal)}`}>
                            Ksh {tenant.acBal}
                          </span>
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {tenant.phone}
                        </td>
                        <td className="px-3 py-1 text-right font-bold text-gray-900 border border-gray-200 align-top">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs border border-blue-300">
                            {tenant.rent}
                          </span>
                        </td>
                        <td className="px-3 py-1 border border-gray-200 align-top">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
                            tenant.leaseType === 'Residential'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : tenant.leaseType === 'Commercial'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          }`}>
                            {tenant.leaseType}
                          </span>
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top text-center">
                          {tenant.paymentFreq}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap">
                          {tenant.leaseStart}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap">
                          {tenant.leaseEnd}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top text-center">
                          {tenant.leaseTerm}
                        </td>
                        <td className="px-3 py-1 text-center font-bold border border-gray-200 align-top">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getDaysToExpireColor(tenant.daysToExpire)}`}>
                            {tenant.daysToExpire} days
                          </span>
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {tenant.property}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {tenant.email}
                        </td>
                        <td className="px-3 py-1 text-center border border-gray-200 align-top">
                          <div className="flex items-center justify-center gap-1">
                            <FaPaperclip className="text-gray-600 text-xs" />
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs border border-gray-300">
                              {tenant.attachedFiles} files
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Empty state row
                    <tr>
                      <td 
                        colSpan={columns.length + 1}
                        className="px-3 py-4 text-center text-gray-500 border border-gray-200"
                        style={{ backgroundColor: '#a5c9b7' }}
                      >
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="text-lg font-bold text-gray-400 mb-2">No tenants found</div>
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
                  Showing <span className="font-bold">{startIndex + 1}</span> to <span className="font-bold">{Math.min(endIndex, tenants.length)}</span> of <span className="font-bold">{tenants.length}</span> tenants
                </span>
                {selectedTenants.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-300">
                    {selectedTenants.length} selected
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

        {/* Add Tenant Modal (keep the same as before) */}
        {showAddTenantModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Add New Tenant</h2>
                  <p className="text-xs text-gray-600">Fill in the tenant details below</p>
                </div>
                <button
                  onClick={() => setShowAddTenantModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleAddTenantSubmit}>
                  {/* Top Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Auto-generated or manual"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tenant Type *
                      </label>
                      <select
                        name="tenantType"
                        value={formData.tenantType}
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
                  </div>
                  
                  {/* Personal Information */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Surname *
                        </label>
                        <input
                          type="text"
                          name="surname"
                          value={formData.surname}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Last name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Other Name(s) *
                        </label>
                        <input
                          type="text"
                          name="otherNames"
                          value={formData.otherNames}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="First and middle names"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          ID No./REG No. *
                        </label>
                        <input
                          type="text"
                          name="idNo"
                          value={formData.idNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="National ID or Registration number"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tax PIN *
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
                  
                  {/* Addresses Section */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Addresses</h3>
                    
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
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Postal code"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Town *
                        </label>
                        <select
                          name="town"
                          value={formData.town}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        >
                          <option value="">Select Town</option>
                          {townOptions.map(town => (
                            <option key={town} value={town}>{town}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mobile Number *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                            +254
                          </span>
                          <input
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="712 345 678"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Verify Mobile Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                            +254
                          </span>
                          <input
                            type="tel"
                            name="verifyMobileNumber"
                            value={formData.verifyMobileNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Re-enter mobile number"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact 1 */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Emergency Contact/Contact Person</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName1"
                          value={formData.emergencyContactName1}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Emergency contact name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                            +254
                          </span>
                          <input
                            type="tel"
                            name="emergencyPhone1"
                            value={formData.emergencyPhone1}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Emergency phone number"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Relationship
                        </label>
                        <select
                          name="emergencyRelationship1"
                          value={formData.emergencyRelationship1}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">Select Relationship</option>
                          {relationshipOptions.map(relation => (
                            <option key={relation} value={relation}>{relation}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="emergencyEmail1"
                          value={formData.emergencyEmail1}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Emergency email address"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact 2 */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Emergency Contact/Contact Person 2</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName2"
                          value={formData.emergencyContactName2}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Secondary emergency contact"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                            +254
                          </span>
                          <input
                            type="tel"
                            name="emergencyPhone2"
                            value={formData.emergencyPhone2}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Secondary emergency phone"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Relationship
                        </label>
                        <select
                          name="emergencyRelationship2"
                          value={formData.emergencyRelationship2}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">Select Relationship</option>
                          {relationshipOptions.map(relation => (
                            <option key={relation} value={relation}>{relation}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="emergencyEmail2"
                          value={formData.emergencyEmail2}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Secondary emergency email"
                        />
                      </div>
                    </div>
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
                    onClick={() => setShowAddTenantModal(false)}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset form logic
                      setFormData({
                        accountNumber: '',
                        tenantType: 'Individual',
                        surname: '',
                        otherNames: '',
                        gender: '',
                        idNo: '',
                        taxPin: '',
                        postalAddress: '',
                        email: '',
                        postalCode: '',
                        town: 'NAIROBI',
                        mobileNumber: '',
                        verifyMobileNumber: '',
                        country: 'Kenya',
                        emergencyContactName1: '',
                        emergencyPhone1: '',
                        emergencyRelationship1: '',
                        emergencyEmail1: '',
                        emergencyContactName2: '',
                        emergencyPhone2: '',
                        emergencyRelationship2: '',
                        emergencyEmail2: ''
                      });
                    }}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddTenantSubmit}
                    className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave /> Save Tenant
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

export default Tenants;