// pages/Properties.js
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaGripVertical,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
  FaTimes,
  FaBuilding,
  FaRedoAlt,
  FaArchive,
  FaUndo,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getProperties, deleteProperty } from "../../redux/propertyRedux";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const Properties = () => {
  const dispatch = useDispatch();

  // Redux state
  const { properties, loading, error, pagination } = useSelector((state) => state.property);

  // Pagination
  const itemsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Selection + table UI
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Dropdown (Archive/Restore placeholder - if you add redux actions later)
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const actionMenuRef = useRef(null);

  // Column resizing (stateful, not mutating const)
  const [columnWidths, setColumnWidths] = useState({
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
  });

  const resizingRef = useRef(null);
  const tableRef = useRef(null);

  const columns = useMemo(
    () => [
      { key: "code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "landlord", label: "Landlord" },
      { key: "category", label: "Category" },
      { key: "zone", label: "Zone" },
      { key: "location", label: "Location" },
      { key: "totalUnits", label: "Total Units" },
      { key: "occupiedUnits", label: "Occupied" },
      { key: "vacantUnits", label: "Vacant" },
      { key: "area", label: "Unit Measurement" },
      { key: "grossArea", label: "Gross Area" },
      { key: "netArea", label: "Net Area" },
      { key: "fieldOfficer", label: "Field Officer" },
      { key: "dateAcquired", label: "Date Acquired" },
      { key: "status", label: "Status" },
    ],
    []
  );

  // ---- NEW: Draft (typed) filters + Applied (searched) filters ----
  const emptyFilters = {
    status: "",
    zone: "",
    category: "",
    // typed
    code: "",
    name: "",
    lr: "",
    landlord: "",
    location: "",
  };

  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!actionMenuRef.current) return;
      if (!actionMenuRef.current.contains(e.target)) setActionMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Keep selectAll off when page changes
  useEffect(() => {
    setSelectAll(false);
  }, [currentPage]);

  // Apply search (button)
  const applySearch = () => {
    setAppliedFilters({
      ...draftFilters,
      code: draftFilters.code.trim(),
      name: draftFilters.name.trim(),
      lr: draftFilters.lr.trim(),
      landlord: draftFilters.landlord.trim(),
      location: draftFilters.location.trim(),
    });
    setCurrentPage(1);
    setSelectedProperties([]);
    setSelectAll(false);
    setActionMenuOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
    setSelectedProperties([]);
    setSelectAll(false);
    setExpandedRow(null);
    setActionMenuOpen(false);
  };

  const onFilterEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applySearch();
    }
  };

  // Fetch properties when applied filters or page changes
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      // we keep backend "search" empty because we're using explicit fields;
      // if your backend expects one string, you can combine them later.
      search: "",
      status: appliedFilters.status,
      zone: appliedFilters.zone,
      category: appliedFilters.category,
      // NOTE: only include these if your API supports them.
      // If not supported, it's still safe (backend may ignore unknown params),
      // but remove if your server rejects unknown query params.
      code: appliedFilters.code,
      name: appliedFilters.name,
      lrNumber: appliedFilters.lr,
      landlord: appliedFilters.landlord,
      location: appliedFilters.location,
    };

    dispatch(getProperties(params));
  }, [dispatch, currentPage, itemsPerPage, appliedFilters]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Selection
  const handleSelectProperty = (id) => {
    setSelectedProperties((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProperties([]);
      setSelectAll(false);
    } else {
      setSelectedProperties((properties || []).map((p) => p._id));
      setSelectAll(true);
    }
  };

  const handleCheckboxClick = (e) => e.stopPropagation();

  // Expand row (no navigation here)
  const handleRowClick = (propertyId, e) => {
    if (e.target.type === "checkbox" || e.target.closest(".action-buttons")) return;
    setExpandedRow((prev) => (prev === propertyId ? null : propertyId));
  };

  // Delete
  const handleDelete = async (propertyId) => {
    try {
      await dispatch(deleteProperty(propertyId)).unwrap();
      toast.success("Property deleted successfully");
      setShowDeleteConfirm(null);

      // refresh
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: "",
        status: appliedFilters.status,
        zone: appliedFilters.zone,
        category: appliedFilters.category,
        code: appliedFilters.code,
        name: appliedFilters.name,
        lrNumber: appliedFilters.lr,
        landlord: appliedFilters.landlord,
        location: appliedFilters.location,
      };
      dispatch(getProperties(params));
    } catch (err) {
      toast.error(err || "Failed to delete property");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) {
      toast.error("No properties selected");
      return;
    }

    const ok = window.confirm(
      `Are you sure you want to delete ${selectedProperties.length} properties? This action cannot be undone.`
    );
    if (!ok) return;

    try {
      for (const propertyId of selectedProperties) {
        await dispatch(deleteProperty(propertyId));
      }
      toast.success(`${selectedProperties.length} properties deleted successfully`);
      setSelectedProperties([]);
      setSelectAll(false);

      // refresh
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: "",
        status: appliedFilters.status,
        zone: appliedFilters.zone,
        category: appliedFilters.category,
        code: appliedFilters.code,
        name: appliedFilters.name,
        lrNumber: appliedFilters.lr,
        landlord: appliedFilters.landlord,
        location: appliedFilters.location,
      };
      dispatch(getProperties(params));
    } catch (err) {
      toast.error("Failed to delete some properties");
    }
  };

  const handleExport = () => toast.info("Export feature coming soon");

  // Column resizing
  const startResizing = (columnKey, e) => {
    e.preventDefault();
    setIsResizing(true);

    const startWidth = columnWidths[columnKey] ?? 140;
    resizingRef.current = { columnKey, startX: e.clientX, startWidth };

    const handleMouseMove = (evt) => {
      if (!resizingRef.current) return;
      const { columnKey: ck, startX, startWidth: sw } = resizingRef.current;
      const diff = evt.clientX - startX;
      const newWidth = Math.max(80, sw + diff);

      setColumnWidths((prev) => ({ ...prev, [ck]: newWidth }));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizingRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Row styling
  const getRowClass = (index, id) => {
    if (selectedProperties.includes(id)) return "bg-[#CDE7D3] hover:bg-[#DFF1E3]";
    return index % 2 === 0 ? "bg-white hover:bg-[#f8f8f8]" : "bg-[#f9f9f9] hover:bg-[#f0f0f0]";
  };

  // Helpers
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPrimaryLandlord = (landlords) => {
    if (!landlords || landlords.length === 0) return "N/A";
    const primary = landlords.find((l) => l.isPrimary);
    return primary ? primary.name : landlords[0].name;
  };

  const getFullAddress = (property) => {
    const parts = [property.roadStreet, property.estateArea, property.townCityState].filter(
      (p) => p && p.trim() !== ""
    );
    return parts.join(", ") || property.address || "N/A";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "closed":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "residential":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "commercial":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "mixed use":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const totalPages = Math.max(1, Math.ceil((pagination?.total || 0) / itemsPerPage));

  // Archive/Restore placeholders (wire later)
  const archiveSelected = () => {
    toast.info("Archive feature coming soon");
    setActionMenuOpen(false);
  };
  const restoreSelected = () => {
    toast.info("Restore feature coming soon");
    setActionMenuOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-0 bg-gray-50">
        {/* Filters Card (consistent with Landlords) */}
        <div className="flex-shrink-0 pt-2 px-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
            {/* Row 1: dropdown filters + buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
                value={draftFilters.status}
                onChange={(e) => setDraftFilters((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="closed">Closed</option>
              </select>

              <select
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
                value={draftFilters.zone}
                onChange={(e) => setDraftFilters((p) => ({ ...p, zone: e.target.value }))}
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
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
                value={draftFilters.category}
                onChange={(e) => setDraftFilters((p) => ({ ...p, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed Use">Mixed Use</option>
                <option value="Industrial">Industrial</option>
                <option value="Agricultural">Agricultural</option>
              </select>

              {/* Search button */}
              <button
                onClick={applySearch}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_ORANGE} ${MILIK_ORANGE_HOVER}`}
                title="Search using the fields"
              >
                <FaSearch className="text-xs" />
                Search
              </button>

              {/* Reset */}
              <button
                onClick={resetFilters}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                title="Reset filters and selection"
              >
                <FaRedoAlt className="text-xs" />
                Reset
              </button>

              {/* Edit (only when 1 selected) */}
              <Link to={selectedProperties.length === 1 ? `/properties/edit/${selectedProperties[0]}` : "#"}>
                <button
                  disabled={selectedProperties.length !== 1}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                    selectedProperties.length === 1 ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}` : "bg-gray-400 cursor-not-allowed"
                  }`}
                  title={
                    selectedProperties.length === 1 ? "Edit selected property" : "Select exactly 1 property to edit"
                  }
                  onClick={(e) => {
                    if (selectedProperties.length !== 1) e.preventDefault();
                  }}
                >
                  <FaEdit className="text-xs" />
                  Edit
                </button>
              </Link>

              {/* Archive / Restore dropdown (placeholder) */}
              <div className="relative" ref={actionMenuRef}>
                <button
                  onClick={() => setActionMenuOpen((v) => !v)}
                  disabled={selectedProperties.length === 0}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                    selectedProperties.length > 0 ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}` : "bg-gray-400 cursor-not-allowed"
                  }`}
                  title={selectedProperties.length ? "Archive/Restore selected properties" : "Select properties first"}
                >
                  <FaArchive className="text-xs" />
                  Actions
                  <FaChevronDown className="text-[10px] opacity-90" />
                </button>

                {actionMenuOpen && selectedProperties.length > 0 && (
                  <div className="absolute mt-1 right-0 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={archiveSelected}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FaArchive className="text-xs text-gray-700" />
                      Archive
                    </button>
                    <button
                      onClick={restoreSelected}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FaUndo className="text-xs text-gray-700" />
                      Restore
                    </button>
                  </div>
                )}
              </div>

              {/* Bulk Delete */}
              <button
                onClick={handleBulkDelete}
                disabled={selectedProperties.length === 0}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                  selectedProperties.length > 0 ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                title={selectedProperties.length ? "Delete selected properties" : "Select properties to delete"}
              >
                <FaTrash className="text-xs" />
                Delete {selectedProperties.length > 0 ? `(${selectedProperties.length})` : ""}
              </button>

              {/* Add / Export */}
              <Link to="/properties/new">
                <button
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                >
                  <FaPlus className="text-xs" />
                  Add Property
                </button>
              </Link>

              <button
                onClick={handleExport}
                className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <FaFileExport className="text-xs" />
                Export
              </button>
            </div>

            {/* Row 2: typed fields (like Landlords) */}
            <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2">
              <input
                value={draftFilters.code}
                onChange={(e) => setDraftFilters((p) => ({ ...p, code: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Property Code"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.name}
                onChange={(e) => setDraftFilters((p) => ({ ...p, name: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Property Name"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.lr}
                onChange={(e) => setDraftFilters((p) => ({ ...p, lr: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="LR Number"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.landlord}
                onChange={(e) => setDraftFilters((p) => ({ ...p, landlord: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Landlord"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.location}
                onChange={(e) => setDraftFilters((p) => ({ ...p, location: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Location"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 px-2 pb-2 overflow-hidden relative">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-3xl text-emerald-600 mb-4" />
                <p className="text-gray-600">Loading properties...</p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto flex-1 pb-16">
                <table
                  className="min-w-full text-xs border-collapse border border-gray-200 font-bold bg-white"
                  ref={tableRef}
                  style={{ tableLayout: "fixed" }}
                >
                  <thead>
                    <tr className="sticky top-0 z-10">
                      {/* Checkbox */}
                      <th
                        className="px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                        style={{ width: "50px", minWidth: "50px", maxWidth: "50px" }}
                      >
                        <input
                          type="checkbox"
                          checked={selectAll && (properties || []).length > 0}
                          onChange={handleSelectAll}
                          onClick={handleCheckboxClick}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </th>

                      {/* Expand */}
                      <th
                        className="px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                        style={{ width: "40px", minWidth: "40px", maxWidth: "40px" }}
                      />

                      {columns.map((column) => {
                        const width = columnWidths[column.key] ?? 140;
                        return (
                          <th
                            key={column.key}
                            className="relative px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                            style={{ width: `${width}px`, minWidth: "80px", position: "relative" }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{column.label}</span>
                              <div
                                className="w-2 h-4 ml-1 cursor-col-resize hover:bg-white/20 flex items-center justify-center rounded"
                                onMouseDown={(e) => startResizing(column.key, e)}
                                title="Drag to resize"
                              >
                                <FaGripVertical className="text-white/70 text-xs" />
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {properties && properties.length > 0 ? (
                      properties.map((property, index) => (
                        <React.Fragment key={property._id}>
                          <tr
                            className={`border-b border-gray-200 cursor-pointer transition-colors duration-150 ${getRowClass(
                              index,
                              property._id
                            )}`}
                            onClick={(e) => handleRowClick(property._id, e)}
                          >
                            {/* checkbox */}
                            <td
                              className="px-3 py-1 border border-gray-200 align-top"
                              style={{ width: "50px" }}
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

                            {/* expand btn */}
                            <td className="px-1 py-1 border border-gray-200 align-top text-center" style={{ width: "40px" }}>
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

                            {/* Code */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                              {property.propertyCode}
                            </td>

                            {/* Name */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                              {property.propertyName}
                            </td>

                            {/* Landlord */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                              {getPrimaryLandlord(property.landlords)}
                            </td>

                            {/* Category */}
                            <td className="px-3 py-1 border border-gray-200 align-top">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${getCategoryColor(
                                  property.category
                                )}`}
                              >
                                {property.category || "N/A"}
                              </span>
                            </td>

                            {/* Zone */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                              {property.zoneRegion || "N/A"}
                            </td>

                            {/* Location */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                              {getFullAddress(property)}
                            </td>

                            {/* Units */}
                            <td className="px-3 py-1 text-center border border-gray-200 align-top">{property.totalUnits || 0}</td>
                            <td className="px-3 py-1 text-center border border-gray-200 align-top">
                              <span className="font-bold text-green-700">{property.occupiedUnits || 0}</span>
                            </td>
                            <td className="px-3 py-1 text-center border border-gray-200 align-top">
                              <span className="font-bold text-red-700">{property.vacantUnits || 0}</span>
                            </td>

                            {/* Unit measurement */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap">Sq Meter</td>

                            {/* Areas */}
                            <td className="px-3 py-1 text-right border border-gray-200 align-top">{property.grossArea || "0"}</td>
                            <td className="px-3 py-1 text-right border border-gray-200 align-top">{property.netArea || "0"}</td>

                            {/* Officer */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                              {property.fieldOfficer || "N/A"}
                            </td>

                            {/* Acquired */}
                            <td className="px-3 py-1 border border-gray-200 align-top whitespace-nowrap">
                              {formatDate(property.dateAcquired)}
                            </td>

                            {/* Status */}
                            <td className="px-3 py-1 border border-gray-200 align-top">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${getStatusColor(
                                  property.status
                                )}`}
                              >
                                {property.status || "N/A"}
                              </span>
                            </td>
                          </tr>

                          {/* Expanded row */}
                          {expandedRow === property._id && (
                            <tr className={getRowClass(index, property._id)}>
                              <td colSpan={columns.length + 2} className="p-4 border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Property Details</h4>
                                    <div>
                                      <span className="text-xs text-gray-500">Property Type:</span>
                                      <p className="text-sm font-medium">{property.propertyType || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Specification:</span>
                                      <p className="text-sm font-medium">{property.specification || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Floors:</span>
                                      <p className="text-sm font-medium">{property.numberOfFloors || "0"}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">LR Number:</span>
                                      <p className="text-sm font-medium">{property.lrNumber || "N/A"}</p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Financial Details</h4>
                                    <div>
                                      <span className="text-xs text-gray-500">Let/Manage:</span>
                                      <p className="text-sm font-medium">{property.letManage || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Account Ledger:</span>
                                      <p className="text-sm font-medium">{property.accountLedgerType || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">Invoice Prefix:</span>
                                      <p className="text-sm font-medium">{property.invoicePrefix || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-500">M-Pesa Paybill:</span>
                                      <p className="text-sm font-medium">{property.mpesaPaybill ? "Yes" : "No"}</p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Contact Details</h4>
                                    {property.landlords && property.landlords.length > 0 ? (
                                      property.landlords.map((landlord, idx) => (
                                        <div key={idx} className="mb-2">
                                          <p className="text-sm font-medium">
                                            {landlord.name} {landlord.isPrimary && "(Primary)"}
                                          </p>
                                          {landlord.contact && <p className="text-xs text-gray-600">{landlord.contact}</p>}
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

                                  <div className="space-y-3">
                                    <h4 className="font-bold text-gray-800 text-sm mb-2">Actions</h4>
                                    <div className="flex flex-wrap gap-2 action-buttons">
                                      <Link to={`/properties/${property._id}`} onClick={(e) => e.stopPropagation()}>
                                        <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors w-full">
                                          <FaEye /> View Details
                                        </button>
                                      </Link>

                                      <Link to={`/properties/edit/${property._id}`} onClick={(e) => e.stopPropagation()}>
                                        <button className={`px-3 py-1.5 text-xs text-white rounded-lg flex items-center gap-2 transition-colors w-full ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}>
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

                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                      <h4 className="font-bold text-gray-800 text-sm mb-2">Quick Stats</h4>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-blue-50 p-2 rounded">
                                          <p className="text-xs text-gray-600">Occupancy Rate</p>
                                          <p className="text-sm font-bold">
                                            {property.totalUnits > 0
                                              ? `${Math.round((property.occupiedUnits / property.totalUnits) * 100)}%`
                                              : "0%"}
                                          </p>
                                        </div>
                                        <div className="bg-green-50 p-2 rounded">
                                          <p className="text-xs text-gray-600">Vacancy Rate</p>
                                          <p className="text-sm font-bold">
                                            {property.totalUnits > 0
                                              ? `${Math.round((property.vacantUnits / property.totalUnits) * 100)}%`
                                              : "0%"}
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
                      <tr>
                        <td colSpan={columns.length + 2} className="px-3 py-4 text-center text-gray-500 border border-gray-200 bg-white">
                          <div className="flex flex-col items-center justify-center py-8">
                            <FaBuilding className="text-4xl text-gray-300 mb-4" />
                            <div className="text-lg font-bold text-gray-400 mb-2">No properties found</div>
                            <div className="text-sm text-gray-500 mb-4">Use the filter fields above, then click Search</div>
                            <Link to="/properties/new">
                              <button className={`px-4 py-2 text-white rounded-lg transition-colors ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}>
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

        {/* Footer with pagination (consistent with Landlords - fixed bottom bar style) */}
        {!loading && properties && properties.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 shadow-sm">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="font-bold">
                    Showing{" "}
                    <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-bold">{Math.min(currentPage * itemsPerPage, pagination?.total || 0)}</span> of{" "}
                    <span className="font-bold">{pagination?.total || 0}</span> properties
                  </span>

                  {selectedProperties.length > 0 && (
                    <span className="bg-[#DDEFE1] text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold border border-[#0B3B2E]/30">
                      {selectedProperties.length} selected
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                >
                  <FaChevronLeft size={10} />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 min-w-[32px] text-xs rounded-lg border transition-colors font-bold ${
                            currentPage === page
                              ? "bg-[#0B3B2E] text-white border-[#0B3B2E] hover:bg-[#0A3127]"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
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
        {isResizing && <div className="fixed inset-0 z-50 cursor-col-resize" style={{ cursor: "col-resize" }} />}
      </div>
    </DashboardLayout>
  );
};

export default Properties;