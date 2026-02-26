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
  FaEdit,
  FaRedoAlt,
  FaArchive,
  FaUndo,
  FaChevronDown,
} from "react-icons/fa";

const STORAGE_KEY = "milik_landlords_v1";
const ITEMS_PER_PAGE = 50;

const MILIK_GREEN = "bg-[#0B3B2E]"; // deep MILIK-ish green
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const Landlords = () => {
  // Table + UI state
  const [selectedLandlords, setSelectedLandlords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isResizing, setIsResizing] = useState(false);

  // Modals
  const [showAddLandlordModal, setShowAddLandlordModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Data
  const [landlords, setLandlords] = useState([]);

  // ---- NEW: Draft filters (typed) + Applied filters (used for searching) ----
  const emptyFilters = {
    status: "any", // any | Active | Archived
    portal: "any", // any | Enabled | Disabled
    propsCount: "any", // any | 1-5 | 6-10 | 10+
    location: "any",

    code: "",
    name: "",
    regId: "",
    pin: "",
    email: "",
    phone: "",
  };

  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

  // Dropdown (Archive/Restore)
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const actionMenuRef = useRef(null);

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
    portalAccess: "Disabled",
    status: "Active",
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

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!actionMenuRef.current) return;
      if (!actionMenuRef.current.contains(e.target)) setActionMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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

  // --- APPLY SEARCH (button) ---
  const applySearch = () => {
    setAppliedFilters({
      ...draftFilters,
      code: draftFilters.code.trim(),
      name: draftFilters.name.trim(),
      regId: draftFilters.regId.trim(),
      pin: draftFilters.pin.trim(),
      email: draftFilters.email.trim(),
      phone: draftFilters.phone.trim(),
    });
    setCurrentPage(1);
    setSelectedLandlords([]);
    setSelectAll(false);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSelectedLandlords([]);
    setSelectAll(false);
    setCurrentPage(1);
    setActionMenuOpen(false);
  };

  const onFilterEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applySearch();
    }
  };

  // --- FILTER LOGIC (uses appliedFilters only) ---
  const matchesText = (fieldValue, query) => {
    const q = normalize(query);
    if (!q) return true;
    return normalize(fieldValue).includes(q);
  };

  const matchesPortal = (l) => {
    if (appliedFilters.portal === "any") return true;
    return String(l.portalAccess) === appliedFilters.portal;
  };

  const matchesLocation = (l) => {
    if (appliedFilters.location === "any") return true;
    return String(l.location) === appliedFilters.location;
  };

  const matchesStatus = (l) => {
    if (appliedFilters.status === "any") return true;
    return String(l.status || "Active") === appliedFilters.status;
  };

  const matchesPropertiesCount = (l) => {
    if (appliedFilters.propsCount === "any") return true;
    const n = Number(l.activeProperties || 0);
    if (Number.isNaN(n)) return false;

    if (appliedFilters.propsCount === "1-5") return n >= 1 && n <= 5;
    if (appliedFilters.propsCount === "6-10") return n >= 6 && n <= 10;
    if (appliedFilters.propsCount === "10+") return n >= 11;
    return true;
  };

  const matchesTypedFields = (l) => {
    return (
      matchesText(l.code, appliedFilters.code) &&
      matchesText(l.name, appliedFilters.name) &&
      matchesText(l.regId, appliedFilters.regId) &&
      matchesText(l.pin, appliedFilters.pin) &&
      matchesText(l.email, appliedFilters.email) &&
      matchesText(l.phone, appliedFilters.phone)
    );
  };

  const filteredLandlords = useMemo(() => {
    return landlords.filter(
      (l) =>
        matchesTypedFields(l) &&
        matchesStatus(l) &&
        matchesPortal(l) &&
        matchesLocation(l) &&
        matchesPropertiesCount(l)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landlords, appliedFilters]);

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
    if (selectedLandlords.includes(landlordId)) return "bg-[#CDE7D3] hover:bg-[#DFF1E3]";
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

  // --- TOP BAR ACTIONS ---
  const archiveSelected = () => {
    if (selectedLandlords.length === 0) return;
    setLandlords((prev) =>
      prev.map((l) =>
        selectedLandlords.includes(l.id) ? { ...l, status: "Archived", updatedAt: new Date().toISOString() } : l
      )
    );
    setActionMenuOpen(false);
  };

  const restoreSelected = () => {
    if (selectedLandlords.length === 0) return;
    setLandlords((prev) =>
      prev.map((l) =>
        selectedLandlords.includes(l.id) ? { ...l, status: "Active", updatedAt: new Date().toISOString() } : l
      )
    );
    setActionMenuOpen(false);
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
        <div className="flex-shrink-0 pt-2 px-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
            {/* Row 1: dropdown filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={draftFilters.status}
                onChange={(e) => setDraftFilters((p) => ({ ...p, status: e.target.value }))}
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
              >
                <option value="any">Status</option>
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={draftFilters.portal}
                onChange={(e) => setDraftFilters((p) => ({ ...p, portal: e.target.value }))}
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
              >
                <option value="any">Portal Access</option>
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>

              <select
                value={draftFilters.propsCount}
                onChange={(e) => setDraftFilters((p) => ({ ...p, propsCount: e.target.value }))}
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
              >
                <option value="any">Properties Count</option>
                <option value="1-5">1-5 Properties</option>
                <option value="6-10">6-10 Properties</option>
                <option value="10+">10+ Properties</option>
              </select>

              <select
                value={draftFilters.location}
                onChange={(e) => setDraftFilters((p) => ({ ...p, location: e.target.value }))}
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
              >
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === "any" ? "Location" : loc}
                  </option>
                ))}
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

              {/* Edit */}
              <button
                onClick={openEditModal}
                disabled={!canEdit}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                  canEdit ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}` : "bg-gray-400 cursor-not-allowed"
                }`}
                title={canEdit ? "Edit selected landlord" : "Select exactly 1 landlord to edit"}
              >
                <FaEdit className="text-xs" />
                Edit
              </button>

              {/* Archive / Restore dropdown */}
              <div className="relative" ref={actionMenuRef}>
                <button
                  onClick={() => setActionMenuOpen((v) => !v)}
                  disabled={selectedCount === 0}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                    selectedCount > 0 ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}` : "bg-gray-400 cursor-not-allowed"
                  }`}
                  title={selectedCount ? "Archive/Restore selected landlord(s)" : "Select landlord(s) first"}
                >
                  <FaArchive className="text-xs" />
                  Actions
                  <FaChevronDown className="text-[10px] opacity-90" />
                </button>

                {actionMenuOpen && selectedCount > 0 && (
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

              {/* Delete */}
              <button
                onClick={deleteSelected}
                disabled={selectedCount === 0}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                  selectedCount > 0 ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                title={selectedCount ? "Delete selected landlord(s)" : "Select landlord(s) to delete"}
              >
                <FaTrash className="text-xs" />
                Delete
              </button>

              {/* Existing actions */}
              <button
                onClick={openAddModal}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
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

            {/* Row 2: typed fields */}
            <div className="mt-2 grid grid-cols-2 md:grid-cols-6 gap-2">
              <input
                value={draftFilters.code}
                onChange={(e) => setDraftFilters((p) => ({ ...p, code: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Landlord Code"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.name}
                onChange={(e) => setDraftFilters((p) => ({ ...p, name: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Landlord Name"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.regId}
                onChange={(e) => setDraftFilters((p) => ({ ...p, regId: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Reg/ID No."
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.email}
                onChange={(e) => setDraftFilters((p) => ({ ...p, email: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Email"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.phone}
                onChange={(e) => setDraftFilters((p) => ({ ...p, phone: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Phone"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
            </div>
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
                      className="px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]"
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
                          className="relative px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                          style={{
                            width: `${width}px`,
                            minWidth: "80px",
                            position: "relative",
                          }}
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
                          <div className="text-sm text-gray-500">Use the filter fields above, then click Search</div>
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
                      <span className="font-bold">{filteredLandlords.length === 0 ? 0 : startIndex + 1}</span> to{" "}
                      <span className="font-bold">{Math.min(endIndex, filteredLandlords.length)}</span> of{" "}
                      <span className="font-bold">{filteredLandlords.length}</span> landlords
                    </span>

                    {selectedLandlords.length > 0 && (
                      <span className="bg-[#DDEFE1] text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold border border-[#0B3B2E]/30">
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
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= safeCurrentPage - 1 && page <= safeCurrentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1.5 min-w-[32px] text-xs rounded-lg border transition-colors font-bold ${
                              safeCurrentPage === page
                                ? "bg-[#0B3B2E] text-white border-[#0B3B2E] hover:bg-[#0A3127]"
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
                        className={`px-4 py-2 text-xs text-white rounded-lg flex items-center gap-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
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
                    className={`px-6 py-2 text-sm text-white rounded-lg transition-colors flex items-center gap-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
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