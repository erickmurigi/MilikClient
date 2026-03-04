import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaFileInvoice,
  FaDownload,
  FaPrint,
  FaEye,
  FaArrowRight,
  FaSearch,
  FaRedoAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getTenants } from "../../redux/tenantsRedux";
import { getProperties } from "../../redux/propertyRedux";
import { getUnits } from "../../redux/unitRedux";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const emptyFilters = {
  status: "ALL",
  fromDate: "",
  toDate: "",
  property: "any",
  tenantName: "",
  unit: "any",
  invoiceNo: "",
};

const getTenantDisplayName = (tenant) => {
  const fullName = `${tenant?.firstName || ""} ${tenant?.lastName || ""}`.trim();
  return fullName || tenant?.tenantName || tenant?.name || "N/A";
};

const getPropertyDisplayName = (tenant) => {
  return (
    tenant?.unit?.property?.propertyName ||
    tenant?.property?.propertyName ||
    tenant?.propertyName ||
    "N/A"
  );
};

const getUnitDisplayName = (tenant) => {
  return (
    tenant?.unit?.unitName ||
    tenant?.unit?.name ||
    tenant?.unit?.unitNumber ||
    tenant?.unitName ||
    "N/A"
  );
};

const getInvoiceIdFromEntry = (entry) => {
  if (typeof entry === "string") return entry;
  return entry?.invoiceId || entry?.id || entry?.number || "";
};

const formatDateDisplay = (dateValue) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const resolveTenantPropertyName = (tenant, unitsFromStore = [], propertiesFromStore = []) => {
  const directPropertyName =
    tenant?.unit?.property?.propertyName ||
    tenant?.property?.propertyName ||
    tenant?.propertyName;
  if (directPropertyName) return directPropertyName;

  const tenantUnitId = tenant?.unit?._id || tenant?.unit;
  const matchedUnit = unitsFromStore.find((unit) => unit?._id === tenantUnitId);

  const propertyIdFromUnit = matchedUnit?.property?._id || matchedUnit?.property;
  const propertyIdFromTenant = tenant?.property?._id || tenant?.property;
  const resolvedPropertyId = propertyIdFromUnit || propertyIdFromTenant;

  const matchedProperty = propertiesFromStore.find(
    (property) => property?._id === resolvedPropertyId
  );

  return (
    matchedUnit?.property?.propertyName ||
    matchedProperty?.propertyName ||
    matchedProperty?.name ||
    "N/A"
  );
};

