import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaFileExport,
  FaPrint,
  FaSearch,
  FaCheckCircle,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getLandlords, getRentPayments } from "../../redux/apiCalls";
import { getProperties } from "../../redux/propertyRedux";
import { getTenants } from "../../redux/tenantsRedux";
import { closeStatement } from "../../redux/processedStatementsRedux";

// Milik color constants
const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const money = (value) => Number(value || 0).toFixed(2);

const toDateSafe = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const monthSpanInclusive = (start, end) => {
  if (!start || !end) return 1;
  const s = new Date(start.getFullYear(), start.getMonth(), 1);
  const e = new Date(end.getFullYear(), end.getMonth(), 1);
  if (e < s) return 1;
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1;
};

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const resolveTenantName = (tenant) =>
  tenant?.name || tenant?.tenantName || [tenant?.firstName, tenant?.lastName].filter(Boolean).join(" ") || "N/A";

const resolveTenantUnit = (tenant) => tenant?.unit?.unitNumber || tenant?.unitNumber || "N/A";

const resolveTenantPropertyId = (tenant) => {
  const p1 = tenant?.unit?.property?._id || tenant?.unit?.property;
  const p2 = tenant?.property?._id || tenant?.property;
  const p3 = tenant?.propertyId;
  return normalizeId(p1 || p2 || p3);
};

const resolvePaymentTenantId = (payment) =>
  normalizeId(payment?.tenant?._id || payment?.tenant || payment?.tenantId?._id || payment?.tenantId);

const resolvePaymentAmount = (payment) =>
  Number(payment?.amount || payment?.amountPaid || payment?.breakdown?.total || 0);

const resolvePaymentTxnNo = (payment) => payment?.receiptNumber || payment?.referenceNumber || "N/A";

const loadTenantInvoiceEntries = (tenantId) => {
  if (!tenantId) return [];
  const storageKey = `createdInvoices_${tenantId}`;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Object.entries(parsed || {}).map(([periodKey, entry]) => {
      const createdAt = entry?.createdAt || entry?.createdDate || null;
      const invoiceDate = toDateSafe(createdAt) || toDateSafe(`1 ${String(entry?.period || periodKey).replace(/__(rent|utility)$/i, "")}`);
      const rentAmount = Number(entry?.rentAmount || 0);
      const totalAmount = Number(entry?.amount || 0);
      return {
        createdAt: invoiceDate,
        rentAmount: rentAmount > 0 ? rentAmount : totalAmount,
      };
    });
  } catch (error) {
    return [];
  }
};

// Get list of months
const getMonthsList = () => {
  return [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];
};

// Get list of years (previous 3 years to current year)
const getYearsList = () => {
  const years = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  for (let i = currentYear - 3; i <= currentYear; i++) {
    years.push({ label: String(i), value: i });
  }
  return years;
};

// Calculate actual statement period dates
const calculateStatementDates = (monthNum, year) => {
  if (!monthNum || !year) return { start: null, end: null, displayStart: "", displayEnd: "" };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedMonthDate = new Date(year, monthNum - 1, 1);
  const selectedMonthEnd = new Date(year, monthNum, 0, 23, 59, 59, 999);
  
  let startDate, endDate;
  
  // If selected month is before current month, use standard dates
  if (selectedMonthDate < new Date(today.getFullYear(), today.getMonth(), 1)) {
    startDate = new Date(year, monthNum - 1, 1);
    endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
  } else if (selectedMonthDate.getFullYear() === today.getFullYear() && 
             selectedMonthDate.getMonth() === today.getMonth()) {
    // Current month: from day after last day of previous month to today
    const prevMonthEnd = new Date(year, monthNum - 1, 0);
    startDate = new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() + 1);
    endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Future month: use standard dates
    startDate = new Date(year, monthNum - 1, 1);
    endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
  }
  
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };
  
  return {
    start: startDate,
    end: endDate,
    displayStart: formatDate(startDate),
    displayEnd: formatDate(endDate),
  };
};

