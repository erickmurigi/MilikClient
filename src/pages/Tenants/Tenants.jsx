// pages/Tenants.js
import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaPlus, FaSearch, FaEllipsisH, FaFileExport, 
  FaChevronLeft, FaChevronRight, FaGripVertical,
  FaFile, FaPaperclip
} from 'react-icons/fa';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [columnWidths, setColumnWidths] = useState({
    id: 60,
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
  const itemsPerPage = 10;

  // Sample tenants data matching the provided structure
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
    },
    {
      id: 11,
      tntId: 'TNT011',
      lseId: 'LSE011',
      unitNo: 'SH-115',
      acNo: 'ACC011',
      tenantName: 'Fashion Boutique Ltd',
      acBal: '25,000',
      phone: '+254 712 987 654',
      rent: '55,000',
      leaseType: 'Commercial',
      paymentFreq: 'Monthly',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      leaseTerm: '1 Year',
      daysToExpire: 45,
      property: 'BLESSING MALL SHOPPING CENTER',
      email: 'sales@fashionboutique.co.ke',
      attachedFiles: 4
    },
    {
      id: 12,
      tntId: 'TNT012',
      lseId: 'LSE012',
      unitNo: 'APT-412',
      acNo: 'ACC012',
      tenantName: 'Robert Kiprono',
      acBal: '3,000',
      phone: '+254 723 876 543',
      rent: '28,000',
      leaseType: 'Residential',
      paymentFreq: 'Monthly',
      leaseStart: '2024-03-15',
      leaseEnd: '2025-03-14',
      leaseTerm: '1 Year',
      daysToExpire: 380,
      property: 'KITUI HEIGHTS RESIDENTIAL COMPLEX',
      email: 'robert.kiprono@email.com',
      attachedFiles: 2
    }
  ];

  const columns = [
    { key: 'id', label: 'Id' },
    { key: 'tntId', label: 'Tnt Id' },
    { key: 'lseId', label: 'Lse Id' },
    { key: 'unitNo', label: 'Unit No.' },
    { key: 'acNo', label: 'Ac/No./Code' },
    { key: 'tenantName', label: 'Tenant Name' },
    { key: 'acBal', label: 'A/c Bal. (Kshs)' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'rent', label: 'Rent' },
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

  // Function to determine account balance color
  const getBalanceColor = (balance) => {
    if (balance.startsWith('-')) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else if (parseFloat(balance.replace(/,/g, '')) > 0) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // Function to determine days to expire color
  const getDaysToExpireColor = (days) => {
    if (days <= 30) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else if (days <= 90) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    return 'text-green-600 bg-green-50 border-green-200';
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

  return (
    <DashboardLayout>
      <div className="p-0">
        {/* Search and Filters Row */}
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
          <button className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
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
                {currentTenants.map((tenant, index) => (
                  <tr 
                    key={tenant.id}
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
                        checked={selectedTenants.includes(tenant.id)}
                        onChange={() => handleSelectTenant(tenant.id)}
                        onClick={handleCheckboxClick}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    
                    {/* Id */}
                    <td 
                      className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top text-center"
                      style={{ width: `${columnWidths.id}px` }}
                    >
                      {tenant.id}
                    </td>
                    
                    {/* Tnt Id */}
                    <td 
                      className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.tntId}px` }}
                      title={tenant.tntId}
                    >
                      {tenant.tntId}
                    </td>
                    
                    {/* Lse Id */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.lseId}px` }}
                      title={tenant.lseId}
                    >
                      {tenant.lseId}
                    </td>
                    
                    {/* Unit No. */}
                    <td 
                      className="px-3 py-1 text-center font-medium text-gray-900 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.unitNo}px` }}
                    >
                      {tenant.unitNo}
                    </td>
                    
                    {/* Ac/No./Code */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.acNo}px` }}
                      title={tenant.acNo}
                    >
                      {tenant.acNo}
                    </td>
                    
                    {/* Tenant Name */}
                    <td 
                      className="px-3 py-1 font-medium text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.tenantName}px` }}
                      title={tenant.tenantName}
                    >
                      {tenant.tenantName}
                    </td>
                    
                    {/* A/c Bal. (Kshs) */}
                    <td 
                      className="px-3 py-1 text-right font-medium border border-gray-200 align-top"
                      style={{ width: `${columnWidths.acBal}px` }}
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getBalanceColor(tenant.acBal)}`}>
                        Ksh {tenant.acBal}
                      </span>
                    </td>
                    
                    {/* Phone Number */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.phone}px` }}
                      title={tenant.phone}
                    >
                      {tenant.phone}
                    </td>
                    
                    {/* Rent */}
                    <td 
                      className="px-3 py-1 text-right font-medium text-gray-900 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.rent}px` }}
                    >
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-200">
                        Ksh {tenant.rent}
                      </span>
                    </td>
                    
                    {/* Lease Variation Type */}
                    <td 
                      className="px-3 py-1 border border-gray-200 align-top"
                      style={{ width: `${columnWidths.leaseType}px` }}
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                        tenant.leaseType === 'Residential'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : tenant.leaseType === 'Commercial'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {tenant.leaseType}
                      </span>
                    </td>
                    
                    {/* Payment Frequency */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top text-center"
                      style={{ width: `${columnWidths.paymentFreq}px` }}
                    >
                      {tenant.paymentFreq}
                    </td>
                    
                    {/* Lease Start */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                      style={{ width: `${columnWidths.leaseStart}px` }}
                    >
                      {tenant.leaseStart}
                    </td>
                    
                    {/* Lease End */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap"
                      style={{ width: `${columnWidths.leaseEnd}px` }}
                    >
                      {tenant.leaseEnd}
                    </td>
                    
                    {/* Lease Term */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top text-center"
                      style={{ width: `${columnWidths.leaseTerm}px` }}
                    >
                      {tenant.leaseTerm}
                    </td>
                    
                    {/* Days To Expire */}
                    <td 
                      className="px-3 py-1 text-center font-medium border border-gray-200 align-top"
                      style={{ width: `${columnWidths.daysToExpire}px` }}
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getDaysToExpireColor(tenant.daysToExpire)}`}>
                        {tenant.daysToExpire} days
                      </span>
                    </td>
                    
                    {/* Property */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.property}px` }}
                      title={tenant.property}
                    >
                      {tenant.property}
                    </td>
                    
                    {/* Email */}
                    <td 
                      className="px-3 py-1 text-gray-700 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `${columnWidths.email}px` }}
                      title={tenant.email}
                    >
                      {tenant.email}
                    </td>
                    
                    {/* Attached Files */}
                    <td 
                      className="px-3 py-1 text-center border border-gray-200 align-top"
                      style={{ width: `${columnWidths.attachedFiles}px` }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <FaPaperclip className="text-gray-500 text-xs" />
                        <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded text-xs border border-gray-200">
                          {tenant.attachedFiles} files
                        </span>
                      </div>
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
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, tenants.length)}</span> of <span className="font-medium">{tenants.length}</span> tenants
              </span>
              {selectedTenants.length > 0 && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-200">
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

export default Tenants;