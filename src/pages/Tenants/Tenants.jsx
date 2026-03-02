import React, { useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaExpandAlt,
  FaCompressAlt,
  FaFileExport,
  FaRedoAlt,
  FaEdit,
  FaEllipsisV,
  FaFileInvoiceDollar,
  FaUserEdit,
  FaBolt,
  FaChartLine,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getTenants, deleteTenant } from "../../redux/tenantsRedux";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const ITEMS_PER_PAGE = 50;

const Tenants = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { currentCompany } = useSelector((state) => state.company || {});
  const { tenants: tenantsData = [], isFetching } = useSelector(
    (state) => state.tenant || { tenants: [], isFetching: false }
  );

  // ===== UI STATE =====
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTenants, setExpandedTenants] = useState([]);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const actionMenuRef = useRef(null);

  // ===== FILTERS =====
  const [draftFilters, setDraftFilters] = useState({
    property: "any",
    status: "any",
    search: "",
    tenantName: "",
    tenantCode: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    property: "any",
    status: "any",
    search: "",
    tenantName: "",
    tenantCode: "",
  });

  // ===== EFFECTS =====
  // Fetch tenants on mount
  useEffect(() => {
    if (currentCompany?._id) {
      dispatch(getTenants({ business: currentCompany._id }));
      console.log("Tenants initialized for company:", currentCompany._id);
    }
  }, [dispatch, currentCompany]);

  // Reset selectAll when page changes
  useEffect(() => {
    setSelectAll(false);
  }, [currentPage]);

  // Close action menu on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!actionMenuRef.current) return;
      if (!actionMenuRef.current.contains(e.target)) setActionMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ===== TRANSFORM TENANT DATA =====
  const transformedTenants = useMemo(() => {
    return (Array.isArray(tenantsData) ? tenantsData : []).map((tenant, index) => {
      // Auto-generate tenant code: TT + 4 digits
      const tenantCode = tenant.tenantCode || `TT${String(index + 1).padStart(4, '0')}`;
      
      return {
        id: tenant._id,
        tenantCode: tenantCode,
        tenantName: tenant.name || "-",
        unitNumber: tenant.unit?.unitNumber || "-",
        propertyName: tenant.unit?.property?.propertyName || "-",
        startDate: tenant.leaseStartDate
          ? new Date(tenant.leaseStartDate).toLocaleDateString()
          : "-",
        rent: tenant.unit?.rent
          ? `Ksh ${tenant.unit.rent.toLocaleString()}`
          : "-",
        status: (tenant.status || "active").toLowerCase(),
        phone: tenant.phone || "-",
        email: tenant.email || "-",
        accountBalance: tenant.accountBalance ?? 0,
      };
    });
  }, [tenantsData]);

  // ===== FILTER TENANTS =====
  const filteredTenants = useMemo(() => {
    return transformedTenants.filter((t) => {
      // Property filter
      if (
        appliedFilters.property !== "any" &&
        t.propertyName !== appliedFilters.property
      ) {
        return false;
      }

      // Status filter
      if (
        appliedFilters.status !== "any" &&
        t.status !== appliedFilters.status
      ) {
        return false;
      }

      // Search filter (name or phone)
      if (appliedFilters.search) {
        const searchLower = appliedFilters.search.toLowerCase();
        const matchesName = t.tenantName.toLowerCase().includes(searchLower);
        const matchesPhone = t.phone.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesPhone) return false;
      }

      // Tenant name filter
      if (appliedFilters.tenantName) {
        const nameLower = appliedFilters.tenantName.toLowerCase();
        if (!t.tenantName.toLowerCase().includes(nameLower)) return false;
      }

      // Tenant code filter
      if (appliedFilters.tenantCode) {
        const codeLower = appliedFilters.tenantCode.toLowerCase();
        if (!t.tenantCode.toLowerCase().includes(codeLower)) return false;
      }

      return true;
    });
  }, [transformedTenants, appliedFilters]);

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filteredTenants.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTenants = filteredTenants.slice(startIndex, endIndex);

  // ===== SELECTION HANDLERS =====
  const handleSelectTenant = (tenantId) => {
    setSelectedTenants((prev) =>
      prev.includes(tenantId)
        ? prev.filter((id) => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTenants([]);
      setSelectAll(false);
    } else {
      setSelectedTenants(currentTenants.map((t) => t.id));
      setSelectAll(true);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  // ===== EXPAND/COLLAPSE =====
  const toggleTenantExpand = (tenantId) => {
    setExpandedTenants((prev) =>
      prev.includes(tenantId)
        ? prev.filter((id) => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  const expandAllTenants = () => {
    setExpandedTenants(filteredTenants.map((t) => t.id));
  };

  const collapseAllTenants = () => {
    setExpandedTenants([]);
  };

  // ===== ACTION MENU HANDLERS =====
  const handleViewStatement = () => {
    if (selectedTenants.length === 0) {
      toast.warning("Please select at least one tenant");
      return;
    }
    if (selectedTenants.length === 1) {
      navigate(`/tenant/${selectedTenants[0]}/statement`);
    } else {
      toast.info("Multiple tenants selected. Opening first tenant's statement.");
      navigate(`/tenant/${selectedTenants[0]}/statement`);
    }
    setActionMenuOpen(false);
  };

  const handleEditTenant = () => {
    if (selectedTenants.length === 0) {
      toast.warning("Please select a tenant to edit");
      return;
    }
    if (selectedTenants.length > 1) {
      toast.warning("Please select only one tenant to edit");
      return;
    }
    navigate(`/tenant/${selectedTenants[0]}/edit`);
    setActionMenuOpen(false);
  };

  const handleAddUtility = () => {
    if (selectedTenants.length === 0) {
      toast.warning("Please select at least one tenant");
      return;
    }
    toast.info("Add utility feature coming soon");
    setActionMenuOpen(false);
  };

  const handleReviewRent = () => {
    if (selectedTenants.length === 0) {
      toast.warning("Please select at least one tenant");
      return;
    }
    toast.info("Review rent feature coming soon");
    setActionMenuOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters({ property: "any", status: "any", search: "", tenantName: "", tenantCode: "" });
    setAppliedFilters({ property: "any", status: "any", search: "", tenantName: "", tenantCode: "" });
    setCurrentPage(1);
  };

  // ===== CRUD ACTIONS =====
  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm("Delete this tenant?")) return;
    try {
      await dispatch(deleteTenant(tenantId)).unwrap();
      toast.success("Tenant deleted successfully");
      setSelectedTenants((prev) => prev.filter((id) => id !== tenantId));
    } catch (error) {
      toast.error(error?.message || "Failed to delete tenant");
    }
  };


  // ===== FILTER OPTIONS =====
  const uniqueProperties = useMemo(() => {
    const propertyNames = transformedTenants
      .map((t) => t.propertyName)
      .filter((p) => p !== "-");
    return ["any", ...Array.from(new Set(propertyNames)).sort()];
  }, [transformedTenants]);

  const statusOptions = ["any", "active", "inactive"];

  // ===== RENDER =====
  return (
    <DashboardLayout lockContentScroll>
      <div className="flex flex-col h-full min-h-0 p-0 bg-gray-50 overflow-hidden">
        {/* ===== FILTER BAR ===== */}
        <div className="flex-shrink-0 sticky top-0 z-30 bg-white border-b border-gray-200 px-2 pt-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Property Filter */}
            <div>
              <select
                value={draftFilters.property}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, property: e.target.value })
                }
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 hover:bg-white transition-colors"
              >
                {uniqueProperties.map((prop) => (
                  <option key={prop} value={prop}>
                    {prop === "any" ? "All Properties" : prop}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={draftFilters.status}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, status: e.target.value })
                }
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 hover:bg-white transition-colors"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "any"
                      ? "All Status"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tenant Name Filter */}
            <div>
              <input
                type="text"
                placeholder="Tenant Name"
                value={draftFilters.tenantName}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, tenantName: e.target.value })
                }
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 placeholder-gray-600"
              />
            </div>

            {/* Tenant Code Filter */}
            <div>
              <input
                type="text"
                placeholder="Tenant Code (TT####)"
                value={draftFilters.tenantCode}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, tenantCode: e.target.value })
                }
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 placeholder-gray-600"
              />
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={draftFilters.search}
                onChange={(e) =>
                  setDraftFilters({ ...draftFilters, search: e.target.value })
                }
                className="w-full pl-9 pr-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Action buttons */}
            <button
              onClick={() => navigate("/tenant/new")}
              className={`px-4 py-1 text-xs ${MILIK_ORANGE} text-white rounded-lg flex items-center gap-2 hover:bg-[#e67e00] transition-colors shadow-sm`}
            >
              <FaPlus className="text-xs" />
              <span>Add</span>
            </button>

            <button
              onClick={() => setAppliedFilters(draftFilters)}
              className={`px-4 py-1 text-xs ${MILIK_GREEN} text-white rounded-lg flex items-center gap-2 hover:bg-[#0A3127] transition-colors shadow-sm`}
            >
              <FaSearch className="text-xs" />
              <span>Search</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="px-4 py-1 text-xs bg-gray-500 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors shadow-sm"
            >
              <FaRedoAlt className="text-xs" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ===== COMPACT ACTION BAR ===== */}
        <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 px-2 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={expandAllTenants}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-700 text-sm"
              title="Expand all"
            >
              <FaExpandAlt />
            </button>
            <button
              onClick={collapseAllTenants}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-700 text-sm"
              title="Collapse all"
            >
              <FaCompressAlt />
            </button>
            <span className="text-xs font-bold text-gray-700">
              {selectedTenants.length} selected
            </span>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditTenant}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit Selected Tenant"
              disabled={selectedTenants.length !== 1}
            >
              <FaEdit size={10} />
              <span>Edit</span>
            </button>
            
            {/* Actions Dropdown */}
            <div className="relative" ref={actionMenuRef}>
              <button
                onClick={() => setActionMenuOpen(!actionMenuOpen)}
                className={`${MILIK_GREEN} hover:bg-[#0A3127] text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm`}
                title="More Actions"
              >
                <FaEllipsisV size={10} />
                <span>Actions</span>
              </button>
              
              {actionMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleViewStatement}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                    >
                      <FaFileInvoiceDollar size={12} />
                      <span>View Tenant Statement</span>
                    </button>
                    <button
                      onClick={handleEditTenant}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                    >
                      <FaUserEdit size={12} />
                      <span>Edit Tenant Details</span>
                    </button>
                    <button
                      onClick={handleAddUtility}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                    >
                      <FaBolt size={12} />
                      <span>Add Utility to Selected Tenant</span>
                    </button>
                    <button
                      onClick={handleReviewRent}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 flex items-center gap-2 text-gray-700 border-t border-gray-200"
                    >
                      <FaChartLine size={12} />
                      <span>Review Rent for Selected Tenant</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
              title="Export"
            >
              <FaFileExport size={12} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ===== TENANTS TABLE ===== */}
        <div className="flex-1 min-h-0 overflow-auto px-2 py-1">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className={`${MILIK_GREEN} text-white text-xs`}>
                <th className="px-2 py-1.5 text-center font-bold border-r border-gray-400 w-6">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    onClick={handleCheckboxClick}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </th>
                <th className="px-2 py-1.5 text-center font-bold border-r border-gray-400 w-6">
                  ⬇️
                </th>
                <th className="px-2 py-1.5 text-left font-bold border-r border-gray-400 min-w-[80px]">
                  Code
                </th>
                <th className="px-2 py-1.5 text-left font-bold border-r border-gray-400 min-w-[150px]">
                  Tenant Name
                </th>
                <th className="px-2 py-1.5 text-left font-bold border-r border-gray-400 min-w-[120px]">
                  Property
                </th>
                <th className="px-2 py-1.5 text-left font-bold border-r border-gray-400 min-w-[80px]">
                  Unit
                </th>
                <th className="px-2 py-1.5 text-left font-bold border-r border-gray-400 min-w-[100px]">
                  Start Date
                </th>
                <th className="px-2 py-1.5 text-right font-bold border-r border-gray-400 min-w-[100px]">
                  Rent
                </th>
                <th className="px-2 py-1.5 text-center font-bold border-r border-gray-400 min-w-[80px]">
                  Status
                </th>
                <th className="px-2 py-1.5 text-left font-bold min-w-[100px]">
                  Phone
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {currentTenants.length > 0 ? (
                currentTenants.map((tenant, idx) => (
                  <React.Fragment key={tenant.id}>
                    {/* Tenant Row */}
                    <tr
                      className={`border-b border-gray-200 cursor-pointer transition-colors text-xs ${
                        selectedTenants.includes(tenant.id)
                          ? "bg-orange-50 hover:bg-orange-100"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectTenant(tenant.id)}
                    >
                      <td
                        className="px-2 py-1 text-center border-r border-gray-200"
                        onClick={handleCheckboxClick}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTenants.includes(tenant.id)}
                          onChange={() => handleSelectTenant(tenant.id)}
                          onClick={handleCheckboxClick}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                      <td
                        className="px-2 py-1 text-center border-r border-gray-200 cursor-pointer"
                        onClick={() => toggleTenantExpand(tenant.id)}
                      >
                        <span>
                          {expandedTenants.includes(tenant.id) ? "▼" : "▶"}
                        </span>
                      </td>
                      <td className="px-2 py-1 font-mono text-gray-600 border-r border-gray-200 text-xs">
                        {tenant.tenantCode}
                      </td>
                      <td className="px-2 py-1 font-bold text-gray-900 border-r border-gray-200">
                        {tenant.tenantName}
                      </td>
                      <td className="px-2 py-1 font-bold text-gray-900 border-r border-gray-200">
                        {tenant.propertyName}
                      </td>
                      <td className="px-2 py-1 font-bold text-gray-900 border-r border-gray-200">
                        {tenant.unitNumber}
                      </td>
                      <td className="px-2 py-1 font-bold text-gray-900 border-r border-gray-200">
                        {tenant.startDate}
                      </td>
                      <td className="px-2 py-1 font-bold text-gray-900 text-right border-r border-gray-200">
                        {tenant.rent}
                      </td>
                      <td className="px-2 py-1 text-center border-r border-gray-200">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            tenant.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-2 py-1 font-bold text-gray-900">
                        {tenant.phone}
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {expandedTenants.includes(tenant.id) && (
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <td colSpan="10" className="px-3 py-2">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                            {/* Tenant & Contact Details */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 text-xs border-b-2 border-orange-500 pb-1">
                                👤 Tenant Details
                              </h4>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Email:</span>
                                  <p className="text-gray-600 text-xs">{tenant.email}</p>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Phone:</span>
                                  <p className="text-gray-600 text-xs">{tenant.phone}</p>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Property:</span>
                                  <p className="text-gray-600 text-xs">{tenant.propertyName}</p>
                                </div>
                              </div>
                            </div>

                            {/* Billing-Critical Details */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 text-xs border-b-2 border-green-500 pb-1">
                                💰 Billing Info
                              </h4>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Monthly Rent:</span>
                                  <p className="text-gray-600 font-bold">{tenant.rent}</p>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Balance:</span>
                                  <p className={`font-bold ${
                                    tenant.accountBalance >= 0 
                                      ? 'text-green-600' 
                                      : 'text-red-600'
                                  }`}>
                                    Ksh {tenant.accountBalance.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Status:</span>
                                  <p className={`text-xs font-bold ${
                                    tenant.status === 'active'
                                      ? 'text-green-700'
                                      : 'text-gray-700'
                                  }`}>
                                    {tenant.status.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Lease Details */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 text-xs border-b-2 border-blue-500 pb-1">
                                📋 Lease Details
                              </h4>
                              <div className="space-y-1 text-xs">
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Unit:</span>
                                  <p className="text-gray-600 text-xs">{tenant.unitNumber}</p>
                                </div>
                                <div>
                                  <span className="font-bold text-gray-700 block text-xs">Start Date (Anchor):</span>
                                  <p className="text-gray-600 font-bold text-xs">{tenant.startDate}</p>
                                  <p className="text-gray-500 text-xs mt-0.5">⚠️ Billing anchor</p>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 text-xs border-b-2 border-purple-500 pb-1">
                                ⚙️ Actions
                              </h4>
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    navigate(`/tenant/${tenant.id}/statement`)
                                  }
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition-colors"
                                >
                                  💳 Statement
                                </button>
                                <button
                                  onClick={() =>
                                    navigate(`/tenant/${tenant.id}/billing`)
                                  }
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-xs transition-colors"
                                >
                                  📅 Schedule
                                </button>
                                <button
                                  onClick={() =>
                                    navigate(`/tenant/${tenant.id}/charges`)
                                  }
                                  className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded text-xs transition-colors"
                                >
                                  🔧 Charges
                                </button>
                                <button
                                  onClick={() =>
                                    navigate(`/tenant/${tenant.id}/escalations`)
                                  }
                                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded text-xs transition-colors"
                                >
                                  📈 Escalations
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-3 py-4 text-center text-gray-600 font-semibold text-xs">
                    No tenants found. Try adjusting filters or create a new tenant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== COMPACT PAGINATION FOOTER ===== */}
        <div className="flex-shrink-0 sticky bottom-0 z-20 bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-600">
            Showing {currentTenants.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, filteredTenants.length)} of {filteredTenants.length}{" "}
            tenants
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 text-xs"
            >
              <FaChevronLeft size={12} />
            </button>

            <div className="flex items-center gap-0.5">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= safeCurrentPage - 1 && page <= safeCurrentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                        safeCurrentPage === page
                          ? `${MILIK_ORANGE} text-white`
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === safeCurrentPage - 2 ||
                  page === safeCurrentPage + 2
                ) {
                  return (
                    <span key={page} className="px-1 text-gray-400 text-xs">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 text-xs"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tenants;
