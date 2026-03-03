import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTenants } from "../../redux/tenantsRedux";
import { getLeases } from "../../redux/apiCalls";
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

// Mock transactions data
const mockTransactions = [
  {
    id: 1,
    date: "2026-01-15",
    description: "Monthly Rent - January",
    type: "CHARGE",
    amount: 15000,
    balance: 15000,
    transactionCode: "INV00001",
  },
  {
    id: 2,
    date: "2026-01-20",
    description: "Rent Payment",
    type: "PAYMENT",
    amount: -15000,
    balance: 0,
    transactionCode: "RCP00001",
  },
  {
    id: 3,
    date: "2026-02-01",
    description: "Service Charge - February",
    type: "CHARGE",
    amount: 2000,
    balance: 2000,
    transactionCode: "INV00002",
  },
  {
    id: 4,
    date: "2026-02-15",
    description: "Monthly Rent - February",
    type: "CHARGE",
    amount: 15000,
    balance: 17000,
    transactionCode: "INV00003",
  },
  {
    id: 5,
    date: "2026-03-01",
    description: "Rent Payment",
    type: "PAYMENT",
    amount: -17000,
    balance: 0,
    transactionCode: "RCP00002",
  },
];

const TenantStatement = () => {
  const { id: tenantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("statement");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [transactionType, setTransactionType] = useState("ALL");
  const currentCompany = useSelector((state) => state.company?.currentCompany);

  const tenantsFromStore = useSelector((state) => state.tenant?.tenants || []);
  const leasesFromStore = useSelector((state) => state.lease?.leases || []);
  const tenant = tenantsFromStore?.find((t) => t._id === tenantId);
  const tenantLease = useMemo(() => {
    return leasesFromStore.find((lease) => lease.tenant === tenantId || lease.tenant?._id === tenantId);
  }, [leasesFromStore, tenantId]);

  useEffect(() => {
    if (!currentCompany?._id) return;

    dispatch(getTenants({ business: currentCompany._id }));
    getLeases(dispatch, currentCompany._id, null, tenantId);
  }, [dispatch, currentCompany?._id, tenantId]);

  // Calculate statement data
  const statementData = useMemo(() => {
    const transactions = mockTransactions;
    const charges = transactions.filter((t) => t.type === "CHARGE");
    const payments = transactions.filter((t) => t.type === "PAYMENT");
    const totalCharges = charges.reduce((sum, t) => sum + t.amount, 0);
    const totalPayments = Math.abs(payments.reduce((sum, t) => sum + t.amount, 0));
    const currentBalance =
      totalCharges - totalPayments;

    return {
      transactions,
      totalCharges,
      totalPayments,
      currentBalance,
    };
  }, []);

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
      
      scheduleData.push({
        from,
        to,
        description: monthName,
        rent: baseRent,
        utility: serviceCharge,
        booked: isPast ? "Yes" : "No",
        posted: isPast ? "Yes" : "No",
        frozen: "No",
        invoice: isPast ? invoiceNum : "-"
      });
      
      if (isPast) invoiceCounter++;
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
    { id: "reviews", label: "Rent Reviews", icon: <FaChartBar /> },
    { id: "escalations", label: "Escalations", icon: <FaCog /> },
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

  const renderBillingSchedule = () => (
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

      <div className="overflow-auto">
        <table className="w-full min-w-[1200px] text-xs">
          <thead>
            <tr className={`${MILIK_GREEN} text-white`}>
              <th className="px-3 py-2 text-left font-semibold">From</th>
              <th className="px-3 py-2 text-left font-semibold">To</th>
              <th className="px-3 py-2 text-left font-semibold">Description</th>
              <th className="px-3 py-2 text-right font-semibold">Rent Amount</th>
              <th className="px-3 py-2 text-right font-semibold">S. Charge/Util.</th>
              <th className="px-3 py-2 text-right font-semibold">Total</th>
              <th className="px-3 py-2 text-center font-semibold">Booked</th>
              <th className="px-3 py-2 text-center font-semibold">Posted</th>
              <th className="px-3 py-2 text-center font-semibold">Frozen</th>
              <th className="px-3 py-2 text-left font-semibold">Invoice #</th>
              <th className="px-3 py-2 text-left font-semibold">Code</th>
            </tr>
          </thead>
          <tbody>
            {billingScheduleData.map((row, index) => {
              const total = row.rent + row.utility;
              const isProcessed = row.booked === "Yes" || row.posted === "Yes";

              return (
                <tr
                  key={`${row.from}-${row.description}`}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50"} border-b border-slate-200 hover:bg-emerald-50/40`}
                >
                  <td className="px-3 py-2 text-slate-800">{row.from}</td>
                  <td className="px-3 py-2 text-slate-800">{row.to}</td>
                  <td className="px-3 py-2 font-medium text-slate-900">{row.description}</td>
                  <td className="px-3 py-2 text-right text-slate-900">{row.rent.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-slate-900">{row.utility ? row.utility.toLocaleString() : "-"}</td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-900">{total.toLocaleString()}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${row.booked === "Yes" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {row.booked}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${row.posted === "Yes" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {row.posted}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-700">{row.frozen}</td>
                  <td className={`px-3 py-2 ${isProcessed ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    {row.invoice}
                  </td>
                  <td className="px-3 py-2 text-slate-900 font-semibold whitespace-nowrap">
                    {row.invoice !== "-" ? row.invoice : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTenantDetails = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Tenant Information</h3>
      {tenant ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Tenant Name</label>
            <p className="text-lg font-bold text-gray-900">{tenant?.name || "N/A"}</p>
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
            <p className="text-lg font-bold text-gray-900">{tenant?.idNumber || "N/A"}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Unit</label>
            <p className="text-lg font-bold text-gray-900">{tenant?.unit?.unitNumber || "N/A"}</p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Property</label>
            <p className="text-lg font-bold text-gray-900">
              {tenant?.unit?.property?.name || "N/A"}
            </p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Move-In Date</label>
            <p className="text-lg font-bold text-gray-900">
              {tenant?.moveInDate ? new Date(tenant.moveInDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="border-b md:border-b-0 pb-4 md:pb-0">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Lease Type</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              tenant?.moveOutDate && new Date(tenant.moveOutDate) > new Date()
                ? "bg-blue-100 text-blue-800"
                : "bg-orange-100 text-orange-800"
            }`}>
              {tenant?.moveOutDate && new Date(tenant.moveOutDate) > new Date() ? "FIXED" : "AT-WILL"}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Tenant not found</p>
      )}
    </div>
  );

  const renderStandingCharges = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Standing Charges</h3>
      <p className="text-gray-600 mb-6">Recurring charges attached to this tenancy</p>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">Service Charge</h4>
              <p className="text-sm text-gray-600 mt-1">Building maintenance and management</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">KES 2,000</div>
              <div className="text-xs text-gray-600 font-medium">Monthly</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">Garbage Collection</h4>
              <p className="text-sm text-gray-600 mt-1">Waste management and disposal</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">KES 500</div>
              <div className="text-xs text-gray-600 font-medium">Monthly</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">Security Charges</h4>
              <p className="text-sm text-gray-600 mt-1">24/7 security services</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">KES 1,000</div>
              <div className="text-xs text-gray-600 font-medium">Monthly</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">Parking Fee</h4>
              <p className="text-sm text-gray-600 mt-1">Parking space maintenance</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">KES 500</div>
              <div className="text-xs text-gray-600 font-medium">Monthly</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-bold">Total Monthly Standing Charges:</span>
            <span className="float-right font-bold">KES 4,000</span>
          </p>
        </div>
      </div>
    </div>
  );

  const renderRentReviews = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Rent Reviews</h3>
      <p className="text-gray-600 mb-6">Historical rent changes and scheduled reviews</p>

      <div className="space-y-4">
        <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">January 2024</h4>
              <p className="text-sm text-gray-600">Initial lease rate</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">KES 15,000</div>
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 mt-1">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">January 2026</h4>
              <p className="text-sm text-gray-600">Next scheduled review</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">KES 15,750</div>
              <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 mt-1">
                Pending
              </span>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-2">5% increase expected</p>
        </div>
      </div>
    </div>
  );

  const renderEscalations = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Rent Escalations</h3>
      <p className="text-gray-600 mb-6">Automatic rent increase configuration</p>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-white">
          <h4 className="font-bold text-gray-900 mb-4">Fixed Percentage Increase</h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Current Rent</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                KES {(tenant?.rent || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Increase Rate</p>
              <p className="text-lg font-bold text-orange-600 mt-1">10%</p>
              <p className="text-xs text-gray-600">Annually</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Next Review</p>
              <p className="text-lg font-bold text-gray-900 mt-1">01-Jan-2027</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white border border-green-300 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">New Rent</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                KES {Math.round((tenant?.rent || 0) * 1.1).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Increase Amount:</span>
              <span className="float-right font-bold text-green-600">
                + KES {Math.round((tenant?.rent || 0) * 0.1).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-white">
          <h4 className="font-bold text-gray-900 mb-4">Fixed Amount Increase</h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Current Rent</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                KES {(tenant?.rent || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Fixed Increase</p>
              <p className="text-lg font-bold text-purple-600 mt-1">KES 1,500</p>
              <p className="text-xs text-gray-600">Per review</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 font-medium">Frequency</p>
              <p className="text-lg font-bold text-gray-900 mt-1">Yearly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
        return renderRentReviews();
      case "escalations":
        return renderEscalations();
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
          <div className="space-y-4">

          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          button {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
          /* Hide the entire tab navigation */
          .tabs-container {
            display: none !important;
          }
          /* Hide filter section */
          .filter-section {
            display: none !important;
          }
          /* Hide all tab content except statement */
          .tab-content {
            display: none !important;
          }
          .statement-tab {
            display: block !important;
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
          /* Hide back button */
          button:first-child {
            display: none !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default TenantStatement;
