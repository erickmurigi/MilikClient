import React, { useState, useEffect } from "react";

const AddUserPage = ({ onClose, onSave, selectedCompany: initialCompany, companies }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(() => {
    // Normalize initialCompany to have { id, name } structure
    if (initialCompany) {
      return {
        id: initialCompany._id,
        name: initialCompany.companyName || initialCompany.name,
      };
    }
    return null;
  });
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

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
    name: company.companyName || company.name || '-',
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
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.regNo.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.email.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(companySearch.toLowerCase())
  );

  const [userData, setUserData] = useState({
    surname: "",
    otherNames: "",
    idNumber: "",
    gender: "",
    postalAddress: "",
    phoneNumber: "",
    email: "",
    profile: "",
    userControl: true,
    superAdminAccess: false,
    adminAccess: false,
    setupAccess: false,
    companySetupAccess: false,
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
    { id: 11, name: "Financial Reports", enabled: false, module: "Accounts" },
    { id: 12, name: "Budget Approval", enabled: false, module: "Accounts" },
    { id: 13, name: "Vendor Management", enabled: false, module: "Procurement" },
    { id: 14, name: "Contract Management", enabled: false, module: "Legal" },
    { id: 15, name: "Audit Logs", enabled: true, module: "Administration" },
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

  const handleSave = async () => {
    // Validate required fields
    if (!selectedCompany) {
      alert("Please select a company");
      return;
    }
    if (!userData.surname || !userData.otherNames || !userData.idNumber ||
        !userData.phoneNumber || !userData.email || !userData.profile) {
      alert("Please fill in all required fields");
      return;
    }
    if (!password) {
      alert("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const finalUserData = {
      surname: userData.surname,
      otherNames: userData.otherNames,
      idNumber: userData.idNumber,
      gender: userData.gender,
      postalAddress: userData.postalAddress,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      profile: userData.profile,
      userControl: userData.userControl,
      superAdminAccess: userData.superAdminAccess,
      adminAccess: userData.adminAccess,
      setupAccess: userData.setupAccess,
      companySetupAccess: userData.companySetupAccess,
      moduleAccess: userData.moduleAccess,
      rights: userRights.filter(r => r.enabled).map(r => r.id),
      company: selectedCompany.id, // ✅ use the normalized id
      password,
      isActive: true,
      locked: false,
    };

    onSave(finalUserData);
  };

  // Handle company selection
  const selectCompany = (company) => {
    setSelectedCompany(company); // company already has { id, name } from mappedCompanies
    setCompanySearch(company.name);
    setShowCompanyDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Company Selection - Autocomplete */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Select Company <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={companySearch}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setShowCompanyDropdown(true);
                  if (!e.target.value) setSelectedCompany(null);
                }}
                onFocus={() => setShowCompanyDropdown(true)}
                placeholder="Search for a company..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              />
              {showCompanyDropdown && filteredCompanies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCompanies.map(company => (
                    <div
                      key={company.id} // ✅ use company.id
                      onClick={() => selectCompany(company)}
                      className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-sm"
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedCompany && (
              <div className="mt-2 text-sm text-teal-700 bg-teal-50 p-2 rounded-lg">
                <span className="font-medium">Selected: </span>{selectedCompany.name}
              </div>
            )}
          </div>

          {/* Two Column Layout (unchanged) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - User Information */}
            <div className="space-y-6">
              {/* General Information */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-teal-600 rounded-full"></span>
                  General Information
                </h3>
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
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                        placeholder="Other names"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
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
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                        placeholder="ID/Passport number"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700">Gender</label>
                      <select
                        value={userData.gender}
                        onChange={(e) => setUserData({...userData, gender: e.target.value})}
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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
                      className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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
                        className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-teal-600 rounded-full"></span>
                  User Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700">
                      Profile <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={userData.profile}
                      onChange={(e) => setUserData({...userData, profile: e.target.value})}
                      className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-200"
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
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-200"
                        />
                        <label htmlFor={access.key} className="text-xs text-slate-700">{access.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Module Access (unchanged) */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-teal-600 rounded-full"></span>
                Module Access
              </h3>
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
                          className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-200"
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
                        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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

          {/* User Rights Section (unchanged) */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-4 bg-teal-600 rounded-full"></span>
                User Rights Management
              </h3>
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
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                />
              </div>
              <select
                value={rightModuleFilter}
                onChange={(e) => setRightModuleFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
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
                  {filteredRights.length > 0 ? (
                    filteredRights.map(right => (
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
                            className={`text-sm font-medium ${
                              right.enabled ? 'text-amber-600 hover:text-amber-800' : 'text-teal-600 hover:text-teal-800'
                            }`}
                          >
                            {right.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-3 py-4 text-center text-slate-500">
                        No rights found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Rights Summary */}
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-slate-500">
                {userRights.filter(r => r.enabled).length} of {userRights.length} rights enabled
              </div>
              <div className="text-xs text-slate-500">
                Showing {filteredRights.length} rights
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-slate-200 flex-shrink-0 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
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
    </div>
  );
};

export default AddUserPage;