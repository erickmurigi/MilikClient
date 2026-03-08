import React, { useEffect, useMemo, useRef, useState } from "react";
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
import JournalEntriesDrawer from "../../components/Accounting/JournalEntriesDrawer";
import { getTenants } from "../../redux/tenantsRedux";
import { getProperties } from "../../redux/propertyRedux";
import { getUnits } from "../../redux/unitRedux";
import { createRentPayment, getRentPayments } from "../../redux/apiCalls";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const INVOICE_REVENUE_ACCOUNT_MAP = {
  utility: { code: "4102", name: "Utility Recharge Income" },
  rent: { code: "4100", name: "Rent Income" },
  combined: { code: "4100", name: "Rent Income" },
};

const MONTH_OPTIONS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

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

const hasMeaningfulLabel = (value) => {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized !== "" && normalized !== "n/a" && normalized !== "-" && normalized !== "na";
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatPeriodLabel = (month, year) => {
  const date = new Date(year, month, 1);
  return `${date.toLocaleString("en-US", { month: "short" })} ${String(year).slice(-2)}`;
};

const parsePeriodLabel = (periodLabel, fallbackDate = new Date()) => {
  if (!periodLabel || typeof periodLabel !== "string") {
    return {
      month: fallbackDate.getMonth(),
      year: fallbackDate.getFullYear(),
    };
  }

  const parts = String(periodLabel).trim().split(/\s+/);
  if (parts.length < 2) {
    return {
      month: fallbackDate.getMonth(),
      year: fallbackDate.getFullYear(),
    };
  }

  const monthText = parts[0].toLowerCase();
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const month = monthMap[monthText.slice(0, 3)];
  const yearNum = Number(parts[1]);
  const year = yearNum < 100 ? 2000 + yearNum : yearNum;

  return {
    month: Number.isInteger(month) ? month : fallbackDate.getMonth(),
    year: Number.isFinite(year) ? year : fallbackDate.getFullYear(),
  };
};

const getStartOfPeriod = (month, year) => new Date(year, month, 1);
const getEndOfPeriod = (month, year) => new Date(year, month + 1, 0);

const getNormalizedPeriodFromEntry = (periodKey, entry) => {
  if (typeof entry === "object" && entry?.period) return String(entry.period);
  return String(periodKey).replace(/__(rent|utility)$/i, "");
};

const resolveTenantPropertyName = (tenant, unitsFromStore = [], propertiesFromStore = []) => {
  const directPropertyName =
    tenant?.unit?.property?.propertyName ||
    tenant?.property?.propertyName ||
    tenant?.propertyName;
  if (directPropertyName) return directPropertyName;

  const tenantUnitId = tenant?.unit?._id || tenant?.unit;
  const tenantUnitIdStr = tenantUnitId ? String(tenantUnitId) : "";
  const matchedUnit = unitsFromStore.find((unit) => String(unit?._id || "") === tenantUnitIdStr);

  const propertyIdFromUnit = matchedUnit?.property?._id || matchedUnit?.property;
  const propertyIdFromTenant = tenant?.property?._id || tenant?.property;
  const resolvedPropertyId = propertyIdFromUnit || propertyIdFromTenant;
  const resolvedPropertyIdStr = resolvedPropertyId ? String(resolvedPropertyId) : "";

  const matchedProperty = propertiesFromStore.find(
    (property) => String(property?._id || "") === resolvedPropertyIdStr
  );

  return (
    matchedUnit?.property?.propertyName ||
    matchedProperty?.propertyName ||
    matchedProperty?.name ||
    "N/A"
  );
};

const buildJournalEntriesForInvoice = (invoice) => {
  const amount = Number(invoice?.amount || 0);
  const chargeType = String(invoice?.chargeType || "combined").toLowerCase();
  const revenueAccount = INVOICE_REVENUE_ACCOUNT_MAP[chargeType] || INVOICE_REVENUE_ACCOUNT_MAP.combined;
  const narration = `Invoice ${invoice?.id || ""} ${chargeType} charge for ${invoice?.period || "period"}`;

  return [
    {
      accountCode: "1200",
      accountName: "Tenant Receivables",
      debit: amount,
      credit: 0,
      narration,
    },
    {
      accountCode: revenueAccount.code,
      accountName: revenueAccount.name,
      debit: 0,
      credit: amount,
      narration,
    },
  ];
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
  const [bookingAction, setBookingAction] = useState("");
  const [showSingleBooking, setShowSingleBooking] = useState(false);
  const [showBatchBooking, setShowBatchBooking] = useState(false);
  const [journalDrawerOpen, setJournalDrawerOpen] = useState(false);
  const [journalContext, setJournalContext] = useState({});
  const [journalLines, setJournalLines] = useState([]);
  const currentDate = new Date();
  const [singleBookingForm, setSingleBookingForm] = useState({
    tenantId: tenantId || "",
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    billingMode: "combined",
  });
  const [batchBookingForm, setBatchBookingForm] = useState({
    propertyId: "all",
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    billingMode: "combined",
  });

  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const tenantsFromStore = useSelector((state) => state.tenant?.tenants || []);
  const propertiesFromStore = useSelector((state) => state.property?.properties || []);
  const unitsFromStore = useSelector((state) => state.unit?.units || []);
  const rentPayments = useSelector((state) => state.rentPayment?.rentPayments || []);
  const hasSyncedLegacyInvoicesRef = useRef(false);

  const postedInvoiceMap = useMemo(() => {
    const map = new Map();
    rentPayments.forEach((payment) => {
      const ref = String(payment?.referenceNumber || "").trim();
      if (!ref) return;
      if (payment?.ledgerType !== "invoices") return;
      map.set(ref, payment);
    });
    return map;
  }, [rentPayments]);

  useEffect(() => {
    if (!currentCompany?._id) return;
    dispatch(getTenants({ business: currentCompany._id }));
    dispatch(getProperties({ business: currentCompany._id }));
    dispatch(getUnits({ business: currentCompany._id }));
    getRentPayments(dispatch, currentCompany._id);
  }, [dispatch, currentCompany?._id]);

  useEffect(() => {
    if (!tenantId) return;
    setSingleBookingForm((prev) => ({ ...prev, tenantId }));
  }, [tenantId]);

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

      Object.entries(createdInvoices).forEach(([periodKey, entry]) => {
        const invoiceId = getInvoiceIdFromEntry(entry);
        const period = getNormalizedPeriodFromEntry(periodKey, entry);
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
          key: `${tenant._id}_${periodKey}_${invoiceId}`,
          id: invoiceId,
          period,
          storagePeriodKey: periodKey,
          chargeType:
            typeof entry === "object" && entry?.chargeType
              ? String(entry.chargeType)
              : "combined",
          tenantId: tenant._id,
          tenantName,
          propertyName:
            typeof entry === "object" && hasMeaningfulLabel(entry?.propertyName)
              ? entry.propertyName
              : propertyName,
          unitName:
            typeof entry === "object" && hasMeaningfulLabel(entry?.unitName)
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

  const activeProperties = useMemo(() => {
    return propertiesFromStore.filter((property) => {
      const propertyStatus = String(property?.status || "active").toLowerCase();
      return propertyStatus === "active";
    });
  }, [propertiesFromStore]);

  const tenantLookup = useMemo(() => {
    const lookup = {};
    tenantsFromStore.forEach((tenant) => {
      lookup[tenant._id] = tenant;
    });
    return lookup;
  }, [tenantsFromStore]);

  const getTenantPricing = (tenant) => {
    const baseRent =
      Number(tenant?.lease?.rentAmount || tenant?.rent || tenant?.unit?.rent || tenant?.unit?.monthlyRent || 0) ||
      0;
    const utilitiesFromTenant = Array.isArray(tenant?.utilities)
      ? tenant.utilities.reduce((sum, utility) => {
          if (utility?.isIncluded === true) return sum;
          return sum + (Number(utility?.unitCharge || utility?.amount || 0) || 0);
        }, 0)
      : 0;

    const tenantUnitId = tenant?.unit?._id || tenant?.unit;
    const matchedUnit = unitsFromStore.find((unit) => unit?._id === tenantUnitId);
    const utilitiesFromUnit = Array.isArray(matchedUnit?.utilities)
      ? matchedUnit.utilities.reduce((sum, utility) => {
          if (utility?.isIncluded === true) return sum;
          return sum + (Number(utility?.unitCharge || utility?.amount || 0) || 0);
        }, 0)
      : 0;

    const serviceCharge = Number(tenant?.serviceCharge || 0) || 0;
    const utilityAmount = utilitiesFromTenant > 0 ? utilitiesFromTenant + serviceCharge : utilitiesFromUnit + serviceCharge;

    return {
      rentAmount: baseRent,
      utilityAmount,
      total: baseRent + utilityAmount,
    };
  };

  const getTenantPropertyId = (tenant) => {
    const directPropertyId = tenant?.property?._id || tenant?.property;
    if (directPropertyId) return directPropertyId;

    const tenantUnitId = tenant?.unit?._id || tenant?.unit;
    const matchedUnit = unitsFromStore.find((unit) => unit?._id === tenantUnitId);
    return matchedUnit?.property?._id || matchedUnit?.property || null;
  };

  const getNextInvoiceNumber = () => {
    let maxInvoiceNum = 0;

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

    return maxInvoiceNum + 1;
  };

  const singleBookingTenantOptions = useMemo(() => {
    return tenantsFromStore
      .filter((tenant) => String(tenant?.status || "active").toLowerCase() === "active")
      .map((tenant) => ({
        id: tenant._id,
        name: getTenantDisplayName(tenant),
        propertyName: resolveTenantPropertyName(tenant, unitsFromStore, propertiesFromStore),
        unitName: getUnitDisplayName(tenant),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tenantsFromStore, unitsFromStore, propertiesFromStore]);

  const selectedSingleBookingTenant = useMemo(() => {
    return tenantLookup[singleBookingForm.tenantId] || null;
  }, [tenantLookup, singleBookingForm.tenantId]);

  const selectedSingleBookingPreview = useMemo(() => {
    if (!selectedSingleBookingTenant) return null;
    const pricing = getTenantPricing(selectedSingleBookingTenant);
    return {
      periodLabel: formatPeriodLabel(Number(singleBookingForm.month), Number(singleBookingForm.year)),
      rentAmount: pricing.rentAmount,
      utilityAmount: pricing.utilityAmount,
      totalAmount: pricing.total,
      propertyName: resolveTenantPropertyName(
        selectedSingleBookingTenant,
        unitsFromStore,
        propertiesFromStore
      ),
      unitName: getUnitDisplayName(selectedSingleBookingTenant),
    };
  }, [singleBookingForm.month, singleBookingForm.year, selectedSingleBookingTenant, unitsFromStore, propertiesFromStore]);

  const batchBookingScopeCount = useMemo(() => {
    return tenantsFromStore.filter((tenant) => {
      const tenantStatus = String(tenant?.status || "active").toLowerCase();
      if (tenantStatus !== "active") return false;

      const tenantPropertyId = getTenantPropertyId(tenant);
      if (!tenantPropertyId) return false;

      if (batchBookingForm.propertyId === "all") {
        return activeProperties.some((property) => property?._id === tenantPropertyId);
      }

      return tenantPropertyId === batchBookingForm.propertyId;
    }).length;
  }, [tenantsFromStore, batchBookingForm.propertyId, activeProperties]);

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
  const companyDisplayName =
    currentCompany?.companyName ||
    currentCompany?.name ||
    currentCompany?.company ||
    "MILIK Property Management";

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

  const openHtmlDocument = (title, html) => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank", "width=1100,height=850");
    if (!printWindow) {
      toast.error("Please allow popups to view or print invoices");
      window.URL.revokeObjectURL(url);
      return null;
    }

    // Clean object URL shortly after open to avoid memory leaks.
    setTimeout(() => window.URL.revokeObjectURL(url), 15000);

    try {
      printWindow.document.title = title;
    } catch (error) {
      // Ignore title assignment errors on some browsers when window is still loading.
    }

    return printWindow;
  };

  const buildInvoiceHtml = (invoice) => {
    const amount = Number(invoice?.amount || 0).toLocaleString();
    const createdLabel = invoice?.createdAt
      ? new Date(invoice.createdAt).toLocaleString()
      : invoice?.createdDate || "-";

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(invoice?.id || "Invoice")}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
    .header { border-bottom: 2px solid #0B3B2E; padding-bottom: 12px; margin-bottom: 18px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
    .brand-wrap { display:flex; align-items:center; gap:10px; }
    .logo { width:40px; height:40px; border-radius:8px; background:#0B3B2E; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; }
    .brand { font-size: 20px; font-weight: 800; color: #0B3B2E; }
    .company { color:#111827; font-size:13px; font-weight:700; }
    .subtitle { color: #4b5563; font-size: 12px; text-align:right; }
    .grid { display: grid; grid-template-columns: 180px 1fr; gap: 8px 12px; font-size: 13px; }
    .label { color: #6b7280; font-weight: 600; }
    .value { color: #111827; font-weight: 700; }
    .amount { margin-top: 18px; font-size: 22px; font-weight: 800; color: #0B3B2E; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand-wrap">
      <div class="logo">M</div>
      <div>
        <div class="brand">MILIK Rental Invoice</div>
        <div class="company">${escapeHtml(companyDisplayName)}</div>
      </div>
    </div>
    <div class="subtitle">Generated on ${escapeHtml(new Date().toLocaleString())}</div>
  </div>
  <div class="grid">
    <div class="label">Invoice #</div><div class="value">${escapeHtml(invoice?.id)}</div>
    <div class="label">Tenant</div><div class="value">${escapeHtml(invoice?.tenantName)}</div>
    <div class="label">Property</div><div class="value">${escapeHtml(invoice?.propertyName)}</div>
    <div class="label">Unit</div><div class="value">${escapeHtml(invoice?.unitName)}</div>
    <div class="label">Period</div><div class="value">${escapeHtml(invoice?.period)}</div>
    <div class="label">Status</div><div class="value">${escapeHtml(invoice?.status)}</div>
    <div class="label">Created</div><div class="value">${escapeHtml(createdLabel)}</div>
  </div>
  <div class="amount">Amount Due: KES ${amount}</div>
</body>
</html>`;
  };

  const buildInvoiceListHtml = (rows) => {
    const total = rows.reduce((sum, inv) => sum + (Number(inv?.amount) || 0), 0);
    const tableRows = rows
      .map(
        (inv) => `<tr>
  <td>${escapeHtml(inv.id)}</td>
  <td>${escapeHtml(inv.tenantName)}</td>
  <td>${escapeHtml(inv.propertyName)}</td>
  <td>${escapeHtml(inv.unitName)}</td>
  <td>${escapeHtml(inv.period)}</td>
  <td style="text-align:right;">KES ${Number(inv.amount || 0).toLocaleString()}</td>
  <td>${escapeHtml(inv.status)}</td>
  <td>${escapeHtml(inv.createdDate || "-")}</td>
</tr>`
      )
      .join("\n");

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>MILIK Rental Invoices List</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #111827; }
    .header { display:flex; align-items:center; justify-content:space-between; gap:16px; border-bottom:2px solid #0B3B2E; padding-bottom:10px; margin-bottom:10px; }
    .brand-wrap { display:flex; align-items:center; gap:10px; }
    .logo { width:38px; height:38px; border-radius:8px; background:#0B3B2E; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:15px; }
    h1 { margin: 0; color: #0B3B2E; font-size: 20px; }
    .company { margin-top:2px; color:#111827; font-size:12px; font-weight:700; }
    .meta { margin: 6px 0 14px; color: #4b5563; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 6px 8px; }
    th { background: #0B3B2E; color: white; text-align: left; }
    tfoot td { font-weight: 700; background: #f3f4f6; }
    @media print { body { margin: 10mm; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand-wrap">
      <div class="logo">M</div>
      <div>
        <h1>MILIK Rental Invoices List</h1>
        <div class="company">${escapeHtml(companyDisplayName)}</div>
      </div>
    </div>
    <div class="meta">Generated: ${escapeHtml(new Date().toLocaleString())}<br/>Count: ${rows.length}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Invoice #</th>
        <th>Tenant</th>
        <th>Property</th>
        <th>Unit</th>
        <th>Period</th>
        <th style="text-align:right;">Amount</th>
        <th>Status</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="5">Total</td>
        <td style="text-align:right;">KES ${total.toLocaleString()}</td>
        <td colspan="2"></td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;
  };

  const handleViewInvoice = (invoice) => {
    if (!invoice) return;
    const postedTx = postedInvoiceMap.get(invoice.id) || postedInvoiceMap.get(`${invoice.id}-U`);
    setJournalContext({
      transactionNumber: invoice.id,
      date: invoice.createdDate || "-",
      tenant: invoice.tenantName,
      property: invoice.propertyName,
      unit: invoice.unitName,
      cashbook: postedTx?.cashbook || "Tenant Receivables Control",
    });
    setJournalLines(buildJournalEntriesForInvoice(invoice));
    setJournalDrawerOpen(true);
  };

  const handlePrintInvoice = (invoice) => {
    if (!invoice) return;
    const printWindow = openHtmlDocument(`Invoice ${invoice.id}`, buildInvoiceHtml(invoice));
    if (!printWindow) return;

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const handleDownloadInvoice = (invoice) => {
    if (!invoice) return;
    const html = buildInvoiceHtml(invoice);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id || "invoice"}_${(invoice.period || "period").replace(/\s+/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success(`Downloaded ${invoice.id}`);
  };

  const handlePrintList = () => {
    if (filteredInvoices.length === 0) {
      toast.warn("No invoices to print");
      return;
    }

    const printWindow = openHtmlDocument("MILIK Rental Invoices List", buildInvoiceListHtml(filteredInvoices));
    if (!printWindow) return;

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const createBackendInvoiceEntry = async ({
    targetTenant,
    invoiceId,
    amount,
    paymentType,
    month,
    year,
    description,
  }) => {
    const numericAmount = Number(amount || 0);
    if (!targetTenant?._id || !targetTenant?.unit || numericAmount <= 0) return;

    const periodStart = getStartOfPeriod(month, year);
    const periodEnd = getEndOfPeriod(month, year);

    await createRentPayment(dispatch, {
      tenant: targetTenant._id,
      unit: targetTenant.unit?._id || targetTenant.unit,
      amount: numericAmount,
      paymentType,
      paymentDate: periodStart,
      dueDate: periodEnd,
      referenceNumber: invoiceId,
      description,
      isConfirmed: false,
      paymentMethod: "bank_transfer",
      cashbook: "Tenant Receivables Control",
      paidDirectToLandlord: false,
      ledgerType: "invoices",
      month: month + 1,
      year,
      utilities: [],
      breakdown: {
        rent: paymentType === "rent" ? numericAmount : 0,
        utilities: [],
        total: numericAmount,
      },
    });
  };

  const syncStoredInvoiceToBackend = async ({
    tenant,
    invoiceId,
    chargeType,
    amount,
    rentAmount,
    utilityAmount,
    month,
    year,
    existingRefs,
  }) => {
    if (!invoiceId || !tenant?._id) return;

    const hasRef = (ref) => existingRefs.has(String(ref || "").trim());

    if (chargeType === "rent") {
      if (!hasRef(invoiceId) && Number(amount) > 0) {
        await createBackendInvoiceEntry({
          targetTenant: tenant,
          invoiceId,
          amount,
          paymentType: "rent",
          month,
          year,
          description: `Invoice ${invoiceId} rent charge (${formatPeriodLabel(month, year)})`,
        });
        existingRefs.add(invoiceId);
      }
      return;
    }

    if (chargeType === "utility") {
      if (!hasRef(invoiceId) && Number(amount) > 0) {
        await createBackendInvoiceEntry({
          targetTenant: tenant,
          invoiceId,
          amount,
          paymentType: "utility",
          month,
          year,
          description: `Invoice ${invoiceId} utility charge (${formatPeriodLabel(month, year)})`,
        });
        existingRefs.add(invoiceId);
      }
      return;
    }

    const numericRent = Number(rentAmount || 0);
    const numericUtility = Number(utilityAmount || 0);
    const numericTotal = Number(amount || 0);
    const rentPortion = numericRent > 0 ? numericRent : Math.max(numericTotal - numericUtility, 0);
    const utilityRef = `${invoiceId}-U`;

    if (!hasRef(invoiceId) && rentPortion > 0) {
      await createBackendInvoiceEntry({
        targetTenant: tenant,
        invoiceId,
        amount: rentPortion,
        paymentType: "rent",
        month,
        year,
        description: `Invoice ${invoiceId} rent charge (${formatPeriodLabel(month, year)})`,
      });
      existingRefs.add(invoiceId);
    }

    if (!hasRef(utilityRef) && numericUtility > 0) {
      await createBackendInvoiceEntry({
        targetTenant: tenant,
        invoiceId: utilityRef,
        amount: numericUtility,
        paymentType: "utility",
        month,
        year,
        description: `Invoice ${invoiceId} utility charge (${formatPeriodLabel(month, year)})`,
      });
      existingRefs.add(utilityRef);
    }
  };

  useEffect(() => {
    if (hasSyncedLegacyInvoicesRef.current) return;
    if (!currentCompany?._id || tenantsFromStore.length === 0) return;

    const runSync = async () => {
      const existingRefs = new Set(
        (rentPayments || [])
          .map((payment) => String(payment?.referenceNumber || "").trim())
          .filter(Boolean)
      );

      let syncedCount = 0;

      for (const tenant of tenantsFromStore) {
        const storageKey = `createdInvoices_${tenant._id}`;
        const stored = localStorage.getItem(storageKey);
        if (!stored) continue;

        const tenantInvoices = JSON.parse(stored || "{}");

        for (const [periodKey, entry] of Object.entries(tenantInvoices || {})) {
          const invoiceId = getInvoiceIdFromEntry(entry);
          if (!invoiceId) continue;

          const period = getNormalizedPeriodFromEntry(periodKey, entry);
          const parsed = parsePeriodLabel(period);

          const amount = typeof entry === "object" ? Number(entry?.amount || 0) : 0;
          const rentAmount = typeof entry === "object" ? Number(entry?.rentAmount || 0) : 0;
          const utilityAmount = typeof entry === "object" ? Number(entry?.utilityAmount || 0) : 0;
          const chargeType = typeof entry === "object" && entry?.chargeType ? String(entry.chargeType) : "combined";

          const before = existingRefs.size;
          await syncStoredInvoiceToBackend({
            tenant,
            invoiceId,
            chargeType,
            amount,
            rentAmount,
            utilityAmount,
            month: parsed.month,
            year: parsed.year,
            existingRefs,
          });
          if (existingRefs.size > before) {
            syncedCount += existingRefs.size - before;
          }
        }
      }

      hasSyncedLegacyInvoicesRef.current = true;
      if (syncedCount > 0) {
        await getRentPayments(dispatch, currentCompany._id);
        toast.info(`Synced ${syncedCount} invoice ledger entr${syncedCount === 1 ? "y" : "ies"} to accounting ledger.`);
      }
    };

    runSync().catch((error) => {
      hasSyncedLegacyInvoicesRef.current = true;
      console.error("Invoice ledger sync failed:", error);
      toast.warn(error?.response?.data?.message || "Some legacy invoices could not be synced to ledger.");
    });
  }, [currentCompany?._id, tenantsFromStore, rentPayments, dispatch]);

  const createInvoiceForTenant = async (targetTenant, month, year, nextInvoiceNumRef, billingMode = "combined") => {
    if (!targetTenant?._id) {
      return { created: false, reason: "Invalid tenant" };
    }

    const periodLabel = formatPeriodLabel(month, year);
    const storageKey = `createdInvoices_${targetTenant._id}`;
    const stored = localStorage.getItem(storageKey);
    const tenantInvoices = stored ? JSON.parse(stored) : {};

    const hasInvoiceForPeriod = Object.entries(tenantInvoices).some(([periodKey, entry]) => {
      const normalizedPeriod = getNormalizedPeriodFromEntry(periodKey, entry);
      return normalizedPeriod === periodLabel;
    });

    if (hasInvoiceForPeriod) {
      return { created: false, reason: "already_exists", periodLabel };
    }

    const { rentAmount, utilityAmount, total } = getTenantPricing(targetTenant);
    const propertyName = resolveTenantPropertyName(targetTenant, unitsFromStore, propertiesFromStore);
    const unitName = getUnitDisplayName(targetTenant);

    const common = {
      createdAt: new Date().toISOString(),
      status: "Issued",
      period: periodLabel,
      tenantName: getTenantDisplayName(targetTenant),
      propertyName,
      unitName,
      month,
      year,
    };
    const createdInvoiceIds = [];

    if (billingMode === "separate") {
      const nextRentNum = nextInvoiceNumRef.current;
      nextInvoiceNumRef.current += 1;
      const rentInvoiceId = `INV${String(nextRentNum).padStart(5, "0")}`;
      tenantInvoices[`${periodLabel}__rent`] = {
        ...common,
        invoiceId: rentInvoiceId,
        id: rentInvoiceId,
        number: rentInvoiceId,
        amount: rentAmount,
        rentAmount,
        utilityAmount: 0,
        chargeType: "rent",
      };
      createdInvoiceIds.push(rentInvoiceId);

      if (utilityAmount > 0) {
        const nextUtilityNum = nextInvoiceNumRef.current;
        nextInvoiceNumRef.current += 1;
        const utilityInvoiceId = `INV${String(nextUtilityNum).padStart(5, "0")}`;
        tenantInvoices[`${periodLabel}__utility`] = {
          ...common,
          invoiceId: utilityInvoiceId,
          id: utilityInvoiceId,
          number: utilityInvoiceId,
          amount: utilityAmount,
          rentAmount: 0,
          utilityAmount,
          chargeType: "utility",
        };
        createdInvoiceIds.push(utilityInvoiceId);
      }
    } else {
      const nextInvoiceNum = nextInvoiceNumRef.current;
      nextInvoiceNumRef.current += 1;
      const invoiceId = `INV${String(nextInvoiceNum).padStart(5, "0")}`;

      tenantInvoices[periodLabel] = {
        ...common,
        invoiceId,
        id: invoiceId,
        number: invoiceId,
        amount: total,
        rentAmount,
        utilityAmount,
        chargeType: "combined",
      };
      createdInvoiceIds.push(invoiceId);
    }

    localStorage.setItem(storageKey, JSON.stringify(tenantInvoices));

    try {
      if (billingMode === "separate") {
        if (createdInvoiceIds[0] && rentAmount > 0) {
          await createBackendInvoiceEntry({
            targetTenant,
            invoiceId: createdInvoiceIds[0],
            amount: rentAmount,
            paymentType: "rent",
            month,
            year,
            description: `Invoice ${createdInvoiceIds[0]} rent charge (${periodLabel})`,
          });
        }

        if (createdInvoiceIds[1] && utilityAmount > 0) {
          await createBackendInvoiceEntry({
            targetTenant,
            invoiceId: createdInvoiceIds[1],
            amount: utilityAmount,
            paymentType: "utility",
            month,
            year,
            description: `Invoice ${createdInvoiceIds[1]} utility charge (${periodLabel})`,
          });
        }
      } else {
        if (createdInvoiceIds[0] && rentAmount > 0) {
          await createBackendInvoiceEntry({
            targetTenant,
            invoiceId: createdInvoiceIds[0],
            amount: rentAmount,
            paymentType: "rent",
            month,
            year,
            description: `Invoice ${createdInvoiceIds[0]} rent charge (${periodLabel})`,
          });
        }

        if (createdInvoiceIds[0] && utilityAmount > 0) {
          await createBackendInvoiceEntry({
            targetTenant,
            invoiceId: `${createdInvoiceIds[0]}-U`,
            amount: utilityAmount,
            paymentType: "utility",
            month,
            year,
            description: `Invoice ${createdInvoiceIds[0]} utility charge (${periodLabel})`,
          });
        }
      }
    } catch (error) {
      // Keep local invoice so users are not blocked; indicate ledger sync failure.
      return {
        created: true,
        invoiceIds: createdInvoiceIds,
        periodLabel,
        ledgerSynced: false,
        ledgerError: error?.response?.data?.message || error?.message || "Ledger sync failed",
      };
    }

    return { created: true, invoiceIds: createdInvoiceIds, periodLabel, ledgerSynced: true };
  };

  const handleBookingActionChange = (value) => {
    setBookingAction(value);
    if (value === "single") {
      setShowSingleBooking(true);
      if (tenantId) {
        setSingleBookingForm((prev) => ({ ...prev, tenantId }));
      }
    }
    if (value === "batch") {
      setShowBatchBooking(true);
    }
  };

  const handleSingleBooking = async () => {
    const selectedTenant = tenantLookup[singleBookingForm.tenantId];
    if (!selectedTenant) {
      toast.error("Please select a tenant");
      return;
    }

    const pricing = getTenantPricing(selectedTenant);
    if (pricing.total <= 0) {
      toast.error("Selected tenant has no billable rent/utility amount");
      return;
    }

    const nextInvoiceNumRef = { current: getNextInvoiceNumber() };
    const result = await createInvoiceForTenant(
      selectedTenant,
      Number(singleBookingForm.month),
      Number(singleBookingForm.year),
      nextInvoiceNumRef,
      singleBookingForm.billingMode
    );

    if (!result.created && result.reason === "already_exists") {
      toast.info(`Invoice for ${result.periodLabel} already exists for this tenant`);
      return;
    }

    if (!result.created) {
      toast.error(result.reason || "Failed to create booking");
      return;
    }

    if (result.ledgerSynced === false) {
      toast.warn(
        `Booked ${result.invoiceIds.join(", ")} for ${getTenantDisplayName(selectedTenant)} but ledger sync failed: ${result.ledgerError}`
      );
    } else {
      toast.success(
        `Booked ${result.invoiceIds.join(", ")} for ${getTenantDisplayName(selectedTenant)}`
      );
    }
    setShowSingleBooking(false);
    setBookingAction("");
    
    // Notify other components about invoice changes
    window.dispatchEvent(new Event('invoicesUpdated'));
    setRefreshTick((prev) => prev + 1);
  };

  const handleBatchBooking = async () => {
    const selectedPropertyId = batchBookingForm.propertyId;
    const month = Number(batchBookingForm.month);
    const year = Number(batchBookingForm.year);

    const eligibleTenants = tenantsFromStore.filter((tenant) => {
      const tenantStatus = String(tenant?.status || "active").toLowerCase();
      if (tenantStatus !== "active") return false;

      if (selectedPropertyId === "all") {
        const tenantPropertyId = getTenantPropertyId(tenant);
        if (!tenantPropertyId) return false;
        const matchedProperty = activeProperties.find((property) => property?._id === tenantPropertyId);
        return Boolean(matchedProperty);
      }

      const tenantPropertyId = getTenantPropertyId(tenant);
      return tenantPropertyId === selectedPropertyId;
    });

    if (eligibleTenants.length === 0) {
      toast.warn("No active tenants found for the selected scope");
      return;
    }

    const nextInvoiceNumRef = { current: getNextInvoiceNumber() };
    let createdCount = 0;
    let skippedCount = 0;
    let syncFailedCount = 0;

    for (const tenant of eligibleTenants) {
      const result = await createInvoiceForTenant(
        tenant,
        month,
        year,
        nextInvoiceNumRef,
        batchBookingForm.billingMode
      );
      if (result.created) {
        createdCount += 1;
        if (result.ledgerSynced === false) syncFailedCount += 1;
      } else if (result.reason === "already_exists") {
        skippedCount += 1;
      }
    }

    if (createdCount === 0 && skippedCount > 0) {
      toast.info(`No new invoices created. ${skippedCount} already existed.`);
      return;
    }

    const summary = `Batch booking complete: ${createdCount} created${skippedCount > 0 ? `, ${skippedCount} skipped` : ""}`;
    if (syncFailedCount > 0) {
      toast.warn(`${summary}, ${syncFailedCount} with ledger sync issues`);
    } else {
      toast.success(summary);
    }
    setShowBatchBooking(false);
    setBookingAction("");
    
    // Notify other components about invoice changes
    window.dispatchEvent(new Event('invoicesUpdated'));
    setRefreshTick((prev) => prev + 1);
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
      delete tenantInvoices[invoice.storagePeriodKey || invoice.period];
      localStorage.setItem(storageKey, JSON.stringify(tenantInvoices));
    });

    toast.success(`${selectedRows.length} invoice(s) deleted`);
    window.dispatchEvent(new Event('invoicesUpdated'));
    setSelectedInvoices([]);
    setSelectAll(false);
    setRefreshTick((prev) => prev + 1);
  };

  const handleDeleteSingle = (invoice) => {
    const storageKey = `createdInvoices_${invoice.tenantId}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    const tenantInvoices = JSON.parse(stored);
    delete tenantInvoices[invoice.storagePeriodKey || invoice.period];
    localStorage.setItem(storageKey, JSON.stringify(tenantInvoices));
    
    // Notify other components about invoice changes
    window.dispatchEvent(new Event('invoicesUpdated'));
    
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
              {tenantId ? (
                <button
                  onClick={() => navigate("/tenants")}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-semibold text-xs"
                  title="Back to Tenants"
                >
                  <FaArrowLeft size={12} />
                  Back to tenant list
                </button>
              ) : (
                <div />
              )}
            </div>

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
                  onClick={handlePrintList}
                  disabled={filteredInvoices.length === 0}
                  className={`px-4 py-1 text-xs text-white rounded-lg flex items-center gap-2 shadow-sm ${
                    filteredInvoices.length > 0
                      ? `${MILIK_GREEN} ${MILIK_GREEN_HOVER}`
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaPrint className="text-xs" />
                  Print List
                </button>

                <div className="flex items-center gap-1">
                  <FaPlus className="text-[10px] text-[#0B3B2E]" />
                  <select
                    value={bookingAction}
                    onChange={(e) => handleBookingActionChange(e.target.value)}
                    className="px-3 py-1 text-xs border border-[#0B3B2E] rounded-lg shadow-sm bg-[#E7F5EC] text-[#0B3B2E] font-semibold"
                  >
                    <option value="">Booking</option>
                    <option value="single">Create Single Booking</option>
                    <option value="batch">Create Batch Booking</option>
                  </select>
                </div>
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
                    <th className="px-3 py-2 text-left font-semibold">Type</th>
                    <th className="px-3 py-2 text-right font-semibold">Amount</th>
                    <th className="px-3 py-2 text-center font-semibold">Status</th>
                    <th className="px-3 py-2 text-center font-semibold">Created</th>
                    <th className="px-3 py-2 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={tenantId ? "10" : "12"} className="px-4 py-8 text-center text-gray-500">
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
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.key)}
                            onChange={() => toggleRowSelection(invoice.key)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-3 py-2 text-blue-700 font-bold">{invoice.id}</td>
                        {!tenantId && <td className="px-3 py-2 text-slate-900 font-bold">{invoice.tenantName}</td>}
                        {!tenantId && <td className="px-3 py-2 text-slate-900 font-semibold">{invoice.propertyName}</td>}
                        <td className="px-3 py-2 text-slate-900 font-semibold">{invoice.unitName}</td>
                        <td className="px-3 py-2 text-orange-700 font-semibold">{invoice.period}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                            {invoice.chargeType || "combined"}
                          </span>
                        </td>
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
                          <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleViewInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                              title="View Invoice"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(invoice)}
                              className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-50 rounded"
                              title="Print Invoice"
                            >
                              <FaPrint size={12} />
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(invoice)}
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

      {showSingleBooking && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-5 py-3 bg-[#0B3B2E] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wide">Single Tenant Booking</h3>
              <button
                onClick={() => {
                  setShowSingleBooking(false);
                  setBookingAction("");
                }}
                className="text-xs font-semibold px-2 py-1 rounded bg-white/20 hover:bg-white/30"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tenant</label>
                  <select
                    value={singleBookingForm.tenantId}
                    onChange={(e) =>
                      setSingleBookingForm((prev) => ({ ...prev, tenantId: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B3B2E]"
                  >
                    <option value="">Select tenant</option>
                    {singleBookingTenantOptions.map((tenantOption) => (
                      <option key={tenantOption.id} value={tenantOption.id}>
                        {tenantOption.name} - {tenantOption.propertyName} ({tenantOption.unitName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period</label>
                  <select
                    value={singleBookingForm.month}
                    onChange={(e) =>
                      setSingleBookingForm((prev) => ({ ...prev, month: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    {MONTH_OPTIONS.map((monthOption) => (
                      <option key={monthOption.value} value={monthOption.value}>
                        {monthOption.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={singleBookingForm.year}
                    onChange={(e) =>
                      setSingleBookingForm((prev) => ({ ...prev, year: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Mode</label>
                  <select
                    value={singleBookingForm.billingMode}
                    onChange={(e) =>
                      setSingleBookingForm((prev) => ({ ...prev, billingMode: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="combined">Combined (Rent + Utility)</option>
                    <option value="separate">Separate (Rent and Utility)</option>
                  </select>
                </div>
              </div>

              {selectedSingleBookingPreview && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-xs font-semibold text-emerald-800 mb-2">
                    Booking Preview - {selectedSingleBookingPreview.periodLabel}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500">Property</p>
                      <p className="font-semibold text-slate-900">{selectedSingleBookingPreview.propertyName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Unit</p>
                      <p className="font-semibold text-slate-900">{selectedSingleBookingPreview.unitName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Rent</p>
                      <p className="font-semibold text-slate-900">
                        KES {selectedSingleBookingPreview.rentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Utility</p>
                      <p className="font-semibold text-slate-900">
                        KES {selectedSingleBookingPreview.utilityAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-bold text-[#0B3B2E]">
                    Total: KES {selectedSingleBookingPreview.totalAmount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-800 font-semibold">
                    Mode: {singleBookingForm.billingMode === "separate" ? "Separate invoices" : "Combined invoice"}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowSingleBooking(false);
                    setBookingAction("");
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSingleBooking}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-[#0B3B2E] hover:bg-[#0A3127]"
                >
                  Create Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBatchBooking && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-5 py-3 bg-[#0B3B2E] text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wide">Batch Booking</h3>
              <button
                onClick={() => {
                  setShowBatchBooking(false);
                  setBookingAction("");
                }}
                className="text-xs font-semibold px-2 py-1 rounded bg-white/20 hover:bg-white/30"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Scope (Optional)
                  </label>
                  <select
                    value={batchBookingForm.propertyId}
                    onChange={(e) =>
                      setBatchBookingForm((prev) => ({ ...prev, propertyId: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="all">All active properties</option>
                    {activeProperties.map((property) => (
                      <option key={property._id} value={property._id}>
                        {property.propertyName || property.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period</label>
                  <select
                    value={batchBookingForm.month}
                    onChange={(e) =>
                      setBatchBookingForm((prev) => ({ ...prev, month: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    {MONTH_OPTIONS.map((monthOption) => (
                      <option key={monthOption.value} value={monthOption.value}>
                        {monthOption.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={batchBookingForm.year}
                    onChange={(e) =>
                      setBatchBookingForm((prev) => ({ ...prev, year: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Mode</label>
                  <select
                    value={batchBookingForm.billingMode}
                    onChange={(e) =>
                      setBatchBookingForm((prev) => ({ ...prev, billingMode: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="combined">Combined (Rent + Utility)</option>
                    <option value="separate">Separate (Rent and Utility)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                <p className="text-xs text-orange-800 font-semibold">
                  Scope preview: {batchBookingScopeCount} active tenant(s) will be booked for{" "}
                  {formatPeriodLabel(Number(batchBookingForm.month), Number(batchBookingForm.year))}.
                </p>
                <p className="text-xs text-orange-800 font-semibold mt-1">
                  Mode: {batchBookingForm.billingMode === "separate" ? "Separate invoices" : "Combined invoice"}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowBatchBooking(false);
                    setBookingAction("");
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBatchBooking}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-[#0B3B2E] hover:bg-[#0A3127]"
                >
                  Run Batch Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <JournalEntriesDrawer
        open={journalDrawerOpen}
        onClose={() => setJournalDrawerOpen(false)}
        title="Invoice Journal Entry"
        sourceType="invoice"
        context={journalContext}
        lines={journalLines}
      />
    </DashboardLayout>
  );
};

export default RentalInvoices;
