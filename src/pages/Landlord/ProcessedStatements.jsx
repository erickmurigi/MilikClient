import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaHourglass,
  FaChevronDown,
  FaChevronUp,
  FaPrint,
  FaDownload,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getProcessedStatements, updateStatement, deleteStatement } from "../../redux/processedStatementsRedux";

// Milik colors
const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#e67e00]";

const money = (value) => Number(value || 0).toFixed(2);

const ProcessedStatements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth?.currentUser);
  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const { statements, loading } = useSelector((state) => state.processedStatements);

  const [activeTab, setActiveTab] = useState("unpaid"); // paid | unpaid
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc

  const businessId = useMemo(() => {
    return (
      currentCompany?._id || currentUser?.company?._id || currentUser?.company || currentUser?.businessId || ""
    );
  }, [currentCompany?._id, currentUser?.company, currentUser?.businessId]);

  // Load statements
  useEffect(() => {
    if (!businessId) return;

    const loadStatements = async () => {
      try {
        await dispatch(getProcessedStatements({ businessId, status: null })).unwrap();
      } catch (error) {
        toast.error("Failed to load processed statements");
      }
    };

    loadStatements();
  }, [businessId, dispatch]);

  // Filter and sort statements
  const filteredStatements = useMemo(() => {
    let filtered = statements.filter((s) => s.status === activeTab);

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.landlord?.landlordName?.toLowerCase().includes(search) ||
          s.property?.propertyCode?.toLowerCase().includes(search) ||
          s.property?.propertyName?.toLowerCase().includes(search)
      );
    }

    // Sort
    if (sortBy === "date-desc") {
      filtered.sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt));
    } else if (sortBy === "date-asc") {
      filtered.sort((a, b) => new Date(a.closedAt) - new Date(b.closedAt));
    }

    return filtered;
  }, [statements, activeTab, searchText, sortBy]);

  // Summary stats
  const stats = useMemo(() => {
    const paid = statements.filter((s) => s.status === "paid");
    const unpaid = statements.filter((s) => s.status === "unpaid");
    return {
      totalPaid: paid.length,
      totalUnpaid: unpaid.length,
      totalAmountPaid: paid.reduce((sum, s) => sum + (s.netAmountDue || 0), 0),
      totalAmountUnpaid: unpaid.reduce((sum, s) => sum + (s.netAmountDue || 0), 0),
    };
  }, [statements]);

  const handleMarkAsPaid = async (statementId) => {
    try {
      await dispatch(
        updateStatement({
          statementId,
          updates: {
            status: "paid",
            paidDate: new Date().toISOString(),
          },
        })
      ).unwrap();

      toast.success("Statement marked as paid");
    } catch (error) {
      toast.error(error || "Failed to update statement");
    }
  };

  const handleMarkAsUnpaid = async (statementId) => {
    try {
      await dispatch(
        updateStatement({
          statementId,
          updates: {
            status: "unpaid",
            paidDate: null,
          },
        })
      ).unwrap();

      toast.success("Statement marked as unpaid");
    } catch (error) {
      toast.error(error || "Failed to update statement");
    }
  };

  const handleDeleteStatement = async (statementId) => {
    if (!window.confirm("Are you sure you want to delete this statement?")) {
      return;
    }

    try {
      await dispatch(deleteStatement(statementId)).unwrap();
      toast.success("Statement deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete statement");
    }
  };

  const handlePrintStatement = (statement) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Unable to open print window");
      return;
    }

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

    const getMonthYear = (date) =>
      new Date(date).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Processed Statement</title>
  <style>
    @page { margin: 0.5cm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.3; padding: 10px; }
    .header { text-align: center; margin-bottom: 15px; }
    .header h1 { font-size: 14pt; font-weight: bold; margin-bottom: 3px; }
    .header p { font-size: 9pt; margin: 1px 0; }
    .title { text-align: center; font-size: 11pt; font-weight: bold; margin: 10px 0; border-top: 2px solid black; border-bottom: 2px solid black; padding: 5px 0; }
    .info-section { display: flex; justify-content: space-between; margin: 10px 0; font-size: 9pt; }
    .statement-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9pt; }
    .statement-table th { background: #0B3B2E; color: white; padding: 5px; text-align: left; border: 1px solid #999; font-weight: bold; }
    .statement-table td { padding: 5px; border: 1px solid #ccc; text-align: left; }
    .statement-table .number { text-align: right; }
    .statement-table .total-row { font-weight: bold; background: #f5f5f5; }
    .summary { width: 50%; margin-left: auto; margin-top: 20px; font-size: 9pt; }
    .summary table { width: 100%; border-collapse: collapse; }
    .summary th { text-align: left; padding: 5px; background: #0B3B2E; color: white; border: 1px solid #999; font-weight: bold; }
    .summary td { padding: 5px; border: 1px solid #ccc; text-align: right; }
    .status-badge { padding: 3px 8px; border-radius: 3px; font-weight: bold; display: inline-block; }
    .status-paid { background-color: #d4edda; color: #155724; }
    .status-unpaid { background-color: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${statement.business?.companyName || "PROPERTY MANAGEMENT SYSTEM"}</h1>
    <p>${statement.business?.address || ""}</p>
    <p>TEL: ${statement.business?.phone || ""} | EMAIL: ${statement.business?.email || ""}</p>
  </div>

  <div class="title">PROCESSED LANDLORD STATEMENT</div>

  <div class="info-section">
    <div>
      <p><strong>LANDLORD:</strong> ${statement.landlord?.landlordName || "N/A"}</p>
      <p><strong>PROPERTY:</strong> [${statement.property?.propertyCode || "N/A"}] ${statement.property?.propertyName || "N/A"}</p>
      <p><strong>PERIOD:</strong> ${getMonthYear(statement.periodStart)}</p>
    </div>
    <div style="text-align: right;">
      <p><strong>STATUS:</strong> <span class="status-badge status-${statement.status}">${statement.status.toUpperCase()}</span></p>
      <p><strong>PROCESSED:</strong> ${formatDate(statement.closedAt)}</p>
      ${statement.paidDate ? `<p><strong>PAID DATE:</strong> ${formatDate(statement.paidDate)}</p>` : ""}
    </div>
  </div>

  <table class="statement-table">
    <thead>
      <tr>
        <th>UNIT</th>
        <th>TENANT</th>
        <th class="number">PER MONTH</th>
        <th class="number">BALANCE B/F</th>
        <th class="number">INVOICED</th>
        <th class="number">RECEIVED</th>
        <th class="number">BALANCE C/F</th>
      </tr>
    </thead>
    <tbody>
      ${statement.tenantRows
        ?.map(
          (row) => `
        <tr>
          <td>${row.unit}</td>
          <td>${row.tenantName}</td>
          <td class="number">${money(row.rentPerMonth)}</td>
          <td class="number">${money(row.openingBalance)}</td>
          <td class="number">${money(row.totalInvoiced)}</td>
          <td class="number">${money(row.totalReceived)}</td>
          <td class="number">${money(row.closingBalance)}</td>
        </tr>`
        )
        .join("")}
      <tr class="total-row">
        <td colspan="2"><strong></strong></td>
        <td class="number"><strong>SUMMARY</strong></td>
        <td class="number"><strong>${money(statement.tenantRows?.reduce((s, r) => s + r.openingBalance, 0) || 0)}</strong></td>
        <td class="number"><strong>${money(statement.totalRentInvoiced)}</strong></td>
        <td class="number"><strong>${money(statement.totalRentReceived)}</strong></td>
        <td class="number"><strong>${money(statement.tenantRows?.reduce((s, r) => s + r.closingBalance, 0) || 0)}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="summary">
    <h3 style="margin-bottom: 10px;">FINANCIAL SUMMARY</h3>
    <table>
      <tr>
        <th>RENT RECEIVED</th>
        <td>${money(statement.totalRentReceived)}</td>
      </tr>
      <tr>
        <th>COMMISSION (${statement.commissionPercentage}%)</th>
        <td>(${money(statement.commissionAmount)})</td>
      </tr>
      <tr style="background: #0B3B2E; color: white; font-weight: bold;">
        <th>NET AMOUNT DUE</th>
        <td>${money(statement.netAmountDue)}</td>
      </tr>
    </table>
  </div>
</body>
</html>`;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-GB");

  const getStatusBadge = (status) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
          <FaCheckCircle /> Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
        <FaHourglass /> Unpaid
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Processed Statements</h1>
              <p className="text-gray-600 mt-2">View and manage landlord payment statements</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`${MILIK_GREEN} text-white rounded-lg shadow-md p-6`}>
              <p className="text-sm opacity-90">Total Paid</p>
              <p className="text-2xl font-bold">{stats.totalPaid}</p>
              <p className="text-xs opacity-75">Amount: {money(stats.totalAmountPaid)}</p>
            </div>
            <div className="bg-yellow-500 text-white rounded-lg shadow-md p-6">
              <p className="text-sm opacity-90">Total Unpaid</p>
              <p className="text-2xl font-bold">{stats.totalUnpaid}</p>
              <p className="text-xs opacity-75">Amount: {money(stats.totalAmountUnpaid)}</p>
            </div>
            <div className="bg-blue-600 text-white rounded-lg shadow-md p-6">
              <p className="text-sm opacity-90">Total Statements</p>
              <p className="text-2xl font-bold">{statements.length}</p>
              <p className="text-xs opacity-75">&nbsp;</p>
            </div>
            <div className={`${MILIK_ORANGE} text-white rounded-lg shadow-md p-6`}>
              <p className="text-sm opacity-90">Total Outstanding</p>
              <p className="text-2xl font-bold">{money(stats.totalAmountUnpaid)}</p>
              <p className="text-xs opacity-75">&nbsp;</p>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab("unpaid")}
                className={`px-4 py-2 font-semibold border-b-2 transition ${
                  activeTab === "unpaid"
                    ? `${MILIK_GREEN} border-orange-500 text-white`
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                <FaHourglass className="inline mr-2" /> Unpaid ({stats.totalUnpaid})
              </button>
              <button
                onClick={() => setActiveTab("paid")}
                className={`px-4 py-2 font-semibold border-b-2 transition ${
                  activeTab === "paid"
                    ? `${MILIK_GREEN} border-orange-500 text-white`
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                <FaCheckCircle className="inline mr-2" /> Paid ({stats.totalPaid})
              </button>
            </div>

            {/* Search and Sort */}
            <div className="flex gap-4 flex-col md:flex-row">
              <input
                type="text"
                placeholder="Search by landlord or property..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Statements Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">Loading statements...</p>
              </div>
            ) : filteredStatements.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No {activeTab} statements found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">LANDLORD</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">PROPERTY</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">PERIOD</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">NET DUE</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">PAID AMOUNT</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">STATUS</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStatements.map((statement) => (
                      <React.Fragment key={statement._id}>
                        <tr className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{statement.landlord?.landlordName || "N/A"}</td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold">{statement.property?.propertyCode}</p>
                              <p className="text-sm text-gray-600">{statement.property?.propertyName}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(statement.periodStart).toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{money(statement.netAmountDue)}</td>
                          <td className="px-4 py-3 text-right">{money(statement.amountPaid || 0)}</td>
                          <td className="px-4 py-3 text-center">{getStatusBadge(statement.status)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setExpandedRow(expandedRow === statement._id ? null : statement._id)}
                              className="text-gray-600 hover:text-gray-900 transition"
                            >
                              {expandedRow === statement._id ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {expandedRow === statement._id && (
                          <tr className="border-b bg-gray-50">
                            <td colSpan="7" className="px-4 py-4">
                              <div className="space-y-4">
                                {/* Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600">Occupied Units</p>
                                    <p className="font-semibold">{statement.occupiedUnits}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Vacant Units</p>
                                    <p className="font-semibold">{statement.vacantUnits}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Processed Date</p>
                                    <p className="font-semibold">{formatDate(statement.closedAt)}</p>
                                  </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="bg-white rounded p-3 border">
                                  <p className="font-semibold text-sm mb-2">Financial Summary</p>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div>
                                      <p className="text-gray-600">Rent Received</p>
                                      <p className="font-semibold">{money(statement.totalRentReceived)}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Commission</p>
                                      <p className="font-semibold">({money(statement.commissionAmount)})</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Commission %</p>
                                      <p className="font-semibold">{statement.commissionPercentage}%</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600">Basis</p>
                                      <p className="font-semibold capitalize">{statement.commissionBasis}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => handlePrintStatement(statement)}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-800 transition"
                                  >
                                    <FaPrint /> Print
                                  </button>

                                  {statement.status === "unpaid" && (
                                    <button
                                      onClick={() => handleMarkAsPaid(statement._id)}
                                      className={`flex items-center gap-2 px-3 py-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER} text-white text-sm rounded transition`}
                                    >
                                      <FaCheckCircle /> Mark as Paid
                                    </button>
                                  )}

                                  {statement.status === "paid" && (
                                    <button
                                      onClick={() => handleMarkAsUnpaid(statement._id)}
                                      className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
                                    >
                                      <FaHourglass /> Mark as Unpaid
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleDeleteStatement(statement._id)}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition ml-auto"
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProcessedStatements;
