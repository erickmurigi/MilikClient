// pages/Landlord/Landlord.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  FaPlus,
  FaSearch,
  FaFileExport,
  FaEllipsisH,
  FaChevronLeft,
  FaChevronRight,
  FaGripVertical,
  FaTimes,
  FaSave,
  FaPaperclip,
  FaDownload as FaDownloadIcon,
  FaTrash,
  FaTrashAlt,
} from "react-icons/fa";

const STORAGE_KEY = "milik_landlords_v1";
const ITEMS_PER_PAGE = 50;

const Landlords = () => {
  // Table + UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLandlords, setSelectedLandlords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);

  // Modals
  const [showAddLandlordModal, setShowAddLandlordModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Filters
  const [filterField, setFilterField] = useState("any"); // any | code | name | regId | pin | location | email | phone
  const [filterPortal, setFilterPortal] = useState("any"); // any | Enabled | Disabled
  const [filterPropertiesCount, setFilterPropertiesCount] = useState("any"); // any | 1-5 | 6-10 | 10+
  const [filterLocation, setFilterLocation] = useState("any"); // any | value
  const [filterStatus, setFilterStatus] = useState("any"); // any | Active | Archived

  // Data
  const [landlords, setLandlords] = useState([]);

  // Modal form state
  const [formData, setFormData] = useState({
    landlordCode: "",
    landlordType: "Individual",
    landlordName: "",
    regId: "",
    taxPin: "",
    postalAddress: "",
    email: "",
    phoneNumber: "",
    location: "",
    portalAccess: "Disabled", // allow edit
    status: "Active", // Active | Archived
  });

  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  // Column widths (FIXED KEYS)
  const [columnWidths, setColumnWidths] = useState({
    code: 120,
    name: 220,
    status: 110,
    regId: 150,
    address: 220,
    location: 160,
    email: 220,
    phone: 160,
    active: 140,
    archived: 160,
    portal: 140,
  });

  const resizingRef = useRef(null);
  const tableRef = useRef(null);

  const columns = useMemo(
    () => [
      { key: "code", label: "Landlord Code" },
      { key: "name", label: "Landlord Name" },
      { key: "status", label: "Status" },
      { key: "regId", label: "Reg No./ID/PPT #" },
      { key: "address", label: "Address" },
      { key: "location", label: "Location" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone Nos." },
      { key: "active", label: "Active Properties" },
      { key: "archived", label: "Archived Properties" },
      { key: "portal", label: "Portal Access" },
    ],
    []
  );

  // Load from localStorage (persist across refresh)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLandlords(parsed);
      }
    } catch (e) {
      console.warn("Failed to load landlords from storage:", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(landlords));
    } catch (e) {
      console.warn("Failed to save landlords to storage:", e);
    }
  }, [landlords]);

  // Reset selectAll whenever page changes
  useEffect(() => {
    setSelectAll(false);
  }, [currentPage]);

  const normalize = (v) => String(v ?? "").toLowerCase().trim();

  const uniqueLocations = useMemo(() => {
    const set = new Set();
    landlords.forEach((l) => {
      if (l.location) set.add(l.location);
    });
    return ["any", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [landlords]);

  // --- SEARCH / FILTERS ---
  const matchesSearch = (l) => {
    const term = normalize(searchTerm);
    if (!term) return true;

    const fields = {
      code: normalize(l.code),
      name: normalize(l.name),
      status: normalize(l.status),
      regId: normalize(l.regId),
      pin: normalize(l.pin),
      address: normalize(l.address),
      location: normalize(l.location),
      email: normalize(l.email),
      phone: normalize(l.phone),
    };

    // IMPORTANT: user asked search by name, code, status
    // We still keep "any" and other fields for flexibility
    if (filterField === "any") return Object.values(fields).some((x) => x.includes(term));
    return (fields[filterField] || "").includes(term);
  };

  const matchesPortal = (l) => {
    if (filterPortal === "any") return true;
    return String(l.portalAccess) === filterPortal;
  };

  const matchesLocation = (l) => {
    if (filterLocation === "any") return true;
    return String(l.location) === filterLocation;
  };

  const matchesStatus = (l) => {
    if (filterStatus === "any") return true;
    return String(l.status || "Active") === filterStatus;
  };

  const matchesPropertiesCount = (l) => {
    if (filterPropertiesCount === "any") return true;
    const n = Number(l.activeProperties || 0);
    if (Number.isNaN(n)) return false;

    if (filterPropertiesCount === "1-5") return n >= 1 && n <= 5;
    if (filterPropertiesCount === "6-10") return n >= 6 && n <= 10;
    if (filterPropertiesCount === "10+") return n >= 11;
    return true;
  };

  const filteredLandlords = useMemo(() => {
    return landlords.filter(
      (l) =>
        matchesSearch(l) &&
        matchesStatus(l) &&
        matchesPortal(l) &&
        matchesLocation(l) &&
        matchesPropertiesCount(l)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    landlords,
    searchTerm,
    filterField,
    filterStatus,
    filterPortal,
    filterLocation,
    filterPropertiesCount,
  ]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLandlords.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLandlords = filteredLandlords.slice(startIndex, endIndex);

  // Ensure currentPage doesn't exceed totalPages after filtering
  useEffect(() => {
    if (currentPage !== safeCurrentPage) setCurrentPage(safeCurrentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // Selection
  const handleSelectLandlord = (id) => {
    setSelectedLandlords((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      const currentIds = currentLandlords.map((l) => l.id);
      setSelectedLandlords((prev) => prev.filter((id) => !currentIds.includes(id)));
      setSelectAll(false);
    } else {
      const currentIds = currentLandlords.map((l) => l.id);
      setSelectedLandlords((prev) => Array.from(new Set([...prev, ...currentIds])));
      setSelectAll(true);
    }
  };

  const handleCheckboxClick = (e) => e.stopPropagation();

  // Zebra + selection styling
  const getRowClass = (index, landlordId) => {
    if (selectedLandlords.includes(landlordId)) return "bg-[#addbb2] hover:bg-[#c8e6c9]";
    return index % 2 === 0 ? "bg-white hover:bg-[#f8f8f8]" : "bg-[#f9f9f9] hover:bg-[#f0f0f0]";
  };

  // Column resizing
  const startResizing = (columnKey, e) => {
    e.preventDefault();
    setIsResizing(true);

    const startWidth = columnWidths[columnKey] ?? 140;

    resizingRef.current = {
      columnKey,
      startX: e.clientX,
      startWidth,
    };

    const handleMouseMove = (evt) => {
      if (!resizingRef.current) return;
      const { columnKey: ck, startX, startWidth } = resizingRef.current;
      const diff = evt.clientX - startX;
      const newWidth = Math.max(80, startWidth + diff);

      setColumnWidths((prev) => ({
        ...prev,
        [ck]: newWidth,
      }));
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

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // --- MODAL / FORM ---
  const openAddModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData({
      landlordCode: "",
      landlordType: "Individual",
      landlordName: "",
      regId: "",
      taxPin: "",
      postalAddress: "",
      email: "",
      phoneNumber: "",
      location: "",
      portalAccess: "Disabled",
      status: "Active",
    });
    setAttachments([]);
    setShowAddLandlordModal(true);
  };

  const openEditModal = () => {
    if (selectedLandlords.length !== 1) return;
    const id = selectedLandlords[0];
    const l = landlords.find((x) => x.id === id);
    if (!l) return;

    setIsEditMode(true);
    setEditingId(id);
    setFormData({
      landlordCode: l.code || "",
      landlordType: l.landlordType || "Individual",
      landlordName: l.name || "",
      regId: l.regId || "",
      taxPin: l.pin || "",
      postalAddress: l.address || "",
      email: l.email || "",
      phoneNumber: l.phone || "",
      location: l.location || "",
      portalAccess: l.portalAccess || "Disabled",
      status: l.status || "Active",
    });
    setAttachments((l.attachments || []).map((a) => ({ ...a, file: null })));
    setShowAddLandlordModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      dateTime: new Date().toLocaleString(),
      file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const handleDownload = (attachment) => {
    if (!attachment?.file) return;
    const url = URL.createObjectURL(attachment.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const nextCode = () => {
    const codes = landlords
      .map((l) => String(l.code || ""))
      .filter((c) => /^LL\d{3,}$/i.test(c))
      .map((c) => Number(c.replace(/[^0-9]/g, "")))
      .filter((n) => !Number.isNaN(n));

    const max = codes.length ? Math.max(...codes) : 0;
    const next = max + 1;
    return `LL${String(next).padStart(3, "0")}`;
  };

  const handleAddOrEditSubmit = (e) => {
    e.preventDefault();

    const landlordCode = formData.landlordCode?.trim() || nextCode();

    if (!formData.landlordName?.trim()) return;
    if (!formData.regId?.trim()) return;
    if (!formData.taxPin?.trim()) return;
    if (!formData.phoneNumber?.trim()) return;

    const payload = {
      id: isEditMode ? editingId : Date.now(),
      code: landlordCode,
      name: formData.landlordName.trim(),
      pin: formData.taxPin.trim(),
      regId: formData.regId.trim(),
      address: formData.postalAddress?.trim() || "",
      location: formData.location?.trim() || "",
      email: formData.email?.trim() || "",
      phone: formData.phoneNumber?.trim() || "",
      activeProperties: String(
        Number.isFinite(Number((landlords.find((x) => x.id === editingId) || {}).activeProperties))
          ? (landlords.find((x) => x.id === editingId) || {}).activeProperties
          : 0
      ),
      archivedProperties: String(
        Number.isFinite(Number((landlords.find((x) => x.id === editingId) || {}).archivedProperties))
          ? (landlords.find((x) => x.id === editingId) || {}).archivedProperties
          : 0
      ),
      portalAccess: formData.portalAccess || "Disabled",
      status: formData.status || "Active",
      landlordType: formData.landlordType,
      attachments: attachments.map(({ id, name, size, dateTime }) => ({ id, name, size, dateTime })),
      updatedAt: new Date().toISOString(),
      ...(isEditMode ? {} : { createdAt: new Date().toISOString() }),
    };

    setLandlords((prev) => {
      if (!isEditMode) return [payload, ...prev];
      return prev.map((x) => (x.id === editingId ? { ...x, ...payload } : x));
    });

    setShowAddLandlordModal(false);
    setIsEditMode(false);
    setEditingId(null);
    setAttachments([]);
    setFormData({
      landlordCode: "",
      landlordType: "Individual",
      landlordName: "",
      regId: "",
      taxPin: "",
      postalAddress: "",
      email: "",
      phoneNumber: "",
      location: "",
      portalAccess: "Disabled",
      status: "Active",
    });

    setCurrentPage(1);
  };

  // --- TOP BAR BUTTON ACTIONS ---
  const resetFilters = () => {
    setSearchTerm("");
    setFilterField("any");
    setFilterStatus("any");
    setFilterPortal("any");
    setFilterPropertiesCount("any");
    setFilterLocation("any");
    setSelectedLandlords([]);
    setSelectAll(false);
    setCurrentPage(1);
  };

  const archiveSelected = () => {
    if (selectedLandlords.length === 0) return;
    setLandlords((prev) =>
      prev.map((l) =>
        selectedLandlords.includes(l.id)
          ? { ...l, status: "Archived", updatedAt: new Date().toISOString() }
          : l
      )
    );
  };

  const restoreSelected = () => {
    if (selectedLandlords.length === 0) return;
    setLandlords((prev) =>
      prev.map((l) =>
        selectedLandlords.includes(l.id)
          ? { ...l, status: "Active", updatedAt: new Date().toISOString() }
          : l
      )
    );
  };

  const deleteSelected = () => {
    if (selectedLandlords.length === 0) return;
    const ok = window.confirm(
      selectedLandlords.length === 1
        ? "Delete this landlord? This cannot be undone."
        : `Delete ${selectedLandlords.length} landlords? This cannot be undone.`
    );
    if (!ok) return;

    setLandlords((prev) => prev.filter((l) => !selectedLandlords.includes(l.id)));
    setSelectedLandlords([]);
    setSelectAll(false);
    setCurrentPage(1);
  };

  const selectedCount = selectedLandlords.length;
  const canEdit = selectedCount === 1;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-0 bg-gray-50">
        {/* Filters Row */}
        <div className="flex-shrink-0 pt-1 px-2">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 hover:bg-white transition-colors"
            >
              <option value="any">Status</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>

            {/* Search field selector */}
            <select
              value={filterField}
              onChange={(e) => {
                setFilterField(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 hover:bg-white transition-colors"
            >
              <option value="any">Search: Any Field</option>
              <option value="code">Landlord Code</option>
              <option value="name">Landlord Name</option>
              <option value="status">Status</option>
              <option value="regId">Reg No./ID</option>
              <option value="pin">PIN No.</option>
              <option value="location">Location</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>

            {/* Portal filter */}
            <select
              value={filterPortal}
              onChange={(e) => {
                setFilterPortal(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 hover:bg-white transition-colors"
            >
              <option value="any">Portal Access</option>
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>

            {/* Properties count filter */}
            <select
              value={filterPropertiesCount}
              onChange={(e) => {
                setFilterPropertiesCount(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 hover:bg-white transition-colors"
            >
              <option value="any">Properties Count</option>
              <option value="1-5">1-5 Properties</option>
              <option value="6-10">6-10 Properties</option>
              <option value="10+">10+ Properties</option>
            </select>

            {/* Location filter */}
            <select
              value={filterLocation}
              onChange={(e) => {
                setFilterLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-[#addbb2] text-gray-800 hover:bg-white transition-colors"
            >
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "any" ? "Location" : loc}
                </option>
              ))}
            </select>

            {/* Search input (REDUCED WIDTH to make space for buttons) */}
            <div className="relative w-full sm:w-[320px] md:w-[360px] lg:w-[420px]">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search by Landlord Name or Code..."
                className="w-full pl-10 pr-3 py-1 text-xs border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Buttons area (the highlighted space) */}
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-bold"
              title="Reset search, filters and selection"
            >
              RESET
            </button>

            <button
              onClick={openEditModal}
              disabled={!canEdit}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              title={canEdit ? "Edit selected landlord" : "Select exactly 1 landlord to edit"}
            >
              EDIT LANDLORD
            </button>

            <button
              onClick={archiveSelected}
              disabled={selectedCount === 0}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              title={selectedCount ? "Archive selected landlord(s)" : "Select landlord(s) to archive"}
            >
              ARCHIVE LANDLORD
            </button>

            <button
              onClick={restoreSelected}
              disabled={selectedCount === 0}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              title={selectedCount ? "Restore selected landlord(s)" : "Select landlord(s) to restore"}
            >
              RESTORE LANDLORD
            </button>

            <button
              onClick={deleteSelected}
              disabled={selectedCount === 0}
              className="px-3 py-1 text-xs border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors shadow-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              title={selectedCount ? "Delete selected landlord(s)" : "Select landlord(s) to delete"}
            >
              DELETE LANDLORD
            </button>

            {/* Existing right-side actions */}
            <button
              onClick={openAddModal}
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
        </div>

        {/* Table */}
        <div className="flex-1 px-2 pb-2 overflow-hidden relative">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1 pb-16">
              <table
                className="min-w-full text-xs border-collapse border border-gray-200 font-bold bg-white"
                ref={tableRef}
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  <tr className="sticky top-0 z-10">
                    <th
                      className="px-3 py-1 text-left font-bold text-gray-800 border border-gray-200 bg-[#addbb2]"
                      style={{ width: "50px", minWidth: "50px", maxWidth: "50px" }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAll && currentLandlords.length > 0}
                        onChange={handleSelectAll}
                        onClick={handleCheckboxClick}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>

                    {columns.map((column) => {
                      const width = columnWidths[column.key] ?? 140;
                      return (
                        <th
                          key={column.key}
                          className="relative px-3 py-1 text-left font-bold text-gray-800 border border-gray-200 bg-[#addbb2]"
                          style={{
                            width: `${width}px`,
                            minWidth: "80px",
                            position: "relative",
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
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {currentLandlords.length > 0 ? (
                    currentLandlords.map((landlord, index) => (
                      <tr
                        key={landlord.id}
                        className={`border-b border-gray-200 cursor-pointer transition-colors duration-150 ${getRowClass(
                          index,
                          landlord.id
                        )}`}
                        onClick={() => handleSelectLandlord(landlord.id)}
                      >
                        <td
                          className="px-3 py-1 border border-gray-200 align-top"
                          style={{ width: "50px", minWidth: "50px", maxWidth: "50px" }}
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

                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {landlord.code}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {landlord.name}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-1 border border-gray-200 align-top">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap border ${
                              String(landlord.status || "Active") === "Active"
                                ? selectedLandlords.includes(landlord.id)
                                  ? "bg-white text-green-800 border-green-300"
                                  : "bg-green-100 text-green-800 border-green-300"
                                : selectedLandlords.includes(landlord.id)
                                ? "bg-white text-gray-800 border-gray-300"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                            }`}
                          >
                            {landlord.status || "Active"}
                          </span>
                        </td>

                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {landlord.regId}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {landlord.address}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {landlord.location}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {landlord.email}
                        </td>
                        <td className="px-3 py-1 font-bold text-gray-900 border border-gray-200 align-top whitespace-nowrap overflow-hidden text-ellipsis">
                          {landlord.phone}
                        </td>

                        <td className="px-3 py-1 text-center font-bold text-gray-900 border border-gray-200 align-top">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                              selectedLandlords.includes(landlord.id)
                                ? "bg-white text-green-800 border-green-300"
                                : "bg-green-100 text-green-800 border-green-300"
                            }`}
                          >
                            {landlord.activeProperties ?? "0"}
                          </span>
                        </td>

                        <td className="px-3 py-1 text-center font-bold text-gray-900 border border-gray-200 align-top">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                              selectedLandlords.includes(landlord.id)
                                ? "bg-white text-gray-800 border-gray-300"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                            }`}
                          >
                            {landlord.archivedProperties ?? "0"}
                          </span>
                        </td>

                        <td className="px-3 py-1 border border-gray-200 align-top">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap border ${
                              landlord.portalAccess === "Enabled"
                                ? selectedLandlords.includes(landlord.id)
                                  ? "bg-white text-green-800 border-green-300"
                                  : "bg-green-100 text-green-800 border-green-300"
                                : selectedLandlords.includes(landlord.id)
                                ? "bg-white text-gray-800 border-gray-300"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                            }`}
                          >
                            {landlord.portalAccess || "Disabled"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="px-3 py-4 text-center text-gray-500 border border-gray-200 bg-white"
                      >
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="text-lg font-bold text-gray-400 mb-2">No landlords found</div>
                          <div className="text-sm text-gray-500">
                            Click <span className="font-semibold">Add Landlord</span> to create your first record
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 shadow-sm">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="font-bold">
                      Showing{" "}
                      <span className="font-bold">
                        {filteredLandlords.length === 0 ? 0 : startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold">{Math.min(endIndex, filteredLandlords.length)}</span>{" "}
                      of <span className="font-bold">{filteredLandlords.length}</span> landlords
                    </span>

                    {selectedLandlords.length > 0 && (
                      <span className="bg-[#addbb2] text-gray-800 px-2 py-0.5 rounded-full text-xs font-bold border border-green-300">
                        {selectedLandlords.length} selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    <FaChevronLeft size={10} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (page === 1 || page === totalPages || (page >= safeCurrentPage - 1 && page <= safeCurrentPage + 1)) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1.5 min-w-[32px] text-xs rounded-lg border transition-colors font-bold ${
                              safeCurrentPage === page
                                ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      if (page === safeCurrentPage - 2 || page === safeCurrentPage + 2) {
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
                    onClick={() => goToPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                  >
                    Next
                    <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resizing overlay */}
        {isResizing && <div className="fixed inset-0 z-50 cursor-col-resize" style={{ cursor: "col-resize" }} />}

        {/* Add/Edit Landlord Modal */}
        {showAddLandlordModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md backdrop-saturate-300 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {isEditMode ? "Edit Landlord" : "Add New Landlord"}
                  </h2>
                  <p className="text-xs text-gray-600">Fill in the landlord details below</p>
                </div>
                <button
                  onClick={() => setShowAddLandlordModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleAddOrEditSubmit} id="landlordForm">
                  {/* General */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b">General Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Landlord Code</label>
                        <input
                          type="text"
                          name="landlordCode"
                          value={formData.landlordCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Leave blank to auto-generate (LL001...)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Landlord Type *</label>
                        <select
                          name="landlordType"
                          value={formData.landlordType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                          required
                        >
                          <option value="Individual">Individual</option>
                          <option value="Company">Company</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Trust">Trust</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Landlord Name *</label>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Reg/ID NO. *</label>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tax/PIN NO. *</label>
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

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Portal Access</label>
                        <select
                          name="portalAccess"
                          value={formData.portalAccess}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        >
                          <option value="Enabled">Enabled</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b">Address Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Postal Address</label>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
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
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
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

                  {/* Attachments */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b">Attachments</h3>

                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
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

                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                    </div>

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

                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">LANDLORD DETAILS</h3>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                <div className="text-xs text-gray-500">Fields marked with * are required</div>
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
                      setFormData({
                        landlordCode: "",
                        landlordType: "Individual",
                        landlordName: "",
                        regId: "",
                        taxPin: "",
                        postalAddress: "",
                        email: "",
                        phoneNumber: "",
                        location: "",
                        portalAccess: "Disabled",
                        status: "Active",
                      });
                      setAttachments([]);
                    }}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    form="landlordForm"
                    className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave /> {isEditMode ? "Save Changes" : "Save Landlord"}
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