import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTenants } from "../../redux/tenantsRedux";
import { getUnits } from "../../redux/unitRedux";
import { getProperties } from "../../redux/propertyRedux";
import { getLeases, getUtilities } from "../../redux/apiCalls";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import InvoiceCreationModal from "./InvoiceCreationModal";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaChartLine,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaUser,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const MILIK_GREEN = "bg-[#165946]";

const TenantStatement = () => {
  const { id: tenantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("statement");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [transactionType, setTransactionType] = useState("ALL");
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewRecords, setReviewRecords] = useState(() => {
    try {
      const storageKey = `rentReviews_${tenantId}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });
  const [reviewForm, setReviewForm] = useState({
    type: "percentage",
    value: 5,
    frequency: "yearly",
    effectiveDate: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceRefresh, setInvoiceRefresh] = useState(0);
  const [createdInvoices, setCreatedInvoices] = useState({});
  const [createdInvoicesHydrated, setCreatedInvoicesHydrated] = useState(false);
  const currentCompany = useSelector((state) => state.company?.currentCompany);

  const tenantsFromStore = useSelector((state) => state.tenant?.tenants || []);
  const leasesFromStore = useSelector((state) => state.lease?.leases || []);
  const rentPaymentsFromStore = useSelector((state) => state.rentPayment?.rentPayments || []);
  const maintenanceFromStore = useSelector((state) => state.maintenance?.maintenances || []);
  const expensesFromStore = useSelector((state) => state.expenseProperty?.expenseProperties || []);
  const utilitiesFromStore = useSelector((state) => state.utility?.utilities || []);
  const unitsFromStore = useSelector((state) => state.unit?.units || []);
  const propertiesFromStore = useSelector((state) => state.property?.properties || []);
  
  const tenant = tenantsFromStore?.find((t) => t._id === tenantId);
  
  // Helper to resolve property name from tenant data
  const resolveTenantPropertyName = (tenant) => {
    if (!tenant) return "-";
    
    // Level 1: Check direct property fields
    const directPropertyName = tenant?.unit?.property?.propertyName || tenant?.property?.propertyName || tenant?.propertyName;
    if (directPropertyName) return directPropertyName;

    // Level 2: Unit ID → Unit record → Property
    const tenantUnitId = tenant?.unit?._id || tenant?.unit;
    const tenantUnitIdStr = tenantUnitId ? String(tenantUnitId) : "";
    const matchedUnit = unitsFromStore.find((unit) => String(unit?._id || "") === tenantUnitIdStr);
    const propertyIdFromUnit = matchedUnit?.property?._id || matchedUnit?.property;
    
    // Level 3: Property ID → Property record
    const propertyIdFromTenant = tenant?.property?._id || tenant?.property;
    const resolvedPropertyId = propertyIdFromUnit || propertyIdFromTenant;
    const resolvedPropertyIdStr = resolvedPropertyId ? String(resolvedPropertyId) : "";
    const matchedProperty = propertiesFromStore.find(
      (property) => String(property?._id || "") === resolvedPropertyIdStr
    );

    return matchedUnit?.property?.propertyName || matchedProperty?.propertyName || matchedProperty?.name || "-";
  };
  
  // Helper to resolve unit number
  const resolveTenantUnitNumber = (tenant) => {
    if (!tenant) return "-";
    
    // Check direct unit number
    if (tenant?.unit?.unitNumber) return tenant.unit.unitNumber;
    
    // Unit ID → Unit record
    const tenantUnitId = tenant?.unit?._id || tenant?.unit;
    const matchedUnit = unitsFromStore.find((unit) => unit?._id === tenantUnitId);
    
    return matchedUnit?.unitNumber || "-";
  };
  const tenantLease = useMemo(() => {
    return leasesFromStore.find((lease) => lease.tenant === tenantId || lease.tenant?._id === tenantId);
  }, [leasesFromStore, tenantId]);

  // Re-hydrate invoice cache whenever tenant changes.
  useEffect(() => {
    setCreatedInvoicesHydrated(false);
    try {
      const storageKey = `createdInvoices_${tenantId}`;
      const stored = localStorage.getItem(storageKey);
      const parsed = stored ? JSON.parse(stored) : {};
      setCreatedInvoices(parsed && typeof parsed === "object" ? parsed : {});
    } catch (error) {
      setCreatedInvoices({});
    } finally {
      setCreatedInvoicesHydrated(true);
    }
  }, [tenantId]);

  // Save created invoices to localStorage whenever they change
  useEffect(() => {
    if (!createdInvoicesHydrated) return;
    const storageKey = `createdInvoices_${tenantId}`;
    localStorage.setItem(storageKey, JSON.stringify(createdInvoices));
    
    // Notify other components about invoice changes
    window.dispatchEvent(new Event('invoicesUpdated'));
  }, [createdInvoices, tenantId, createdInvoicesHydrated]);

  const getInvoicesForPeriod = (periodLabel) => {
    return Object.entries(createdInvoices)
      .filter(([key, entry]) => {
        const entryPeriod =
          typeof entry === "object" && entry?.period
            ? String(entry.period)
            : String(key).replace(/__(rent|utility)$/i, "");
        return entryPeriod === periodLabel;
      })
      .map(([key, entry]) => {
        const invoiceId =
          typeof entry === "string"
            ? entry
            : (entry?.invoiceId || entry?.id || entry?.number || "");
        return {
          key,
          entry,
          invoiceId,
        };
      })
      .filter((item) => Boolean(item.invoiceId));
  };

  useEffect(() => {
    try {
      const storageKey = `rentReviews_${tenantId}`;
      const stored = localStorage.getItem(storageKey);
      setReviewRecords(stored ? JSON.parse(stored) : []);
    } catch (error) {
      setReviewRecords([]);
    }
  }, [tenantId]);

  useEffect(() => {
    const storageKey = `rentReviews_${tenantId}`;
    localStorage.setItem(storageKey, JSON.stringify(reviewRecords));
  }, [reviewRecords, tenantId]);

  // Set browser tab title to MILIK
  useEffect(() => {
    document.title = 'MILIK';
  }, []);

  useEffect(() => {
    if (!currentCompany?._id) return;

    dispatch(getTenants({ business: currentCompany._id }));
    dispatch(getUnits({ business: currentCompany._id }));
    dispatch(getProperties({ business: currentCompany._id }));
    getLeases(dispatch, currentCompany._id, null, tenantId);
    getUtilities(dispatch, currentCompany._id);
  }, [dispatch, currentCompany?._id, tenantId]);

  const handleConfirmInvoiceCreation = async (billingMode = "combined") => {
    const selectedRows = selectedSchedules.map(idx => billingScheduleData[idx]);
    const periodsWithoutInvoices = selectedRows.filter(row => row.invoice === "-");

    try {
      // Generate invoice numbers for created invoices
      const newInvoices = {};
      let invoiceNum = 1;
      
      // Find the next invoice number by checking ALL tenants' invoices
      tenantsFromStore.forEach(t => {
        const storageKey = `createdInvoices_${t._id}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const tenantInvoices = JSON.parse(stored);
          Object.values(tenantInvoices).forEach((entry) => {
            const invoiceId = typeof entry === "string"
              ? entry
              : (entry?.invoiceId || entry?.id || entry?.number || "");
            const num = parseInt(String(invoiceId).replace("INV", "")) || 0;
            if (num >= invoiceNum) invoiceNum = num + 1;
          });
        }
      });

      // Assign invoice numbers to new periods
      periodsWithoutInvoices.forEach((period) => {
        const rentAmount = Number(period.rent || 0);
        const utilityAmount = Number(period.utility || 0);
        const periodLabel = period.description;
        const commonMeta = {
          createdAt: new Date().toISOString(),
          status: "Issued",
          period: periodLabel,
          tenantName: period.tenantName || "N/A",
          propertyName: period.propertyName || "N/A",
          unitName:
            tenant?.unit?.unitName ||
            tenant?.unit?.name ||
            tenant?.unit?.unitNumber ||
            "N/A",
        };

        if (billingMode === "separate") {
          const rentInvoiceId = `INV${String(invoiceNum).padStart(5, '0')}`;
          newInvoices[`${periodLabel}__rent`] = {
            ...commonMeta,
            invoiceId: rentInvoiceId,
            amount: rentAmount,
            rentAmount,
            utilityAmount: 0,
            chargeType: "rent",
          };
          invoiceNum++;

          if (utilityAmount > 0) {
            const utilityInvoiceId = `INV${String(invoiceNum).padStart(5, '0')}`;
            newInvoices[`${periodLabel}__utility`] = {
              ...commonMeta,
              invoiceId: utilityInvoiceId,
              amount: utilityAmount,
              rentAmount: 0,
              utilityAmount,
              chargeType: "utility",
            };
            invoiceNum++;
          }
          return;
        }

        const invoiceId = `INV${String(invoiceNum).padStart(5, '0')}`;
        newInvoices[periodLabel] = {
          ...commonMeta,
          invoiceId,
          amount: rentAmount + utilityAmount,
          rentAmount,
          utilityAmount,
          chargeType: "combined",
        };
        invoiceNum++;
      });

      // TODO: Replace with actual API call to create invoices
      // Example: await createInvoices(tenantId, periodsWithoutInvoices);
      
      toast.success(
        `Created ${Object.keys(newInvoices).length} invoice(s) in ${billingMode} mode for: ${periodsWithoutInvoices
          .map((p) => p.description)
          .join(', ')}`
      );
      
      // Update created invoices state
      setCreatedInvoices(prev => ({
        ...prev,
        ...newInvoices
      }));
      
      setSelectedSchedules([]);
      setShowInvoiceModal(false);
    } catch (error) {
      toast.error("Failed to create invoices: " + (error.message || "Unknown error"));
    }
  };

  // Build real transactions from Redux store
  const statementData = useMemo(() => {
    const transactions = [];
    let transactionId = 1;

    // Add rent payments
    const tenantRentPayments = rentPaymentsFromStore.filter(
      (p) => p.tenant === tenantId || p.tenant?._id === tenantId
    );
    tenantRentPayments.forEach((payment) => {
      transactions.push({
        id: transactionId++,
        date: payment.paymentDate || payment.createdAt,
        description: `Rent Payment - ${payment.referenceNumber || ""}`,
        type: "PAYMENT",
        amount: -(payment.amount || 0),
        transactionCode: payment.referenceNumber || `RCP${transactionId}`,
      });
    });

    // Add created invoices
    const baseRent = tenantLease?.rentAmount || tenant?.rent || 23000;
    const relevantUtilities = utilitiesFromStore.filter((util) => 
      util.isActive && (util.business === currentCompany?._id || util.business?._id === currentCompany?._id)
    );
    const serviceCharge = relevantUtilities.length === 0 ? null : relevantUtilities.reduce((sum, util) => sum + (util.unitCost || 0), 0);
    
    Object.entries(createdInvoices).forEach(([period, entry]) => {
      const invoiceId = typeof entry === "string"
        ? entry
        : (entry?.invoiceId || entry?.id || entry?.number || "");
      const chargeType =
        typeof entry === "object" && entry?.chargeType
          ? String(entry.chargeType).toUpperCase()
          : "INVOICE";
      const invoiceAmount =
        typeof entry === "object" && Number.isFinite(Number(entry?.amount))
          ? Number(entry.amount)
          : baseRent + (serviceCharge || 0);
      const invoiceDate =
        typeof entry === "object"
          ? (entry?.createdAt || entry?.createdDate || new Date())
          : new Date();
      transactions.push({
        id: transactionId++,
        date: invoiceDate,
        description: `Invoice ${invoiceId} (${chargeType}) - ${period}`,
        type: "CHARGE",
        amount: invoiceAmount,
        transactionCode: invoiceId,
      });
    });

    // Add maintenance charges
    const tenantMaintenanceCharges = maintenanceFromStore.filter(
      (m) => m.tenant === tenantId || m.tenant?._id === tenantId
    );
    tenantMaintenanceCharges.forEach((maintenance) => {
      if (maintenance.actualCost || maintenance.estimatedCost) {
        transactions.push({
          id: transactionId++,
          date: maintenance.completedDate || maintenance.createdAt,
          description: `Maintenance - ${maintenance.category || "General"}`,
          type: "CHARGE",
          amount: maintenance.actualCost || maintenance.estimatedCost || 0,
          transactionCode: `MNT${transactionId}`,
        });
      }
    });

    // Sort by date
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let runningBalance = 0;
    transactions.forEach((t) => {
      runningBalance += t.amount;
      t.balance = runningBalance;
    });

    const charges = transactions.filter((t) => t.type === "CHARGE");
    const payments = transactions.filter((t) => t.type === "PAYMENT");
    const totalCharges = charges.reduce((sum, t) => sum + t.amount, 0);
    const totalPayments = Math.abs(payments.reduce((sum, t) => sum + t.amount, 0));
    const currentBalance = totalCharges - totalPayments;

    return {
      transactions,
      totalCharges,
      totalPayments,
      currentBalance,
    };
  }, [rentPaymentsFromStore, maintenanceFromStore, tenantId, createdInvoices, tenantLease, tenant, utilitiesFromStore, currentCompany]);

  const billingScheduleData = useMemo(() => {
    const baseRent = tenantLease?.rentAmount || tenant?.rent || 23000;
    
    // Get tenant's utilities from multiple sources (in order of preference)
    let tenantUtilities = [];
    let serviceCharge = 0;
    let tenantUtilityNames = [];
    
    // Priority 1: Tenant's own utilities array
    if (tenant?.utilities && tenant.utilities.length > 0) {
      tenantUtilities = tenant.utilities;
    } 
    // Priority 2: Unit's utilities (fallback)
    else if (tenant?.unit?.utilities && tenant.unit.utilities.length > 0) {
      tenantUtilities = tenant.unit.utilities;
    }
    // Priority 3: Try to find unit from store and get its utilities
    else if (unitsFromStore && unitsFromStore.length > 0) {
      const tenantUnitId = tenant?.unit?._id || tenant?.unit;
      const matchedUnit = unitsFromStore.find((u) => u?._id === tenantUnitId);
      if (matchedUnit?.utilities && matchedUnit.utilities.length > 0) {
        tenantUtilities = matchedUnit.utilities;
      }
    }
    
    // Calculate service charge and utility names
    if (tenantUtilities.length > 0) {
      tenantUtilities.forEach((util) => {
        const charge = parseFloat(util.unitCharge) || 0;
        const utilityName = util.utilityLabel || util.utility || "Unknown";
        
        // Add to names list
        if (!tenantUtilityNames.includes(utilityName)) {
          tenantUtilityNames.push(utilityName);
        }
        
        // Add to charge if not included in rent
        if (!util.isIncluded) {
          serviceCharge += charge;
        }
      });
    }
    
    const scheduleData = [];
    let invoiceCounter = 1;
    
    // Get tenant and property names
    const tenantName = tenant?.firstName && tenant?.lastName ? `${tenant.firstName} ${tenant.lastName}` : tenant?.name || "N/A";
    const propertyName = resolveTenantPropertyName(tenant);

    // Determine start and end dates
    let startDate;
    let endDate;
    
    if (tenantLease) {
      startDate = new Date(tenantLease.startDate);
      const hasEndDate = tenantLease.endDate && new Date(tenantLease.endDate) > new Date();
      endDate = hasEndDate 
        ? new Date(tenantLease.endDate) 
        : new Date(startDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
    } else if (tenant) {
      startDate = tenant.moveInDate ? new Date(tenant.moveInDate) : new Date();
      const hasEndDate = tenant.moveOutDate && new Date(tenant.moveOutDate) > new Date();
      endDate = hasEndDate
        ? new Date(tenant.moveOutDate)
        : new Date(startDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date();
      endDate = new Date(startDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
    }

    // Generate schedule from startDate to endDate
    let currentDate = new Date(startDate);
    currentDate.setDate(1);

    while (currentDate < endDate) {
      // Get start of current month
      const from = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      
      // Get last day of current month for the "to" date
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const monthForTo = currentDate.getMonth() + 1; // Same month
      const yearForTo = currentDate.getFullYear();
      const to = `${String(lastDayOfMonth).padStart(2, '0')}/${String(monthForTo).padStart(2, '0')}/${yearForTo}`;
      
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const invoiceNum = `INV${String(invoiceCounter).padStart(5, '0')}`;
      const isPast = currentDate < new Date();
      
      // Move to next month
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      
      // Check if there's an actual rent payment for this period
      const hasPaymentForPeriod = rentPaymentsFromStore.some((payment) => {
        if (payment.tenant !== tenantId && payment.tenant?._id !== tenantId) return false;
        const paymentDate = new Date(payment.paymentDate || payment.createdAt);
        return paymentDate >= currentDate && paymentDate < nextDate;
      });

      // Check if invoice was created for this period
      const periodInvoices = getInvoicesForPeriod(monthName);
      const createdInvoiceNumber = periodInvoices.map((item) => item.invoiceId).join(", ");
      const hasCreatedInvoice = periodInvoices.length > 0;
      const shouldShowInvoice = hasPaymentForPeriod || hasCreatedInvoice;
      const isBooked = hasPaymentForPeriod || hasCreatedInvoice;
      
      scheduleData.push({
        from,
        to,
        description: monthName,
        rent: baseRent,
        utility: serviceCharge,
        utilityNames: tenantUtilityNames.length > 0 ? tenantUtilityNames : [], // Store utility names for display
        booked: isBooked ? "Yes" : "No",
        frozen: "No",
        invoice: shouldShowInvoice ? (createdInvoiceNumber || invoiceNum) : "-",
        tenantName,
        propertyName
      });
      
      if (shouldShowInvoice) invoiceCounter++;
      currentDate = nextDate;
    }

    return scheduleData;
  }, [tenantLease, tenant, unitsFromStore, rentPaymentsFromStore, tenantId, createdInvoices]);

  // Tabs configuration
  const tabs = [
    { id: "statement", label: "Tenant Statement", icon: <FaFileInvoiceDollar /> },
    { id: "billing", label: "Billing Schedule", icon: <FaCalendarAlt /> },
    { id: "details", label: "Tenant Details", icon: <FaUser /> },
    { id: "charges", label: "Standing Charges", icon: <FaMoneyBillWave /> },
    { id: "reviews", label: "Rent Reviews / Escalations", icon: <FaChartBar /> },
    { id: "actions", label: "Actions", icon: <FaCog /> },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Trigger print dialog - user can save as PDF from there
    window.print();
  };

  // TAB RENDERERS
  const renderStatement = () => (
    <div className="statement-tab space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Monthly Rent */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
            Monthly Rent
          </p>
          <p className="text-xl font-bold text-blue-900 mt-1">
            Ksh {(tenantLease?.rentAmount || tenant?.rent || 0).toLocaleString()}
          </p>
        </div>

        {/* Total Charges */}
        <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tight">
            Total Charges
          </p>
          <p className="text-xl font-bold text-orange-900 mt-1">
            Ksh {(statementData?.totalCharges || 0).toLocaleString()}
          </p>
        </div>

        {/* Account Balance */}
        <div
          className={`border-l-4 rounded-lg px-4 py-3 shadow-sm ${
            statementData?.currentBalance >= 0
              ? "bg-green-50 border-green-600"
              : "bg-red-50 border-red-600"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-tight ${
              statementData?.currentBalance >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Current Balance
          </p>
          <p
            className={`text-xl font-bold mt-1 ${
              statementData?.currentBalance >= 0
                ? "text-green-900"
                : "text-red-900"
            }`}
          >
            Ksh {Math.abs(statementData?.currentBalance || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="filter-section bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Filter Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="ALL">All Transactions</option>
              <option value="CHARGE">Invoices Only</option>
              <option value="PAYMENT">Receipts Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-900">
            <FaChartLine className="inline mr-2" />
            Account Transactions
          </h3>
        </div>

        <div className="overflow-y-auto flex-grow">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className={`${MILIK_GREEN} text-white text-[11px] font-bold`}>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-center">Type</th>
                <th className="px-3 py-2 text-left">Code</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-right">R. Balance</th>
              </tr>
            </thead>
            <tbody>
              {statementData?.transactions && statementData.transactions.length > 0 ? (
                statementData.transactions
                  .filter((t) => transactionType === "ALL" || t.type === transactionType)
                  .map((transaction, idx) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-slate-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-3 py-1.5 text-[11px] font-semibold text-gray-900 whitespace-nowrap">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-1.5 text-[11px] text-gray-700">
                        {transaction.description}
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            transaction.type === "CHARGE"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-[11px] font-semibold text-slate-900 whitespace-nowrap">
                        {transaction.transactionCode}
                      </td>
                      <td
                        className={`px-3 py-1.5 text-[11px] font-bold text-right whitespace-nowrap ${
                          transaction.type === "CHARGE" ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {transaction.type === "CHARGE" ? "+" : "-"}
                        Ksh {Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="px-3 py-1.5 text-[11px] font-bold text-right text-gray-900 whitespace-nowrap">
                        Ksh {transaction.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-xs text-gray-600">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer - Sticky */}
        {statementData?.transactions && statementData.transactions.length > 0 && (
          <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] font-bold text-gray-600">Total Charges</p>
                <p className="text-base font-bold text-red-600 mt-0.5">
                  Ksh {(statementData.totalCharges || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-600">Total Payments</p>
                <p className="text-base font-bold text-green-600 mt-0.5">
                  Ksh {(statementData.totalPayments || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-600">Net Balance</p>
                <p
                  className={`text-base font-bold mt-0.5 ${
                    statementData?.currentBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Ksh {Math.abs(statementData?.currentBalance || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Print-Only Footer */}
        <div className="print-footer" style={{ display: 'none' }}>
          <p style={{ marginBottom: '5px' }}>
            Generated on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '10px', color: '#9CA3AF' }}>
            <span>Powered by</span>
            <img 
              src="/logo.png" 
              alt="MILIK Logo" 
              style={{ 
                width: '20px', 
                height: '20px',
                display: 'inline-block',
                verticalAlign: 'middle'
              }} 
            />
            <span>MILIK - Property Management System</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSchedule = () => {
    const handleSelectSchedule = (scheduleKey) => {
      setSelectedSchedules(prev => 
        prev.includes(scheduleKey) 
          ? prev.filter(k => k !== scheduleKey)
          : [...prev, scheduleKey]
      );
    };

    const handleSelectAll = () => {
      if (selectedSchedules.length === billingScheduleData.length) {
        setSelectedSchedules([]);
      } else {
        setSelectedSchedules(billingScheduleData.map((_, idx) => idx));
      }
    };

    const handleCreateInvoices = () => {
      if (selectedSchedules.length === 0) {
        toast.warning("Please select at least one billing period");
        return;
      }

      const selectedRows = selectedSchedules.map(idx => billingScheduleData[idx]);
      const periodsWithInvoices = selectedRows.filter(row => row.invoice !== "-");
      const periodsWithoutInvoices = selectedRows.filter(row => row.invoice === "-");

      if (periodsWithInvoices.length > 0) {
        toast.warning(`${periodsWithInvoices.length} period(s) already have invoices: ${periodsWithInvoices.map(p => p.description).join(', ')}`);
        return;
      }

      if (periodsWithoutInvoices.length === 0) {
        toast.warning("No valid periods selected for invoicing");
        return;
      }

      // Show invoice creation modal
      setShowInvoiceModal(true);
    };

    const handleCancelInvoices = () => {
      if (selectedSchedules.length === 0) {
        toast.warning("Please select at least one billing period");
        return;
      }

      const selectedRows = selectedSchedules.map(idx => billingScheduleData[idx]);
      const invoicedPeriods = selectedRows.filter(row => row.invoice !== "-");

      if (invoicedPeriods.length === 0) {
        toast.warning("No invoiced periods selected");
        return;
      }

      toast.info(`Canceling ${invoicedPeriods.length} invoice(s): ${invoicedPeriods.map(p => p.invoice).join(', ')}`);
      // TODO: Implement actual invoice cancellation API call
      setSelectedSchedules([]);
    };

    const handleEditSchedules = () => {
      if (selectedSchedules.length === 0) {
        toast.warning("Please select at least one billing period");
        return;
      }

      toast.info(`Editing ${selectedSchedules.length} schedule(s)...`);
      // TODO: Implement schedule editing modal/form
    };

    const handleDeleteSchedules = () => {
      if (selectedSchedules.length === 0) {
        toast.warning("Please select at least one billing period");
        return;
      }

      const selectedRows = selectedSchedules.map(idx => billingScheduleData[idx]);
      toast.warning(`Delete ${selectedSchedules.length} schedule(s)? ${selectedRows.map(p => p.description).join(', ')}`);
      // TODO: Implement actual schedule deletion with confirmation
      setSelectedSchedules([]);
    };

    const handleFreezeSchedules = () => {
      if (selectedSchedules.length === 0) {
        toast.warning("Please select at least one billing period");
        return;
      }

      const selectedRows = selectedSchedules.map(idx => billingScheduleData[idx]);
      const alreadyFrozen = selectedRows.filter(row => row.frozen === "Yes");
      const notFrozen = selectedRows.filter(row => row.frozen !== "Yes");

      if (notFrozen.length === 0) {
        toast.info("Selected period(s) are already frozen");
        return;
      }

      // TODO: Implement actual freeze API call
      toast.success(`Freezing ${notFrozen.length} period(s): ${notFrozen.map(p => p.description).join(', ')}`);
      setSelectedSchedules([]);
    };

    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Rent & Other Charges Schedule</h3>
        </div>

        <div className="px-4 py-2 border-b border-slate-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
            <div className="md:col-span-2">
              <label className="block text-[10px] text-slate-600 font-semibold mb-1">Defined Period</label>
              <select className="w-full text-xs border border-slate-300 rounded px-2 py-1.5">
                <option>Custom</option>
                <option>This Year</option>
                <option>Next 12 Months</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] text-slate-600 font-semibold mb-1">From</label>
              <input type="date" className="w-full text-xs border border-slate-300 rounded px-2 py-1.5" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] text-slate-600 font-semibold mb-1">To</label>
              <input type="date" className="w-full text-xs border border-slate-300 rounded px-2 py-1.5" />
            </div>
            <div className="md:col-span-6 flex gap-2 md:justify-end">
              <button className={`${MILIK_GREEN} text-white text-xs font-semibold px-3 py-1.5 rounded`}>Search</button>
              <button className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded border border-slate-300">Reset</button>
              <button className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded border border-slate-300">Refresh</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-b border-slate-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreateInvoices}
              disabled={selectedSchedules.length === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                selectedSchedules.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <FaFileInvoiceDollar size={12} />
              Create Invoice
            </button>
            <button
              onClick={handleCancelInvoices}
              disabled={selectedSchedules.length === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                selectedSchedules.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <FaPrint size={12} />
              Cancel Invoice
            </button>
            <button
              onClick={handleEditSchedules}
              disabled={selectedSchedules.length === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                selectedSchedules.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <FaCog size={12} />
              Edit Schedule
            </button>
            <button
              onClick={handleDeleteSchedules}
              disabled={selectedSchedules.length === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                selectedSchedules.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <FaDownload size={12} />
              Delete Schedule
            </button>
            <button
              onClick={handleFreezeSchedules}
              disabled={selectedSchedules.length === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                selectedSchedules.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <FaCalendarAlt size={12} />
              Freeze Period
            </button>
            {selectedSchedules.length > 0 && (
              <span className="ml-auto flex items-center text-xs text-gray-600 font-semibold">
                {selectedSchedules.length} selected
              </span>
            )}
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1200px] text-xs">
            <thead>
              <tr className={`${MILIK_GREEN} text-white`}>
                <th className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedSchedules.length === billingScheduleData.length && billingScheduleData.length > 0}
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2 text-left font-semibold">From</th>
                <th className="px-3 py-2 text-left font-semibold">To</th>
                <th className="px-3 py-2 text-left font-semibold">Description</th>
                <th className="px-3 py-2 text-right font-semibold">Rent Amount</th>
                <th className="px-3 py-2 text-right font-semibold">S. Charge/Util.</th>
                <th className="px-3 py-2 text-right font-semibold">Total</th>
                <th className="px-3 py-2 text-center font-semibold">Frozen</th>
                <th className="px-3 py-2 text-center font-semibold">Booked</th>
                <th className="px-3 py-2 text-left font-semibold">Invoice #</th>
              </tr>
            </thead>
            <tbody>
              {billingScheduleData.map((row, index) => {
                const total = row.rent + row.utility;
                const isProcessed = row.booked === "Yes";
                const isSelected = selectedSchedules.includes(index);

                return (
                  <tr
                    key={`${row.from}-${row.description}`}
                    className={`${
                      isSelected 
                        ? "bg-blue-50" 
                        : index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } border-b border-slate-200 hover:bg-emerald-50/40 cursor-pointer`}
                    onClick={() => handleSelectSchedule(index)}
                  >
                    <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectSchedule(index)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2 text-slate-800">{row.from}</td>
                    <td className="px-3 py-2 text-slate-800">{row.to}</td>
                    <td className="px-3 py-2 font-medium text-slate-900">{row.description}</td>
                    <td className="px-3 py-2 text-right text-slate-900">{row.rent.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-slate-900">
                      <div>
                        <div className="font-bold">{row.utility ? row.utility.toLocaleString() : "-"}</div>
                        {row.utilityNames && row.utilityNames.length > 0 && (
                          <div className="text-[9px] text-slate-500 font-medium mt-0.5">
                            {row.utilityNames.join(", ")}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-900">{total.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${row.frozen === "Yes" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                        {row.frozen}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${row.booked === "Yes" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                        {row.booked}
                      </span>
                    </td>
                    <td className={`px-3 py-2 ${isProcessed ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                      {row.invoice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTenantDetails = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Tenant Information</h3>
      {tenant ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Tenant Name</label>
            <p className="text-lg font-bold text-gray-900">{tenant?.name || (tenant?.firstName && tenant?.lastName ? `${tenant.firstName} ${tenant.lastName}` : "N/A")}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <p className="text-lg font-bold text-gray-900">{tenant?.email || "N/A"}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Phone</label>
            <p className="text-lg font-bold text-gray-900">{tenant?.phone || "N/A"}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">ID Number</label>
            <p className="text-lg font-bold text-gray-900">{tenant?.idDocument || tenant?.idNumber || "N/A"}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Unit</label>
            <p className="text-lg font-bold text-gray-900">{resolveTenantUnitNumber(tenant)}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Property</label>
            <p className="text-lg font-bold text-gray-900">
              {resolveTenantPropertyName(tenant)}
            </p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Move-In Date</label>
            <p className="text-lg font-bold text-gray-900">
              {tenantLease?.startDate ? new Date(tenantLease.startDate).toLocaleDateString() : (tenant?.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : "N/A")}
            </p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Rent Amount</label>
            <p className="text-lg font-bold text-gray-900">Ksh {(tenantLease?.rentAmount || tenant?.rent || 0).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Tenant not found</p>
      )}
    </div>
  );

  const renderStandingCharges = () => {
    // Get tenant's utilities (standing charges) with fallback to unit utilities
    let tenantUtilities = tenant?.utilities || [];
    
    // If tenant has no utilities, try to get them from the unit
    if (tenantUtilities.length === 0 && tenant?.unit?.utilities && tenant.unit.utilities.length > 0) {
      tenantUtilities = tenant.unit.utilities;
    }
    
    const totalStandingCharges = tenantUtilities.reduce((sum, util) => sum + (parseFloat(util.unitCharge) || 0), 0);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Standing Charges</h3>
        <p className="text-gray-600 mb-6">Recurring charges attached to this tenancy</p>

        {tenantUtilities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No standing charges for this tenant.</p>
            <p className="text-sm text-gray-500 mt-2">Utilities will appear here when added to the tenant record.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tenantUtilities.map((utility, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{utility.utilityLabel || utility.utility}</h4>
                    <p className="text-sm text-gray-600 mt-1">Monthly charge for this tenant</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">Ksh {(parseFloat(utility.unitCharge) || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      {utility.isIncluded ? (
                        <span className="text-green-600">✓ Included in Rent</span>
                      ) : (
                        <span className="text-orange-600">Tenant Pays</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-bold">Total Monthly Standing Charges:</span>
                <span className="float-right font-bold">Ksh {totalStandingCharges.toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRentReviewsAndEscalations = () => {
    const baseRent = tenantLease?.rentAmount || tenant?.rent || 0;
    const sortedRecords = [...reviewRecords].sort(
      (a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate)
    );

    const computeNewRent = (current, type, value) => {
      const numericValue = Number(value) || 0;
      if (type === "percentage") {
        return Math.round(current * (1 + numericValue / 100));
      }
      return Math.round(current + numericValue);
    };

    const appliedOnly = sortedRecords.filter((record) => record.status === "Applied");
    const currentEffectiveRent = appliedOnly.reduce((rent, record) => {
      return computeNewRent(rent, record.type, record.value);
    }, baseRent);

    const pendingRecords = sortedRecords.filter((record) => record.status !== "Applied");
    const nextPendingRecord = pendingRecords.length > 0 ? pendingRecords[0] : null;
    const projectedRent = nextPendingRecord
      ? computeNewRent(currentEffectiveRent, nextPendingRecord.type, nextPendingRecord.value)
      : currentEffectiveRent;

    const computedRows = sortedRecords.reduce(
      (acc, record) => {
        const previousRent = acc.runningRent;
        const resultingRent = computeNewRent(previousRent, record.type, record.value);
        acc.rows.push({ ...record, previousRent, resultingRent });
        if (record.status === "Applied") {
          acc.runningRent = resultingRent;
        }
        return acc;
      },
      { runningRent: baseRent, rows: [] }
    ).rows;

    const resetReviewForm = () => {
      setReviewForm({
        type: "percentage",
        value: 5,
        frequency: "yearly",
        effectiveDate: new Date().toISOString().split("T")[0],
        note: "",
      });
      setEditingReviewId(null);
      setReviewFormOpen(false);
    };

    const handleSaveReview = () => {
      if (!reviewForm.effectiveDate) {
        toast.error("Effective date is required");
        return;
      }
      if (!reviewForm.value || Number(reviewForm.value) <= 0) {
        toast.error("Review value must be greater than zero");
        return;
      }

      if (editingReviewId) {
        setReviewRecords((prev) =>
          prev.map((record) =>
            record.id === editingReviewId
              ? {
                  ...record,
                  ...reviewForm,
                  updatedAt: new Date().toISOString(),
                }
              : record
          )
        );
        toast.success("Review updated");
      } else {
        const newRecord = {
          id: `REV-${Date.now()}`,
          ...reviewForm,
          status: "Scheduled",
          createdAt: new Date().toISOString(),
        };
        setReviewRecords((prev) => [...prev, newRecord]);
        toast.success("Review created");
      }
      resetReviewForm();
    };

    const handleEditReview = (record) => {
      setEditingReviewId(record.id);
      setReviewForm({
        type: record.type,
        value: record.value,
        frequency: record.frequency,
        effectiveDate: record.effectiveDate,
        note: record.note || "",
      });
      setReviewFormOpen(true);
    };

    const handleDeleteReview = (reviewId) => {
      setReviewRecords((prev) => prev.filter((record) => record.id !== reviewId));
      toast.success("Review deleted");
      if (editingReviewId === reviewId) resetReviewForm();
    };

    const handleApplyReview = (reviewId) => {
      setReviewRecords((prev) =>
        prev.map((record) =>
          record.id === reviewId
            ? { ...record, status: "Applied", appliedAt: new Date().toISOString() }
            : record
        )
      );
      toast.success("Review applied to effective rent");
    };

    const formatFrequency = (frequency) => {
      if (frequency === "biannual") return "Bi-Annual";
      if (frequency === "quarterly") return "Quarterly";
      return "Yearly";
    };

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Rent Reviews & Escalations</h3>
              <p className="text-gray-600 text-sm mt-1">
                Manage rent adjustments with full review and escalation controls.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingReviewId(null);
                setReviewFormOpen(true);
              }}
              className={`${MILIK_GREEN} hover:bg-[#0A3127] text-white px-4 py-2 rounded font-semibold flex items-center gap-2`}
            >
              <FaPlus /> Add Review / Escalation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
            <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <p className="text-xs text-slate-600 font-semibold">Base Rent</p>
              <p className="text-lg font-bold text-slate-900 mt-1">Ksh {baseRent.toLocaleString()}</p>
            </div>
            <div className="border border-green-200 rounded-lg p-3 bg-green-50">
              <p className="text-xs text-green-700 font-semibold">Current Effective Rent</p>
              <p className="text-lg font-bold text-green-700 mt-1">Ksh {currentEffectiveRent.toLocaleString()}</p>
            </div>
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs text-blue-700 font-semibold">Scheduled Reviews</p>
              <p className="text-lg font-bold text-blue-700 mt-1">{pendingRecords.length}</p>
            </div>
            <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
              <p className="text-xs text-orange-700 font-semibold">Projected Next Rent</p>
              <p className="text-lg font-bold text-orange-700 mt-1">Ksh {projectedRent.toLocaleString()}</p>
            </div>
          </div>

          {reviewFormOpen && (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-5">
              <h4 className="font-bold text-slate-900 mb-3">
                {editingReviewId ? "Edit Review / Escalation" : "New Review / Escalation"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Type</label>
                  <select
                    value={reviewForm.type}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="amount">Fixed Amount (Ksh)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    {reviewForm.type === "percentage" ? "Increase %" : "Increase Amount"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reviewForm.value}
                    onChange={(e) =>
                      setReviewForm((prev) => ({ ...prev, value: Math.max(0, Number(e.target.value)) }))
                    }
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Frequency</label>
                  <select
                    value={reviewForm.frequency}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, frequency: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="biannual">Bi-Annual</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Effective Date</label>
                  <input
                    type="date"
                    value={reviewForm.effectiveDate}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, effectiveDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Projected Rent</label>
                  <div className="mt-1 h-[42px] px-3 rounded-md border border-green-300 bg-green-50 flex items-center font-bold text-green-700 text-sm">
                    Ksh {computeNewRent(currentEffectiveRent, reviewForm.type, reviewForm.value).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs font-semibold text-slate-700">Notes</label>
                <textarea
                  rows={2}
                  value={reviewForm.note}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, note: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Reason for escalation/review"
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={resetReviewForm}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSaveReview}
                  className={`${MILIK_GREEN} hover:bg-[#0A3127] text-white px-4 py-2 rounded font-semibold text-sm`}
                >
                  {editingReviewId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          )}

          <div className="overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className={`${MILIK_GREEN} text-white text-xs`}>
                  <th className="px-3 py-2 text-left">Effective Date</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Frequency</th>
                  <th className="px-3 py-2 text-right">Increase</th>
                  <th className="px-3 py-2 text-right">Resulting Rent</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Notes</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {computedRows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-3 py-8 text-center text-slate-500">
                      No rent review/escalation records yet.
                    </td>
                  </tr>
                ) : (
                  computedRows.map((record, index) => {
                    const isApplied = record.status === "Applied";
                    return (
                      <tr
                        key={record.id}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} border-b border-slate-200`}
                      >
                        <td className="px-3 py-2 text-slate-800">
                          {new Date(record.effectiveDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-slate-800 capitalize">{record.type}</td>
                        <td className="px-3 py-2 text-slate-800">{formatFrequency(record.frequency)}</td>
                        <td className="px-3 py-2 text-right text-slate-900 font-semibold">
                          {record.type === "percentage"
                            ? `${Number(record.value)}%`
                            : `Ksh ${Number(record.value).toLocaleString()}`}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">
                          Ksh {record.resultingRent.toLocaleString()}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                              isApplied
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700 max-w-[220px] truncate">
                          {record.note || "-"}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-2">
                            {!isApplied && (
                              <button
                                onClick={() => handleApplyReview(record.id)}
                                className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                                title="Apply"
                              >
                                <FaCheck /> Apply
                              </button>
                            )}
                            <button
                              onClick={() => handleEditReview(record)}
                              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(record.id)}
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              title="Delete"
                            >
                              <FaTrash />
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
    );
  };

  const handlePrintReceipt = (receipt) => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt #${receipt.receiptNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: white;
          }
          .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            border: 2px solid #165946;
            padding: 30px;
            border-radius: 8px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #165946;
            padding-bottom: 15px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #165946;
            margin-bottom: 5px;
          }
          .receipt-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-top: 15px;
          }
          .receipt-number {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
          }
          .detail-label {
            font-weight: bold;
            color: #333;
          }
          .detail-value {
            color: #666;
          }
          .divider {
            border-top: 1px solid #ddd;
            margin: 15px 0;
          }
          .amount-section {
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 4px;
          }
          .total-amount {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
            color: #165946;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
          @media print {
            body {
              background: white;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="company-name">${currentCompany?.companyName || 'MILIK'}</div>
            <div class="receipt-title">RENT RECEIPT</div>
            <div class="receipt-number">Receipt #${receipt.receiptNumber}</div>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Tenant Name:</span>
            <span class="detail-value">${tenant?.name || '-'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Reference:</span>
            <span class="detail-value">${receipt.referenceNumber || '-'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Date:</span>
            <span class="detail-value">${new Date(receipt.paymentDate).toLocaleDateString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${receipt.paymentMethod || '-'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Type:</span>
            <span class="detail-value">${receipt.paymentType || '-'}</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="amount-section">
            <div class="total-amount">
              <span>Amount Received:</span>
              <span>Ksh ${(receipt.amount || 0).toLocaleString()}</span>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${receipt.isConfirmed ? 'CONFIRMED' : 'PENDING'}</span>
          </div>
          
          <div class="footer">
            <p>Thank you for your payment</p>
            <p>This is an electronically generated receipt</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const renderActions = () => {
    const tenantReceipts = rentPaymentsFromStore.filter(
      (p) => p.tenant === tenantId || p.tenant?._id === tenantId
    );

    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Tenant Actions & Receipts</h3>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h4 className="text-sm font-semibold text-slate-800 mb-4">Quick Actions</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                navigate(`/receipts/${tenantId}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-semibold text-sm transition-colors"
            >
              <FaMoneyBillWave size={16} />
              View All Receipts
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-colors"
            >
              <FaPrint size={16} />
              Print Statement
            </button>
            <button
              onClick={() => navigate(`/tenant/${tenantId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm transition-colors"
            >
              <FaEdit size={16} />
              Edit Tenant
            </button>
          </div>
        </div>

        {/* Receipts History */}
        <div className="px-6 py-4">
          <h4 className="text-sm font-semibold text-slate-800 mb-4">Recent Receipts</h4>
          {tenantReceipts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No receipts found for this tenant</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">Receipt #</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-2 text-right font-semibold text-slate-700">Amount</th>
                    <th className="px-4 py-2 text-center font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-2 text-center font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tenantReceipts.slice().reverse().map((receipt) => (
                    <tr key={receipt._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-slate-700">{receipt.receiptNumber}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(receipt.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{receipt.paymentType}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        Ksh {(receipt.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                            receipt.isConfirmed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {receipt.isConfirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handlePrintReceipt(receipt)}
                          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 mx-auto"
                          title="Print Receipt"
                        >
                          <FaPrint size={14} />
                          <span className="text-xs">Print</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "statement":
        return renderStatement();
      case "billing":
        return renderBillingSchedule();
      case "details":
        return renderTenantDetails();
      case "charges":
        return renderStandingCharges();
      case "reviews":
        return renderRentReviewsAndEscalations();
      case "actions":
        return renderActions();
      default:
        return renderStatement();
    }
  };

  if (!tenant) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tenant Not Found</h1>
            <p className="text-gray-600 mb-4">The tenant you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/tenants")}
              className={`${MILIK_GREEN} hover:bg-[#0A3127] text-white px-4 py-2 rounded font-semibold flex items-center gap-2 mx-auto`}
            >
              <FaArrowLeft />
              Back to Tenants
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
        <div className="mx-auto" style={{ maxWidth: "95%" }}>
          {/* Print-Only Company Header */}
          <div className="print-only-header" style={{ display: 'none' }}>
            <div style={{ textAlign: 'center', paddingBottom: '10px', marginBottom: '10px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#165946', marginBottom: '12px', letterSpacing: '1px' }}>
                {currentCompany?.companyName || currentCompany?.name || 'System Admin'}
              </h1>
              {currentCompany?.companyEmail && (
                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '3px' }}>
                  Email: {currentCompany.companyEmail}
                </p>
              )}
              {currentCompany?.companyPhone && (
                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '3px' }}>
                  Phone: {currentCompany.companyPhone}
                </p>
              )}
              {currentCompany?.companyAddress && (
                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '10px' }}>
                  Address: {currentCompany.companyAddress}
                </p>
              )}
              <div style={{ borderBottom: '3px solid #165946', margin: '10px auto', width: '100%' }}></div>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tenant Statement
            </h2>
            {/* Tenant Details Section */}
            <div style={{ 
              backgroundColor: '#F9FAFB', 
              border: '2px solid #E5E7EB', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#165946', marginBottom: '12px', borderBottom: '1px solid #D1D5DB', paddingBottom: '6px' }}>
                TENANT INFORMATION
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280', marginBottom: '3px' }}>Tenant Name</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>{tenant?.tenantName || tenant?.name || '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280', marginBottom: '3px' }}>Unit Number</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>{resolveTenantUnitNumber(tenant)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280', marginBottom: '3px' }}>Property</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>{resolveTenantPropertyName(tenant)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280', marginBottom: '3px' }}>Monthly Rent</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>
                    Ksh {(tenantLease?.rentAmount || tenant?.rent || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Header Section - Sticky */}
          <div className="sticky top-0 z-10 bg-white rounded-lg shadow-lg border border-slate-200 mb-6 p-4 no-print">
            {/* Back and Action Buttons */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <button
                  onClick={() => navigate("/tenants")}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-semibold"
                >
                  <FaArrowLeft size={16} />
                  Back to Tenants
                </button>
              </div>
              {/* Show Print and Download buttons only in Statement tab */}
              {activeTab === 'statement' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/receipts/${tenantId}`)}
                    className="bg-[#FF8C00] hover:bg-[#e67e00] text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow-md"
                  >
                    <FaMoneyBillWave size={16} />
                    Receipts
                  </button>
                  <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow-md"
                  >
                    <FaPrint size={16} />
                    Print
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 shadow-md"
                  >
                    <FaDownload size={16} />
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            {/* Tenant Information Card */}
            <div className="bg-slate-50 rounded-lg px-4 py-3 print-tenant-info">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Tenant Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                    {tenant?.tenantName || tenant?.name || "Loading..."}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{tenant?.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Unit
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                    {resolveTenantUnitNumber(tenant)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Property
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                    {resolveTenantPropertyName(tenant)}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-container bg-white rounded-lg shadow-md border border-slate-200 mt-4 overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "bg-orange-50 text-orange-600 border-b-2 border-orange-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="space-y-4 mt-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.75in;
            size: A4;
          }
          
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Hide all navigation and system tabs */
          .fixed {
            display: none !important;
          }
          
          /* Reset padding added for fixed elements */
          .pt-36 {
            padding-top: 0 !important;
          }
          
          .pt-4 {
            padding-top: 0 !important;
          }
          
          /* Hide bottom module tabs */
          .pb-20 {
            padding-bottom: 0 !important;
          }
          
          /* Show print-only header */
          .print-only-header {
            display: block !important;
            page-break-after: avoid;
          }
          
          /* Hide all buttons */
          button {
            display: none !important;
          }
          
          /* Hide checkboxes */
          input[type="checkbox"] {
            display: none !important;
          }
          
          /* Hide elements with no-print class */
          .no-print {
            display: none !important;
          }
          
          /* Hide the entire tab navigation container */
          .tabs-container {
            display: none !important;
          }
          
          /* Hide the flex container inside tabs-container */
          .tabs-container .flex {
            display: none !important;
          }
          
          /* Hide filter section */
          .filter-section {
            display: none !important;
          }
          
          /* Hide tab content wrapper, only show statement content */
          .tab-content {
            display: none !important;
          }
          
          .statement-tab {
            display: block !important;
          }
          
          /* Hide action buttons bar */
          .bg-gray-50 {
            display: none !important;
          }
          
          /* Print optimizations */
          .bg-gradient-to-br {
            background: white !important;
          }
          
          .shadow-sm, .shadow-md, .shadow-lg {
            box-shadow: none !important;
          }
          
          /* Style tenant info card for print */
          .print-tenant-info {
            background: white !important;
            border: 2px solid #E5E7EB !important;
            padding: 15px !important;
            margin-bottom: 20px !important;
            page-break-after: avoid;
          }
          
          .print-tenant-info p {
            font-size: 12px !important;
          }
          
          /* Optimize transaction table for printing */
          .transaction-table {
            height: auto !important;
            break-inside: avoid;
          }
          
          .transaction-table tbody {
            page-break-inside: avoid;
          }
          
          .transaction-table tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          /* Hide action buttons and back button area */
          .flex.items-center.justify-between {
            display: none !important;
          }
          
          /* Optimize colors for print */
          .bg-blue-600, .bg-green-600, .bg-orange-600, .bg-red-600 {
            background-color: white !important;
            border: 1px solid #000 !important;
          }
          
          /* Make text darker for better print readability */
          .text-gray-600, .text-gray-700 {
            color: #000 !important;
          }
          
          /* Card styling for print */
          .bg-white {
            border: 1px solid #E5E7EB !important;
          }
          
          /* Summary cards styling */
          .bg-blue-50, .bg-orange-50, .bg-green-50 {
            background: white !important;
            border: 2px solid #165946 !important;
          }
          
          /* Footer spacing */
          .print-footer {
            display: block !important;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            font-size: 11px;
            color: #6B7280;
          }
        }
      `}</style>

      {/* Invoice Creation Modal */}
      <InvoiceCreationModal
        isOpen={showInvoiceModal}
        periods={selectedSchedules.map(idx => billingScheduleData[idx])}
        onConfirm={handleConfirmInvoiceCreation}
        onCancel={() => setShowInvoiceModal(false)}
      />
    </DashboardLayout>
  );
};

export default TenantStatement;
