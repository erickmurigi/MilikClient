import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, createUser, deleteUser, toggleUserLock } from "../../redux/apiCalls";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaUsers,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaEye,
  FaFileExport,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaDatabase,
  FaKey,
  FaUserClock,
  FaHistory,
  FaSave,
  FaCheck,
  FaSpinner,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaMoneyBill,
  FaToggleOn,
  FaToggleOff,
  FaCog,
  FaWallet,
  FaChartLine,
  FaHome,
  FaHotel,
  FaShoppingCart,
  FaUsers as FaUsersIcon,
  FaUserTie,
  FaFileAlt,
  FaProjectDiagram,
  FaChartBar,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaVenusMars,
  FaLock as FaLockIcon,
  FaShieldAlt,
  FaUserCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import StartMenu from "../../components/StartMenu/StartMenu";
import { getCompanies, createCompany } from "../../redux/apiCalls";
import AddCompanyWizard from "./AddCompanyWizard";
import AddUserPage from "./AddUsers";
// Sample data from the screenshots
const initialCompanies = [
  { id: 1, name: "ACUMEN VALUERS LTD", regNo: "", taxId: "", email: "ADMIN@ACUMEN...", country: "KENYA", phone: "", tenantCount: 276, accountsCount: 357, employeesCount: 0, propertiesCount: 0 },
  { id: 2, name: "ADDED VALUE INTERIORS", regNo: "", taxId: "", email: "INFO@ADDEDV...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 111, employeesCount: 0, propertiesCount: 0 },
  { id: 3, name: "ADDED VALUE PROPERTIES", regNo: "CPR/2011/44303", taxId: "P051353808X", email: "INFO@ADDEDV...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 3150, employeesCount: 3456, propertiesCount: 10 },
  { id: 4, name: "ADLIFE PLAZA", regNo: "", taxId: "", email: "INFO@ADLIFEP...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 0, employeesCount: 61, propertiesCount: 0 },
  { id: 5, name: "AFRI-SINE LIMITED TRADING AS NYALI GOLF VIEW RESIDENCE", regNo: "", taxId: "", email: "NYALIGOLFVIE...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 110, employeesCount: 363, propertiesCount: 0 },
  { id: 6, name: "ANMOL MANAGEMENT PUBLIC LTD.CO", regNo: "", taxId: "", email: "", country: "", phone: "", tenantCount: 0, accountsCount: 104, employeesCount: 204, propertiesCount: 0 },
  { id: 7, name: "ARCADE VENTURES CO.LTD.", regNo: "", taxId: "", email: "MAINAMB@YAH...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 67, employeesCount: 132, propertiesCount: 0 },
  { id: 8, name: "BALCON HOUSING COMPANY LTD", regNo: "CPR", taxId: "P", email: "INFO@BALCON...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 1742, employeesCount: 1931, propertiesCount: 0 },
  { id: 9, name: "BALI'S BEST BAR RESORT", regNo: "CPR/2014/150241", taxId: "P051474770K", email: "BALIBESTBARA...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 0, employeesCount: 57, propertiesCount: 48 },
  { id: 10, name: "BEATS AND WINES", regNo: "", taxId: "P051788657B", email: "INFO@BEATSA...", country: "KENYA", phone: "", tenantCount: 0, accountsCount: 0, employeesCount: 56, propertiesCount: 6 },
];

const initialUsers = [
  { id: 1, name: "DIANA", email: "diana@CONVALUERS.CO.KE", phone: "0724383849", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "Property Management", userProfile: "1", companies: "1", createdAt: "05/04/2024 12:00" },
  { id: 2, name: "ABDALLA AZIZA", email: "aziza@YAHOO.COM", phone: "0795809086", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "Property Management", userProfile: "1", companies: "1", createdAt: "14/02/2020 08:00" },
  { id: 3, name: "ABDILATIF ABDILATIF", email: "limitdepola@gmail.com", phone: "0722750051", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "Financial Account", userProfile: "2", companies: "1", createdAt: "17/12/2019 13:00" },
  { id: 4, name: "ABDULAZIZ NEYU", email: "neyuaziz@GREENZONE.CO.KE", phone: "0711114444", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "System Administration", userProfile: "1", companies: "1", createdAt: "09/01/2020 13:00" },
  { id: 5, name: "ABEL -", email: "maritepldt@gmail.com", phone: "0700634034", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "System Administration", userProfile: "1", companies: "1", createdAt: "22/10/2020 16:00" },
  { id: 6, name: "ABIGAIL MWONGELA", email: "abichael@gmail.com", phone: "0722963093", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "Human Resource", userProfile: "1", companies: "1", createdAt: "27/11/2020 16:00" },
  { id: 7, name: "ABUBAKAR ALI", email: "abubakarali340@gmail.com", phone: "0722755567", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "Organization Administration", userProfile: "1", companies: "1", createdAt: "09/06/2023 10:00" },
  { id: 8, name: "AGNES TERER", email: "agnesterer@YAHOO.COM", phone: "0722951851", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "Property Management", userProfile: "1", companies: "1", createdAt: "22/09/2023 10:00" },
  { id: 9, name: "AHMED ABUBAKAR", email: "ahmedabukar12345@gmail.com", phone: "0784500006", status: "Active", locked: "Yes", userControl: "Not Allowed", adminAccess: "System Administration", userProfile: "1", companies: "1", createdAt: "08/03/2023 10:00" },
  { id: 10, name: "AKICH LYNN", email: "lynnakich@gmail.com", phone: "0702495920", status: "Active", locked: "No", userControl: "Not Allowed", adminAccess: "System Administration", userProfile: "1", companies: "1", createdAt: "08/01/2023 10:00" },
];

const systemRights = [
  { id: 1, name: "Accounting periods", status: "Disabled", privilege: "View", profile: "Property Management", module: "Financial Accounts Module" },
  { id: 2, name: "Accounts", status: "Disabled", privilege: "View", profile: "Property Management", module: "Financial Accounts Module" },
  { id: 3, name: "Accounts Budgeting", status: "Disabled", privilege: "View", profile: "Property Management", module: "Financial Accounts Module" },
  { id: 4, name: "Accounts Meter Reading", status: "Disabled", privilege: "View", profile: "Property Management", module: "Financial Accounts Module" },
  { id: 5, name: "Accounts Module Setup", status: "Disabled", privilege: "View", profile: "Property Management", module: "Financial Accounts Module" },
  { id: 6, name: "Accounts Non Sale Inventory", status: "Disabled", privilege: "View", profile: "Property Management", module: "Financial Accounts Module" },
  { id: 7, name: "Accounts Periods", status: "Disabled", privilege: "View", profile: "Property Management", module: "Financial Accounts Module" },
];

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white`}>
      {icon}
    </div>
    <div>
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-xl font-bold text-slate-900">{value}</div>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, variant = "default" }) => {
  const baseClasses = "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition";
  const variants = {
    default: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    primary: "bg-teal-600 text-white hover:bg-teal-700",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
    warning: "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200",
  };
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {icon}
      {label}
    </button>
  );
};

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
    />
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange, totalRecords, recordsPerPage }) => (
  <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
    <div>
      Displaying {((currentPage - 1) * recordsPerPage) + 1} - {Math.min(currentPage * recordsPerPage, totalRecords)} of {totalRecords} Records
    </div>
    <div className="flex items-center gap-2">
      <span>Per Page: {recordsPerPage}</span>
      <div className="flex gap-1">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        <span className="px-3 py-1 bg-white border border-slate-200 rounded-md">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  </div>
);
const CompaniesTable = ({ companies, onEdit, onDelete, onLock, isLoading }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Handle both array and paginated object
  let companiesArray = [];
  if (Array.isArray(companies)) {
    companiesArray = companies;
  } else if (companies && Array.isArray(companies.companies)) {
    companiesArray = companies.companies;
  }

  // Map API data to display fields (relevant attributes only)
  const mappedCompanies = companiesArray.map(company => ({
    id: company._id,
    name: company.companyName || '-',
    regNo: company.registrationNo || '-',
    taxPIN: company.taxPIN || '-',
    email: company.email || '-',
    country: company.country || '-',
    town: company.town || '-',
    baseCurrency: company.baseCurrency || '-',
    taxRegime: company.taxRegime || '-',
    status: company.accountStatus || (company.isActive ? 'Active' : 'Inactive'),
  }));

  // Filter based on search
  const filteredCompanies = mappedCompanies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.regNo.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / recordsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-teal-600 text-2xl" />
        <span className="ml-2 text-slate-600">Loading companies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <SearchBar 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
        />
        <div className="flex gap-2">
          <Link to="/add-company">
            <ActionButton icon={<FaPlus />} label="Add Company" variant="primary" />
          </Link>
          <ActionButton icon={<FaFileExport />} label="Export" />
        </div>
      </div>

      {/* Horizontally scrollable table container */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[1200px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Company Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Reg No.</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Tax PIN</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Email</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Country</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Town</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Base Currency</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Tax Regime</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedCompanies.length > 0 ? (
                paginatedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-900 max-w-[200px] truncate" title={company.name}>
                      {company.name}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{company.regNo}</td>
                    <td className="px-3 py-2 text-slate-600">{company.taxPIN}</td>
                    <td className="px-3 py-2 text-slate-600 max-w-[150px] truncate" title={company.email}>
                      {company.email}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{company.country}</td>
                    <td className="px-3 py-2 text-slate-600">{company.town}</td>
                    <td className="px-3 py-2 text-slate-600">{company.baseCurrency}</td>
                    <td className="px-3 py-2 text-slate-600">{company.taxRegime}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {company.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEdit(company)} className="p-1 hover:bg-blue-50 rounded text-blue-600" title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => onLock(company)} className="p-1 hover:bg-amber-50 rounded text-amber-600" title="Lock">
                          <FaLock />
                        </button>
                        <button onClick={() => onDelete(company)} className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete">
                          <FaTrash />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-600" title="View Details">
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-3 py-4 text-center text-slate-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredCompanies.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalRecords={filteredCompanies.length}
          recordsPerPage={recordsPerPage}
        />
      )}
    </div>
  );
};
const UsersTable = ({ users, onEdit, onLock, onDelete, isLoading, selectedCompany }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  // Map user data to display fields
  const mappedUsers = users.map(user => ({
    id: user._id,
    name: `${user.surname || ''} ${user.otherNames || ''}`.trim() || '-',
    email: user.email || '-',
    phone: user.phoneNumber || '-',
    status: user.isActive ? 'Active' : 'Inactive',
    locked: user.locked ? 'Yes' : 'No',
    adminAccess: user.adminAccess ? 'System Admin' : 'Standard',
    userProfile: user.profile || '-',
    companies: selectedCompany?.companyName || '-',
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : '-',
  }));

  // Filter based on search
  const filteredUsers = mappedUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-teal-600 text-2xl" />
        <span className="ml-2 text-slate-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
        />
        <div className="flex gap-2">
          <ActionButton icon={<FaPlus />} label="Add User" variant="primary" onClick={() => {}} />
          <ActionButton icon={<FaFilter />} label="Filter" />
          <ActionButton icon={<FaFileExport />} label="Export" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[1200px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Email</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Locked</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Admin Access</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Profile</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Company</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Created</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-900">{user.name}</td>
                    <td className="px-3 py-2 text-slate-600 max-w-[150px] truncate" title={user.email}>
                      {user.email}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{user.phone}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {user.locked === 'Yes' ? (
                        <FaLock className="inline text-amber-600" />
                      ) : (
                        <FaUnlock className="inline text-slate-400" />
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{user.adminAccess}</td>
                    <td className="px-3 py-2 text-center text-slate-600">{user.userProfile}</td>
                    <td className="px-3 py-2 text-center text-slate-600">{user.companies}</td>
                    <td className="px-3 py-2 text-slate-600">{user.createdAt}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEdit(user)} className="p-1 hover:bg-blue-50 rounded text-blue-600" title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => onLock(user.id)} className="p-1 hover:bg-amber-50 rounded text-amber-600" title={user.locked === 'Yes' ? 'Unlock' : 'Lock'}>
                          {user.locked === 'Yes' ? <FaUnlock /> : <FaLock />}
                        </button>
                        <button onClick={() => onDelete(user.id)} className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-3 py-4 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalRecords={filteredUsers.length}
          recordsPerPage={recordsPerPage}
        />
      )}
    </div>
  );
};

const SystemRightsTable = () => {
  const [enableAll, setEnableAll] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const totalPages = Math.ceil(systemRights.length / recordsPerPage);
  const paginatedRights = systemRights.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-700">User Rights:</span>
        <button 
          onClick={() => setEnableAll(true)} 
          className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md border border-green-200 hover:bg-green-100"
        >
          Enable All
        </button>
        <button 
          onClick={() => setDisableAll(true)}
          className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-md border border-red-200 hover:bg-red-100"
        >
          Disable All
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">System Right [Name]</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Permission Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Privilege</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Profile</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Module</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedRights.map((right) => (
                <tr key={right.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900">{right.name}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      right.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {right.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600">{right.privilege}</td>
                  <td className="px-3 py-2 text-slate-600">{right.profile}</td>
                  <td className="px-3 py-2 text-slate-600">{right.module}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalRecords={systemRights.length}
        recordsPerPage={recordsPerPage}
      />
    </div>
  );
};
export default function SystemSetupPage() {
  
  const dispatch = useDispatch();
  const { companies, isFetching: companiesFetching } = useSelector((state) => state.company);
  const { users, isFetching: usersFetching } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("companies");
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedCompanyForUsers, setSelectedCompanyForUsers] = useState(null);

  // Fetch companies on mount
  useEffect(() => {
    dispatch(getCompanies({ limit: 100 }));
  }, [dispatch]);

  // Set default company for users when companies load
  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyForUsers) {
      setSelectedCompanyForUsers(companies[0]);
    }
  }, [companies]);

  // Fetch users when selected company changes
  useEffect(() => {
    if (selectedCompanyForUsers) {
      dispatch(getUsers(selectedCompanyForUsers._id, { limit: 100 }));
    }
  }, [dispatch, selectedCompanyForUsers]);

  

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const handleLockUser = (userId) => {
    dispatch(toggleUserLock(userId));
  };

  const handleEditUser = (user) => {
    console.log("Edit user:", user);
    // Open edit modal or navigate
  };



  const tabs = [
    { key: "companies", label: "COMPANIES", icon: <FaBuilding />, count: companies.length },
    { key: "users", label: "USERS", icon: <FaUsers />, count: users.length },
    { key: "rights", label: "SYSTEM RIGHTS", icon: <FaUserShield />, count: systemRights.length },
    { key: "database", label: "DATABASE", icon: <FaDatabase /> },
    { key: "sessions", label: "SESSIONS", icon: <FaUserClock /> },
    { key: "audit", label: "AUDIT LOG", icon: <FaHistory /> },
  ];

  const handleAddCompany = async (companyData) => {
    try {
      await createCompany(dispatch, companyData);
      setShowAddCompany(false);
      // No need to refetch; the company is added via createCompanySuccess
    } catch (error) {
      console.error("Failed to create company:", error);
      // Optionally show error message to user
    }
  };

  const handleAddUser = async (userData) => {
    try {
      await dispatch(createUser(userData));
      setShowAddUser(false);
    } catch (error) {
      alert("Failed to create user: " + error.message);
    }
  };

  const handleEdit = (item) => {
    console.log("Edit:", item);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCompany(id));
    }
  };

  const handleLock = (item) => {
    // TODO: implement lock/unlock
    console.log("Lock:", item);
  };

  return (
    <div className="min-h-screen bg-[#dfebed]">
      <StartMenu />
      <div className="mx-auto max-w-[1400px] px-4 py-5">
        {/* Header and Stats cards remain same */}

        {/* Tabs */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-lg p-1 mb-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap
                  ${activeTab === tab.key 
                    ? 'bg-teal-600 text-white' 
                    : 'text-slate-700 hover:bg-white/70'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-lg p-4">
          {activeTab === "companies" && (
            <div>
              <CompaniesTable 
                companies={companies}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLock={handleLock}
                isLoading={companiesFetching}
              />
              <div className="mt-3 text-right">
                <ActionButton 
                  icon={<FaPlus />} 
                  label="Add New Company" 
                  variant="primary"
                  onClick={() => setShowAddCompany(true)}
                />
              </div>
            </div>
          )}

        
          
          {activeTab === "users" && (
      <div>
        
        <UsersTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onLock={handleLockUser}
          isLoading={usersFetching}
          selectedCompany={selectedCompanyForUsers}
        />
        <div className="mt-3 text-right">
          <ActionButton
            icon={<FaPlus />}
            label="Add New User"
            variant="primary"
            onClick={() => setShowAddUser(true)}
          />
        </div>
      </div>
    )}
          
          {activeTab === "rights" && (
            <SystemRightsTable />
          )}
          
          {activeTab === "database" && (
            <div className="p-8 text-center text-slate-500">
              <FaDatabase className="text-4xl mx-auto mb-2 text-slate-300" />
              <p>Database management interface coming soon...</p>
            </div>
          )}
          
          {activeTab === "sessions" && (
            <div className="p-8 text-center text-slate-500">
              <FaUserClock className="text-4xl mx-auto mb-2 text-slate-300" />
              <p>Active user sessions monitoring coming soon...</p>
            </div>
          )}
          
          {activeTab === "audit" && (
            <div className="p-8 text-center text-slate-500">
              <FaHistory className="text-4xl mx-auto mb-2 text-slate-300" />
              <p>System audit log coming soon...</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-4 text-xs text-slate-500 text-right">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Modals */}
      {showAddCompany && (
        <AddCompanyWizard 
          onClose={() => setShowAddCompany(false)}
          onSave={handleAddCompany}
        />
      )}

      {showAddUser && (
        <AddUserPage 
          onClose={() => setShowAddUser(false)}
          onSave={handleAddUser}
          companies={companies} // pass real companies list
        />
      )}
    </div>
  );
}