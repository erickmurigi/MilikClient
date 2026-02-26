// pages/Units.js
import React, { useMemo, useRef, useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  FaPlus,
  FaSearch,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaGripVertical,
  FaTimes,
  FaSave,
  FaRedoAlt,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaArchive,
  FaUndo,
} from "react-icons/fa";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const ITEMS_PER_PAGE = 50;

const Units = () => {
  // ---------------------------
  // UI STATE
  // ---------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPropertyId, setExpandedPropertyId] = useState(null);

  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [isResizing, setIsResizing] = useState(false);
  const resizingRef = useRef(null);

  // Archive/Restore dropdown (placeholder, wire later)
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const actionMenuRef = useRef(null);

  // Modal
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);

  // ---------------------------
  // FILTERS (Draft -> Apply with Search button)
  // ---------------------------
  const emptyFilters = {
    property: "any",
    status: "any",
    unitType: "any",
    unitNo: "",
    tenant: "",
  };

  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);

  const applySearch = () => {
    setAppliedFilters({
      ...draftFilters,
      unitNo: draftFilters.unitNo.trim(),
      tenant: draftFilters.tenant.trim(),
    });
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedUnits([]);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setCurrentPage(1);
    setExpandedPropertyId(null);
    setSelectAll(false);
    setSelectedUnits([]);
    setActionMenuOpen(false);
  };

  const onFilterEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applySearch();
    }
  };

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
  useEffect(() => setSelectAll(false), [currentPage]);

  // ---------------------------
  // MODAL FORM STATE (kept from your code)
  // ---------------------------
  const [formData, setFormData] = useState({
    property: "",
    specifiedFloor: "",
    generalFloorNo: "",
    unitSpaceNo: "",
    ownerOccupied: "No",
    rentPerUnitArea: "",
    marketRent: "",
    areaSqFt: "",
    chargeFreq: "",
    electricityAccountNo: "",
    waterAccountNo: "",
    electricityMeterNo: "",
    waterMeterNo: "",
  });

  const [services, setServices] = useState([{ service: "", costPerArea: "", totalCost: "", checked: false }]);
  const [extraMeters, setExtraMeters] = useState([{ meterNo: "", readingSetup: false }]);

  // ---------------------------
  // MOCK DATA (your generator)
  // ---------------------------
  const generateUnitsData = () => {
    const baseUnits = [
      // A1
      { id: "4423425", unitNo: "SERVICE CHA...", property: "A1", tenant: "R.R", area: "0.00", rentUnit: "Ksh 0.00", marketRent: "Ksh 0.00", currentRent: "Ksh 0.00", unitType: "Commercial", status: "Occupied", vacantFrom: "-", propertyId: "property-1" },
      { id: "4423424", unitNo: "WATER", property: "A1", tenant: "MAN VICTOR", area: "0.00", rentUnit: "Ksh 0.00", marketRent: "Ksh 0.00", currentRent: "Ksh 0.00", unitType: "Utility", status: "Occupied", vacantFrom: "-", propertyId: "property-1" },

      // AAA
      { id: "3778019", unitNo: "√", property: "AAA", tenant: "MATOBORI DENNIS", area: "0.00", rentUnit: "Ksh 15,000", marketRent: "Ksh 16,000", currentRent: "Ksh 15,000", unitType: "Residential", status: "Occupied", vacantFrom: "-", propertyId: "property-2" },
      { id: "3778018", unitNo: "ZA", property: "AAA", tenant: "BLACK RAVEN", area: "0.00", rentUnit: "Ksh 12,500", marketRent: "Ksh 13,500", currentRent: "Ksh 12,500", unitType: "Commercial", status: "Occupied", vacantFrom: "-", propertyId: "property-2" },

      // ALL PURPOSE
      { id: "5180166", unitNo: "6", property: "ALL PURPOSE APARTMENT", tenant: "IAN WAWERU", area: "0.00", rentUnit: "Ksh 20,000", marketRent: "Ksh 22,000", currentRent: "Ksh 20,000", unitType: "Residential", status: "Occupied", vacantFrom: "-", propertyId: "property-3" },
      { id: "5180167", unitNo: "7", property: "ALL PURPOSE APARTMENT", tenant: "EDTR JANE", area: "0.00", rentUnit: "Ksh 18,500", marketRent: "Ksh 20,000", currentRent: "Ksh 18,500", unitType: "Residential", status: "Occupied", vacantFrom: "-", propertyId: "property-3" },

      // ALPHA
      { id: "5070726", unitNo: "24", property: "ALPHA APARTMENT", tenant: "-", area: "0.00", rentUnit: "Ksh 25,000", marketRent: "Ksh 27,000", currentRent: "Ksh 0.00", unitType: "Residential", status: "Vacant", vacantFrom: "2023-11-01", propertyId: "property-4" },
      { id: "5070727", unitNo: "25", property: "ALPHA APARTMENT", tenant: "FREEMAN MORGAN", area: "0.00", rentUnit: "Ksh 22,000", marketRent: "Ksh 24,000", currentRent: "Ksh 22,000", unitType: "Residential", status: "Occupied", vacantFrom: "-", propertyId: "property-4" },
      { id: "5070728", unitNo: "27", property: "ALPHA APARTMENT", tenant: "DDEWWT MACHUNGO", area: "0.00", rentUnit: "Ksh 21,500", marketRent: "Ksh 23,500", currentRent: "Ksh 21,500", unitType: "Residential", status: "Occupied", vacantFrom: "-", propertyId: "property-4" },
    ];

    // Add more random units (same spirit as your code)
    const properties = [
      { name: "A1", id: "property-1" },
      { name: "AAA", id: "property-2" },
      { name: "ALL PURPOSE APARTMENT", id: "property-3" },
      { name: "ALPHA APARTMENT", id: "property-4" },
      { name: "BASIL TOWERS", id: "property-5" },
      { name: "BLUE SKY PLAZA", id: "property-6" },
      { name: "CAMON COURT", id: "property-7" },
      { name: "CITE TOWERS", id: "property-8" },
    ];

    const unitTypes = ["Residential", "Commercial", "Utility", "Mixed Use"];
    const statuses = ["Occupied", "Vacant", "Maintenance"];
    const tenants = ["R.R", "MAN VICTOR", "MATOBORI DENNIS", "BLACK RAVEN", "IAN WAWERU", "EDTR JANE", "FREEMAN MORGAN", "DDEWWT MACHUNGO", "-"];

    let allUnits = [...baseUnits];
    let currentId = 6000000;

    for (let i = 9; i <= 25; i++) {
      const p = properties[i % properties.length];
      const unitCount = Math.floor(Math.random() * 8) + 2;

      for (let j = 1; j <= unitCount; j++) {
        const area = (Math.random() * 200 + 50).toFixed(2);
        const marketRent = Math.floor(Math.random() * 50000) + 10000;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const currentRent = status === "Vacant" ? 0 : Math.floor(marketRent * 0.9);

        allUnits.push({
          id: String(currentId++),
          unitNo: `U-${Math.floor(Math.random() * 100) + 100}`,
          property: p.name,
          tenant: tenants[Math.floor(Math.random() * tenants.length)],
          area,
          rentUnit: `Ksh ${(marketRent / parseFloat(area)).toFixed(2)}`,
          marketRent: `Ksh ${marketRent.toLocaleString()}`,
          currentRent: `Ksh ${currentRent.toLocaleString()}`,
          unitType: unitTypes[Math.floor(Math.random() * unitTypes.length)],
          status,
          vacantFrom: status === "Vacant" ? "2024-01-15" : "-",
          propertyId: p.id,
        });
      }
    }

    return allUnits;
  };

  const unitsData = useMemo(() => generateUnitsData(), []);

  // For filter dropdown property list
  const uniqueProperties = useMemo(() => {
    const set = new Set(unitsData.map((u) => u.property).filter(Boolean));
    return ["any", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [unitsData]);

  // ---------------------------
  // FILTER + GROUP (Units under Property)
  // ---------------------------
  const normalize = (v) => String(v ?? "").toLowerCase().trim();

  const filteredUnits = useMemo(() => {
    return unitsData.filter((u) => {
      if (appliedFilters.property !== "any" && u.property !== appliedFilters.property) return false;
      if (appliedFilters.status !== "any" && u.status !== appliedFilters.status) return false;
      if (appliedFilters.unitType !== "any" && u.unitType !== appliedFilters.unitType) return false;

      const unitNoOk = appliedFilters.unitNo ? normalize(u.unitNo).includes(normalize(appliedFilters.unitNo)) : true;
      const tenantOk = appliedFilters.tenant ? normalize(u.tenant).includes(normalize(appliedFilters.tenant)) : true;

      return unitNoOk && tenantOk;
    });
  }, [unitsData, appliedFilters]);

  const propertiesGrouped = useMemo(() => {
    const map = new Map();

    filteredUnits.forEach((u) => {
      const key = u.propertyId || u.property;
      if (!map.has(key)) {
        map.set(key, {
          propertyId: u.propertyId || key,
          propertyName: u.property,
          units: [],
        });
      }
      map.get(key).units.push(u);
    });

    const arr = Array.from(map.values()).map((p) => {
      const occupied = p.units.filter((x) => x.status === "Occupied").length;
      const vacant = p.units.filter((x) => x.status === "Vacant").length;
      const maintenance = p.units.filter((x) => x.status === "Maintenance").length;

      return {
        ...p,
        totals: {
          total: p.units.length,
          occupied,
          vacant,
          maintenance,
        },
      };
    });

    // sort by property name
    arr.sort((a, b) => String(a.propertyName).localeCompare(String(b.propertyName)));
    return arr;
  }, [filteredUnits]);

  // Pagination now is per PROPERTY (since units must sit under property)
  const totalPages = Math.max(1, Math.ceil(propertiesGrouped.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProperties = propertiesGrouped.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) setCurrentPage(safeCurrentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // Visible unit IDs on current page (for selectAll)
  const visibleUnitIds = useMemo(() => {
    const ids = [];
    currentProperties.forEach((p) => p.units.forEach((u) => ids.push(u.id)));
    return ids;
  }, [currentProperties]);

  const handleSelectUnit = (id) => {
    setSelectedUnits((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // remove visible ids from selection
      setSelectedUnits((prev) => prev.filter((id) => !visibleUnitIds.includes(id)));
      setSelectAll(false);
    } else {
      setSelectedUnits((prev) => Array.from(new Set([...prev, ...visibleUnitIds])));
      setSelectAll(true);
    }
  };

  const handleCheckboxClick = (e) => e.stopPropagation();

  const selectedCount = selectedUnits.length;
  const canEdit = selectedCount === 1;

  // Placeholder actions (wire later)
  const archiveSelected = () => {
    setActionMenuOpen(false);
    // wire later
    window.alert("Archive feature coming soon (wire to backend later).");
  };
  const restoreSelected = () => {
    setActionMenuOpen(false);
    // wire later
    window.alert("Restore feature coming soon (wire to backend later).");
  };
  const deleteSelected = () => {
    if (selectedUnits.length === 0) return;
    const ok = window.confirm(
      selectedUnits.length === 1
        ? "Delete this unit? This cannot be undone."
        : `Delete ${selectedUnits.length} units? This cannot be undone.`
    );
    if (!ok) return;
    window.alert("Delete feature coming soon (wire to backend later).");
  };

  // ---------------------------
  // COLUMN RESIZING (Unit table columns only)
  // ---------------------------
  const [unitColumnWidths, setUnitColumnWidths] = useState({
    id: 120,
    unitNo: 140,
    tenant: 170,
    area: 140,
    rentUnit: 160,
    marketRent: 150,
    currentRent: 150,
    unitType: 140,
    status: 120,
    vacantFrom: 140,
    detailed: 110,
  });

  const startResizing = (columnKey, e) => {
    e.preventDefault();
    setIsResizing(true);

    const startWidth = unitColumnWidths[columnKey] ?? 140;

    resizingRef.current = {
      columnKey,
      startX: e.clientX,
      startWidth,
    };

    const handleMouseMove = (evt) => {
      if (!resizingRef.current) return;
      const { columnKey: ck, startX, startWidth: sw } = resizingRef.current;
      const diff = evt.clientX - startX;
      const newWidth = Math.max(80, sw + diff);

      setUnitColumnWidths((prev) => ({
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

  const getStatusPill = (status) => {
    if (status === "Occupied") return "bg-green-100 text-green-800 border border-green-300";
    if (status === "Vacant") return "bg-red-100 text-red-800 border border-red-300";
    return "bg-yellow-100 text-yellow-800 border border-yellow-300";
  };

  const getUnitTypePill = (type) => {
    if (type === "Residential") return "bg-blue-100 text-blue-800 border border-blue-300";
    if (type === "Commercial") return "bg-purple-100 text-purple-800 border border-purple-300";
    if (type === "Utility") return "bg-gray-100 text-gray-800 border border-gray-300";
    return "bg-yellow-100 text-yellow-800 border border-yellow-300";
  };

  // ---------------------------
  // MODAL HANDLERS (kept)
  // ---------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;

    if (field === "checked") updated[index].checked = value;

    if (field === "costPerArea" && formData.areaSqFt) {
      const cost = parseFloat(value) || 0;
      const area = parseFloat(formData.areaSqFt) || 0;
      updated[index].totalCost = (cost * area).toFixed(2);
    }
    setServices(updated);
  };

  const addServiceRow = () => setServices((p) => [...p, { service: "", costPerArea: "", totalCost: "", checked: false }]);
  const removeServiceRow = (index) => {
    if (services.length <= 1) return;
    setServices((p) => p.filter((_, i) => i !== index));
  };

  const handleMeterChange = (index, field, value) => {
    const updated = [...extraMeters];
    updated[index][field] = value;
    setExtraMeters(updated);
  };
  const addMeterRow = () => setExtraMeters((p) => [...p, { meterNo: "", readingSetup: false }]);
  const removeMeterRow = (index) => {
    if (extraMeters.length <= 1) return;
    setExtraMeters((p) => p.filter((_, i) => i !== index));
  };

  const handleAddUnitSubmit = (e) => {
    e.preventDefault();
    if (!formData.property || !formData.unitSpaceNo) return;

    // wire later
    setShowAddUnitModal(false);

    setFormData({
      property: "",
      specifiedFloor: "",
      generalFloorNo: "",
      unitSpaceNo: "",
      ownerOccupied: "No",
      rentPerUnitArea: "",
      marketRent: "",
      areaSqFt: "",
      chargeFreq: "",
      electricityAccountNo: "",
      waterAccountNo: "",
      electricityMeterNo: "",
      waterMeterNo: "",
    });
    setServices([{ service: "", costPerArea: "", totalCost: "", checked: false }]);
    setExtraMeters([{ meterNo: "", readingSetup: false }]);
  };

  const propertiesForDropdown = ["A1, KH KENYA", "AAA, PARKLANDS KENYA", "ALL PURPOSE APARTMENT", "ALPHA APARTMENT", "BASIL TOWERS", "BLUE SKY PLAZA"];
  const chargeFrequencies = ["Monthly", "Quarterly", "Semi-Annually", "Annually", "One-time"];

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full p-0 bg-gray-50">
        {/* Filters Card (consistent style) */}
        <div className="flex-shrink-0 pt-2 px-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
            {/* Row 1: dropdowns + action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={draftFilters.property}
                onChange={(e) => setDraftFilters((p) => ({ ...p, property: e.target.value }))}
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
              >
                {uniqueProperties.map((p) => (
                  <option key={p} value={p}>
                    {p === "any" ? "Property" : p}
                  </option>
                ))}
              </select>

              <select
                value={draftFilters.status}
                onChange={(e) => setDraftFilters((p) => ({ ...p, status: e.target.value }))}
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
              >
                <option value="any">Status</option>
                <option value="Occupied">Occupied</option>
                <option value="Vacant">Vacant</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <select
                value={draftFilters.unitType}
                onChange={(e) => setDraftFilters((p) => ({ ...p, unitType: e.target.value }))}
                className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-[#DDEFE1] text-gray-800 hover:bg-white transition-colors"
              >
                <option value="any">Unit Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Utility">Utility</option>
                <option value="Mixed Use">Mixed Use</option>
              </select>

              <button
                onClick={applySearch}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_ORANGE} ${MILIK_ORANGE_HOVER}`}
                title="Search using the fields"
              >
                <FaSearch className="text-xs" />
                Search
              </button>

              <button
                onClick={resetFilters}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                title="Reset filters and selection"
              >
                <FaRedoAlt className="text-xs" />
                Reset
              </button>

              <button
                disabled={!canEdit}
                onClick={() => window.alert("Edit unit (wire later)")}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                  canEdit ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}` : "bg-gray-400 cursor-not-allowed"
                }`}
                title={canEdit ? "Edit selected unit" : "Select exactly 1 unit to edit"}
              >
                <FaEdit className="text-xs" />
                Edit
              </button>

              {/* Archive / Restore dropdown (one button) */}
              <div className="relative" ref={actionMenuRef}>
                <button
                  onClick={() => setActionMenuOpen((v) => !v)}
                  disabled={selectedCount === 0}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                    selectedCount > 0 ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}` : "bg-gray-400 cursor-not-allowed"
                  }`}
                  title={selectedCount ? "Archive/Restore selected units" : "Select unit(s) first"}
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

              <button
                onClick={deleteSelected}
                disabled={selectedCount === 0}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                  selectedCount > 0 ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                title={selectedCount ? "Delete selected units" : "Select unit(s) to delete"}
              >
                <FaTrash className="text-xs" />
                Delete {selectedCount > 0 ? `(${selectedCount})` : ""}
              </button>

              <button
                onClick={() => setShowAddUnitModal(true)}
                className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
              >
                <FaPlus className="text-xs" />
                Add Unit
              </button>

              <button className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                <FaFileExport className="text-xs" />
                Export
              </button>
            </div>

            {/* Row 2: typed fields */}
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              <input
                value={draftFilters.unitNo}
                onChange={(e) => setDraftFilters((p) => ({ ...p, unitNo: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Unit/Space No"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <input
                value={draftFilters.tenant}
                onChange={(e) => setDraftFilters((p) => ({ ...p, tenant: e.target.value }))}
                onKeyDown={onFilterEnter}
                placeholder="Tenant"
                className="px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
              />
              <div className="hidden md:block" />
              <div className="hidden md:block" />
            </div>
          </div>
        </div>

        {/* PROPERTIES TABLE (Units appear below property) */}
        <div className="flex-1 px-2 pb-2 overflow-hidden relative">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1 pb-16">
              <table className="min-w-full text-xs border-collapse border border-gray-200 font-bold bg-white" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr className="sticky top-0 z-10">
                    <th
                      className="px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                      style={{ width: "50px", minWidth: "50px", maxWidth: "50px" }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAll && visibleUnitIds.length > 0}
                        onChange={handleSelectAll}
                        onClick={handleCheckboxClick}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        title="Select all units in this page"
                      />
                    </th>

                    <th
                      className="px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                      style={{ width: "40px", minWidth: "40px", maxWidth: "40px" }}
                    />

                    <th className="px-3 py-1 text-left font-bold text-white border border-gray-200 bg-[#0B3B2E]">
                      Property
                    </th>

                    <th
                      className="px-3 py-1 text-center font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                      style={{ width: "110px" }}
                    >
                      Total
                    </th>
                    <th
                      className="px-3 py-1 text-center font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                      style={{ width: "110px" }}
                    >
                      Occupied
                    </th>
                    <th
                      className="px-3 py-1 text-center font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                      style={{ width: "110px" }}
                    >
                      Vacant
                    </th>
                    <th
                      className="px-3 py-1 text-center font-bold text-white border border-gray-200 bg-[#0B3B2E]"
                      style={{ width: "130px" }}
                    >
                      Maintenance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentProperties.length > 0 ? (
                    currentProperties.map((p, idx) => {
                      const expanded = expandedPropertyId === p.propertyId;

                      return (
                        <React.Fragment key={p.propertyId}>
                          {/* Property Row */}
                          <tr
                            className={`${idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"} hover:bg-[#f0f0f0] cursor-pointer border-b border-gray-200`}
                            onClick={() => setExpandedPropertyId(expanded ? null : p.propertyId)}
                          >
                            <td
                              className="px-3 py-1 border border-gray-200"
                              style={{ width: "50px" }}
                              onClick={handleCheckboxClick}
                            >
                              {/* No checkbox per property (we select units). Keep column aligned. */}
                            </td>

                            <td className="px-2 py-1 border border-gray-200 text-center" style={{ width: "40px" }}>
                              <button
                                className="p-1 hover:bg-gray-200 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPropertyId(expanded ? null : p.propertyId);
                                }}
                              >
                                {expanded ? <FaChevronUp className="text-gray-600 text-xs" /> : <FaChevronDown className="text-gray-600 text-xs" />}
                              </button>
                            </td>

                            <td className="px-3 py-1 border border-gray-200 font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                              {p.propertyName}
                            </td>

                            <td className="px-3 py-1 border border-gray-200 text-center">{p.totals.total}</td>
                            <td className="px-3 py-1 border border-gray-200 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border bg-green-100 text-green-800 border-green-300">
                                {p.totals.occupied}
                              </span>
                            </td>
                            <td className="px-3 py-1 border border-gray-200 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border bg-red-100 text-red-800 border-red-300">
                                {p.totals.vacant}
                              </span>
                            </td>
                            <td className="px-3 py-1 border border-gray-200 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border bg-yellow-100 text-yellow-800 border-yellow-300">
                                {p.totals.maintenance}
                              </span>
                            </td>
                          </tr>

                          {/* Units UNDER the property */}
                          {expanded && (
                            <tr className={`${idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}`}>
                              <td colSpan={7} className="p-3 border border-gray-200">
                                <div className="rounded-lg border border-gray-200 overflow-x-auto bg-white">
                                  <table className="min-w-full text-xs border-collapse border border-gray-200 font-bold" style={{ tableLayout: "fixed" }}>
                                    <thead>
                                      <tr>
                                        <th
                                          className="px-3 py-1 text-left font-bold text-gray-800 border border-gray-200 bg-[#DDEFE1]"
                                          style={{ width: "50px", minWidth: "50px", maxWidth: "50px" }}
                                        >
                                          {/* units checkbox column */}
                                        </th>

                                        {[
                                          { key: "id", label: "Id" },
                                          { key: "unitNo", label: "Unit/Space No" },
                                          { key: "tenant", label: "Current Tenant" },
                                          { key: "area", label: "Area(Sqr Ft/Mtr)" },
                                          { key: "rentUnit", label: "Rent/Unit Area (Kshs)" },
                                          { key: "marketRent", label: "Mkt. Rent (Kshs)" },
                                          { key: "currentRent", label: "Current Rent (Kshs)" },
                                          { key: "unitType", label: "Unit Type" },
                                          { key: "status", label: "Status" },
                                          { key: "vacantFrom", label: "Vacant from" },
                                          { key: "detailed", label: "Detailed" },
                                        ].map((col) => {
                                          const w = unitColumnWidths[col.key] ?? 140;
                                          return (
                                            <th
                                              key={col.key}
                                              className="relative px-3 py-1 text-left font-bold text-gray-800 border border-gray-200 bg-[#DDEFE1]"
                                              style={{ width: `${w}px`, minWidth: "80px" }}
                                            >
                                              <div className="flex items-center justify-between">
                                                <span className="truncate">{col.label}</span>
                                                <div
                                                  className="w-2 h-4 ml-1 cursor-col-resize hover:bg-gray-300 flex items-center justify-center rounded"
                                                  onMouseDown={(e) => startResizing(col.key, e)}
                                                  title="Drag to resize"
                                                >
                                                  <FaGripVertical className="text-gray-500 text-xs" />
                                                </div>
                                              </div>
                                            </th>
                                          );
                                        })}
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {p.units.map((u, uIdx) => (
                                        <tr
                                          key={u.id}
                                          className={`border-b border-gray-200 transition-colors ${
                                            selectedUnits.includes(u.id)
                                              ? "bg-[#CDE7D3] hover:bg-[#DFF1E3]"
                                              : uIdx % 2 === 0
                                              ? "bg-white hover:bg-[#f8f8f8]"
                                              : "bg-[#f9f9f9] hover:bg-[#f0f0f0]"
                                          }`}
                                          onClick={() => handleSelectUnit(u.id)}
                                        >
                                          <td
                                            className="px-3 py-1 border border-gray-200"
                                            style={{ width: "50px" }}
                                            onClick={handleCheckboxClick}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={selectedUnits.includes(u.id)}
                                              onChange={() => handleSelectUnit(u.id)}
                                              onClick={handleCheckboxClick}
                                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                          </td>

                                          <td className="px-3 py-1 border border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">{u.id}</td>
                                          <td className="px-3 py-1 border border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">{u.unitNo}</td>
                                          <td className="px-3 py-1 border border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">{u.tenant}</td>
                                          <td className="px-3 py-1 border border-gray-200 text-right whitespace-nowrap">{u.area}</td>
                                          <td className="px-3 py-1 border border-gray-200 text-right whitespace-nowrap">{u.rentUnit}</td>
                                          <td className="px-3 py-1 border border-gray-200 text-right whitespace-nowrap">{u.marketRent}</td>
                                          <td className="px-3 py-1 border border-gray-200 text-right whitespace-nowrap">{u.currentRent}</td>

                                          <td className="px-3 py-1 border border-gray-200">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${getUnitTypePill(u.unitType)}`}>
                                              {u.unitType}
                                            </span>
                                          </td>

                                          <td className="px-3 py-1 border border-gray-200">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${getStatusPill(u.status)}`}>
                                              {u.status}
                                            </span>
                                          </td>

                                          <td className="px-3 py-1 border border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">{u.vacantFrom}</td>

                                          <td className="px-3 py-1 border border-gray-200">
                                            <button
                                              className={`px-2 py-0.5 text-xs text-white rounded font-bold ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                window.alert("Open unit details (wire later).");
                                              }}
                                            >
                                              View
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-6 text-center text-gray-500 border border-gray-200 bg-white">
                        <div className="text-lg font-bold text-gray-400 mb-2">No units found</div>
                        <div className="text-sm text-gray-500">Use the filters above, then click Search</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer (consistent) */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 shadow-sm">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="font-bold">
                      Showing <span className="font-bold">{propertiesGrouped.length === 0 ? 0 : startIndex + 1}</span> to{" "}
                      <span className="font-bold">{Math.min(endIndex, propertiesGrouped.length)}</span> of{" "}
                      <span className="font-bold">{propertiesGrouped.length}</span> properties
                    </span>

                    {selectedUnits.length > 0 && (
                      <span className="bg-[#DDEFE1] text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold border border-[#0B3B2E]/30">
                        {selectedUnits.length} unit(s) selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                            onClick={() => setCurrentPage(page)}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

        {/* Add Unit Modal (kept; styling aligned a bit) */}
        {showAddUnitModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md backdrop-saturate-300 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Add New Unit/Space</h2>
                  <p className="text-xs text-gray-600">Fill in the unit details below</p>
                </div>
                <button
                  onClick={() => setShowAddUnitModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleAddUnitSubmit} id="unitForm">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b">General Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Property *</label>
                        <select
                          name="property"
                          value={formData.property}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
                          required
                        >
                          <option value="">Select Property</option>
                          {propertiesForDropdown.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Specified Floor</label>
                        <input
                          type="text"
                          name="specifiedFloor"
                          value={formData.specifiedFloor}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                          placeholder="e.g., Ground Floor"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">General Floor No.</label>
                        <input
                          type="number"
                          name="generalFloorNo"
                          value={formData.generalFloorNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                          placeholder="e.g., 1, 2, 3..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit/Space No. *</label>
                        <input
                          type="text"
                          name="unitSpaceNo"
                          value={formData.unitSpaceNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                          placeholder="e.g., A101, 201, etc."
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-2">Owner Occupied?</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="ownerOccupied"
                              value="Yes"
                              checked={formData.ownerOccupied === "Yes"}
                              onChange={handleInputChange}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="ownerOccupied"
                              value="No"
                              checked={formData.ownerOccupied === "No"}
                              onChange={handleInputChange}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AREA/SPACE MANAGEMENT & COSTING */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">AREA/SPACE MANAGEMENT & COSTING</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Rent Per Unit Area (Ksh)</label>
                        <input
                          type="number"
                          name="rentPerUnitArea"
                          value={formData.rentPerUnitArea}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Market Rent (Ksh)</label>
                        <input
                          type="number"
                          name="marketRent"
                          value={formData.marketRent}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Area (Sq Ft)</label>
                        <input
                          type="number"
                          name="areaSqFt"
                          value={formData.areaSqFt}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Charge Freq.</label>
                        <select
                          name="chargeFreq"
                          value={formData.chargeFreq}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E] bg-white"
                        >
                          <option value="">Select Frequency</option>
                          {chargeFrequencies.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-medium text-gray-700">Service Charge/Utility/Amenity</h4>
                        <button
                          type="button"
                          onClick={addServiceRow}
                          className={`px-3 py-1 text-xs text-white rounded transition-colors ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                        >
                          Add Service
                        </button>
                      </div>

                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-8"></th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Service</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Cost Per Area</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Total Cost</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-16">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {services.map((s, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="checkbox"
                                    checked={s.checked}
                                    onChange={(e) => handleServiceChange(i, "checked", e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="text"
                                    value={s.service}
                                    onChange={(e) => handleServiceChange(i, "service", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                                    placeholder="e.g., Water"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="number"
                                    value={s.costPerArea}
                                    onChange={(e) => handleServiceChange(i, "costPerArea", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                                    placeholder="0.00"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="text"
                                    value={s.totalCost}
                                    readOnly
                                    className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  {services.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeServiceRow(i)}
                                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Utility meters */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">UTILITY ACCOUNT & METER NO.</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Electricity Ac/No.</label>
                        <input
                          type="text"
                          name="electricityAccountNo"
                          value={formData.electricityAccountNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Water Ac/No.</label>
                        <input
                          type="text"
                          name="waterAccountNo"
                          value={formData.waterAccountNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Electricity Meter/No.</label>
                        <input
                          type="text"
                          name="electricityMeterNo"
                          value={formData.electricityMeterNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Water Meter/No.</label>
                        <input
                          type="text"
                          name="waterMeterNo"
                          value={formData.waterMeterNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-medium text-gray-700">Extra Meter Numbers</h4>
                        <button
                          type="button"
                          onClick={addMeterRow}
                          className={`px-3 py-1 text-xs text-white rounded transition-colors ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                        >
                          Add Meter
                        </button>
                      </div>

                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-8"></th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Meter No</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-28">Reading Setup</th>
                              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b w-16">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {extraMeters.map((m, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border-b"></td>
                                <td className="px-3 py-2 border-b">
                                  <input
                                    type="text"
                                    value={m.meterNo}
                                    onChange={(e) => handleMeterChange(i, "meterNo", e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                                    placeholder="Meter number"
                                  />
                                </td>
                                <td className="px-3 py-2 border-b">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={m.readingSetup}
                                      onChange={(e) => handleMeterChange(i, "readingSetup", e.target.checked)}
                                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="ml-2 text-xs">Enabled</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 border-b">
                                  {extraMeters.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeMeterRow(i)}
                                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                <div className="text-xs text-gray-500">Fields marked with * are required</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUnitModal(false)}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        property: "",
                        specifiedFloor: "",
                        generalFloorNo: "",
                        unitSpaceNo: "",
                        ownerOccupied: "No",
                        rentPerUnitArea: "",
                        marketRent: "",
                        areaSqFt: "",
                        chargeFreq: "",
                        electricityAccountNo: "",
                        waterAccountNo: "",
                        electricityMeterNo: "",
                        waterMeterNo: "",
                      });
                      setServices([{ service: "", costPerArea: "", totalCost: "", checked: false }]);
                      setExtraMeters([{ meterNo: "", readingSetup: false }]);
                    }}
                    className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    form="unitForm"
                    className={`px-6 py-2 text-sm text-white rounded-lg transition-colors flex items-center gap-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                  >
                    <FaSave /> Save Unit
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

export default Units;