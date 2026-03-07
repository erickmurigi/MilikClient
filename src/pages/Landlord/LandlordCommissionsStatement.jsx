import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaDownload,
  FaFileInvoiceDollar,
  FaPrint,
  FaRedoAlt,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getLandlords, getPaymentVouchers, getRentPayments, getExpenseProperties } from "../../redux/apiCalls";
import { getProperties } from "../../redux/propertyRedux";
import { getTenants } from "../../redux/tenantsRedux";
import { adminRequests } from "../../utils/requestMethods";

const money = (value) => Number(value || 0).toLocaleString();

const asDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toInputDate = (value) => {
  const date = asDate(value) || new Date();
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getMonthSpanInclusive = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  if (end < start) return 1;
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
};

const toDateText = (value) => {
  const date = asDate(value);
  return date ? date.toLocaleDateString() : "-";
};

const parseUnitFromText = (text = "") => {
  const match = String(text).match(/unit\s*([a-z0-9\-\/]+)/i);
  return match ? `Unit ${match[1]}` : "-";
};

const getTenantName = (tenant) => tenant?.name || tenant?.tenantName || "Unnamed Tenant";

const normalizeInvoiceEntries = (tenantId) => {
  if (!tenantId) return [];
  const storageKey = `createdInvoices_${tenantId}`;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Object.entries(parsed || {}).flatMap(([periodKey, entry]) => {
      const createdAt = entry?.createdAt || entry?.createdDate || null;
      const chargeType = String(entry?.chargeType || "").toLowerCase();
      const basePeriod = String(entry?.period || periodKey).replace(/__(rent|utility)$/i, "");
      const amount = Number(entry?.amount || 0);
      const rentAmount = Number(entry?.rentAmount || 0);
      const utilityAmount = Number(entry?.utilityAmount || 0);

      if (chargeType === "combined" && (rentAmount > 0 || utilityAmount > 0)) {
        const rows = [];
        if (rentAmount > 0) {
          rows.push({ period: basePeriod, createdAt, chargeType: "rent", amount: rentAmount });
        }
        if (utilityAmount > 0) {
          rows.push({ period: basePeriod, createdAt, chargeType: "utility", amount: utilityAmount });
        }
        return rows;
      }

      const inferred =
        chargeType ||
        (String(periodKey).toLowerCase().includes("__utility") ? "utility" : "rent");

      return [
        {
          period: basePeriod,
          createdAt,
          chargeType: inferred,
          amount,
        },
      ];
    });
  } catch (error) {
    return [];
  }
};

const invoiceDateInRange = (invoice, startDate, endDate) => {
  const created = asDate(invoice?.createdAt);
  if (created) {
    return created >= startDate && created <= endDate;
  }

  const inferred = asDate(`1 ${invoice?.period || ""}`);
  if (!inferred) return false;
  return inferred >= startDate && inferred <= endDate;
};

const isDirectToLandlordPayment = (payment) => {
  if (payment?.paidDirectToLandlord === true) return true;
  const text = `${payment?.description || ""} ${payment?.referenceNumber || ""}`.toLowerCase();
  return /direct\s*(to)?\s*landlord|paid\s*to\s*landlord|landlord\s*direct/.test(text);
};

const getPropertyIdFromTenant = (tenant) => {
  const fromUnit = tenant?.unit?.property?._id || tenant?.unit?.property;
  const fromDirect = tenant?.property?._id || tenant?.property;
  return String(fromUnit || fromDirect || "");
};

const categoryLabel = {
  landlord_maintenance: "Landlord Maintenance",
  deposit_refund: "Deposit Refund",
  landlord_other: "Other Landlord Expense",
};

