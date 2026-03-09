import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaEdit,
  FaEye,
  FaFileInvoiceDollar,
  FaPlus,
  FaPrint,
  FaRedoAlt,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUndo,
} from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import JournalEntriesDrawer from "../../components/Accounting/JournalEntriesDrawer";
import { getTenants } from "../../redux/tenantsRedux";
import {
  confirmRentPayment,
  createRentPayment,
  deleteRentPayment,
  getRentPayments,
  reverseRentPayment,
  cancelReversalRentPayment,
  updateRentPayment,
  unconfirmRentPayment,
} from "../../redux/apiCalls";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const CASHBOOK_OPTIONS = [
  "Main Cashbook",
  "Bank Cashbook",
  "Petty Cash",
  "M-Pesa Collections",
  "Agency Collections",
];

const CASHBOOK_ACCOUNT_MAP = {
  "Main Cashbook": { code: "1100", name: "Cash on Hand - Main" },
  "Bank Cashbook": { code: "1110", name: "Bank Accounts - Operations" },
  "Petty Cash": { code: "1120", name: "Petty Cash" },
  "M-Pesa Collections": { code: "1130", name: "M-Pesa Collections" },
  "Agency Collections": { code: "1140", name: "Agency Collections Control" },
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const toInputDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const getTenantName = (payment, tenants) => {
  const directName =
    payment?.tenant?.name ||
    payment?.tenant?.tenantName ||
    [payment?.tenant?.firstName, payment?.tenant?.lastName].filter(Boolean).join(" ");
  if (directName) return directName;
  const tenantId = payment?.tenant?._id || payment?.tenant;
  const tenantIdStr = tenantId ? String(tenantId) : "";
  const found = tenants.find((tenant) => String(tenant?._id || "") === tenantIdStr);
  return found?.name || "N/A";
};

const getUnitName = (payment, tenants) => {
  const direct = payment?.unit?.unitNumber || payment?.unit?.name || payment?.unit?.unitName;
  if (direct) return direct;
  const tenantId = payment?.tenant?._id || payment?.tenant;
  const tenantIdStr = tenantId ? String(tenantId) : "";
  const found = tenants.find((tenant) => String(tenant?._id || "") === tenantIdStr);
  return found?.unit?.unitNumber || "N/A";
};

const getPropertyName = (payment, tenants) => {
  const directProperty = payment?.unit?.property?.propertyName || payment?.unit?.propertyName;
  if (directProperty) return directProperty;

  const tenantId = payment?.tenant?._id || payment?.tenant;
  const tenantIdStr = tenantId ? String(tenantId) : "";
  const found = tenants.find((tenant) => String(tenant?._id || "") === tenantIdStr);

  return (
    found?.unit?.property?.propertyName ||
    found?.property?.propertyName ||
    found?.propertyName ||
    "N/A"
  );
};

const getLedgerType = (payment) => {
  if (payment?.reversalOf) return "cashbook";
  return payment?.ledgerType || "receipts";
};

const getCashbookAccount = (cashbook) => {
  return CASHBOOK_ACCOUNT_MAP[cashbook] || CASHBOOK_ACCOUNT_MAP["Main Cashbook"];
};

const buildJournalEntriesForReceipt = (receipt) => {
  const amount = Number(receipt?.amount || 0);
  const narration = receipt?.description || `Receipt ${receipt?.receiptNumber || receipt?.referenceNumber || ""}`;
  const ledgerType = getLedgerType(receipt);
  const cashbook = receipt?.cashbook || "Main Cashbook";
  const cashbookAccount = getCashbookAccount(cashbook);

  if (ledgerType === "invoices") {
    const incomeAccount = receipt?.paymentType === "utility"
      ? { code: "4102", name: "Utility Recharge Income" }
      : { code: "4100", name: "Rent Income" };
    return [
      {
        accountCode: "1200",
        accountName: "Tenant Receivables",
        debit: amount,
        credit: 0,
        narration,
      },
      {
        accountCode: incomeAccount.code,
        accountName: incomeAccount.name,
        debit: 0,
        credit: amount,
        narration,
      },
    ];
  }

  return [
    {
      accountCode: cashbookAccount.code,
      accountName: cashbookAccount.name,
      debit: amount,
      credit: 0,
      narration,
    },
    {
      accountCode: "1200",
      accountName: "Tenant Receivables",
      debit: 0,
      credit: amount,
      narration,
    },
  ];
};

const Receipts = () => {
  const { id: tenantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCompany } = useSelector((state) => state.company || {});
  const { currentUser } = useSelector((state) => state.auth || {});
  const tenants = useSelector((state) => state.tenant?.tenants || []);
  const rentPayments = useSelector((state) => state.rentPayment?.rentPayments || []);
  const loading = useSelector((state) => state.rentPayment?.isFetching || false);

  const initialFilters = {
     search: "",
     tenantSearch: "",
     status: "all",
     paymentType: "all",
     tenant: tenantId || "all",
     property: "all",
     unit: "all",
     ledger: "all",
     from: "",
     to: "",
  };

  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [journalDrawerOpen, setJournalDrawerOpen] = useState(false);
  const [journalContext, setJournalContext] = useState({});
  const [journalLines, setJournalLines] = useState([]);
  const [formData, setFormData] = useState({
    tenantId: tenantId || "",
    amount: "",
    paymentType: "rent",
    paymentMethod: "mobile_money",
    cashbook: "Main Cashbook",
    paymentDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    description: "",
    isConfirmed: false,
  });

  const loadData = async () => {
    if (!currentCompany?._id) return;
    try {
      await dispatch(getTenants({ business: currentCompany._id }));
      await getRentPayments(dispatch, currentCompany._id, appliedFilters.tenant !== "all" ? appliedFilters.tenant : null);
    } catch (error) {
      toast.error("Failed to load receipts");
    }
  };

  useEffect(() => {
    if (!currentCompany?._id) return;
    loadData();
  }, [currentCompany?._id, appliedFilters.tenant]);

  const propertyOptions = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(rentPayments.map((p) => getPropertyName(p, tenants)).filter(Boolean))).sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    ];
  }, [rentPayments, tenants]);

  const unitOptions = useMemo(() => {
    const scoped = rentPayments.filter((p) => {
      if (draftFilters.property === "all") return true;
      return getPropertyName(p, tenants) === draftFilters.property;
    });

    return [
      "all",
      ...Array.from(new Set(scoped.map((p) => getUnitName(p, tenants)).filter(Boolean))).sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    ];
  }, [rentPayments, tenants, draftFilters.property]);

  // Only show receipts, not invoices
  const filteredReceipts = useMemo(() => {
    return rentPayments.filter((payment) => {
      // Only allow receipts and cashbook entries, not invoices
      const ledgerType = getLedgerType(payment);
      if (ledgerType !== "receipts" && ledgerType !== "cashbook") return false;

      const tenantName = getTenantName(payment, tenants).toLowerCase();
      const unitName = getUnitName(payment, tenants).toLowerCase();
      const propertyName = getPropertyName(payment, tenants);
      const receiptNo = (payment.receiptNumber || "").toLowerCase();
      const referenceNo = (payment.referenceNumber || "").toLowerCase();
      const searchTerm = appliedFilters.search.toLowerCase().trim();
      const tenantSearch = appliedFilters.tenantSearch.toLowerCase().trim();

      if (searchTerm) {
        const hasMatch =
          tenantName.includes(searchTerm) ||
          propertyName.toLowerCase().includes(searchTerm) ||
          unitName.includes(searchTerm) ||
          receiptNo.includes(searchTerm) ||
          referenceNo.includes(searchTerm);
        if (!hasMatch) return false;
      }

      if (appliedFilters.status === "confirmed" && !payment.isConfirmed) return false;
      if (appliedFilters.status === "pending" && payment.isConfirmed) return false;
      if (appliedFilters.paymentType !== "all" && payment.paymentType !== appliedFilters.paymentType) return false;
      if (tenantSearch && !tenantName.includes(tenantSearch)) return false;

      const thisTenantId = payment?.tenant?._id || payment?.tenant;
      if (appliedFilters.tenant !== "all" && thisTenantId !== appliedFilters.tenant) return false;

      if (appliedFilters.property !== "all" && propertyName !== appliedFilters.property) return false;
      if (appliedFilters.unit !== "all" && getUnitName(payment, tenants) !== appliedFilters.unit) return false;

      // Remove ledger filter for invoices
      if (appliedFilters.ledger !== "all" && ledgerType !== appliedFilters.ledger) return false;

      if (appliedFilters.from) {
        const fromDate = new Date(appliedFilters.from);
        const paymentDate = new Date(payment.paymentDate || payment.createdAt);
        if (paymentDate < fromDate) return false;
      }

      if (appliedFilters.to) {
        const toDate = new Date(appliedFilters.to);
        toDate.setHours(23, 59, 59, 999);
        const paymentDate = new Date(payment.paymentDate || payment.createdAt);
        if (paymentDate > toDate) return false;
      }

      return true;
    });
  }, [rentPayments, appliedFilters, tenants]);

  const stats = useMemo(() => {
    const total = filteredReceipts.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const confirmedCount = filteredReceipts.filter((item) => item.isConfirmed).length;
    const pendingCount = filteredReceipts.length - confirmedCount;
    return {
      count: filteredReceipts.length,
      total,
      confirmedCount,
      pendingCount,
    };
  }, [filteredReceipts]);

  const selectedTenant = useMemo(() => {
    return tenants.find((tenant) => tenant._id === formData.tenantId);
  }, [formData.tenantId, tenants]);

  const getCreatedInvoicesForTenant = (targetTenantId) => {
    if (!targetTenantId) return [];

    const storageKey = `createdInvoices_${targetTenantId}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];

    try {
      const entries = JSON.parse(stored);
      return Object.entries(entries || {}).map(([period, entry]) => {
        const amount =
          typeof entry === "object" && Number.isFinite(Number(entry?.amount))
            ? Number(entry.amount)
            : 0;
        const createdAt =
          typeof entry === "object" ? entry?.createdAt || entry?.createdDate || null : null;

        return {
          period,
          amount,
          createdAt,
        };
      });
    } catch (error) {
      return [];
    }
  };

  // Helper: Calculate tenant balance from actual invoices and confirmed receipts
  const calculateTenantBalance = (tenantId) => {
    if (!tenantId) return { totalOwed: 0, totalPaid: 0, balance: 0 };
    
    // Get all tenant's confirmed payments
    const tenantPayments = rentPayments.filter(
      (p) => (p.tenant === tenantId || p.tenant?._id === tenantId) && p.isConfirmed === true
    );
    const totalPaid = tenantPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const invoices = getCreatedInvoicesForTenant(tenantId);
    const totalOwed = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
    const balance = totalOwed - totalPaid;

    return { totalOwed, totalPaid, balance };
  };

  // Helper: Outstanding invoice breakdown from actual created invoices
  const getOutstandingInvoices = (tenantId) => {
    if (!tenantId) return [];

    const invoices = getCreatedInvoicesForTenant(tenantId)
      .filter((inv) => Number(inv.amount) > 0)
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });

    const confirmedPayments = rentPayments
      .filter((p) => (p.tenant === tenantId || p.tenant?._id === tenantId) && p.isConfirmed === true)
      .sort((a, b) => {
        const aTime = new Date(a.paymentDate || a.createdAt).getTime();
        const bTime = new Date(b.paymentDate || b.createdAt).getTime();
        return aTime - bTime;
      });

    let remainingPaid = confirmedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return invoices
      .map((inv) => {
        const invAmount = Number(inv.amount) || 0;
        const paid = Math.min(invAmount, Math.max(0, remainingPaid));
        remainingPaid -= paid;
        const outstanding = Math.max(0, invAmount - paid);

        return {
          month: inv.period,
          rent: invAmount,
          paid,
          outstanding,
        };
      })
      .filter((inv) => inv.outstanding > 0 || inv.paid > 0);
  };

  const resetForm = () => {
    setFormData({
      tenantId: tenantId || "",
      amount: "",
      paymentType: "rent",
      paymentMethod: "mobile_money",
      cashbook: "Main Cashbook",
      paymentDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      description: "",
      isConfirmed: false,
    });
    setActiveReceipt(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    if (tenantId) {
      navigate(`/receipts/new?tenant=${tenantId}`);
      return;
    }
    navigate("/receipts/new");
  };

  const openEditForm = (receipt) => {
    const tenantRef = receipt?.tenant?._id || receipt?.tenant || "";
    setActiveReceipt(receipt);
    setFormData({
      tenantId: tenantRef,
      amount: receipt.amount || "",
      paymentType: receipt.paymentType || "rent",
      paymentMethod: receipt.paymentMethod || "mobile_money",
      cashbook: receipt.cashbook || "Main Cashbook",
      paymentDate: (receipt.paymentDate || "").split("T")[0] || new Date().toISOString().split("T")[0],
      dueDate: (receipt.dueDate || "").split("T")[0] || new Date().toISOString().split("T")[0],
      description: receipt.description || "",
      isConfirmed: Boolean(receipt.isConfirmed),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.tenantId) {
      toast.error("Tenant is required");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    if (!formData.cashbook) {
      toast.error("Cashbook is required");
      return;
    }

    const unitId = selectedTenant?.unit?._id || selectedTenant?.unit;
    if (!unitId) {
      toast.error("Selected tenant has no linked unit");
      return;
    }

    const paymentDateObj = new Date(formData.paymentDate);
    const payload = {
      tenant: formData.tenantId,
      unit: unitId,
      amount: Number(formData.amount),
      paymentType: formData.paymentType,
      paymentMethod: formData.paymentMethod,
      cashbook: formData.cashbook,
      paymentDate: formData.paymentDate,
      dueDate: formData.dueDate,
      description: formData.description,
      isConfirmed: formData.isConfirmed,
      month: paymentDateObj.getMonth() + 1,
      year: paymentDateObj.getFullYear(),
    };

    try {
      if (activeReceipt?._id) {
        await updateRentPayment(dispatch, activeReceipt._id, payload);
        toast.success("Receipt updated successfully");
      } else {
        await createRentPayment(dispatch, payload);
        toast.success("Receipt created successfully");
      }
      resetForm();
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save receipt");
    }
  };

  const handleDeleteOne = async (receiptId) => {
    try {
      await deleteRentPayment(dispatch, receiptId);
      toast.success("Receipt deleted");
      setSelectedIds((prev) => prev.filter((id) => id !== receiptId));
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete receipt");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Select receipt(s) to delete");
      return;
    }

    try {
      for (const receiptId of selectedIds) {
        await deleteRentPayment(dispatch, receiptId);
      }
      toast.success(`${selectedIds.length} receipt(s) deleted`);
      setSelectedIds([]);
      await loadData();
    } catch (error) {
      toast.error("Failed to delete selected receipts");
    }
  };

  const handleReverseOne = async (receipt) => {
    if (!receipt?.isConfirmed) {
      toast.warning("Only confirmed receipts can be reversed");
      return;
    }

    if (receipt?.isReversed) {
      toast.info("Receipt is already reversed");
      return;
    }

    const reason = window.prompt("Provide reversal reason", "Customer correction");
    if (reason === null) return;

    try {
      await reverseRentPayment(dispatch, receipt._id, { reason });
      toast.success("Receipt reversed successfully");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reverse receipt");
    }
  };

  const handleReverseSelected = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Select receipt(s) to reverse");
      return;
    }

    const selectedReceipts = filteredReceipts.filter((r) => selectedIds.includes(r._id));
    const eligible = selectedReceipts.filter((r) => r.isConfirmed && !r.isReversed);

    if (eligible.length === 0) {
      toast.warning("No eligible confirmed receipts selected for reversal");
      return;
    }

    const reason = window.prompt("Provide reversal reason for selected receipts", "Batch correction");
    if (reason === null) return;

    try {
      for (const receipt of eligible) {
        await reverseRentPayment(dispatch, receipt._id, { reason });
      }
      toast.success(`${eligible.length} receipt(s) reversed successfully`);
      setSelectedIds([]);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reverse selected receipts");
    }
  };

  const handleCancelReversalOne = async (receipt) => {
    if (!receipt?.isReversed) {
      toast.info("Receipt is not reversed");
      return;
    }

    const reason = window.prompt("Provide reason for cancelling reversal", "Allocation restoration");
    if (reason === null) return;

    try {
      await cancelReversalRentPayment(dispatch, receipt._id, { reason });
      toast.success("Reversal cancelled. Receipt allocation restored.");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel reversal");
    }
  };

  const applySearchFilters = () => {
    setAppliedFilters({ ...draftFilters });
    setSelectedIds([]);
  };

  const resetSearchFilters = () => {
    const reset = {
      ...initialFilters,
      tenant: tenantId || "all",
    };
    setDraftFilters(reset);
    setAppliedFilters(reset);
    setSelectedIds([]);
  };

  const applyDatePreset = (preset) => {
    const today = new Date();
    let from = "";
    let to = "";

    if (preset === "today") {
      from = toInputDate(today);
      to = toInputDate(today);
    }

    if (preset === "thisMonth") {
      from = toInputDate(new Date(today.getFullYear(), today.getMonth(), 1));
      to = toInputDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    }

    if (preset === "lastMonth") {
      from = toInputDate(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      to = toInputDate(new Date(today.getFullYear(), today.getMonth(), 0));
    }

    setDraftFilters((prev) => ({
      ...prev,
      from,
      to,
    }));
  };

  const handleConfirmOne = async (receipt) => {
    if (receipt.isConfirmed) {
      toast.info("Receipt already confirmed");
      return;
    }

    try {
      await confirmRentPayment(dispatch, receipt._id, {
        confirmedBy: currentUser?._id || currentUser?.id || null,
      });
      toast.success("Receipt confirmed");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to confirm receipt");
    }
  };

  const handleConfirmSelected = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Select receipt(s) to confirm");
      return;
    }

    try {
      for (const receiptId of selectedIds) {
        const receipt = filteredReceipts.find((item) => item._id === receiptId);
        if (receipt && !receipt.isConfirmed) {
          await confirmRentPayment(dispatch, receiptId, {
            confirmedBy: currentUser?._id || currentUser?.id || null,
          });
        }
      }
      toast.success("Selected receipts confirmed");
      setSelectedIds([]);
      await loadData();
    } catch (error) {
      toast.error("Failed to confirm selected receipts");
    }
  };

  const handleUnconfirmOne = async (receipt) => {
    if (!receipt.isConfirmed) {
      toast.info("Receipt is not confirmed. Cannot unconfirm an unconfirmed receipt.");
      return;
    }

    try {
      await unconfirmRentPayment(dispatch, receipt._id);
      toast.success("Receipt unconfirmed. You can now delete it.");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to unconfirm receipt");
    }
  };

  const toggleSelection = (receiptId) => {
    setSelectedIds((prev) =>
      prev.includes(receiptId) ? prev.filter((id) => id !== receiptId) : [...prev, receiptId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredReceipts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReceipts.map((item) => item._id));
    }
  };

  const openView = (receipt) => {
    setActiveReceipt(receipt);
    setShowView(true);
  };

  const openJournalDrawer = (receipt) => {
    const context = {
      transactionNumber: receipt?.receiptNumber || receipt?.referenceNumber || "-",
      date: formatDate(receipt?.paymentDate),
      tenant: getTenantName(receipt, tenants),
      property: getPropertyName(receipt, tenants),
      unit: getUnitName(receipt, tenants),
      cashbook: receipt?.cashbook || "Main Cashbook",
    };
    setJournalContext(context);
    setJournalLines(buildJournalEntriesForReceipt(receipt));
    setJournalDrawerOpen(true);
  };

  const handlePrintReceipt = (receipt) => {
    const tenantName = getTenantName(receipt, tenants);
    const unitName = getUnitName(receipt, tenants);
    const propertyName = getPropertyName(receipt, tenants);
    const companyName = currentCompany?.companyName || currentCompany?.name || "MILIK";

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>MILIK Receipt ${receipt.receiptNumber || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 16px; }
            .logo { height: 48px; width: 48px; border: 2px dashed #9ca3af; border-radius: 8px; display:flex; align-items:center; justify-content:center; color:#6b7280; font-size:11px; font-weight:700; }
            .company { font-size: 20px; font-weight: 800; color: #0B3B2E; }
            .title { font-size: 22px; font-weight: 700; color: #0B3B2E; margin-top: 8px; margin-bottom: 4px; }
            .sub { color: #6b7280; margin-bottom: 16px; }
            .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; }
            .label { color: #6b7280; }
            .value { font-weight: 700; }
            .amount { font-size: 24px; color: #0B3B2E; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">${escapeHtml(companyName)}</div>
              <div class="sub">Property Management System</div>
            </div>
            <div class="logo">LOGO</div>
          </div>
          <div class="title">MILIK RECEIPT</div>
          <div class="sub">Professional property receipt statement</div>
          <div class="card">
            <div class="row"><span class="label">Receipt #</span><span class="value">${escapeHtml(receipt.receiptNumber || "-")}</span></div>
            <div class="row"><span class="label">Reference #</span><span class="value">${escapeHtml(receipt.referenceNumber || "-")}</span></div>
            <div class="row"><span class="label">Date</span><span class="value">${formatDate(receipt.paymentDate)}</span></div>
            <div class="row"><span class="label">Tenant</span><span class="value">${escapeHtml(tenantName)}</span></div>
            <div class="row"><span class="label">Property</span><span class="value">${escapeHtml(propertyName)}</span></div>
            <div class="row"><span class="label">Unit</span><span class="value">${escapeHtml(unitName)}</span></div>
            <div class="row"><span class="label">Payment Type</span><span class="value">${escapeHtml(receipt.paymentType || "-")}</span></div>
            <div class="row"><span class="label">Method</span><span class="value">${escapeHtml(receipt.paymentMethod || "-")}</span></div>
            <div class="row"><span class="label">Status</span><span class="value">${receipt.isConfirmed ? "Confirmed" : "Pending"}</span></div>
            <div class="row"><span class="label">Amount</span><span class="value amount">Ksh ${Number(receipt.amount || 0).toLocaleString()}</span></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handlePrintList = () => {
    const companyName = currentCompany?.companyName || currentCompany?.name || "MILIK";
    const printedOn = new Date().toLocaleString();

    const rowsHtml = filteredReceipts
      .map(
        (receipt, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(receipt.receiptNumber || "-")}</td>
            <td>${formatDate(receipt.paymentDate)}</td>
            <td>${escapeHtml(getTenantName(receipt, tenants))}</td>
            <td>${escapeHtml(getPropertyName(receipt, tenants))}</td>
            <td>${escapeHtml(getUnitName(receipt, tenants))}</td>
            <td>${escapeHtml(receipt.referenceNumber || "-")}</td>
            <td style="text-align:right;">Ksh ${Number(receipt.amount || 0).toLocaleString()}</td>
            <td>${receipt.isConfirmed ? "Confirmed" : "Pending"}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipts List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 18px; color: #0f172a; }
            .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px; }
            .company { font-size: 20px; font-weight: 800; color:#0B3B2E; }
            .logo { height:44px; width:44px; border:2px dashed #9ca3af; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#6b7280; font-size:10px; font-weight:700; }
            .meta { font-size: 12px; color:#475569; margin-top:6px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 7px; text-align: left; }
            th { background: #0B3B2E; color: #fff; font-weight: 700; }
            tr:nth-child(even) { background: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">${escapeHtml(companyName)}</div>
              <div class="meta">Receipts List | Printed: ${escapeHtml(printedOn)}</div>
              <div class="meta">Records: ${filteredReceipts.length} | Total: Ksh ${stats.total.toLocaleString()}</div>
            </div>
            <div class="logo">LOGO</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Receipt #</th>
                <th>Date</th>
                <th>Tenant</th>
                <th>Property</th>
                <th>Unit</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="9" style="text-align:center;">No receipts to print</td></tr>'}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
        <div className="mx-auto" style={{ maxWidth: "96%" }}>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2.5 mb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => navigate("/tenants")}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-semibold text-xs"
              >
                <FaArrowLeft /> Back to Tenants
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="px-3 py-1 text-xs border border-slate-300 rounded-md hover:bg-slate-50 font-semibold flex items-center gap-2"
                >
                  <FaRedoAlt /> Refresh
                </button>
                <button
                  onClick={openCreateForm}
                  className={`px-3 py-1 text-xs text-white rounded-md font-semibold flex items-center gap-2 ${MILIK_ORANGE} ${MILIK_ORANGE_HOVER}`}
                >
                  <FaPlus /> New Receipt
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 bg-slate-50 font-semibold text-slate-700">
                Receipts: <strong className="text-slate-900">{stats.count}</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-green-300 bg-green-50 font-semibold text-green-700">
                Total: <strong>Ksh {stats.total.toLocaleString()}</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-blue-300 bg-blue-50 font-semibold text-blue-700">
                Confirmed: <strong>{stats.confirmedCount}</strong>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-orange-300 bg-orange-50 font-semibold text-orange-700">
                Pending: <strong>{stats.pendingCount}</strong>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              <div className="md:col-span-2 relative">
                <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                <input
                  value={draftFilters.search}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, search: e.target.value }))}
                  placeholder="Search tenant, receipt, reference"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>

              <input
                value={draftFilters.tenantSearch}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, tenantSearch: e.target.value }))}
                placeholder="Filter tenant by name"
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              />

              <select
                value={draftFilters.property}
                onChange={(e) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    property: e.target.value,
                    unit: "all",
                  }))
                }
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              >
                {propertyOptions.map((property) => (
                  <option key={property} value={property}>
                    {property === "all" ? "All Properties" : property}
                  </option>
                ))}
              </select>

              <select
                value={draftFilters.unit}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, unit: e.target.value }))}
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              >
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit === "all" ? "All Units" : unit}
                  </option>
                ))}
              </select>

              <select
                value={draftFilters.ledger}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, ledger: e.target.value }))}
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              >
                <option value="all">All Ledgers</option>
                <option value="receipts">Receipts Ledger</option>
                <option value="cashbook">Cashbook Ledger</option>
              </select>

              <select
                value={draftFilters.status}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={draftFilters.paymentType}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, paymentType: e.target.value }))}
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="rent">Rent</option>
                <option value="deposit">Deposit</option>
                <option value="utility">Utility</option>
                <option value="late_fee">Late Fee</option>
                <option value="other">Other</option>
              </select>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={draftFilters.from}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, from: e.target.value }))}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-md"
                />
                <input
                  type="date"
                  value={draftFilters.to}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => applyDatePreset("today")}
                className="px-3 py-1.5 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                Today
              </button>
              <button
                onClick={() => applyDatePreset("thisMonth")}
                className="px-3 py-1.5 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                This Month
              </button>
              <button
                onClick={() => applyDatePreset("lastMonth")}
                className="px-3 py-1.5 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
              >
                Last Month
              </button>
              <button
                onClick={applySearchFilters}
                className={`px-3 py-1.5 text-xs rounded-md text-white font-semibold flex items-center gap-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
              >
                <FaSearch /> Search
              </button>
              <button
                onClick={resetSearchFilters}
                className="px-3 py-1.5 text-xs rounded-md bg-slate-500 hover:bg-slate-600 text-white font-semibold flex items-center gap-2"
              >
                <FaRedoAlt /> Reset Filters
              </button>
              <button
                onClick={handleConfirmSelected}
                className="px-3 py-1.5 text-xs rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
              >
                <FaCheck /> Confirm Selected
              </button>
              <button
                onClick={handleReverseSelected}
                className="px-3 py-1.5 text-xs rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center gap-2"
              >
                <FaUndo /> Reverse Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 text-xs rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
              >
                <FaTrash /> Delete Selected
              </button>
              <button
                onClick={handlePrintList}
                className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2"
              >
                <FaPrint /> Print List
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-xs">
                <thead>
                  <tr className={`${MILIK_GREEN} text-white`}>
                    <th className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={filteredReceipts.length > 0 && selectedIds.length === filteredReceipts.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-3 py-2 text-left">Receipt #</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Tenant</th>
                    <th className="px-3 py-2 text-left">Property</th>
                    <th className="px-3 py-2 text-left">Unit</th>
                    <th className="px-3 py-2 text-left">Ledger</th>
                    <th className="px-3 py-2 text-left">Cashbook</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Method</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Reference</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.length === 0 ? (
                    <tr>
                      <td colSpan="14" className="px-3 py-10 text-center text-slate-500">
                        No receipts found.
                      </td>
                    </tr>
                  ) : (
                    filteredReceipts.map((receipt, index) => {
                      const isSelected = selectedIds.includes(receipt._id);
                      return (
                        <tr
                          key={receipt._id}
                          className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} border-b border-slate-200`}
                          onClick={() => openJournalDrawer(receipt)}
                        >
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelection(receipt._id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-3 py-2 font-bold text-slate-900">{receipt.receiptNumber || "-"}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{formatDate(receipt.paymentDate)}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{getTenantName(receipt, tenants)}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{getPropertyName(receipt, tenants)}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{getUnitName(receipt, tenants)}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex px-2 py-1 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                              {getLedgerType(receipt)}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{receipt.cashbook || "Main Cashbook"}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900 capitalize">{receipt.paymentType || "-"}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900 capitalize">{(receipt.paymentMethod || "-").replace("_", " ")}</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900">
                            Ksh {Number(receipt.amount || 0).toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex px-2 py-1 rounded text-[10px] font-semibold ${
                                receipt.isConfirmed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {receipt.isConfirmed ? "Confirmed" : "Pending"}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{receipt.referenceNumber || "-"}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => openView(receipt)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                                title="View"
                              >
                                <FaEye size={11} />
                              </button>
                              <button
                                onClick={() => openEditForm(receipt)}
                                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                                title="Edit"
                              >
                                <FaEdit size={11} />
                              </button>
                              <button
                                onClick={() => handleConfirmOne(receipt)}
                                className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                                title="Confirm"
                                disabled={receipt.isConfirmed}
                              >
                                <FaCheck size={11} />
                              </button>
                              <button
                                onClick={() => handleUnconfirmOne(receipt)}
                                className="px-2 py-1 rounded bg-orange-600 hover:bg-orange-700 text-white"
                                title="Unconfirm"
                                disabled={!receipt.isConfirmed}
                              >
                                <FaTimes size={11} />
                              </button>
                              <button
                                onClick={() => handleDeleteOne(receipt._id)}
                                className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                                title="Delete"
                              >
                                <FaTrash size={11} />
                              </button>
                              <button
                                onClick={() => handleReverseOne(receipt)}
                                className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reverse Receipt"
                                disabled={!receipt.isConfirmed || receipt.isReversed}
                              >
                                <FaUndo size={11} />
                              </button>
                              <button
                                onClick={() => handleCancelReversalOne(receipt)}
                                className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cancel Reversal"
                                disabled={!receipt.isReversed}
                              >
                                <FaRedoAlt size={11} />
                              </button>
                              <button
                                onClick={() => handlePrintReceipt(receipt)}
                                className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white"
                                title="Print"
                              >
                                <FaPrint size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-slate-900 text-sm">
                {activeReceipt ? "Edit Receipt" : "Create Receipt"}
              </h3>
              <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>

            <div className="p-4">
              {/* Balance Summary Section */}
              {formData.tenantId && (
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(() => {
                    const { totalOwed, totalPaid, balance } = calculateTenantBalance(formData.tenantId);
                    const receiptAmount = Number(formData.amount) || 0;
                    const newBalance = balance - receiptAmount;
                    
                    return (
                      <>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-[10px] font-bold uppercase text-red-700 mb-1">Total Owed</p>
                          <p className="text-xl font-bold text-red-700">Ksh {totalOwed.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-[10px] font-bold uppercase text-blue-700 mb-1">Current Balance</p>
                          <p className={`text-xl font-bold ${balance > 0 ? 'text-blue-700' : 'text-green-700'}`}>
                            Ksh {balance.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-[10px] font-bold uppercase text-green-700 mb-1">After Receipt</p>
                          <p className={`text-xl font-bold ${newBalance > 0 ? 'text-red-700' : 'text-green-700'}`}>
                            Ksh {newBalance.toLocaleString()}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Outstanding Invoices List */}
              {formData.tenantId && (
                <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-slate-700 mb-3">📋 OUTSTANDING INVOICES</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getOutstandingInvoices(formData.tenantId).length > 0 ? (
                      getOutstandingInvoices(formData.tenantId).map((invoice, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded p-2 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-900">{invoice.month}</span>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                              invoice.outstanding > 0 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {invoice.outstanding === 0 ? '✓ PAID' : '⚠ DUE'}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600 mb-1">
                            <span>Rent: Ksh {invoice.rent.toLocaleString()}</span>
                            <span>Paid: Ksh {invoice.paid.toLocaleString()}</span>
                          </div>
                          {invoice.outstanding > 0 && (
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div 
                                className="bg-orange-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (invoice.paid / invoice.rent) * 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-center py-4">No outstanding invoices</p>
                    )}
                  </div>
                </div>
              )}

              {/* Impact Visualization */}
              {formData.tenantId && formData.amount && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-amber-800 mb-2">💡 BALANCE IMPACT</h4>
                  {(() => {
                    const { balance } = calculateTenantBalance(formData.tenantId);
                    const receiptAmount = Number(formData.amount) || 0;
                    const newBalance = balance - receiptAmount;
                    const progressBase = Math.abs(balance);
                    const progress =
                      progressBase > 0
                        ? Math.max(0, Math.min(100, (Math.min(progressBase, receiptAmount) / progressBase) * 100))
                        : 0;
                    
                    return (
                      <>
                        <p className="text-[10px] text-amber-800 mb-2">
                          This receipt of <strong>Ksh {receiptAmount.toLocaleString()}</strong> will reduce the balance by {(progress).toFixed(1)}%
                        </p>
                        <div className="w-full bg-slate-300 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Tenant *</label>
                <select
                  value={formData.tenantId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tenantId: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="">Select tenant</option>
                  {tenants.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Amount *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Payment Type *</label>
                <select
                  value={formData.paymentType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paymentType: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="rent">Rent</option>
                  <option value="deposit">Deposit</option>
                  <option value="utility">Utility</option>
                  <option value="late_fee">Late Fee</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Payment Method *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Cashbook *</label>
                <select
                  value={formData.cashbook}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cashbook: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  {CASHBOOK_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Payment Date *</label>
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paymentDate: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Optional note"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isConfirmed"
                  checked={formData.isConfirmed}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isConfirmed: e.target.checked }))}
                />
                <label htmlFor="isConfirmed" className="text-xs font-semibold text-slate-700">
                  Mark as confirmed
                </label>
              </div>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-xs border border-slate-300 rounded-md font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 text-xs rounded-md text-white font-semibold ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
              >
                {activeReceipt ? "Update Receipt" : "Create Receipt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showView && activeReceipt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-xl">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FaFileInvoiceDollar /> Receipt Details
              </h3>
              <button onClick={() => setShowView(false)} className="text-slate-500 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Receipt #</span><span className="font-semibold">{activeReceipt.receiptNumber || "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Reference #</span><span className="font-semibold">{activeReceipt.referenceNumber || "-"}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Tenant</span><span className="font-semibold">{getTenantName(activeReceipt, tenants)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Unit</span><span className="font-semibold">{getUnitName(activeReceipt, tenants)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Payment Date</span><span className="font-semibold">{formatDate(activeReceipt.paymentDate)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Due Date</span><span className="font-semibold">{formatDate(activeReceipt.dueDate)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Type</span><span className="font-semibold capitalize">{activeReceipt.paymentType}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Method</span><span className="font-semibold capitalize">{activeReceipt.paymentMethod?.replace("_", " ")}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Cashbook</span><span className="font-semibold">{activeReceipt.cashbook || "Main Cashbook"}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Status</span><span className="font-semibold">{activeReceipt.isConfirmed ? "Confirmed" : "Pending"}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Amount</span><span className="font-bold text-lg">Ksh {Number(activeReceipt.amount || 0).toLocaleString()}</span></div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-600">Description</span>
                <p className="font-medium mt-1">{activeReceipt.description || "-"}</p>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              {!activeReceipt.isConfirmed && (
                <button
                  onClick={() => {
                    handleConfirmOne(activeReceipt);
                    setShowView(false);
                  }}
                  className="px-4 py-2 text-xs rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <FaCheck /> Confirm
                </button>
              )}
              {activeReceipt.isConfirmed && (
                <button
                  onClick={() => {
                    handleUnconfirmOne(activeReceipt);
                    setShowView(false);
                  }}
                  className="px-4 py-2 text-xs rounded-md text-white font-semibold bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                >
                  <FaTimes /> Unconfirm
                </button>
              )}
              <button
                onClick={() => {
                  openEditForm(activeReceipt);
                  setShowView(false);
                }}
                className="px-4 py-2 text-xs rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteOne(activeReceipt._id);
                  setShowView(false);
                }}
                className="px-4 py-2 text-xs rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 flex items-center gap-2"
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={() => handlePrintReceipt(activeReceipt)}
                className="px-4 py-2 text-xs rounded-md text-white font-semibold bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                <FaPrint /> Print
              </button>
              {activeReceipt.isReversed && (
                <button
                  onClick={() => {
                    handleCancelReversalOne(activeReceipt);
                    setShowView(false);
                  }}
                  className="px-4 py-2 text-xs rounded-md text-white font-semibold bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                >
                  <FaRedoAlt /> Cancel Reversal
                </button>
              )}
              <button
                onClick={() => setShowView(false)}
                className="px-4 py-2 text-xs border border-slate-300 rounded-md font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <JournalEntriesDrawer
        open={journalDrawerOpen}
        onClose={() => setJournalDrawerOpen(false)}
        title="Receipt Journal Entry"
        sourceType="receipt"
        context={journalContext}
        lines={journalLines}
      />
    </DashboardLayout>
  );
};

export default Receipts;
