import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { createRentPayment, getRentPayments } from "../../redux/apiCalls";
import { getProperties } from "../../redux/propertyRedux";
import { getTenants } from "../../redux/tenantsRedux";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";

const CASHBOOK_OPTIONS = [
  "Main Cashbook",
  "Bank Cashbook",
  "Petty Cash",
  "M-Pesa Collections",
  "Agency Collections",
];

const todayInput = () => new Date().toISOString().split("T")[0];

const getTenantName = (tenant) => {
  if (!tenant) return "";
  return (
    tenant.name ||
    tenant.tenantName ||
    [tenant.firstName, tenant.lastName].filter(Boolean).join(" ") ||
    "Unnamed Tenant"
  );
};

const getTenantPropertyId = (tenant) => {
  const propertyFromUnit = tenant?.unit?.property?._id || tenant?.unit?.property;
  const propertyDirect = tenant?.property?._id || tenant?.property;
  return propertyFromUnit || propertyDirect || "";
};

const AddReceipt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedTenantId = searchParams.get("tenant") || "";
  const { currentCompany } = useSelector((state) => state.company || {});
  const properties = useSelector((state) => state.property?.properties || []);
  const tenants = useSelector((state) => state.tenant?.tenants || []);
  const rentPayments = useSelector((state) => state.rentPayment?.rentPayments || []);

  const [formData, setFormData] = useState({
    propertyId: "",
    tenantId: preselectedTenantId,
    amount: "",
    paymentType: "rent",
    paymentMethod: "mobile_money",
    cashbook: "Main Cashbook",
    paidDirectToLandlord: false,
    paymentDate: todayInput(),
    dueDate: todayInput(),
    referenceNumber: "",
    bankingDate: todayInput(),
    recordDate: todayInput(),
    description: "",
    isConfirmed: false,
  });
  const [priorityInvoiceKeys, setPriorityInvoiceKeys] = useState([]);

  useEffect(() => {
    if (!currentCompany?._id) return;

    const load = async () => {
      try {
        await Promise.all([
          dispatch(getProperties({ business: currentCompany._id })),
          dispatch(getTenants({ business: currentCompany._id })),
          getRentPayments(dispatch, currentCompany._id),
        ]);
      } catch (error) {
        toast.error("Failed to load receipt setup data");
      }
    };

    load();
  }, [currentCompany?._id, dispatch]);

  useEffect(() => {
    if (!formData.tenantId || formData.propertyId) return;
    const selected = tenants.find((tenant) => String(tenant._id) === String(formData.tenantId));
    if (!selected) return;

    const tenantPropertyId = getTenantPropertyId(selected);
    if (tenantPropertyId) {
      setFormData((prev) => ({ ...prev, propertyId: String(tenantPropertyId) }));
    }
  }, [formData.tenantId, formData.propertyId, tenants]);

  const tenantOptions = useMemo(() => {
    if (!formData.propertyId) return [];
    return tenants.filter(
      (tenant) => String(getTenantPropertyId(tenant) || "") === String(formData.propertyId)
    );
  }, [tenants, formData.propertyId]);

  const selectedTenant = useMemo(
    () => tenants.find((tenant) => String(tenant._id) === String(formData.tenantId)),
    [formData.tenantId, tenants]
  );

  const getCreatedInvoicesForTenant = (targetTenantId) => {
    if (!targetTenantId) return [];

    const storageKey = `createdInvoices_${targetTenantId}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];

    try {
      const entries = JSON.parse(stored);
      return Object.entries(entries || {}).flatMap(([periodKey, entry]) => {
        const period =
          typeof entry === "object" && entry?.period
            ? String(entry.period)
            : String(periodKey).replace(/__(rent|utility)$/i, "");
        const invoiceId =
          typeof entry === "object"
            ? entry?.invoiceId || entry?.id || entry?.number || ""
            : "";
        const amount =
          typeof entry === "object" && Number.isFinite(Number(entry?.amount))
            ? Number(entry.amount)
            : 0;
        const createdAt =
          typeof entry === "object" ? entry?.createdAt || entry?.createdDate || null : null;
        const rentAmount =
          typeof entry === "object" && Number.isFinite(Number(entry?.rentAmount))
            ? Number(entry.rentAmount)
            : 0;
        const utilityAmount =
          typeof entry === "object" && Number.isFinite(Number(entry?.utilityAmount))
            ? Number(entry.utilityAmount)
            : 0;
        const inferredType =
          typeof entry === "object" && entry?.chargeType
            ? String(entry.chargeType).toLowerCase()
            : utilityAmount > 0 && rentAmount === 0
            ? "utility"
            : rentAmount > 0 && utilityAmount === 0
            ? "rent"
            : "combined";

        if (inferredType === "combined" && (rentAmount > 0 || utilityAmount > 0)) {
          const parts = [];
          if (rentAmount > 0) {
            parts.push({
              periodKey: `${periodKey}__component_rent`,
              period,
              amount: rentAmount,
              createdAt,
              invoiceId,
              parentInvoiceAmount: amount,
              chargeType: "rent",
            });
          }
          if (utilityAmount > 0) {
            parts.push({
              periodKey: `${periodKey}__component_utility`,
              period,
              amount: utilityAmount,
              createdAt,
              invoiceId,
              parentInvoiceAmount: amount,
              chargeType: "utility",
            });
          }
          return parts;
        }

        return [
          {
            periodKey,
            period,
            amount,
            createdAt,
            invoiceId,
            chargeType: inferredType === "combined" ? "rent" : inferredType,
          },
        ];
      });
    } catch (error) {
      return [];
    }
  };

  const calculateTenantBalance = (tenantId) => {
    if (!tenantId) return { totalOwed: 0, totalPaid: 0, balance: 0 };

    const tenantPayments = rentPayments.filter(
      (payment) =>
        (String(payment?.tenant?._id || payment?.tenant || "") === String(tenantId)) &&
        payment.isConfirmed === true
    );
    const totalPaid = tenantPayments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

    const invoices = getCreatedInvoicesForTenant(tenantId);
    const totalOwed = invoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

    return {
      totalOwed,
      totalPaid,
      balance: totalOwed - totalPaid,
    };
  };

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
      .filter(
        (payment) =>
          String(payment?.tenant?._id || payment?.tenant || "") === String(tenantId) &&
          payment.isConfirmed === true
      )
      .sort((a, b) => {
        const aTime = new Date(a.paymentDate || a.createdAt).getTime();
        const bTime = new Date(b.paymentDate || b.createdAt).getTime();
        return aTime - bTime;
      });

    let remainingPaid = confirmedPayments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

    return invoices
      .map((inv) => {
        const billedAmount = Number(inv.amount) || 0;
        const paid = Math.min(billedAmount, Math.max(0, remainingPaid));
        remainingPaid -= paid;
        const outstanding = Math.max(0, billedAmount - paid);

        return {
          invoiceKey: inv.periodKey,
          period: inv.period,
          chargeType: inv.chargeType,
          billedAmount,
          paid,
          outstanding,
        };
      })
      .filter((inv) => inv.outstanding > 0 || inv.paid > 0);
  };

  const balanceSummary = useMemo(
    () => calculateTenantBalance(formData.tenantId),
    [formData.tenantId, rentPayments]
  );

  const outstandingInvoices = useMemo(
    () => getOutstandingInvoices(formData.tenantId),
    [formData.tenantId, rentPayments]
  );

  useEffect(() => {
    setPriorityInvoiceKeys([]);
  }, [formData.tenantId]);

  useEffect(() => {
    const activeKeys = new Set(outstandingInvoices.map((invoice) => invoice.invoiceKey));
    setPriorityInvoiceKeys((prev) => prev.filter((key) => activeKeys.has(key)));
  }, [outstandingInvoices]);

  const orderedOutstandingInvoices = useMemo(() => {
    if (priorityInvoiceKeys.length === 0) return outstandingInvoices;

    const priorityMap = new Map(priorityInvoiceKeys.map((key, index) => [key, index]));
    return [...outstandingInvoices].sort((a, b) => {
      const aIndex = priorityMap.has(a.invoiceKey) ? priorityMap.get(a.invoiceKey) : Number.MAX_SAFE_INTEGER;
      const bIndex = priorityMap.has(b.invoiceKey) ? priorityMap.get(b.invoiceKey) : Number.MAX_SAFE_INTEGER;
      if (aIndex !== bIndex) return aIndex - bIndex;
      return 0;
    });
  }, [outstandingInvoices, priorityInvoiceKeys]);

  const togglePriorityInvoice = (invoiceKey) => {
    if (!invoiceKey) return;
    setPriorityInvoiceKeys((prev) => {
      if (prev.includes(invoiceKey)) {
        return prev.filter((key) => key !== invoiceKey);
      }
      return [...prev, invoiceKey];
    });
  };

  const getPriorityIndex = (invoiceKey) => {
    const index = priorityInvoiceKeys.findIndex((key) => key === invoiceKey);
    return index >= 0 ? index + 1 : null;
  };

  const allocationPreview = useMemo(() => {
    const receiptAmount = Number(formData.amount) || 0;
    let remaining = receiptAmount;

    const lines = orderedOutstandingInvoices.map((invoice) => {
      const apply = Math.min(invoice.outstanding, Math.max(0, remaining));
      remaining -= apply;
      return {
        invoiceKey: invoice.invoiceKey,
        period: invoice.period,
        chargeType: invoice.chargeType,
        beforeOutstanding: invoice.outstanding,
        apply,
        afterOutstanding: Math.max(0, invoice.outstanding - apply),
      };
    });

    return {
      lines,
      unappliedAmount: Math.max(0, remaining),
      projectedBalance: balanceSummary.balance - receiptAmount,
    };
  }, [formData.amount, orderedOutstandingInvoices, balanceSummary.balance]);

  const rentOutstandingInvoices = useMemo(
    () => outstandingInvoices.filter((invoice) => invoice.chargeType === "rent"),
    [outstandingInvoices]
  );

  const utilityOutstandingInvoices = useMemo(
    () => outstandingInvoices.filter((invoice) => invoice.chargeType === "utility"),
    [outstandingInvoices]
  );

  const onPropertyChange = (propertyId) => {
    setFormData((prev) => ({
      ...prev,
      propertyId,
      tenantId: "",
    }));
  };

  const handleSubmit = async () => {
    if (!currentCompany?._id) {
      toast.error("No active company selected");
      return;
    }

    if (!formData.propertyId) {
      toast.error("Property is required");
      return;
    }

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
      paidDirectToLandlord: Boolean(formData.paidDirectToLandlord),
      paymentDate: formData.paymentDate,
      dueDate: formData.dueDate,
      referenceNumber: formData.referenceNumber || undefined,
      bankingDate: formData.bankingDate || undefined,
      recordDate: formData.recordDate || undefined,
      description: formData.description,
      isConfirmed: formData.isConfirmed,
      ledgerType: "receipts",
      month: paymentDateObj.getMonth() + 1,
      year: paymentDateObj.getFullYear(),
    };

    try {
      await createRentPayment(dispatch, payload);
      toast.success("Receipt created successfully");
      navigate(preselectedTenantId ? `/receipts/${preselectedTenantId}` : "/receipts");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create receipt");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
        <div className="mx-auto max-w-5xl">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <button
                onClick={() => navigate(preselectedTenantId ? `/receipts/${preselectedTenantId}` : "/receipts")}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-semibold text-sm"
              >
                <FaArrowLeft /> Back to Receipts
              </button>
              <h1 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wide">
                Add Receipt
              </h1>
            </div>

            {formData.tenantId && (
              <div className="mb-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-[10px] font-bold uppercase text-red-700 mb-1">Total Invoiced</p>
                    <p className="text-lg font-bold text-red-700">Ksh {balanceSummary.totalOwed.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <p className="text-[10px] font-bold uppercase text-blue-700 mb-1">Current Balance</p>
                    <p className={`text-lg font-bold ${balanceSummary.balance > 0 ? "text-blue-700" : "text-green-700"}`}>
                      Ksh {balanceSummary.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <p className="text-[10px] font-bold uppercase text-green-700 mb-1">After This Receipt</p>
                    <p className={`text-lg font-bold ${allocationPreview.projectedBalance > 0 ? "text-red-700" : "text-green-700"}`}>
                      Ksh {allocationPreview.projectedBalance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <h3 className="text-[11px] font-bold text-slate-700 mb-1">Open Invoice Breakdown</h3>
                  <div className="mb-1 flex items-center justify-between text-[10px]">
                    <p className="text-slate-500">Click an invoice row to prioritize it for clearing first.</p>
                    {priorityInvoiceKeys.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPriorityInvoiceKeys([])}
                        className="text-blue-700 font-semibold hover:underline"
                      >
                        Clear Priority
                      </button>
                    )}
                  </div>
                  {outstandingInvoices.length > 0 ? (
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      <div className="bg-white border border-blue-200 rounded p-1.5">
                        <p className="text-[10px] font-bold uppercase text-blue-700 mb-1">Rent Invoices</p>
                        {rentOutstandingInvoices.length > 0 ? (
                          <div className="space-y-1">
                            {rentOutstandingInvoices.map((invoice, index) => {
                              const priorityIndex = getPriorityIndex(invoice.invoiceKey);
                              return (
                                <div
                                  key={`rent-${invoice.period}-${index}`}
                                  onClick={() => togglePriorityInvoice(invoice.invoiceKey)}
                                  className={`border rounded px-2 py-1 text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                    priorityIndex
                                      ? "border-blue-400 bg-blue-50"
                                      : "border-slate-200 hover:bg-slate-50"
                                  }`}
                                >
                                  <span className="font-semibold text-slate-900 whitespace-nowrap">{invoice.period}</span>
                                  <span className="text-slate-600 whitespace-nowrap">Invoice: Ksh {invoice.billedAmount.toLocaleString()}</span>
                                  <span className="text-slate-600 whitespace-nowrap">Outstanding: Ksh {invoice.outstanding.toLocaleString()}</span>
                                  {priorityIndex && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-700 text-white whitespace-nowrap">
                                      #{priorityIndex}
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase whitespace-nowrap">
                                      {invoice.chargeType}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">No open rent invoices.</p>
                        )}
                      </div>

                      <div className="bg-white border border-amber-200 rounded p-1.5">
                        <p className="text-[10px] font-bold uppercase text-amber-700 mb-1">Utility Invoices</p>
                        {utilityOutstandingInvoices.length > 0 ? (
                          <div className="space-y-1">
                            {utilityOutstandingInvoices.map((invoice, index) => {
                              const priorityIndex = getPriorityIndex(invoice.invoiceKey);
                              return (
                                <div
                                  key={`utility-${invoice.period}-${index}`}
                                  onClick={() => togglePriorityInvoice(invoice.invoiceKey)}
                                  className={`border rounded px-2 py-1 text-[11px] flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                    priorityIndex
                                      ? "border-amber-400 bg-amber-50"
                                      : "border-slate-200 hover:bg-slate-50"
                                  }`}
                                >
                                  <span className="font-semibold text-slate-900 whitespace-nowrap">{invoice.period}</span>
                                  <span className="text-slate-600 whitespace-nowrap">Invoice: Ksh {invoice.billedAmount.toLocaleString()}</span>
                                  <span className="text-slate-600 whitespace-nowrap">Outstanding: Ksh {invoice.outstanding.toLocaleString()}</span>
                                  {priorityIndex && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-700 text-white whitespace-nowrap">
                                      #{priorityIndex}
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase whitespace-nowrap">
                                      {invoice.chargeType}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">No open utility invoices.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No open invoices found for this tenant.</p>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                  <h3 className="text-[11px] font-bold text-amber-800 mb-1">Receipt Allocation Preview</h3>
                  {Number(formData.amount) > 0 ? (
                    <div className="space-y-1 text-[11px] text-amber-900">
                      {allocationPreview.lines.map((line, idx) =>
                        line.apply > 0 ? (
                          <div
                            key={`${line.period}-${line.chargeType}-${idx}`}
                            className="flex items-center justify-between bg-white border border-amber-100 rounded px-2 py-0.5"
                          >
                            <span>{line.period} ({line.chargeType})</span>
                            <span>
                              Apply Ksh {line.apply.toLocaleString()} | Remaining: Ksh {line.afterOutstanding.toLocaleString()}
                            </span>
                          </div>
                        ) : null
                      )}

                      {allocationPreview.unappliedAmount > 0 && (
                        <div className="flex items-center justify-between bg-white border border-amber-100 rounded px-2 py-0.5">
                          <span>Unapplied / Credit</span>
                          <span>Ksh {allocationPreview.unappliedAmount.toLocaleString()}</span>
                        </div>
                      )}

                      {allocationPreview.lines.every((line) => line.apply === 0) && (
                        <p className="text-xs">Entered amount does not apply to any open invoice yet.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-800">Enter an amount to preview how this receipt clears open invoices.</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Property *</label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => onPropertyChange(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="">Select property</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.propertyName || property.name || "Unnamed Property"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Tenant *</label>
                <select
                  value={formData.tenantId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tenantId: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  disabled={!formData.propertyId}
                >
                  <option value="">{formData.propertyId ? "Select tenant" : "Select property first"}</option>
                  {tenantOptions.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {getTenantName(tenant)}
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
                <label className="text-xs font-semibold text-slate-700">Reference Number</label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Bank ref / MPESA code"
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
                <p className="mt-1 text-[11px] text-slate-500">
                  Select where this receipt is collected for posting to journals and ledger reports.
                </p>
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

              <div>
                <label className="text-xs font-semibold text-slate-700">Banking Date</label>
                <input
                  type="date"
                  value={formData.bankingDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankingDate: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Record Date</label>
                <input
                  type="date"
                  value={formData.recordDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, recordDate: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Optional notes"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="paidDirectToLandlord"
                  checked={formData.paidDirectToLandlord}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paidDirectToLandlord: e.target.checked }))}
                />
                <label htmlFor="paidDirectToLandlord" className="text-xs font-semibold text-slate-700">
                  Payment made directly to landlord (for commission statement)
                </label>
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

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => navigate(preselectedTenantId ? `/receipts/${preselectedTenantId}` : "/receipts")}
                className="px-4 py-2 text-xs border border-slate-300 rounded-md font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-xs rounded-md text-white font-semibold flex items-center gap-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER}`}
              >
                <FaSave /> Save Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddReceipt;
