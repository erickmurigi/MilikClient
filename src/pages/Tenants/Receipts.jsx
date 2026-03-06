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
} from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getTenants } from "../../redux/tenantsRedux";
import {
  confirmRentPayment,
  createRentPayment,
  deleteRentPayment,
  getRentPayments,
  updateRentPayment,
  unconfirmRentPayment,
} from "../../redux/apiCalls";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

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
  const found = tenants.find((tenant) => tenant._id === tenantId);
  return found?.name || "N/A";
};

const getUnitName = (payment, tenants) => {
  const direct = payment?.unit?.unitNumber || payment?.unit?.name || payment?.unit?.unitName;
  if (direct) return direct;
  const tenantId = payment?.tenant?._id || payment?.tenant;
  const found = tenants.find((tenant) => tenant._id === tenantId);
  return found?.unit?.unitNumber || "N/A";
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

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    paymentType: "all",
    tenant: tenantId || "all",
    from: "",
    to: "",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [formData, setFormData] = useState({
    tenantId: tenantId || "",
    amount: "",
    paymentType: "rent",
    paymentMethod: "mobile_money",
    paymentDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    description: "",
    isConfirmed: false,
  });

  const loadData = async () => {
    if (!currentCompany?._id) return;
    try {
      await dispatch(getTenants({ business: currentCompany._id }));
      await getRentPayments(dispatch, currentCompany._id, filters.tenant !== "all" ? filters.tenant : null);
    } catch (error) {
      toast.error("Failed to load receipts");
    }
  };

  useEffect(() => {
    if (!currentCompany?._id) return;
    loadData();
  }, [currentCompany?._id]);

  const filteredReceipts = useMemo(() => {
    return rentPayments.filter((payment) => {
      const tenantName = getTenantName(payment, tenants).toLowerCase();
      const unitName = getUnitName(payment, tenants).toLowerCase();
      const receiptNo = (payment.receiptNumber || "").toLowerCase();
      const referenceNo = (payment.referenceNumber || "").toLowerCase();
      const searchTerm = filters.search.toLowerCase().trim();

      if (searchTerm) {
        const hasMatch =
          tenantName.includes(searchTerm) ||
          unitName.includes(searchTerm) ||
          receiptNo.includes(searchTerm) ||
          referenceNo.includes(searchTerm);
        if (!hasMatch) return false;
      }

      if (filters.status === "confirmed" && !payment.isConfirmed) return false;
      if (filters.status === "pending" && payment.isConfirmed) return false;
      if (filters.paymentType !== "all" && payment.paymentType !== filters.paymentType) return false;

      const thisTenantId = payment?.tenant?._id || payment?.tenant;
      if (filters.tenant !== "all" && thisTenantId !== filters.tenant) return false;

      if (filters.from) {
        const fromDate = new Date(filters.from);
        const paymentDate = new Date(payment.paymentDate || payment.createdAt);
        if (paymentDate < fromDate) return false;
      }

      if (filters.to) {
        const toDate = new Date(filters.to);
        toDate.setHours(23, 59, 59, 999);
        const paymentDate = new Date(payment.paymentDate || payment.createdAt);
        if (paymentDate > toDate) return false;
      }

      return true;
    });
  }, [rentPayments, filters, tenants]);

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

  // Helper: Calculate tenant's balance owed
  const calculateTenantBalance = (tenantId) => {
    if (!tenantId) return { totalOwed: 0, totalPaid: 0, balance: 0 };
    
    // Get all tenant's confirmed payments
    const tenantPayments = rentPayments.filter(
      (p) => (p.tenant === tenantId || p.tenant?._id === tenantId) && p.isConfirmed === true
    );
    const totalPaid = tenantPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Get tenant data to calculate rent owed
    const tenant = tenants.find((t) => t._id === tenantId);
    if (!tenant) return { totalOwed: 0, totalPaid, balance: 0 };

    // Estimate total rent owed based on move-in date
    const monthlyRent = tenant.unit?.rent || 0;
    const startDate = new Date(tenant.moveInDate || new Date());
    const today = new Date();
    const monthsDiff = (today.getFullYear() - startDate.getFullYear()) * 12 + 
                      (today.getMonth() - startDate.getMonth());
    const monthsElapsed = Math.max(1, monthsDiff + 1);
    
    // Add utilities if not included in rent
    let totalUtilities = 0;
    const tenantUtilities = tenant.utilities || [];
    if (Array.isArray(tenantUtilities)) {
      totalUtilities = tenantUtilities
        .filter((util) => util.isIncluded !== true)
        .reduce((sum, util) => sum + (util.unitCharge || util.amount || 0), 0);
    }

    const totalOwed = (monthlyRent + totalUtilities) * monthsElapsed;
    const balance = totalOwed - totalPaid;

    return { totalOwed, totalPaid, balance };
  };

  // Helper: Get outstanding invoice breakdown
  const getOutstandingInvoices = (tenantId) => {
    if (!tenantId) return [];
    
    const tenant = tenants.find((t) => t._id === tenantId);
    if (!tenant) return [];

    const monthlyRent = tenant.unit?.rent || 0;
    const startDate = new Date(tenant.moveInDate || new Date());
    
    const invoices = [];
    const currentDate = new Date();
    
    // Generate monthly invoices from start date to now
    for (let i = 0; i <= 12; i++) {
      const invDate = new Date(startDate);
      invDate.setMonth(invDate.getMonth() + i);
      
      if (invDate > currentDate) break;
      
      const invKey = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = invDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      // Get payments for this month
      const monthPayments = rentPayments.filter((p) => {
        if (p.tenant !== tenantId && p.tenant?._id !== tenantId) return false;
        if (!p.isConfirmed) return false;
        const pDate = new Date(p.paymentDate);
        return pDate.getFullYear() === invDate.getFullYear() && 
               pDate.getMonth() === invDate.getMonth();
      });
      
      const paid = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const outstanding = Math.max(0, monthlyRent - paid);
      
      if (outstanding > 0 || paid > 0) {
        invoices.push({
          month: monthLabel,
          rent: monthlyRent,
          paid,
          outstanding,
        });
      }
    }
    
    return invoices;
  };

  const resetForm = () => {
    setFormData({
      tenantId: tenantId || "",
      amount: "",
      paymentType: "rent",
      paymentMethod: "mobile_money",
      paymentDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      description: "",
      isConfirmed: false,
    });
    setActiveReceipt(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setActiveReceipt(null);
    setShowForm(true);
  };

  const openEditForm = (receipt) => {
    const tenantRef = receipt?.tenant?._id || receipt?.tenant || "";
    setActiveReceipt(receipt);
    setFormData({
      tenantId: tenantRef,
      amount: receipt.amount || "",
      paymentType: receipt.paymentType || "rent",
      paymentMethod: receipt.paymentMethod || "mobile_money",
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

  const handlePrintReceipt = (receipt) => {
    const tenantName = getTenantName(receipt, tenants);
    const unitName = getUnitName(receipt, tenants);

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>MILIK Receipt ${receipt.receiptNumber || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            .title { font-size: 24px; font-weight: 700; color: #0B3B2E; margin-bottom: 6px; }
            .sub { color: #6b7280; margin-bottom: 20px; }
            .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; }
            .label { color: #6b7280; }
            .value { font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="title">MILIK RECEIPT</div>
          <div class="sub">Professional property receipt</div>
          <div class="card">
            <div class="row"><span class="label">Receipt #</span><span class="value">${receipt.receiptNumber || "-"}</span></div>
            <div class="row"><span class="label">Reference #</span><span class="value">${receipt.referenceNumber || "-"}</span></div>
            <div class="row"><span class="label">Date</span><span class="value">${formatDate(receipt.paymentDate)}</span></div>
            <div class="row"><span class="label">Tenant</span><span class="value">${tenantName}</span></div>
            <div class="row"><span class="label">Unit</span><span class="value">${unitName}</span></div>
            <div class="row"><span class="label">Payment Type</span><span class="value">${receipt.paymentType}</span></div>
            <div class="row"><span class="label">Method</span><span class="value">${receipt.paymentMethod}</span></div>
            <div class="row"><span class="label">Status</span><span class="value">${receipt.isConfirmed ? "Confirmed" : "Pending"}</span></div>
            <div class="row"><span class="label">Amount</span><span class="value">Ksh ${Number(receipt.amount || 0).toLocaleString()}</span></div>
          </div>
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
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <button
                onClick={() => navigate("/tenants")}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-semibold text-sm"
              >
                <FaArrowLeft /> Back to Tenants
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-md hover:bg-slate-50 font-semibold flex items-center gap-2"
                >
                  <FaRedoAlt /> Refresh
                </button>
                <button
                  onClick={openCreateForm}
                  className={`px-3 py-1.5 text-xs text-white rounded-md font-semibold flex items-center gap-2 ${MILIK_ORANGE} ${MILIK_ORANGE_HOVER}`}
                >
                  <FaPlus /> New Receipt
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <p className="text-[10px] font-bold uppercase text-slate-600">Receipts</p>
                <p className="text-lg font-bold text-slate-900">{stats.count}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-[10px] font-bold uppercase text-green-700">Total Amount</p>
                <p className="text-lg font-bold text-green-700">Ksh {stats.total.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-[10px] font-bold uppercase text-blue-700">Confirmed</p>
                <p className="text-lg font-bold text-blue-700">{stats.confirmedCount}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <p className="text-[10px] font-bold uppercase text-orange-700">Pending</p>
                <p className="text-lg font-bold text-orange-700">{stats.pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              <div className="md:col-span-2 relative">
                <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                <input
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  placeholder="Search tenant, receipt, reference"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>

              <select
                value={filters.tenant}
                onChange={(e) => setFilters((prev) => ({ ...prev, tenant: e.target.value }))}
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              >
                <option value="all">All Tenants</option>
                {tenants.map((tenant) => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 text-xs border border-slate-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={filters.paymentType}
                onChange={(e) => setFilters((prev) => ({ ...prev, paymentType: e.target.value }))}
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
                  value={filters.from}
                  onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-md"
                />
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleConfirmSelected}
                className="px-3 py-1.5 text-xs rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
              >
                <FaCheck /> Confirm Selected
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 text-xs rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
              >
                <FaTrash /> Delete Selected
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
                    <th className="px-3 py-2 text-left">Unit</th>
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
                      <td colSpan="11" className="px-3 py-10 text-center text-slate-500">
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
                        >
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelection(receipt._id)}
                            />
                          </td>
                          <td className="px-3 py-2 font-bold text-slate-900">{receipt.receiptNumber || "-"}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{formatDate(receipt.paymentDate)}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{getTenantName(receipt, tenants)}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{getUnitName(receipt, tenants)}</td>
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
                            <div className="flex items-center justify-center gap-1">
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
                    const progress = Math.max(0, Math.min(100, ((balance - newBalance) / balance) * 100));
                    
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
    </DashboardLayout>
  );
};

export default Receipts;