const LandlordCommissionsStatement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth?.currentUser);
  const currentCompany = useSelector((state) => state.company?.currentCompany);

  const landlords = useSelector((state) => state.landlord?.landlords || []);
  const properties = useSelector((state) => state.property?.properties || []);
  const tenants = useSelector((state) => state.tenant?.tenants || []);
  const rentPayments = useSelector((state) => state.rentPayment?.rentPayments || []);
  const { loading: psLoading } = useSelector((state) => state.processedStatements || {});

  const company = currentCompany || currentUser?.company || null;

  const [selectedLandlordId, setSelectedLandlordId] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statementData, setStatementData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingStatement, setProcessingStatement] = useState(false);

  const businessId = useMemo(() => {
    return (
      currentCompany?._id ||
      currentUser?.company?._id ||
      currentUser?.company ||
      currentUser?.businessId ||
      ""
    );
  }, [currentCompany?._id, currentUser?.company, currentUser?.businessId]);

  useEffect(() => {
    if (!businessId) return;

    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getProperties({ business: businessId })),
          dispatch(getTenants({ business: businessId })),
          dispatch(getLandlords({ company: businessId })),
          getRentPayments(dispatch, businessId),
        ]);
      } catch (error) {
        toast.error("Failed to load statement data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [businessId, dispatch]);

  const selectedLandlord = useMemo(
    () => landlords.find((l) => normalizeId(l?._id) === normalizeId(selectedLandlordId)) || null,
    [landlords, selectedLandlordId]
  );

  const landlordProperties = useMemo(() => {
    if (!selectedLandlord) return [];

    const landlordId = normalizeId(selectedLandlord._id);
    const landlordName = normalizeText(selectedLandlord.landlordName);

    return properties.filter((property) => {
      const entries = Array.isArray(property?.landlords) ? property.landlords : [];
      if (entries.length === 0) return false;

      return entries.some((entry) => {
        const entryId = normalizeId(entry?.landlordId);
        const entryName = normalizeText(entry?.name);
        return entryId === landlordId || (entryName && entryName === landlordName);
      });
    });
  }, [properties, selectedLandlord]);

  const generateStatement = () => {
    if (!selectedLandlordId || !selectedPropertyId || !selectedMonth || !selectedYear) {
      toast.error("Please select landlord, property, month, and year");
      return;
    }

    const property = properties.find((p) => normalizeId(p?._id) === normalizeId(selectedPropertyId));
    const landlord = landlords.find((l) => normalizeId(l?._id) === normalizeId(selectedLandlordId));

    if (!property || !landlord) {
      toast.error("Property or landlord not found");
      return;
    }

    const { start: periodStart, end: periodEnd } = calculateStatementDates(parseInt(selectedMonth), selectedYear);

    const propertyId = normalizeId(property._id);
    const propertyTenants = tenants.filter(
      (tenant) => resolveTenantPropertyId(tenant) === propertyId
    );
    const tenantIds = new Set(propertyTenants.map((t) => normalizeId(t._id)));

    const validPayments = rentPayments.filter((payment) => {
      const tenantId = resolvePaymentTenantId(payment);
      if (!tenantIds.has(tenantId)) return false;

      if (typeof payment?.isConfirmed === "boolean" && !payment.isConfirmed) return false;
      if (payment?.isCancelled) return false;
      if (payment?.reversalOf) return false;

      const paymentDate = toDateSafe(payment?.paymentDate || payment?.createdAt);
      if (!paymentDate) return false;

      return true;
    });

    const periodPayments = validPayments.filter((payment) => {
      const paymentDate = toDateSafe(payment?.paymentDate || payment?.createdAt);
      return paymentDate >= periodStart && paymentDate <= periodEnd;
    });

    const openingPayments = validPayments.filter((payment) => {
      const paymentDate = toDateSafe(payment?.paymentDate || payment?.createdAt);
      return paymentDate < periodStart;
    });

    const months = monthSpanInclusive(periodStart, periodEnd);

    const tenantRows = propertyTenants.map((tenant) => {
      const tenantId = normalizeId(tenant._id);
      const rentPerMonth = Number(tenant?.rent || tenant?.unit?.rent || 0);

      const invoiceEntries = loadTenantInvoiceEntries(tenantId);

      const invoicedInPeriod = invoiceEntries
        .filter((inv) => inv.createdAt && inv.createdAt >= periodStart && inv.createdAt <= periodEnd)
        .reduce((sum, inv) => sum + Number(inv.rentAmount || 0), 0);

      const invoicedBeforePeriod = invoiceEntries
        .filter((inv) => inv.createdAt && inv.createdAt < periodStart)
        .reduce((sum, inv) => sum + Number(inv.rentAmount || 0), 0);

      const totalInvoiced = invoicedInPeriod > 0 ? invoicedInPeriod : rentPerMonth * months;

      const tenantPeriodPayments = periodPayments.filter(
        (payment) => resolvePaymentTenantId(payment) === tenantId
      );

      const tenantOpeningPayments = openingPayments.filter(
        (payment) => resolvePaymentTenantId(payment) === tenantId
      );

      const totalReceived = tenantPeriodPayments.reduce((sum, p) => sum + resolvePaymentAmount(p), 0);
      const openingReceived = tenantOpeningPayments.reduce((sum, p) => sum + resolvePaymentAmount(p), 0);

      const openingBalance = invoicedBeforePeriod - openingReceived;
      const closingBalance = openingBalance + totalInvoiced - totalReceived;

      return {
        unit: resolveTenantUnit(tenant),
        tenantName: resolveTenantName(tenant),
        rentPerMonth,
        openingBalance,
        totalInvoiced,
        txnNo:
          tenantPeriodPayments.length > 0
            ? tenantPeriodPayments.map((p) => resolvePaymentTxnNo(p)).join(", ")
            : "-",
        totalReceived,
        closingBalance,
      };
    });

    const totalRentInvoiced = tenantRows.reduce((sum, row) => sum + row.totalInvoiced, 0);
    const totalRentReceived = tenantRows.reduce((sum, row) => sum + row.totalReceived, 0);

    const commissionPercentage = Number(property?.commissionPercentage || 0);
    const commissionBasis = property?.commissionRecognitionBasis || "received";
    const commissionBaseAmount = commissionBasis === "invoiced" ? totalRentInvoiced : totalRentReceived;
    const commissionAmount = (commissionBaseAmount * commissionPercentage) / 100;
    const netAmountDue = totalRentReceived - commissionAmount;

    const occupiedUnits = propertyTenants.filter((t) => {
      const st = normalizeText(t?.status || t?.tenantStatus);
      return st === "active" || st === "occupied";
    }).length;

    const totalUnits = Number(property?.totalUnits || 0);
    const vacantUnits = Math.max(totalUnits - occupiedUnits, 0);

    setStatementData({
      landlord,
      property,
      periodStart,
      periodEnd,
      tenantRows,
      totalRentInvoiced,
      totalRentReceived,
      commissionPercentage,
      commissionBasis,
      commissionAmount,
      netAmountDue,
      occupiedUnits,
      vacantUnits,
    });
  };

  const handlePrint = () => {
    if (!statementData) {
      toast.error("Please generate a statement first");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    const printContent = generatePrintHTML();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportCSV = () => {
    if (!statementData) {
      toast.error("Please generate a statement first");
      return;
    }

    const {
      landlord,
      property,
      tenantRows,
      totalRentInvoiced,
      totalRentReceived,
      commissionAmount,
      netAmountDue,
    } = statementData;

    let csv = "LANDLORD COMMISSION STATEMENT\n\n";
    csv += `Landlord:,${landlord.landlordName}\n`;
    csv += `Property:,${property.propertyCode} - ${property.propertyName}\n`;
    csv += `Period:,${selectedMonth &&selectedYear ? `${selectedMonth}/${selectedYear}` : ""}\n\n`;
    csv += "Unit,Tenant,Per Month,Balance B/F,Amount Invoiced,TXN No,Amount Received,Balance C/F\n";

    tenantRows.forEach((row) => {
      csv += `${row.unit},${row.tenantName},${money(row.rentPerMonth)},${money(row.openingBalance)},${money(row.totalInvoiced)},"${row.txnNo}",${money(row.totalReceived)},${money(row.closingBalance)}\n`;
    });

    csv += `\nTOTALS:,,,${money(tenantRows.reduce((s, r) => s + r.openingBalance, 0))},${money(totalRentInvoiced)},,${money(totalRentReceived)},${money(tenantRows.reduce((s, r) => s + r.closingBalance, 0))}\n\n`;
    csv += "STATEMENT SUMMARY\n";
    csv += `Rent Received:,${money(totalRentReceived)}\n`;
    csv += `Commission (${statementData.commissionPercentage}%):,${money(commissionAmount)}\n`;
    csv += `Net Amount Due:,${money(netAmountDue)}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Landlord_Statement_${property.propertyCode}_${selectedMonth}_${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Statement exported successfully");
  };

  const handleProcessStatement = async () => {
    if (!statementData) {
      toast.error("Please generate a statement first");
      return;
    }

    setProcessingStatement(true);
    try {
      const statementPayload = {
        business: businessId,
        landlord: statementData.landlord._id,
        property: statementData.property._id,
        periodStart: statementData.periodStart,
        periodEnd: statementData.periodEnd,
        totalRentInvoiced: statementData.totalRentInvoiced,
        totalRentReceived: statementData.totalRentReceived,
        commissionPercentage: statementData.commissionPercentage,
        commissionBasis: statementData.commissionBasis,
        commissionAmount: statementData.commissionAmount,
        netAmountDue: statementData.netAmountDue,
        occupiedUnits: statementData.occupiedUnits,
        vacantUnits: statementData.vacantUnits,
        tenantRows: statementData.tenantRows,
      };

      await dispatch(closeStatement(statementPayload)).unwrap();

      toast.success("Statement processed successfully!");
      setStatementData(null);
      setSelectedLandlordId("");
      setSelectedPropertyId("");
      setSelectedMonth("");
      setSelectedYear(new Date().getFullYear());

      // Navigate to processed statements page after 1 second
      setTimeout(() => {
        navigate("/landlord/processed-statements");
      }, 1000);
    } catch (error) {
      // Display the error message from the API
      const errorMessage = error?.message || error || "Failed to process statement";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Process statement error:", error);
    } finally {
      setProcessingStatement(false);
    }
  };

  const generatePrintHTML = () => {
    const {
      landlord,
      property,
      tenantRows,
      periodStart,
      periodEnd,
      totalRentInvoiced,
      totalRentReceived,
      commissionPercentage,
      commissionAmount,
      netAmountDue,
      occupiedUnits,
      vacantUnits,
    } = statementData;

    const formatDate = (date) =>
      date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

    const getMonthYear = (date) =>
      date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Property Account Statement</title>
  <style>
    @page { margin: 0.5cm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.3; padding: 10px; }
    .header { text-align: center; margin-bottom: 15px; }
    .header h1 { font-size: 14pt; font-weight: bold; margin-bottom: 3px; }
    .header p { font-size: 9pt; margin: 1px 0; }
    .title { text-align: center; font-size: 11pt; font-weight: bold; margin: 10px 0; border-top: 2px solid black; border-bottom: 2px solid black; padding: 5px 0; }
    .info-section { display: flex; justify-content: space-between; margin: 10px 0; font-size: 9pt; }
    .info-left, .info-right { width: 48%; }
    .info-left p, .info-right p { margin: 2px 0; }
    .statement-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9pt; }
    .statement-table th { background: #e0e0e0; padding: 5px; text-align: left; border: 1px solid #999; font-weight: bold; }
    .statement-table td { padding: 5px; border: 1px solid #ccc; text-align: left; }
    .statement-table .number { text-align: right; }
    .statement-table .total-row { font-weight: bold; background: #f5f5f5; }
    .unit-count { font-size: 9pt; margin: 5px 0 15px 0; }
    .summary { width: 50%; margin-left: auto; margin-top: 20px; font-size: 9pt; }
    .summary table { width: 100%; border-collapse: collapse; }
    .summary th { text-align: left; padding: 5px; background: #e0e0e0; border: 1px solid #999; }
    .summary td { padding: 5px; border: 1px solid #ccc; text-align: right; }
    .summary .total { font-weight: bold; font-size: 10pt; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${company?.companyName || "PROPERTY MANAGEMENT SYSTEM"}</h1>
    <p>${company?.address || ""}</p>
    <p>TEL: ${company?.phone || ""}</p>
    <p>EMAIL: ${company?.email || ""}</p>
  </div>

  <div class="title">PROPERTY ACCOUNT STATEMENT - INTERIM/PROVISIONAL</div>

  <div class="info-section">
    <div class="info-left">
      <p><strong>LANDLORD:</strong> ${landlord.landlordName}</p>
      <p><strong>PROPERTY:</strong> [${property.propertyCode}] ${property.propertyName}</p>
    </div>
    <div class="info-right" style="text-align:right;">
      <p><strong>STATEMENT PERIOD:</strong> ${getMonthYear(periodStart)}</p>
      <p>${formatDate(periodStart)} - ${formatDate(periodEnd)}</p>
    </div>
  </div>

  <table class="statement-table">
    <thead>
      <tr>
        <th>UNIT</th>
        <th>TENANT/RESIDENT</th>
        <th class="number">PER MONTH</th>
        <th class="number">BALANCE B/F<br/>RENT</th>
        <th class="number">AMOUNT INVOICED<br/>RENT</th>
        <th>TXN NO</th>
        <th class="number">AMOUNT RECEIVED<br/>RENT</th>
        <th class="number">BALANCE C/F</th>
      </tr>
    </thead>
    <tbody>
      ${tenantRows
        .map(
          (row) => `
        <tr>
          <td>${row.unit}</td>
          <td>${row.tenantName}</td>
          <td class="number">${money(row.rentPerMonth)}</td>
          <td class="number">${money(row.openingBalance)}</td>
          <td class="number">${money(row.totalInvoiced)}</td>
          <td>${row.txnNo}</td>
          <td class="number">${money(row.totalReceived)}</td>
          <td class="number">${money(row.closingBalance)}</td>
        </tr>`
        )
        .join("")}
      <tr class="total-row">
        <td colspan="3"><strong>TOTALS:</strong></td>
        <td class="number">${money(tenantRows.reduce((s, r) => s + r.openingBalance, 0))}</td>
        <td class="number"><strong>${money(totalRentInvoiced)}</strong><br/><small>TOTAL INVOICED</small></td>
        <td></td>
        <td class="number"><strong>${money(totalRentReceived)}</strong><br/><small>TOTAL PAID</small></td>
        <td class="number">${money(tenantRows.reduce((s, r) => s + r.closingBalance, 0))}</td>
      </tr>
    </tbody>
  </table>

  <p class="unit-count"><strong>OCCUPIED UNITS: ${occupiedUnits} | VACANT UNITS: ${vacantUnits}</strong></p>

  <div class="summary">
    <h3 style="margin-bottom:10px;">STATEMENT SUMMARY</h3>
    <table>
      <tr>
        <th>RENT RECEIVED</th>
        <td>${money(totalRentReceived)}</td>
      </tr>
      <tr>
        <th>COMMISSION (${commissionPercentage}%)</th>
        <td>(${money(commissionAmount)})</td>
      </tr>
      <tr class="total">
        <th>NET AMOUNT DUE</th>
        <td>${money(netAmountDue)}</td>
      </tr>
    </table>
  </div>
</body>
</html>`;
  };

  const months = getMonthsList();
  const years = getYearsList();
  const statementDates = calculateStatementDates(parseInt(selectedMonth), selectedYear);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Landlord Commission Statement</h1>
            <p className="text-gray-600 mt-2">Generate and process property account statements</p>
          </div>

          {/* Selection Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* Landlord Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Landlord *</label>
                <select
                  value={selectedLandlordId}
                  onChange={(e) => {
                    setSelectedLandlordId(e.target.value);
                    setSelectedPropertyId("");
                    setStatementData(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">-- Select Landlord --</option>
                  {landlords.map((landlord) => (
                    <option key={landlord._id} value={landlord._id}>
                      {landlord.landlordName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property *</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => {
                    setSelectedPropertyId(e.target.value);
                    setStatementData(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={!selectedLandlordId}
                >
                  <option value="">-- Select Property --</option>
                  {landlordProperties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.propertyCode} - {property.propertyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Month *</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setStatementData(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">-- Select Month --</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(parseInt(e.target.value));
                    setStatementData(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <button
                  onClick={generateStatement}
                  disabled={loading}
                  className={`w-full px-4 py-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER} text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaSearch /> {loading ? "Loading..." : "Generate"}
                </button>
              </div>
            </div>

            {/* Statement Period Display */}
            {selectedMonth && selectedYear && (
              <div className="bg-gradient-to-r from-orange-50 to-green-50 border-2 border-orange-300 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-1">Statement Period:</p>
                <p className="text-xl font-bold text-orange-600">
                  {statementDates.displayStart} to {statementDates.displayEnd}
                </p>
              </div>
            )}
          </div>

          {/* Statement Display */}
          {statementData ? (
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              {/* Statement Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
                <h2 className="text-2xl font-bold">{company?.companyName || "PROPERTY MANAGEMENT SYSTEM"}</h2>
                <p className="text-sm text-gray-600">{company?.address || ""}</p>
                <p className="text-sm text-gray-600">TEL: {company?.phone || ""} | EMAIL: {company?.email || ""}</p>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold border-t-2 border-b-2 border-gray-800 py-2">
                  PROPERTY ACCOUNT STATEMENT - INTERIM/PROVISIONAL
                </h3>
              </div>

              <div className="flex justify-between mb-6 text-sm">
                <div>
                  <p><strong>LANDLORD:</strong> {statementData.landlord.landlordName}</p>
                  <p><strong>PROPERTY:</strong> [{statementData.property.propertyCode}] {statementData.property.propertyName}</p>
                </div>
                <div className="text-right">
                  <p><strong>STATEMENT PERIOD:</strong> {statementData.periodStart.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
                  <p>{statementData.periodStart.toLocaleDateString("en-GB")} - {statementData.periodEnd.toLocaleDateString("en-GB")}</p>
                </div>
              </div>

              {/* Tenant Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 p-2 text-left">UNIT</th>
                      <th className="border border-gray-400 p-2 text-left">TENANT/RESIDENT</th>
                      <th className="border border-gray-400 p-2 text-right">PER MONTH</th>
                      <th className="border border-gray-400 p-2 text-right">BALANCE B/F RENT</th>
                      <th className="border border-gray-400 p-2 text-right">AMOUNT INVOICED RENT</th>
                      <th className="border border-gray-400 p-2">TXN NO</th>
                      <th className="border border-gray-400 p-2 text-right">AMOUNT RECEIVED RENT</th>
                      <th className="border border-gray-400 p-2 text-right">BALANCE C/F</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statementData.tenantRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{row.unit}</td>
                        <td className="border border-gray-300 p-2">{row.tenantName}</td>
                        <td className="border border-gray-300 p-2 text-right">{money(row.rentPerMonth)}</td>
                        <td className="border border-gray-300 p-2 text-right">{money(row.openingBalance)}</td>
                        <td className="border border-gray-300 p-2 text-right">{money(row.totalInvoiced)}</td>
                        <td className="border border-gray-300 p-2 text-xs">{row.txnNo}</td>
                        <td className="border border-gray-300 p-2 text-right">{money(row.totalReceived)}</td>
                        <td className="border border-gray-300 p-2 text-right">{money(row.closingBalance)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan="3" className="border border-gray-400 p-2">TOTALS:</td>
                      <td className="border border-gray-400 p-2 text-right">{money(statementData.tenantRows.reduce((s, r) => s + r.openingBalance, 0))}</td>
                      <td className="border border-gray-400 p-2 text-right">{money(statementData.totalRentInvoiced)}</td>
                      <td className="border border-gray-400 p-2"></td>
                      <td className="border border-gray-400 p-2 text-right">{money(statementData.totalRentReceived)}</td>
                      <td className="border border-gray-400 p-2 text-right">{money(statementData.tenantRows.reduce((s, r) => s + r.closingBalance, 0))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm font-semibold mb-6">OCCUPIED UNITS: {statementData.occupiedUnits} | VACANT UNITS: {statementData.vacantUnits}</p>

              {/* Summary */}
              <div className="w-full md:w-1/2 ml-auto mb-6">
                <h4 className="font-bold mb-3 text-sm">STATEMENT SUMMARY</h4>
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 p-2 text-left">RENT RECEIVED</th>
                      <td className="border border-gray-400 p-2 text-right font-semibold">{money(statementData.totalRentReceived)}</td>
                    </tr>
                    <tr>
                      <th className="border border-gray-400 p-2 text-left">COMMISSION ({statementData.commissionPercentage}%)</th>
                      <td className="border border-gray-400 p-2 text-right">({money(statementData.commissionAmount)})</td>
                    </tr>
                    <tr className={`${MILIK_GREEN} text-white font-bold`}>
                      <th className="border border-gray-500 p-2 text-left">NET AMOUNT DUE</th>
                      <td className="border border-gray-500 p-2 text-right">{money(statementData.netAmountDue)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm mb-6">
                <p>
                  <strong>Note:</strong> Commission calculated on{" "}
                  <strong>{statementData.commissionBasis === "invoiced" ? "Invoiced Amount" : "Received Amount"}</strong>
                  {" "}basis.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 border-t pt-6">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                  <FaPrint /> Print
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  <FaDownload /> Export CSV
                </button>
                <button
                  onClick={handleProcessStatement}
                  disabled={processingStatement || psLoading}
                  className={`flex items-center gap-2 px-6 py-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER} text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto`}
                >
                  <FaCheckCircle /> {processingStatement || psLoading ? "Processing..." : "Process Statement"}
                </button>
              </div>
            </div>
          ) : (
            !loading && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaSearch className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Statement Generated</h3>
                <p className="text-gray-500">Select a landlord, property, and period, then click "Generate"</p>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandlordCommissionsStatement;
