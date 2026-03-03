import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTenants } from "../../redux/tenantsRedux";
import { getLeases, getUtilities } from "../../redux/apiCalls";
import DashboardLayout from "../../components/Layout/DashboardLayout";
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
} from "react-icons/fa";

const MILIK_GREEN = "bg-[#165946]";

const TenantStatement = () => {
  const { id: tenantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("statement");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [transactionType, setTransactionType] = useState("ALL");
  const [escalationType, setEscalationType] = useState('percentage');
  const [escalationRate, setEscalationRate] = useState(10);
  const [escalationAmount, setEscalationAmount] = useState(1500);
  const [escalationFrequency, setEscalationFrequency] = useState('yearly');
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const currentCompany = useSelector((state) => state.company?.currentCompany);

  const tenantsFromStore = useSelector((state) => state.tenant?.tenants || []);
  const leasesFromStore = useSelector((state) => state.lease?.leases || []);
  const rentPaymentsFromStore = useSelector((state) => state.rentPayment?.rentPayments || []);
  const maintenanceFromStore = useSelector((state) => state.maintenance?.maintenances || []);
  const expensesFromStore = useSelector((state) => state.expenseProperty?.expenseProperties || []);
  const utilitiesFromStore = useSelector((state) => state.utility?.utilities || []);
  
  const tenant = tenantsFromStore?.find((t) => t._id === tenantId);
  const tenantLease = useMemo(() => {
    return leasesFromStore.find((lease) => lease.tenant === tenantId || lease.tenant?._id === tenantId);
  }, [leasesFromStore, tenantId]);

  useEffect(() => {
    if (!currentCompany?._id) return;

    dispatch(getTenants({ business: currentCompany._id }));
    getLeases(dispatch, currentCompany._id, null, tenantId);
    getUtilities(dispatch, currentCompany._id);
  }, [dispatch, currentCompany?._id, tenantId]);

  // Build real transactions from Redis store
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
  }, [rentPaymentsFromStore, maintenanceFromStore, tenantId]);

  const billingScheduleData = useMemo(() => {
    const baseRent = tenantLease?.rentAmount || tenant?.rent || 23000;
    const serviceCharge = 350;
    const scheduleData = [];
    let invoiceCounter = 1;

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
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      const lastDay = new Date(nextDate.getFullYear(), nextDate.getMonth(), 0).getDate();
      const fromDay = currentDate.getDate();
      const from = `${String(fromDay).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
      const monthTo = currentDate.getMonth() === 11 ? 1 : currentDate.getMonth() + 2;
      const yearTo = currentDate.getMonth() === 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
      const to = `${String(lastDay).padStart(2, '0')}/${String(monthTo).padStart(2, '0')}/${yearTo}`;
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const invoiceNum = `INV${String(invoiceCounter).padStart(5, '0')}`;
      const isPast = currentDate < new Date();
      
      // Check if there's an actual rent payment for this period
      const hasPaymentForPeriod = rentPaymentsFromStore.some((payment) => {
        if (payment.tenant !== tenantId && payment.tenant?._id !== tenantId) return false;
        const paymentDate = new Date(payment.paymentDate || payment.createdAt);
        return paymentDate >= currentDate && paymentDate < nextDate;
      });
      
      scheduleData.push({
        from,
        to,
        description: monthName,
        rent: baseRent,
        utility: serviceCharge,
        booked: hasPaymentForPeriod ? "Yes" : "No",
        frozen: "No",
        invoice: hasPaymentForPeriod ? invoiceNum : "-"
      });
      
      if (hasPaymentForPeriod) invoiceCounter++;
      currentDate = nextDate;
    }

    return scheduleData;
  }, [tenantLease, tenant]);

  // Tabs configuration
  const tabs = [
    { id: "statement", label: "Tenant Statement", icon: <FaFileInvoiceDollar /> },
    { id: "billing", label: "Billing Schedule", icon: <FaCalendarAlt /> },
    { id: "details", label: "Tenant Details", icon: <FaUser /> },
    { id: "charges", label: "Standing Charges", icon: <FaMoneyBillWave /> },
    { id: "reviews", label: "Rent Reviews / Escalations", icon: <FaChartBar /> },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.info("Download feature coming soon");
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

      // TODO: Implement actual invoice creation API call
      toast.success(`Creating ${periodsWithoutInvoices.length} invoice(s) for: ${periodsWithoutInvoices.map(p => p.description).join(', ')}`);
      setSelectedSchedules([]);
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
                    <td className="px-3 py-2 text-right text-slate-900">{row.utility ? row.utility.toLocaleString() : "-"}</td>
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
            <p className="text-lg font-bold text-gray-900">{tenant?.firstName} {tenant?.lastName}</p>
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
            <p className="text-lg font-bold text-gray-900">{tenant?.idDocument || "N/A"}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Unit</label>
            <p className="text-lg font-bold text-gray-900">{tenant?.unit?.unitNumber || "N/A"}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Property</label>
            <p className="text-lg font-bold text-gray-900">
              {tenant?.unit?.property?.propertyName || "N/A"}
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
    // Filter utilities for this tenant's property or company
    const relevantUtilities = utilitiesFromStore.filter((util) => 
      util.isActive && (util.business === currentCompany?._id || util.business?._id === currentCompany?._id)
    );

    const totalStandingCharges = relevantUtilities.reduce((sum, util) => sum + (util.unitCost || 0), 0);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Standing Charges</h3>
        <p className="text-gray-600 mb-6">Recurring charges attached to this tenancy</p>

        {relevantUtilities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No standing charges configured yet.</p>
            <p className="text-sm text-gray-500 mt-2">Add utilities in System Setup to see them here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {relevantUtilities.map((utility) => (
              <div key={utility._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{utility.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{utility.description || "No description"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">KES {(utility.unitCost || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-600 font-medium capitalize">{utility.billingCycle || "Monthly"}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-bold">Total Monthly Standing Charges:</span>
                <span className="float-right font-bold">KES {totalStandingCharges.toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRentReviewsAndEscalations = () => {
    const currentRent = tenantLease?.rentAmount || tenant?.rent || 0;
    const nextReviewDate = tenantLease?.endDate 
      ? new Date(tenantLease.endDate).toLocaleDateString() 
      : "01-Jan-2027";

    return (
      <div className="space-y-6">
        {/* Rent Reviews Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rent Reviews</h3>
          <p className="text-gray-600 mb-6">Historical rent changes and scheduled reviews</p>

          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {tenantLease?.startDate 
                      ? new Date(tenantLease.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : "January 2024"}
                  </h4>
                  <p className="text-sm text-gray-600">Initial lease rate</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">KES {currentRent.toLocaleString()}</div>
                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 mt-1">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">Next Scheduled Review</h4>
                  <p className="text-sm text-gray-600">{nextReviewDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    KES {(currentRent * 1.05).toLocaleString()}
                  </div>
                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 mt-1">
                    Pending
                  </span>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-2">5% increase expected</p>
            </div>
          </div>
        </div>

        {/* Escalations Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rent Escalations</h3>
          <p className="text-gray-600 mb-6">Automatic rent increase configuration</p>

          {/* Escalation Type Selector */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setEscalationType('percentage')}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                escalationType === 'percentage'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Percentage Increase
            </button>
            <button
              onClick={() => setEscalationType('amount')}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                escalationType === 'amount'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fixed Amount Increase
            </button>
          </div>

          {/* Percentage Increase Configuration */}
          {escalationType === 'percentage' && (
            <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-white">
              <h4 className="font-bold text-gray-900 mb-4">Fixed Percentage Increase</h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">Current Rent</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    KES {currentRent.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium mb-2">Increase Rate</p>
                  <input
                    type="number"
                    value={escalationRate}
                    onChange={(e) => setEscalationRate(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-600 mt-1">% Annually</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">Next Review</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{nextReviewDate}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white border border-green-300 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">New Rent</p>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    KES {Math.round(currentRent * (1 + escalationRate / 100)).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Increase Amount:</span>
                  <span className="float-right font-bold text-green-600">
                    + KES {Math.round(currentRent * (escalationRate / 100)).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Fixed Amount Increase Configuration */}
          {escalationType === 'amount' && (
            <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-white">
              <h4 className="font-bold text-gray-900 mb-4">Fixed Amount Increase</h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">Current Rent</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    KES {currentRent.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium mb-2">Fixed Increase</p>
                  <input
                    type="number"
                    value={escalationAmount}
                    onChange={(e) => setEscalationAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                  <p className="text-xs text-gray-600 mt-1">Per review</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium mb-2">Frequency</p>
                  <select
                    value={escalationFrequency}
                    onChange={(e) => setEscalationFrequency(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="biannual">Bi-annual</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white border border-green-300 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium">New Rent</p>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    KES {(currentRent + escalationAmount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Increase Amount:</span>
                  <span className="float-right font-bold text-green-600">
                    + KES {escalationAmount.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded font-semibold hover:bg-gray-200">
                  Cancel
                </button>
                <button className={`${MILIK_GREEN} hover:bg-[#0A3127] text-white px-4 py-2 rounded font-semibold`}>
                  Save Escalation
                </button>
              </div>
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
          {/* Header Section - Sticky */}
          <div className="sticky top-0 z-10 bg-white rounded-lg shadow-lg border border-slate-200 mb-6 p-4">
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
              <div className="flex gap-2">
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
            </div>

            {/* Tenant Information Card */}
            <div className="bg-slate-50 rounded-lg px-4 py-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Tenant Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                    {tenant?.firstName} {tenant?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{tenant?.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Unit
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                    {tenant?.unit?.unitNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
                    Property
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                    {tenant?.unit?.property?.propertyName || "-"}
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
          body {
            background: white !important;
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
          }
          /* Hide action buttons and back button area */
          .flex.items-center.justify-between {
            display: none !important;
          }
          /* Keep tenant info card visible */
          .bg-slate-50.rounded-lg {
            display: block !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default TenantStatement;