const RentalInvoices = () => {
  const { id: tenantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [refreshTick, setRefreshTick] = useState(0);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const tenantsFromStore = useSelector((state) => state.tenant?.tenants || []);
  const propertiesFromStore = useSelector((state) => state.property?.properties || []);
  const unitsFromStore = useSelector((state) => state.unit?.units || []);
  const rentPayments = useSelector((state) => state.rentPayment?.rentPayments || []);

  useEffect(() => {
    if (!currentCompany?._id) return;
    dispatch(getTenants({ business: currentCompany._id }));
    dispatch(getProperties({ business: currentCompany._id }));
    dispatch(getUnits({ business: currentCompany._id }));
  }, [dispatch, currentCompany?._id]);

  useEffect(() => {
    if (tenantsFromStore.length === 0) return;

    let maxInvoiceNum = 0;
    const invoiceNumbers = new Set();
    const updatedByTenant = {};
    let hasDuplicates = false;

    tenantsFromStore.forEach((tenant) => {
      const storageKey = `createdInvoices_${tenant._id}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const tenantInvoices = JSON.parse(stored);
      Object.values(tenantInvoices).forEach((entry) => {
        const invoiceId = getInvoiceIdFromEntry(entry);
        const num = parseInt(String(invoiceId).replace("INV", ""), 10) || 0;
        if (num > maxInvoiceNum) maxInvoiceNum = num;
      });
    });

    tenantsFromStore.forEach((tenant) => {
      const storageKey = `createdInvoices_${tenant._id}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const tenantInvoices = JSON.parse(stored);
      const normalizedInvoices = {};
      let changed = false;

      Object.entries(tenantInvoices).forEach(([period, entry]) => {
        const currentId = getInvoiceIdFromEntry(entry);
        let nextId = currentId;

        if (invoiceNumbers.has(currentId)) {
          hasDuplicates = true;
          changed = true;
          maxInvoiceNum += 1;
          nextId = `INV${String(maxInvoiceNum).padStart(5, "0")}`;
        }

        invoiceNumbers.add(nextId);

        if (typeof entry === "string") {
          normalizedInvoices[period] = nextId;
        } else {
          normalizedInvoices[period] = {
            ...entry,
            invoiceId: nextId,
            id: nextId,
            number: nextId,
          };
        }
      });

      if (changed) {
        updatedByTenant[storageKey] = normalizedInvoices;
      }
    });

    if (hasDuplicates) {
      Object.entries(updatedByTenant).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      toast.info("Duplicate invoice numbers fixed successfully");
      setRefreshTick((prev) => prev + 1);
    }
  }, [tenantsFromStore]);

  const invoices = useMemo(() => {
    if (tenantsFromStore.length === 0) return [];

    const targetTenants = tenantId
      ? tenantsFromStore.filter((tenant) => tenant._id === tenantId)
      : tenantsFromStore;

    const allInvoices = [];

    targetTenants.forEach((tenant) => {
      const storageKey = `createdInvoices_${tenant._id}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const createdInvoices = JSON.parse(stored);
      const tenantName = getTenantDisplayName(tenant);
      const propertyName = resolveTenantPropertyName(tenant, unitsFromStore, propertiesFromStore);
      const unitName = getUnitDisplayName(tenant);
      const baseRent = Number(tenant?.lease?.rentAmount || tenant?.rent || 23000) || 23000;

      Object.entries(createdInvoices).forEach(([period, entry]) => {
        const invoiceId = getInvoiceIdFromEntry(entry);
        const utilityAmount = Number(tenant?.serviceCharge || 0) || 0;
        const fallbackAmount = baseRent + utilityAmount;
        const amount =
          typeof entry === "object" && Number.isFinite(Number(entry?.amount))
            ? Number(entry.amount)
            : fallbackAmount;
        const createdAt =
          typeof entry === "object"
            ? entry?.createdAt || entry?.createdDate || null
            : null;

        // Calculate status based on confirmed payments
        const confirmedPayments = rentPayments.filter(
          (payment) =>
            payment.isConfirmed === true &&
            (payment.tenant?._id === tenant._id || payment.tenant === tenant._id)
        );
        const totalPaid = confirmedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const status = totalPaid >= amount ? "Paid" : "Issued";

        allInvoices.push({
          key: `${tenant._id}_${period}`,
          id: invoiceId,
          period,
          tenantId: tenant._id,
          tenantName,
          propertyName:
            typeof entry === "object" && entry?.propertyName
              ? entry.propertyName
              : propertyName,
          unitName:
            typeof entry === "object" && entry?.unitName
              ? entry.unitName
              : unitName,
          amount,
          status,
          createdAt,
          createdDate: formatDateDisplay(createdAt),
        });
      });
    });

    return allInvoices.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }, [tenantId, tenantsFromStore, unitsFromStore, propertiesFromStore, refreshTick, rentPayments]);

  const uniqueProperties = useMemo(() => {
    return [
      "any",
      ...Array.from(
        new Set(propertiesFromStore.map((property) => property?.propertyName).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    ];
  }, [propertiesFromStore]);

  const unitsForSelectedProperty = useMemo(() => {
    let scopedUnits = unitsFromStore;

    if (draftFilters.property !== "any") {
      const selectedProperty = propertiesFromStore.find(
        (property) => property?.propertyName === draftFilters.property
      );
      const selectedPropertyId = selectedProperty?._id;

      scopedUnits = unitsFromStore.filter((unit) => {
        const unitPropertyId = unit?.property?._id || unit?.property;
        const unitPropertyName = unit?.property?.propertyName || unit?.propertyName;

        if (selectedPropertyId) {
          return unitPropertyId === selectedPropertyId;
        }
        return unitPropertyName === draftFilters.property;
      });
    }

    return [
      "any",
      ...Array.from(
        new Set(
          scopedUnits
            .map((unit) => unit?.unitNumber || unit?.unitName || unit?.name)
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    ];
  }, [unitsFromStore, propertiesFromStore, draftFilters.property]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      if (appliedFilters.status !== "ALL" && invoice.status !== appliedFilters.status) return false;
      if (appliedFilters.property !== "any" && invoice.propertyName !== appliedFilters.property) return false;
      if (appliedFilters.unit !== "any" && invoice.unitName !== appliedFilters.unit) return false;
      if (
        appliedFilters.tenantName &&
        !invoice.tenantName.toLowerCase().includes(appliedFilters.tenantName.toLowerCase())
      ) {
        return false;
      }
      if (
        appliedFilters.invoiceNo &&
        !String(invoice.id).toLowerCase().includes(appliedFilters.invoiceNo.toLowerCase())
      ) {
        return false;
      }

      if (appliedFilters.fromDate || appliedFilters.toDate) {
        if (!invoice.createdAt) return false;
        const invoiceDate = new Date(invoice.createdAt);
        if (Number.isNaN(invoiceDate.getTime())) return false;

        if (appliedFilters.fromDate) {
          const fromDate = new Date(`${appliedFilters.fromDate}T00:00:00`);
          if (invoiceDate < fromDate) return false;
        }
        if (appliedFilters.toDate) {
          const toDate = new Date(`${appliedFilters.toDate}T23:59:59`);
          if (invoiceDate > toDate) return false;
        }
      }

      return true;
    });
  }, [invoices, appliedFilters]);

  useEffect(() => {
    if (filteredInvoices.length === 0) {
      setSelectAll(false);
      setSelectedInvoices([]);
      return;
    }

    const visibleKeys = new Set(filteredInvoices.map((inv) => inv.key));
    setSelectedInvoices((prev) => prev.filter((key) => visibleKeys.has(key)));
  }, [filteredInvoices]);

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const pendingAmount = filteredInvoices
    .filter((inv) => inv.status === "Issued")
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  const selectedCount = selectedInvoices.length;
  const canEdit = selectedCount === 1;

  const applySearch = () => {
    setAppliedFilters({ ...draftFilters });
    setSelectedInvoices([]);
    setSelectAll(false);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSelectedInvoices([]);
    setSelectAll(false);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([]);
      setSelectAll(false);
      return;
    }

    setSelectedInvoices(filteredInvoices.map((inv) => inv.key));
    setSelectAll(true);
  };

  const toggleRowSelection = (rowKey) => {
    setSelectedInvoices((prev) => {
      const hasRow = prev.includes(rowKey);
      if (hasRow) return prev.filter((id) => id !== rowKey);
      return [...prev, rowKey];
    });
  };

  useEffect(() => {
    if (filteredInvoices.length === 0) {
      setSelectAll(false);
      return;
    }
    setSelectAll(selectedInvoices.length === filteredInvoices.length);
  }, [selectedInvoices, filteredInvoices]);

  const handleViewInvoice = (invoiceId) => {
    toast.info(`Opening invoice ${invoiceId}`);
  };

  const handlePrintInvoice = (invoiceId) => {
    toast.info(`Printing invoice ${invoiceId}`);
  };

  const handleDownloadInvoice = (invoiceId) => {
    toast.info(`Downloading invoice ${invoiceId}`);
  };

  const handleCreateInvoice = () => {
    navigate("/tenants");
  };

  const handleEditSelected = () => {
    if (!canEdit) {
      toast.warn("Select exactly one invoice to edit");
      return;
    }

    const selectedInvoice = filteredInvoices.find((inv) => inv.key === selectedInvoices[0]);
    if (!selectedInvoice) return;

    navigate(`/tenant/${selectedInvoice.tenantId}/statement`);
    toast.info(`Open tenant statement to edit ${selectedInvoice.id}`);
  };

  const handleDeleteSelected = () => {
    if (selectedInvoices.length === 0) {
      toast.warn("Select at least one invoice to delete");
      return;
    }

    const selectedRows = filteredInvoices.filter((inv) => selectedInvoices.includes(inv.key));

    selectedRows.forEach((invoice) => {
      const storageKey = `createdInvoices_${invoice.tenantId}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;

      const tenantInvoices = JSON.parse(stored);
      delete tenantInvoices[invoice.period];
      localStorage.setItem(storageKey, JSON.stringify(tenantInvoices));
    });

    toast.success(`${selectedRows.length} invoice(s) deleted`);
    setSelectedInvoices([]);
    setSelectAll(false);
    setRefreshTick((prev) => prev + 1);
  };

  const handleDeleteSingle = (invoice) => {
    const storageKey = `createdInvoices_${invoice.tenantId}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    const tenantInvoices = JSON.parse(stored);
    delete tenantInvoices[invoice.period];
    localStorage.setItem(storageKey, JSON.stringify(tenantInvoices));
    toast.success(`Invoice ${invoice.id} deleted`);
    setRefreshTick((prev) => prev + 1);
  };

  const handleViewTenantStatement = (targetTenantId) => {
    navigate(`/tenant/${targetTenantId}/statement`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-3">
        <div className="mx-auto" style={{ maxWidth: "96%" }}>
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 mb-4 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {tenantId && (
                  <button
                    onClick={() => navigate("/tenants")}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-semibold"
                    title="Back to Tenants"
                  >
                    <FaArrowLeft size={12} />
                  </button>
                )}
                <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2 leading-none">
                  <FaFileInvoice size={18} className="text-blue-600" />
                  Rental Invoices
                </h1>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 mb-2.5 leading-none">
              {tenantId ? "Invoices for selected tenant" : "All rental invoices across tenants"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="bg-blue-50 border border-blue-200 rounded p-2.5">
                <p className="text-[11px] text-blue-600 font-semibold">Total Invoices</p>
                <p className="text-xl font-bold text-blue-900 leading-tight">{filteredInvoices.length}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-2.5">
                <p className="text-[11px] text-green-600 font-semibold">Total Amount</p>
                <p className="text-xl font-bold text-green-900 leading-tight">KES {totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-2.5">
                <p className="text-[11px] text-orange-600 font-semibold">Pending Amount</p>
                <p className="text-xl font-bold text-orange-900 leading-tight">KES {pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-3">
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <button
                  onClick={() => setDraftFilters((prev) => ({ ...prev, status: "ALL" }))}
                  className={`px-3 py-1 text-xs rounded font-semibold transition-colors ${
                    draftFilters.status === "ALL"
                      ? `${MILIK_GREEN} text-white`
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDraftFilters((prev) => ({ ...prev, status: "Issued" }))}
                  className={`px-3 py-1 text-xs rounded font-semibold transition-colors ${
                    draftFilters.status === "Issued"
                      ? `${MILIK_GREEN} text-white`
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Issued
                </button>
                <button
                  onClick={() => setDraftFilters((prev) => ({ ...prev, status: "Paid" }))}
                  className={`px-3 py-1 text-xs rounded font-semibold transition-colors ${
                    draftFilters.status === "Paid"
                      ? `${MILIK_GREEN} text-white`
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Paid
                </button>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  value={draftFilters.invoiceNo}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, invoiceNo: e.target.value }))}
                  placeholder="Invoice #"
                  className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                />

                {!tenantId && (
                  <input
                    type="text"
                    value={draftFilters.tenantName}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, tenantName: e.target.value }))}
                    placeholder="Tenant name"
                    className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                  />
                )}

                <select
                  value={draftFilters.property}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      property: e.target.value,
                      unit: "any",
                    }))
                  }
                  className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm bg-[#DDEFE1] text-gray-800"
                >
                  {uniqueProperties.map((property) => (
                    <option key={property} value={property}>
                      {property === "any" ? "Property" : property}
                    </option>
                  ))}
                </select>

                <select
                  value={draftFilters.unit}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, unit: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm bg-[#DDEFE1] text-gray-800"
                >
                  {unitsForSelectedProperty.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit === "any" ? "Unit" : unit}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={draftFilters.fromDate}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm"
                  title="From date"
                />

                <input
                  type="date"
                  value={draftFilters.toDate}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, toDate: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-300 rounded shadow-sm"
                  title="To date"
                />

                <button
                  onClick={applySearch}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_ORANGE} ${MILIK_ORANGE_HOVER}`}
                >
                  <FaSearch className="text-xs" />
                  Search
                </button>

                <button
                  onClick={resetFilters}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                >
                  <FaRedoAlt className="text-xs" />
                  Reset
                </button>

                <button
                  onClick={handleEditSelected}
                  disabled={!canEdit}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                    canEdit ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}` : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaEdit className="text-xs" />
                  Edit
                </button>

                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedCount === 0}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                    selectedCount > 0 ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaTrash className="text-xs" />
                  Delete
                </button>

                <button
                  onClick={handleCreateInvoice}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
                >
                  <FaPlus className="text-xs" />
                  Add Invoice
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={`${MILIK_GREEN} text-white`}>
                    <th className="px-3 py-2 text-left">
                      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    </th>
                    <th className="px-3 py-2 text-left font-semibold">Invoice #</th>
                    {!tenantId && <th className="px-3 py-2 text-left font-semibold">Tenant</th>}
                    {!tenantId && <th className="px-3 py-2 text-left font-semibold">Property</th>}
                    <th className="px-3 py-2 text-left font-semibold">Unit</th>
                    <th className="px-3 py-2 text-left font-semibold">Period</th>
                    <th className="px-3 py-2 text-right font-semibold">Amount</th>
                    <th className="px-3 py-2 text-center font-semibold">Status</th>
                    <th className="px-3 py-2 text-center font-semibold">Created</th>
                    <th className="px-3 py-2 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={tenantId ? "9" : "11"} className="px-4 py-8 text-center text-gray-500">
                        <FaFileInvoice className="inline-block text-4xl text-gray-300 mb-2" />
                        <p className="text-sm font-semibold mt-1">No invoices found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {tenantId
                            ? "Create invoices from billing schedule"
                            : "Create invoices and apply filters to see results"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice, idx) => (
                      <tr
                        key={invoice.key}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        } border-b border-slate-200 hover:bg-blue-50/40 transition-colors`}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.key)}
                            onChange={() => toggleRowSelection(invoice.key)}
                          />
                        </td>
                        <td className="px-3 py-2 text-blue-700 font-bold">{invoice.id}</td>
                        {!tenantId && <td className="px-3 py-2 text-slate-800 font-semibold">{invoice.tenantName}</td>}
                        {!tenantId && <td className="px-3 py-2 text-slate-800">{invoice.propertyName}</td>}
                        <td className="px-3 py-2 text-slate-800">{invoice.unitName}</td>
                        <td className="px-3 py-2 text-orange-700 font-semibold">{invoice.period}</td>
                        <td className="px-3 py-2 text-right text-slate-900 font-bold">
                          KES {Number(invoice.amount || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                              invoice.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center text-gray-600">{invoice.createdDate}</td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => handleViewInvoice(invoice.id)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                              title="View Invoice"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(invoice.id)}
                              className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded"
                              title="Print Invoice"
                            >
                              <FaPrint size={12} />
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                              title="Download Invoice"
                            >
                              <FaDownload size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteSingle(invoice)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                              title="Delete Invoice"
                            >
                              <FaTrash size={12} />
                            </button>
                            {!tenantId && (
                              <button
                                onClick={() => handleViewTenantStatement(invoice.tenantId)}
                                className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-50 rounded"
                                title="View Tenant Statement"
                              >
                                <FaArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredInvoices.length > 0 && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2.5">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Summary:</span> {filteredInvoices.length} invoice(s)
                {appliedFilters.status !== "ALL" && ` · Status: ${appliedFilters.status}`}
                · Total: <span className="font-bold">KES {totalAmount.toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RentalInvoices;
