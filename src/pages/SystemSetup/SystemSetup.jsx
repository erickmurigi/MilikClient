import React, { useState, useEffect } from "react";
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


// Add User Component with Rights Management
const AddUserPage = ({ onClose, onSave, companies }) => {
  const [step, setStep] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [userData, setUserData] = useState({
    // General Information
    surname: "",
    otherNames: "",
    idNumber: "",
    gender: "",
    postalAddress: "",
    phoneNumber: "",
    email: "",
    
    // User Details
    profile: "",
    userControl: true,
    superAdminAccess: false,
    adminAccess: false,
    setupAccess: false,
    companySetupAccess: false,
    
    // Module Access
    moduleAccess: {
      propertyMgmt: "Not allowed",
      propertySale: "Not allowed",
      facilityManagement: "Not allowed",
      hotelManagement: "Not allowed",
      accounts: "Not allowed",
      revenueRecognition: "Not allowed",
      telcoDealership: "Not allowed",
      inventory: "Not allowed",
      retailOutlet: "",
      procurement: "Not allowed",
      humanResource: "Not allowed",
      hidePayDetails: false,
      incidentManagement: "Not allowed",
      sacco: "Not allowed",
      projectManagement: "Not allowed",
      assetValuation: "Not allowed",
      crm: "Not allowed",
      dms: "Not allowed",
      academics: "Not allowed",
    },
    
    // Companies Access
    companies: [],
  });

  const [userRights, setUserRights] = useState([
    { id: 1, name: "View Dashboard", enabled: true, module: "Dashboard" },
    { id: 2, name: "Manage Properties", enabled: false, module: "Property Management" },
    { id: 3, name: "View Properties", enabled: true, module: "Property Management" },
    { id: 4, name: "Create Invoices", enabled: false, module: "Billing" },
    { id: 5, name: "Approve Payments", enabled: false, module: "Accounts" },
    { id: 6, name: "View Reports", enabled: true, module: "Reports" },
    { id: 7, name: "Manage Users", enabled: false, module: "Administration" },
    { id: 8, name: "System Settings", enabled: false, module: "Administration" },
    { id: 9, name: "Tenant Management", enabled: false, module: "Property Management" },
    { id: 10, name: "Maintenance Requests", enabled: true, module: "Facility Management" },
  ]);

  const [filteredRights, setFilteredRights] = useState(userRights);
  const [rightSearch, setRightSearch] = useState("");
  const [rightModuleFilter, setRightModuleFilter] = useState("All");

  useEffect(() => {
    let filtered = userRights;
    if (rightSearch) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(rightSearch.toLowerCase())
      );
    }
    if (rightModuleFilter !== "All") {
      filtered = filtered.filter(r => r.module === rightModuleFilter);
    }
    setFilteredRights(filtered);
  }, [rightSearch, rightModuleFilter, userRights]);

  const toggleRight = (rightId) => {
    setUserRights(userRights.map(right => 
      right.id === rightId ? { ...right, enabled: !right.enabled } : right
    ));
  };

  const enableAllRights = () => {
    setUserRights(userRights.map(right => ({ ...right, enabled: true })));
  };

  const disableAllRights = () => {
    setUserRights(userRights.map(right => ({ ...right, enabled: false })));
  };

  const uniqueModules = ["All", ...new Set(userRights.map(r => r.module))];

  const handleSave = () => {
    // Save user with rights
    const finalUserData = {
      ...userData,
      rights: userRights.filter(r => r.enabled).map(r => r.id),
      companyId: selectedCompany?.id,
    };
    onSave(finalUserData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl mx-4 my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
          </div>
        </div>

        {/* Company Selection (if not already selected) */}
        {!selectedCompany && (
          <div className="p-6">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Select Company for User
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {companies.map(company => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className="p-4 border border-slate-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 text-left"
                >
                  <div className="font-medium text-slate-900">{company.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{company.email}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCompany && (
          <div className="p-6">
            {/* Selected Company Indicator */}
            <div className="bg-teal-50 p-3 rounded-lg mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-700">Adding user to:</span>
                <span className="ml-2 font-medium text-teal-900">{selectedCompany.name}</span>
              </div>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="text-xs text-teal-600 hover:text-teal-800"
              >
                Change
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - User Information */}
              <div className="space-y-6">
                {/* General Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">General Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-700">
                          Surname <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={userData.surname}
                          onChange={(e) => setUserData({...userData, surname: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                          placeholder="Surname"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-700">
                          Other Names <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={userData.otherNames}
                          onChange={(e) => setUserData({...userData, otherNames: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                          placeholder="Other names"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-700">
                          ID/PP/Job No. <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={userData.idNumber}
                          onChange={(e) => setUserData({...userData, idNumber: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                          placeholder="ID/Passport number"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-700">Gender</label>
                        <select
                          value={userData.gender}
                          onChange={(e) => setUserData({...userData, gender: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-700">Postal Address</label>
                      <input
                        type="text"
                        value={userData.postalAddress}
                        onChange={(e) => setUserData({...userData, postalAddress: e.target.value})}
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        placeholder="Postal address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={userData.phoneNumber}
                          onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">User Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700">
                        Profile <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={userData.profile}
                        onChange={(e) => setUserData({...userData, profile: e.target.value})}
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      >
                        <option value="">Select profile</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Manager">Manager</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Agent">Agent</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="userControl"
                        checked={userData.userControl}
                        onChange={(e) => setUserData({...userData, userControl: e.target.checked})}
                        className="rounded border-slate-300 text-teal-600"
                      />
                      <label htmlFor="userControl" className="text-sm text-slate-700">User Control</label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'superAdminAccess', label: 'Super Admin Access' },
                        { key: 'adminAccess', label: 'Admin Access' },
                        { key: 'setupAccess', label: 'Setup Access' },
                        { key: 'companySetupAccess', label: 'Company Setup Access' },
                      ].map(access => (
                        <div key={access.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={access.key}
                            checked={userData[access.key]}
                            onChange={(e) => setUserData({...userData, [access.key]: e.target.checked})}
                            className="rounded border-slate-300 text-teal-600"
                          />
                          <label htmlFor={access.key} className="text-xs text-slate-700">{access.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Module Access */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Module Access</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {Object.entries(userData.moduleAccess).map(([key, value]) => {
                    if (key === 'retailOutlet') {
                      return (
                        <div key={key}>
                          <label className="text-xs font-medium text-slate-700">Retail Outlet/Cashier Till/Counter</label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setUserData({
                              ...userData,
                              moduleAccess: {...userData.moduleAccess, [key]: e.target.value}
                            })}
                            className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                            placeholder="Enter counter details"
                          />
                        </div>
                      );
                    }
                    
                    if (key === 'hidePayDetails') {
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={key}
                            checked={value}
                            onChange={(e) => setUserData({
                              ...userData,
                              moduleAccess: {...userData.moduleAccess, [key]: e.target.checked}
                            })}
                            className="rounded border-slate-300 text-teal-600"
                          />
                          <label htmlFor={key} className="text-sm text-slate-700">Hide Pay Details</label>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm text-slate-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </label>
                        <select
                          value={value}
                          onChange={(e) => setUserData({
                            ...userData,
                            moduleAccess: {...userData.moduleAccess, [key]: e.target.value}
                          })}
                          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                        >
                          <option value="Not allowed">Not allowed</option>
                          <option value="View only">View only</option>
                          <option value="Full access">Full access</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* User Rights Section */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">User Rights Management</h3>
                <div className="flex gap-2">
                  <button
                    onClick={enableAllRights}
                    className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-md border border-green-200 hover:bg-green-100"
                  >
                    Enable All
                  </button>
                  <button
                    onClick={disableAllRights}
                    className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-md border border-red-200 hover:bg-red-100"
                  >
                    Disable All
                  </button>
                </div>
              </div>

              {/* Rights Filters */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={rightSearch}
                    onChange={(e) => setRightSearch(e.target.value)}
                    placeholder="Search rights..."
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <select
                  value={rightModuleFilter}
                  onChange={(e) => setRightModuleFilter(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                >
                  {uniqueModules.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>

              {/* Rights Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">Right Name</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">Module</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-700">Status</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRights.map(right => (
                      <tr key={right.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-medium text-slate-900">{right.name}</td>
                        <td className="px-3 py-2 text-slate-600">{right.module}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            right.enabled ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {right.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => toggleRight(right.id)}
                            className={`text-sm ${right.enabled ? 'text-amber-600' : 'text-teal-600'}`}
                          >
                            {right.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rights Summary */}
              <div className="mt-2 text-xs text-slate-500">
                {userRights.filter(r => r.enabled).length} of {userRights.length} rights enabled
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Create User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

const CompaniesTable = ({ companies, onEdit, onDelete, onLock }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / recordsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="space-y-3">
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

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Company Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Reg No.</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Email</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Country</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Tenants</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Accounts</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Employees</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Properties</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900 max-w-[200px] truncate" title={company.name}>
                    {company.name}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{company.regNo || '-'}</td>
                  <td className="px-3 py-2 text-slate-600">{company.email || '-'}</td>
                  <td className="px-3 py-2 text-slate-600">{company.country || '-'}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{company.tenantCount}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{company.accountsCount}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{company.employeesCount}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{company.propertiesCount}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalRecords={filteredCompanies.length}
        recordsPerPage={recordsPerPage}
      />
    </div>
  );
};

const UsersTable = ({ users, onEdit, onLock, onDelete }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.adminAccess.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SearchBar 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
        />
        <div className="flex gap-2">
            <Link to="/add-user">
          <ActionButton icon={<FaPlus />} label="Add User" variant="primary" />
          </Link>
          <ActionButton icon={<FaFilter />} label="Filter" />
          <ActionButton icon={<FaFileExport />} label="Export" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Email</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Locked</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Admin Access</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Profile</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Companies</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Created</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900">{user.name}</td>
                  <td className="px-3 py-2 text-slate-600 max-w-[150px] truncate" title={user.email}>
                    {user.email}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{user.phone || '-'}</td>
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {user.locked === 'Yes' ? (
                      <span className="text-amber-600"><FaLock className="inline" /></span>
                    ) : (
                      <span className="text-slate-400"><FaUnlock className="inline" /></span>
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
                      <button onClick={() => onLock(user)} className="p-1 hover:bg-amber-50 rounded text-amber-600" title={user.locked === 'Yes' ? 'Unlock' : 'Lock'}>
                        {user.locked === 'Yes' ? <FaUnlock /> : <FaLock />}
                      </button>
                      <button onClick={() => onDelete(user)} className="p-1 hover:bg-red-50 rounded text-red-600" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
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
        totalRecords={filteredUsers.length}
        recordsPerPage={recordsPerPage}
      />
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

// Update the main SystemSetupPage to include modals
export default function SystemSetupPage() {
  const [activeTab, setActiveTab] = useState("companies");
  const [companies, setCompanies] = useState(initialCompanies);
  const [users, setUsers] = useState(initialUsers);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const tabs = [
    { key: "companies", label: "COMPANIES", icon: <FaBuilding />, count: companies.length },
    { key: "users", label: "USERS", icon: <FaUsers />, count: users.length },
    { key: "rights", label: "SYSTEM RIGHTS", icon: <FaUserShield />, count: systemRights.length },
    { key: "database", label: "DATABASE", icon: <FaDatabase /> },
    { key: "sessions", label: "SESSIONS", icon: <FaUserClock /> },
    { key: "audit", label: "AUDIT LOG", icon: <FaHistory /> },
  ];

  const handleAddCompany = (companyData) => {
    const newCompany = {
      id: companies.length + 1,
      name: companyData.companyName,
      regNo: companyData.registrationNo,
      taxId: companyData.taxPIN,
      email: "admin@" + companyData.companyName.toLowerCase().replace(/\s+/g, '') + ".com",
      country: companyData.country,
      phone: "",
      tenantCount: 0,
      accountsCount: 0,
      employeesCount: 0,
      propertiesCount: 0,
    };
    setCompanies([...companies, newCompany]);
    setShowAddCompany(false);
  };

  const handleAddUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      name: `${userData.surname} ${userData.otherNames}`,
      email: userData.email,
      phone: userData.phoneNumber,
      status: "Active",
      locked: "No",
      userControl: userData.userControl ? "Allowed" : "Not Allowed",
      adminAccess: userData.adminAccess ? "System Administration" : "Property Management",
      userProfile: userData.profile,
      companies: "1",
      createdAt: new Date().toLocaleDateString('en-GB') + " 00:00",
    };
    setUsers([...users, newUser]);
    setShowAddUser(false);
  };

  const handleEdit = (item) => {
    console.log("Edit:", item);
  };

  const handleDelete = (item) => {
    if (activeTab === "companies") {
      setCompanies(companies.filter(c => c.id !== item.id));
    } else if (activeTab === "users") {
      setUsers(users.filter(u => u.id !== item.id));
    }
  };

  const handleLock = (item) => {
    if (activeTab === "users") {
      setUsers(users.map(u => 
        u.id === item.id ? { ...u, locked: u.locked === 'Yes' ? 'No' : 'Yes' } : u
      ));
    }
  };

  return (
    <div className="min-h-screen bg-[#dfebed]">
        <StartMenu></StartMenu>
      <div className="mx-auto max-w-[1400px] px-4 py-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">System Setup</h1>
            <p className="text-sm text-slate-600">Manage companies, users, and system permissions</p>
          </div>
          
          <div className="flex items-center gap-2">
            <ActionButton icon={<FaKey />} label="System Settings" />
            <ActionButton icon={<FaFileExport />} label="Export All" variant="primary" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          <StatCard 
            icon={<FaBuilding />}
            label="Total Companies"
            value={companies.length}
            color="bg-teal-600"
          />
          <StatCard 
            icon={<FaUsers />}
            label="Total Users"
            value={users.length}
            color="bg-blue-600"
          />
          <StatCard 
            icon={<FaUserShield />}
            label="System Rights"
            value={systemRights.length}
            color="bg-purple-600"
          />
          <StatCard 
            icon={<FaDatabase />}
            label="Active Sessions"
            value="24"
            color="bg-amber-600"
          />
        </div>

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
              />
              <div className="mt-3 text-right">
                <Link to="/add-company">
                  <ActionButton 
                    icon={<FaPlus />} 
                    label="Add New Company" 
                    variant="primary"
                  />
                </Link>
              
              </div>
            </div>
          )}
          
          {activeTab === "users" && (
            <div>
              <UsersTable 
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLock={handleLock}
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
          companies={companies}
        />
      )}
    </div>
  );
}