const LandlordCommissionsStatement = () => {
  const dispatch = useDispatch();
  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const landlords = useSelector((state) => state.landlord?.landlords || []);
  const properties = useSelector((state) => state.property?.properties || []);
  const tenants = useSelector((state) => state.tenant?.tenants || []);
  const rentPayments = useSelector((state) => state.rentPayment?.rentPayments || []);
  const expenses = useSelector((state) => state.expenseProperty?.expenseProperties || []);

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [companySettings, setCompanySettings] = useState(null);

  const defaultStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const defaultEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  const [filters, setFilters] = useState({
    landlordId: "",
    propertyId: "",
    from: toInputDate(defaultStart),
    to: toInputDate(defaultEnd),
    commissionPct: "",
  });

  useEffect(() => {
    if (!currentCompany?._id) return;

    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getLandlords({ company: currentCompany._id })),
          dispatch(getProperties({ business: currentCompany._id })),
          dispatch(getTenants({ business: currentCompany._id })),
          getRentPayments(dispatch, currentCompany._id),
          getExpenseProperties(dispatch, currentCompany._id),
        ]);

        const [voucherRows, settingsResponse] = await Promise.all([
          getPaymentVouchers({}),
          adminRequests.get(`/company-settings/${currentCompany._id}`),
        ]);

        setVouchers(Array.isArray(voucherRows) ? voucherRows : []);
        setCompanySettings(settingsResponse?.data || null);
      } catch (error) {
        toast.error("Failed to load landlord statement data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dispatch, currentCompany?._id]);

  const landlordOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return landlords;
    return landlords.filter((landlord) => {
      const text = `${landlord.landlordName || ""} ${landlord.landlordCode || ""}`.toLowerCase();
      return text.includes(term);
    });
  }, [landlords, searchTerm]);

  const selectedLandlord = useMemo(
    () => landlords.find((landlord) => String(landlord._id) === String(filters.landlordId)),
    [landlords, filters.landlordId]
  );

  const landlordProperties = useMemo(() => {
    if (!filters.landlordId) return [];
    return properties.filter((property) =>
      (property?.landlords || []).some(
        (entry) => String(entry?.landlordId || "") === String(filters.landlordId)
      )
    );
  }, [properties, filters.landlordId]);

  useEffect(() => {
    if (!filters.landlordId) return;
    if (!landlordProperties.some((property) => String(property._id) === String(filters.propertyId))) {
      setFilters((prev) => ({ ...prev, propertyId: landlordProperties[0]?._id || "" }));
    }
  }, [filters.landlordId, filters.propertyId, landlordProperties]);

  const selectedProperty = useMemo(
    () => properties.find((property) => String(property._id) === String(filters.propertyId)),
    [properties, filters.propertyId]
  );

  const fromDate = asDate(filters.from);
  const toDateRaw = asDate(filters.to);
  const toDate = toDateRaw ? new Date(toDateRaw.getFullYear(), toDateRaw.getMonth(), toDateRaw.getDate(), 23, 59, 59, 999) : null;

  const scopedTenants = useMemo(() => {
    if (!filters.propertyId) return [];
    return tenants.filter((tenant) => String(getPropertyIdFromTenant(tenant)) === String(filters.propertyId));
  }, [tenants, filters.propertyId]);

  const scopedPayments = useMemo(() => {
    if (!filters.propertyId || !fromDate || !toDate) return [];

    const tenantIds = new Set(scopedTenants.map((tenant) => String(tenant._id)));
    return rentPayments.filter((payment) => {
      const tenantId = String(payment?.tenant?._id || payment?.tenant || "");
      if (!tenantIds.has(tenantId)) return false;
      if (!payment?.isConfirmed) return false;
      if (payment?.isCancelled) return false;
      if (payment?.reversalOf) return false;
      const paymentDate = asDate(payment?.paymentDate || payment?.createdAt);
      if (!paymentDate) return false;
      return paymentDate >= fromDate && paymentDate <= toDate;
    });
  }, [filters.propertyId, fromDate, toDate, scopedTenants, rentPayments]);

  const openingPaymentsByTenant = useMemo(() => {
    if (!filters.propertyId || !fromDate) return new Map();
    const tenantIds = new Set(scopedTenants.map((tenant) => String(tenant._id)));
    const map = new Map();

    rentPayments.forEach((payment) => {
      const tenantId = String(payment?.tenant?._id || payment?.tenant || "");
      if (!tenantIds.has(tenantId)) return;
      if (!payment?.isConfirmed || payment?.isCancelled || payment?.reversalOf) return;
      const paymentDate = asDate(payment?.paymentDate || payment?.createdAt);
      if (!paymentDate || paymentDate >= fromDate) return;

      const direct = isDirectToLandlordPayment(payment);
      if (direct) return;

      const rentAmount = Number(payment?.breakdown?.rent || 0) || (payment?.paymentType === "rent" ? Number(payment.amount || 0) : 0);
      const utilityAmount = Number(
        (payment?.breakdown?.utilities || []).reduce((sum, item) => sum + Number(item?.amount || 0), 0)
      ) || (payment?.paymentType === "utility" ? Number(payment.amount || 0) : 0);

      const current = map.get(tenantId) || { rent: 0, utility: 0 };
      current.rent += rentAmount;
      current.utility += utilityAmount;
      map.set(tenantId, current);
    });

    return map;
  }, [filters.propertyId, fromDate, scopedTenants, rentPayments]);

  const tenantRows = useMemo(() => {
    if (!filters.propertyId || !fromDate || !toDate) return [];

    const monthSpan = getMonthSpanInclusive(fromDate, toDate);

    return scopedTenants.map((tenant) => {
      const tenantId = String(tenant._id);
      const unitName = tenant?.unit?.unitNumber || tenant?.unit?.name || "-";
      const expectedMonthlyRent = Number(tenant?.rent || tenant?.unit?.rent || 0);
      const expectedRent = expectedMonthlyRent * monthSpan;

      const invoiceEntries = normalizeInvoiceEntries(tenantId);
      const invoiceInPeriod = invoiceEntries.filter((entry) => invoiceDateInRange(entry, fromDate, toDate));
      const invoiceBeforePeriod = invoiceEntries.filter((entry) => {
        const created = asDate(entry?.createdAt) || asDate(`1 ${entry?.period || ""}`);
        return created && created < fromDate;
      });

      const invoicedRent = invoiceInPeriod
        .filter((entry) => entry.chargeType !== "utility")
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      const utilityInvoiced = invoiceInPeriod
        .filter((entry) => entry.chargeType === "utility")
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

      const openingInvoiceRent = invoiceBeforePeriod
        .filter((entry) => entry.chargeType !== "utility")
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      const openingInvoiceUtility = invoiceBeforePeriod
        .filter((entry) => entry.chargeType === "utility")
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

      const payments = scopedPayments.filter(
        (payment) => String(payment?.tenant?._id || payment?.tenant || "") === tenantId
      );

      let paidRent = 0;
      let paidUtility = 0;
      let directRent = 0;
      let directUtility = 0;

      payments.forEach((payment) => {
        const direct = isDirectToLandlordPayment(payment);
        const rentAmount = Number(payment?.breakdown?.rent || 0) || (payment?.paymentType === "rent" ? Number(payment.amount || 0) : 0);
        const utilityAmount = Number(
          (payment?.breakdown?.utilities || []).reduce((sum, item) => sum + Number(item?.amount || 0), 0)
        ) || (payment?.paymentType === "utility" ? Number(payment.amount || 0) : 0);

        if (direct) {
          directRent += rentAmount;
          directUtility += utilityAmount;
        } else {
          paidRent += rentAmount;
          paidUtility += utilityAmount;
        }
      });

      const openingPaid = openingPaymentsByTenant.get(tenantId) || { rent: 0, utility: 0 };
      const balanceForward =
        (openingInvoiceRent + openingInvoiceUtility) - (Number(openingPaid.rent || 0) + Number(openingPaid.utility || 0));

      const finalInvoicedRent = invoicedRent > 0 ? invoicedRent : expectedRent;
      const outstanding = balanceForward + finalInvoicedRent + utilityInvoiced - (paidRent + paidUtility + directRent + directUtility);

      return {
        tenantId,
        tenantName: getTenantName(tenant),
        unitName,
        expectedRent,
        invoicedRent: finalInvoicedRent,
        utilityInvoiced,
        paidRent,
        paidUtility,
        balanceForward,
        directRent,
        directUtility,
        outstanding,
      };
    });
  }, [filters.propertyId, fromDate, toDate, scopedTenants, scopedPayments, openingPaymentsByTenant]);

  const periodExpenseRows = useMemo(() => {
    if (!filters.propertyId || !fromDate || !toDate) return [];

    const rows = [];

    expenses.forEach((expense) => {
      const propertyId = String(expense?.property?._id || expense?.property || "");
      if (propertyId !== String(filters.propertyId)) return;

      const expenseDate = asDate(expense?.date || expense?.createdAt);
      if (!expenseDate || expenseDate < fromDate || expenseDate > toDate) return;

      const unitName = expense?.unit?.unitNumber || "-";
      rows.push({
        key: `expense-${expense._id}`,
        source: "Expense",
        date: expenseDate,
        description: expense?.description || expense?.category || "Expense",
        tenantUnit: unitName,
        amount: Number(expense?.amount || 0),
        reference: expense?.receiptNumber || expense?.paidBy || "-",
        notes: expense?.category || "",
      });
    });

    vouchers.forEach((voucher) => {
      const propertyId = String(voucher?.property?._id || voucher?.property || voucher?.propertyId || "");
      if (propertyId !== String(filters.propertyId)) return;
      if (["draft", "reversed"].includes(String(voucher?.status || ""))) return;

      const voucherDate = asDate(voucher?.paidDate || voucher?.dueDate || voucher?.createdAt);
      if (!voucherDate || voucherDate < fromDate || voucherDate > toDate) return;

      const label = categoryLabel[voucher?.category] || "Expense";
      const narration = String(voucher?.narration || "").trim();
      const description = `${label} - ${narration || "No narration"}`;

      rows.push({
        key: `voucher-${voucher._id}`,
        source: "Voucher",
        date: voucherDate,
        description,
        tenantUnit: parseUnitFromText(narration),
        amount: Number(voucher?.amount || 0),
        reference: voucher?.reference || voucher?.voucherNo || "-",
        notes: voucher?.voucherNo || "",
      });
    });

    return rows.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filters.propertyId, fromDate, toDate, expenses, vouchers]);

  const directLandlordRecords = useMemo(() => {
    if (!filters.propertyId || !fromDate || !toDate) return [];

    const tenantMap = new Map(scopedTenants.map((tenant) => [String(tenant._id), tenant]));
    return scopedPayments
      .filter((payment) => isDirectToLandlordPayment(payment))
      .map((payment) => {
        const tenantId = String(payment?.tenant?._id || payment?.tenant || "");
        const tenant = tenantMap.get(tenantId);
        const unit = tenant?.unit?.unitNumber || "-";

        return {
          id: payment._id,
          date: payment?.paymentDate || payment?.createdAt,
          tenant: getTenantName(tenant),
          unit,
          paymentType: payment?.paymentType || "rent",
          amount: Number(payment?.amount || 0),
          reference: payment?.referenceNumber || payment?.receiptNumber || "-",
          note: payment?.description || "Paid direct to landlord",
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filters.propertyId, fromDate, toDate, scopedPayments, scopedTenants]);

  const additionsRows = useMemo(() => {
    if (!filters.propertyId || !fromDate || !toDate) return [];

    const tenantMap = new Map(scopedTenants.map((tenant) => [String(tenant._id), tenant]));
    const rows = [];

    scopedPayments.forEach((payment) => {
      if (isDirectToLandlordPayment(payment)) return;

      const type = String(payment?.paymentType || "").toLowerCase();
      if (!["deposit", "other"].includes(type)) return;

      const tenantId = String(payment?.tenant?._id || payment?.tenant || "");
      const tenant = tenantMap.get(tenantId);

      rows.push({
        key: payment._id,
        date: payment?.paymentDate || payment?.createdAt,
        description: type === "deposit" ? "Deposit Received" : "Adjustment / Other Credit",
        tenantUnit: `${getTenantName(tenant)} / ${tenant?.unit?.unitNumber || "-"}`,
        amount: Number(payment?.amount || 0),
        reference: payment?.referenceNumber || payment?.receiptNumber || "-",
        notes: payment?.description || "",
      });
    });

    return rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filters.propertyId, fromDate, toDate, scopedPayments, scopedTenants]);

  const commissionDefaults = useMemo(() => {
    const commissions = companySettings?.commissions || [];
    const active = commissions.find((commission) => commission?.isActive !== false && ["rent", "all"].includes(commission?.applicableTo));
    return Number(active?.percentage || 0);
  }, [companySettings]);

  useEffect(() => {
    if (!filters.commissionPct && commissionDefaults > 0) {
      setFilters((prev) => ({ ...prev, commissionPct: String(commissionDefaults) }));
    }
  }, [commissionDefaults, filters.commissionPct]);

  const totals = useMemo(() => {
    const totalRentInvoiced = tenantRows.reduce((sum, row) => sum + row.invoicedRent, 0);
    const totalRentReceivedManaged = tenantRows.reduce((sum, row) => sum + row.paidRent, 0);
    const totalUtilityReceivedManaged = tenantRows.reduce((sum, row) => sum + row.paidUtility, 0);

    const directRent = tenantRows.reduce((sum, row) => sum + row.directRent, 0);
    const directUtility = tenantRows.reduce((sum, row) => sum + row.directUtility, 0);

    const totalDeductions = periodExpenseRows.reduce((sum, row) => sum + row.amount, 0);
    const totalAdditions = additionsRows.reduce((sum, row) => sum + row.amount, 0);

    const commissionPercentage = Number(filters.commissionPct || 0);
    const commissionBaseRent = totalRentReceivedManaged + directRent;
    const commissionAmount = (commissionBaseRent * commissionPercentage) / 100;

    const netPayableToLandlord =
      totalRentReceivedManaged +
      totalUtilityReceivedManaged +
      totalAdditions -
      totalDeductions -
      commissionAmount;

    return {
      totalRentInvoiced,
      totalRentReceivedManaged,
      totalUtilityReceivedManaged,
      directRent,
      directUtility,
      totalDeductions,
      totalAdditions,
      commissionPercentage,
      commissionAmount,
      commissionBaseRent,
      netPayableToLandlord,
    };
  }, [tenantRows, periodExpenseRows, additionsRows, filters.commissionPct]);

  const printStatement = () => {
    if (!selectedLandlord || !selectedProperty) {
      toast.warning("Select landlord and property first");
      return;
    }

    const logoUrl =
      currentCompany?.logo || currentCompany?.logoUrl || currentCompany?.companyLogo || "";

    const tenantRowsHtml = tenantRows
      .map(
        (row) => `
        <tr>
          <td>${row.tenantName}</td>
          <td>${row.unitName}</td>
          <td style="text-align:right">${money(row.expectedRent)}</td>
          <td style="text-align:right">${money(row.invoicedRent)}</td>
          <td style="text-align:right">${money(row.utilityInvoiced)}</td>
          <td style="text-align:right">${money(row.paidRent)}</td>
          <td style="text-align:right">${money(row.paidUtility)}</td>
          <td style="text-align:right">${money(row.balanceForward)}</td>
          <td style="text-align:right">${money(row.outstanding)}</td>
        </tr>
      `
      )
      .join("");

    const expenseHtml = periodExpenseRows
      .map(
        (row) => `
        <tr>
          <td>${toDateText(row.date)}</td>
          <td>${row.description}</td>
          <td>${row.tenantUnit || "-"}</td>
          <td style="text-align:right">${money(row.amount)}</td>
          <td>${row.reference || "-"}</td>
          <td>${row.notes || "-"}</td>
        </tr>
      `
      )
      .join("");

    const additionsHtml = additionsRows
      .map(
        (row) => `
        <tr>
          <td>${toDateText(row.date)}</td>
          <td>${row.description}</td>
          <td>${row.tenantUnit || "-"}</td>
          <td style="text-align:right">${money(row.amount)}</td>
          <td>${row.reference || "-"}</td>
          <td>${row.notes || "-"}</td>
        </tr>
      `
      )
      .join("");

    const directHtml = directLandlordRecords
      .map(
        (row) => `
        <tr>
          <td>${toDateText(row.date)}</td>
          <td>${row.tenant}</td>
          <td>${row.unit}</td>
          <td>${row.paymentType}</td>
          <td style="text-align:right">${money(row.amount)}</td>
          <td>${row.reference || "-"}</td>
          <td>${row.note || "-"}</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <html>
      <head>
        <title>Landlord Statement</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #111827; }
          .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #0B3B2E; padding-bottom:12px; margin-bottom:16px; }
          .logo { max-height: 56px; max-width: 140px; object-fit: contain; }
          .small { color:#4b5563; font-size:12px; }
          h1 { margin:0; color:#0B3B2E; font-size:20px; }
          h2 { margin:18px 0 8px 0; color:#0B3B2E; font-size:14px; text-transform:uppercase; }
          table { width:100%; border-collapse:collapse; font-size:12px; margin-top:8px; }
          th, td { border:1px solid #d1d5db; padding:6px; vertical-align:top; }
          th { background:#0B3B2E; color:white; text-align:left; }
          .summary { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-top:10px; }
          .card { border:1px solid #d1d5db; border-radius:6px; padding:8px; }
          .kv { display:flex; justify-content:space-between; font-size:12px; margin:4px 0; }
          .answer { border:1px dashed #0B3B2E; padding:8px; margin-top:12px; background:#f8fafc; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            ${logoUrl ? `<img class="logo" src="${logoUrl}" alt="logo" />` : ""}
            <h1>${currentCompany?.companyName || "Company"}</h1>
            <div class="small">${currentCompany?.address || ""}</div>
            <div class="small">${currentCompany?.phone || ""} ${currentCompany?.email ? `| ${currentCompany.email}` : ""}</div>
          </div>
          <div style="text-align:right">
            <h1>Landlord Statement</h1>
            <div class="small"><strong>Property:</strong> ${selectedProperty?.propertyName || selectedProperty?.name || "-"}</div>
            <div class="small"><strong>Landlord:</strong> ${selectedLandlord?.landlordName || "-"}</div>
            <div class="small"><strong>Period:</strong> ${toDateText(fromDate)} - ${toDateText(toDate)}</div>
          </div>
        </div>

        <h2>Tenant Payment Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Tenant</th><th>Unit</th><th>Rent</th><th>Invoiced Rent</th><th>Utility / Other Charges</th><th>Paid Rent</th><th>Paid Utility</th><th>Balance Forward (B/F)</th><th>Outstanding</th>
            </tr>
          </thead>
          <tbody>${tenantRowsHtml || `<tr><td colspan="9">No tenant activity in this period.</td></tr>`}</tbody>
        </table>

        <h2>Period Expenses / Deductions</h2>
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Tenant/Unit</th><th>Amount</th><th>Reference</th><th>Notes</th></tr></thead>
          <tbody>${expenseHtml || `<tr><td colspan="6">No period deductions.</td></tr>`}</tbody>
        </table>

        <h2>Additions / Credits</h2>
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Tenant/Unit</th><th>Amount</th><th>Reference</th><th>Notes</th></tr></thead>
          <tbody>${additionsHtml || `<tr><td colspan="6">No additions/credits for this period.</td></tr>`}</tbody>
        </table>

        <h2>Direct-To-Landlord Receipts / Confirmations</h2>
        <table>
          <thead><tr><th>Date</th><th>Tenant</th><th>Unit</th><th>Type</th><th>Amount</th><th>Reference</th><th>Notes</th></tr></thead>
          <tbody>${directHtml || `<tr><td colspan="7">No direct-to-landlord records in this period.</td></tr>`}</tbody>
        </table>

        <h2>Summary</h2>
        <div class="summary">
          <div class="card">
            <div class="kv"><span>Total Rent Invoiced</span><strong>Ksh ${money(totals.totalRentInvoiced)}</strong></div>
            <div class="kv"><span>Total Rent Received (Managed)</span><strong>Ksh ${money(totals.totalRentReceivedManaged)}</strong></div>
            <div class="kv"><span>Rent Paid Direct to Landlord</span><strong>Ksh ${money(totals.directRent)}</strong></div>
            <div class="kv"><span>Commission %</span><strong>${totals.commissionPercentage}%</strong></div>
            <div class="kv"><span>Commission Amount (Rent Only)</span><strong>Ksh ${money(totals.commissionAmount)}</strong></div>
          </div>
          <div class="card">
            <div class="kv"><span>Total Expenses / Deductions</span><strong>Ksh ${money(totals.totalDeductions)}</strong></div>
            <div class="kv"><span>Total Additions / Credits</span><strong>Ksh ${money(totals.totalAdditions)}</strong></div>
            <div class="kv"><span>Total Utility Received (Managed)</span><strong>Ksh ${money(totals.totalUtilityReceivedManaged)}</strong></div>
            <div class="kv"><span>Final Net Amount Payable</span><strong>Ksh ${money(totals.netPayableToLandlord)}</strong></div>
          </div>
        </div>

        <div class="answer">
          <div><strong>What was billed?</strong> Ksh ${money(totals.totalRentInvoiced)} rent plus utility charges shown per tenant.</div>
          <div><strong>What was collected?</strong> Managed: Ksh ${money(totals.totalRentReceivedManaged + totals.totalUtilityReceivedManaged)} | Direct to landlord: Ksh ${money(totals.directRent + totals.directUtility)}</div>
          <div><strong>What was deducted?</strong> Ksh ${money(totals.totalDeductions)} plus commission Ksh ${money(totals.commissionAmount)}.</div>
          <div><strong>What was added?</strong> Ksh ${money(totals.totalAdditions)}.</div>
          <div><strong>Final total payable to landlord:</strong> Ksh ${money(totals.netPayableToLandlord)}.</div>
        </div>

        <script>window.onload = function(){ window.print(); };</script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const exportCsv = () => {
    if (!selectedLandlord || !selectedProperty) {
      toast.warning("Select landlord and property first");
      return;
    }

    const lines = [];
    lines.push(["Landlord Statement"]);
    lines.push(["Company", currentCompany?.companyName || ""]);
    lines.push(["Property", selectedProperty?.propertyName || selectedProperty?.name || ""]);
    lines.push(["Landlord", selectedLandlord?.landlordName || ""]);
    lines.push(["Period", `${toDateText(fromDate)} - ${toDateText(toDate)}`]);
    lines.push([]);

    lines.push(["Tenant Payment Breakdown"]);
    lines.push([
      "Tenant",
      "Unit",
      "Rent",
      "Invoiced Rent",
      "Utility/Other",
      "Paid Rent",
      "Paid Utility",
      "Balance Forward",
      "Outstanding",
    ]);
    tenantRows.forEach((row) => {
      lines.push([
        row.tenantName,
        row.unitName,
        row.expectedRent,
        row.invoicedRent,
        row.utilityInvoiced,
        row.paidRent,
        row.paidUtility,
        row.balanceForward,
        row.outstanding,
      ]);
    });

    lines.push([]);
    lines.push(["Period Expenses / Deductions"]);
    lines.push(["Date", "Description", "Tenant/Unit", "Amount", "Reference", "Notes"]);
    periodExpenseRows.forEach((row) => {
      lines.push([
        toDateText(row.date),
        row.description,
        row.tenantUnit,
        row.amount,
        row.reference,
        row.notes,
      ]);
    });

    lines.push([]);
    lines.push(["Additions / Credits"]);
    lines.push(["Date", "Description", "Tenant/Unit", "Amount", "Reference", "Notes"]);
    additionsRows.forEach((row) => {
      lines.push([
        toDateText(row.date),
        row.description,
        row.tenantUnit,
        row.amount,
        row.reference,
        row.notes,
      ]);
    });

    lines.push([]);
    lines.push(["Direct-To-Landlord Receipts / Confirmations"]);
    lines.push(["Date", "Tenant", "Unit", "Type", "Amount", "Reference", "Notes"]);
    directLandlordRecords.forEach((row) => {
      lines.push([
        toDateText(row.date),
        row.tenant,
        row.unit,
        row.paymentType,
        row.amount,
        row.reference,
        row.note,
      ]);
    });

    lines.push([]);
    lines.push(["Summary"]);
    lines.push(["Total Rent Invoiced", totals.totalRentInvoiced]);
    lines.push(["Total Rent Received (Managed)", totals.totalRentReceivedManaged]);
    lines.push(["Total Utility Received (Managed)", totals.totalUtilityReceivedManaged]);
    lines.push(["Rent Paid Direct to Landlord", totals.directRent]);
    lines.push(["Commission Percentage", totals.commissionPercentage]);
    lines.push(["Commission Amount", totals.commissionAmount]);
    lines.push(["Total Expenses / Deductions", totals.totalDeductions]);
    lines.push(["Total Additions / Credits", totals.totalAdditions]);
    lines.push(["Net Amount Payable to Landlord", totals.netPayableToLandlord]);

    const csv = lines
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Landlord_Statement_${selectedLandlord?.landlordName || "Landlord"}_${filters.from}_${filters.to}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const logoUrl = currentCompany?.logo || currentCompany?.logoUrl || currentCompany?.companyLogo || "";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-3">
        <div className="mx-auto" style={{ maxWidth: "96%" }}>
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 mb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded border border-slate-300 bg-white overflow-hidden flex items-center justify-center text-[10px] text-slate-500">
                  {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain" /> : "LOGO"}
                </div>
                <div>
                  <h1 className="text-sm font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                    <FaFileInvoiceDollar /> Commissions & Landlord Statement
                  </h1>
                  <p className="text-[11px] text-slate-600">
                    Property {selectedProperty?.propertyName || selectedProperty?.name || "-"} | Landlord {selectedLandlord?.landlordName || "-"} | Period {toDateText(fromDate)} - {toDateText(toDate)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-2 py-1 text-xs rounded border border-slate-300 bg-white hover:bg-slate-50 inline-flex items-center gap-1"
                >
                  <FaRedoAlt size={11} /> Refresh
                </button>
                <button
                  onClick={exportCsv}
                  className="px-2 py-1 text-xs rounded border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center gap-1"
                >
                  <FaDownload size={11} /> Export
                </button>
                <button
                  onClick={printStatement}
                  className="px-2 py-1 text-xs rounded border border-slate-300 bg-slate-800 text-white hover:bg-slate-700 inline-flex items-center gap-1"
                >
                  <FaPrint size={11} /> Print
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              <div className="relative md:col-span-2">
                <FaSearch className="absolute left-2 top-2.5 text-[10px] text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search landlord"
                  className="w-full pl-7 pr-2 py-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <select
                value={filters.landlordId}
                onChange={(e) => setFilters((prev) => ({ ...prev, landlordId: e.target.value, propertyId: "" }))}
                className="px-2 py-2 text-xs border border-slate-300 rounded"
              >
                <option value="">Select Landlord</option>
                {landlordOptions.map((landlord) => (
                  <option key={landlord._id} value={landlord._id}>
                    {landlord.landlordName}
                  </option>
                ))}
              </select>

              <select
                value={filters.propertyId}
                onChange={(e) => setFilters((prev) => ({ ...prev, propertyId: e.target.value }))}
                className="px-2 py-2 text-xs border border-slate-300 rounded"
                disabled={!filters.landlordId}
              >
                <option value="">Select Property</option>
                {landlordProperties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.propertyName || property.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
                className="px-2 py-2 text-xs border border-slate-300 rounded"
              />

              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
                className="px-2 py-2 text-xs border border-slate-300 rounded"
              />
            </div>

            <div className="mt-2 max-w-[220px]">
              <label className="text-[11px] text-slate-600 font-semibold">Commission % (Rent Only)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.commissionPct}
                onChange={(e) => setFilters((prev) => ({ ...prev, commissionPct: e.target.value }))}
                className="w-full px-2 py-2 text-xs border border-slate-300 rounded mt-1"
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 text-center text-slate-500 text-sm">
              Loading landlord statement...
            </div>
          ) : (
            <>
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-3 overflow-x-auto">
                <div className="px-3 py-2 border-b border-slate-200 text-xs font-bold uppercase text-slate-700">
                  Tenant Payment Breakdown
                </div>
                <table className="w-full min-w-[1200px] text-xs">
                  <thead>
                    <tr className="bg-[#0B3B2E] text-white">
                      <th className="px-2 py-1 text-left">Tenant</th>
                      <th className="px-2 py-1 text-left">Unit</th>
                      <th className="px-2 py-1 text-right">Rent</th>
                      <th className="px-2 py-1 text-right">Invoiced Rent</th>
                      <th className="px-2 py-1 text-right">Utility / Other Charges</th>
                      <th className="px-2 py-1 text-right">Paid Rent</th>
                      <th className="px-2 py-1 text-right">Paid Utility</th>
                      <th className="px-2 py-1 text-right">Balance Forward (B/F)</th>
                      <th className="px-2 py-1 text-right">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-2 py-5 text-center text-slate-500">
                          No tenant statement rows for selected filters.
                        </td>
                      </tr>
                    ) : (
                      tenantRows.map((row, index) => (
                        <tr key={row.tenantId} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} border-b border-slate-200`}>
                          <td className="px-2 py-1.5">{row.tenantName}</td>
                          <td className="px-2 py-1.5">{row.unitName}</td>
                          <td className="px-2 py-1.5 text-right">Ksh {money(row.expectedRent)}</td>
                          <td className="px-2 py-1.5 text-right">Ksh {money(row.invoicedRent)}</td>
                          <td className="px-2 py-1.5 text-right">Ksh {money(row.utilityInvoiced)}</td>
                          <td className="px-2 py-1.5 text-right">Ksh {money(row.paidRent)}</td>
                          <td className="px-2 py-1.5 text-right">Ksh {money(row.paidUtility)}</td>
                          <td className="px-2 py-1.5 text-right">Ksh {money(row.balanceForward)}</td>
                          <td className="px-2 py-1.5 text-right font-semibold">Ksh {money(row.outstanding)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-3">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
                  <div className="px-3 py-2 border-b border-slate-200 text-xs font-bold uppercase text-slate-700">Period Expenses / Deductions</div>
                  <table className="w-full min-w-[700px] text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Description</th>
                        <th className="px-2 py-1 text-left">Tenant/Unit</th>
                        <th className="px-2 py-1 text-right">Amount</th>
                        <th className="px-2 py-1 text-left">Ref</th>
                      </tr>
                    </thead>
                    <tbody>
                      {periodExpenseRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-2 py-4 text-center text-slate-500">No deductions in period.</td>
                        </tr>
                      ) : (
                        periodExpenseRows.map((row) => (
                          <tr key={row.key} className="border-b border-slate-200">
                            <td className="px-2 py-1.5">{toDateText(row.date)}</td>
                            <td className="px-2 py-1.5">{row.description}</td>
                            <td className="px-2 py-1.5">{row.tenantUnit}</td>
                            <td className="px-2 py-1.5 text-right">Ksh {money(row.amount)}</td>
                            <td className="px-2 py-1.5">{row.reference || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
                  <div className="px-3 py-2 border-b border-slate-200 text-xs font-bold uppercase text-slate-700">Additions / Credits</div>
                  <table className="w-full min-w-[700px] text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Description</th>
                        <th className="px-2 py-1 text-left">Tenant/Unit</th>
                        <th className="px-2 py-1 text-right">Amount</th>
                        <th className="px-2 py-1 text-left">Ref</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionsRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-2 py-4 text-center text-slate-500">No additions/credits in period.</td>
                        </tr>
                      ) : (
                        additionsRows.map((row) => (
                          <tr key={row.key} className="border-b border-slate-200">
                            <td className="px-2 py-1.5">{toDateText(row.date)}</td>
                            <td className="px-2 py-1.5">{row.description}</td>
                            <td className="px-2 py-1.5">{row.tenantUnit}</td>
                            <td className="px-2 py-1.5 text-right">Ksh {money(row.amount)}</td>
                            <td className="px-2 py-1.5">{row.reference || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-3 overflow-x-auto">
                <div className="px-3 py-2 border-b border-slate-200 text-xs font-bold uppercase text-slate-700">
                  Direct-To-Landlord Receipts / Confirmations
                </div>
                <table className="w-full min-w-[900px] text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="px-2 py-1 text-left">Date</th>
                      <th className="px-2 py-1 text-left">Tenant</th>
                      <th className="px-2 py-1 text-left">Unit</th>
                      <th className="px-2 py-1 text-left">Type</th>
                      <th className="px-2 py-1 text-right">Amount</th>
                      <th className="px-2 py-1 text-left">Reference</th>
                      <th className="px-2 py-1 text-left">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directLandlordRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-2 py-4 text-center text-slate-500">
                          No direct-to-landlord records in selected period.
                        </td>
                      </tr>
                    ) : (
                      directLandlordRecords.map((row) => (
                        <tr key={row.id} className="border-b border-slate-200">
                          <td className="px-2 py-1.5">{toDateText(row.date)}</td>
                          <td className="px-2 py-1.5">{row.tenant}</td>
                          <td className="px-2 py-1.5">{row.unit}</td>
                          <td className="px-2 py-1.5 uppercase">{row.paymentType}</td>
                          <td className="px-2 py-1.5 text-right">Ksh {money(row.amount)}</td>
                          <td className="px-2 py-1.5">{row.reference || "-"}</td>
                          <td className="px-2 py-1.5">{row.note}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-3">
                <div className="text-xs font-bold uppercase text-slate-700 mb-2">Summary</div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 text-xs">
                  <div className="border border-slate-200 rounded p-2">
                    <div className="text-slate-500">Total Rent Invoiced</div>
                    <div className="font-bold text-slate-900">Ksh {money(totals.totalRentInvoiced)}</div>
                  </div>
                  <div className="border border-slate-200 rounded p-2">
                    <div className="text-slate-500">Total Rent Received</div>
                    <div className="font-bold text-slate-900">Ksh {money(totals.totalRentReceivedManaged)}</div>
                  </div>
                  <div className="border border-slate-200 rounded p-2">
                    <div className="text-slate-500">Commission % / Amount</div>
                    <div className="font-bold text-slate-900">{totals.commissionPercentage}% / Ksh {money(totals.commissionAmount)}</div>
                  </div>
                  <div className="border border-slate-200 rounded p-2 bg-green-50 border-green-200">
                    <div className="text-green-700">Net Payable to Landlord</div>
                    <div className="font-bold text-green-700">Ksh {money(totals.netPayableToLandlord)}</div>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-1">
                  <div>Total Utility Received (Managed): Ksh {money(totals.totalUtilityReceivedManaged)}</div>
                  <div>Total Expenses / Deductions: Ksh {money(totals.totalDeductions)}</div>
                  <div>Total Additions / Credits: Ksh {money(totals.totalAdditions)}</div>
                  <div>Paid Direct to Landlord (Rent + Utility): Ksh {money(totals.directRent + totals.directUtility)}</div>
                  <div>Commission is calculated on rent only, including direct-to-landlord rent confirmations.</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LandlordCommissionsStatement;
