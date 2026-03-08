import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaDownload, FaPaperPlane, FaEdit, FaExclamation, FaLock } from "react-icons/fa";

const MILIK_GREEN = "#0B3B2E";
const MILIK_ORANGE = "#FF8C00";

const StatementDetailView = ({
  statement,
  lines = [],
  loading = false,
  onBack,
  onApprove,
  onSend,
  onRevise,
  onDownloadPdf,
  auditInfo = null,
}) => {
  const [showAudit, setShowAudit] = useState(false);

  const formatCurrency = (value) => {
    if (!value) return "KES 0.00";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "text-yellow-600",
      reviewed: "text-blue-600",
      approved: "text-green-600",
      sent: "text-purple-600",
      revised: "text-pink-600",
    };
    return colors[status] || "text-gray-600";
  };

  const canApprove = statement?.status === "draft" || statement?.status === "reviewed";
  const canSend = statement?.status === "approved";
  const canRevise = statement?.status === "approved" || statement?.status === "sent";
  const isImmutable = statement?.status === "approved" || statement?.status === "sent";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-800" />
          <p className="mt-2 text-gray-600">Loading statement...</p>
        </div>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No statement selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FaArrowLeft /> Back to Statements
      </button>

      {/* Header */}
      <div
        className="rounded-lg p-6 text-white"
        style={{ backgroundColor: MILIK_GREEN }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {statement.statementNumber || "Statement"}
            </h1>
            <p className="text-green-100">
              Version {statement.version || 1}
              {statement.supersededByStatementId && " (Revised)"}
            </p>
          </div>
          <span className={`text-2xl ${getStatusColor(statement.status)}`}>
            {statement.status?.toUpperCase()}
          </span>
        </div>
        {isImmutable && (
          <div className="flex items-center gap-2 text-green-200 bg-green-900 bg-opacity-30 px-3 py-2 rounded w-fit">
            <FaLock className="text-sm" />
            <span className="text-sm">This statement is immutable (frozen)</span>
          </div>
        )}
      </div>

      {/* Party Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Property */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Property</h3>
          <p className="text-left text-lg font-bold text-gray-900">
            {statement.property?.name || "N/A"}
          </p>
          <p className="text-sm text-gray-500">{statement.property?.address || ""}</p>
          <p className="text-sm text-gray-500">{statement.property?.city || ""}</p>
        </div>

        {/* Landlord */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Landlord</h3>
          <p className="text-lg font-bold text-gray-900">
            {statement.landlord?.firstName} {statement.landlord?.lastName}
          </p>
          <p className="text-sm text-gray-500">{statement.landlord?.email}</p>
          <p className="text-sm text-gray-500">{statement.landlord?.phone}</p>
        </div>

        {/* Period */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Period</h3>
          <p className="text-sm text-gray-900">
            {formatDate(statement.periodStart)} to {formatDate(statement.periodEnd)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Currency: {statement.currency}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Statement Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Opening Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(statement.openingBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Period Net</p>
            <p className={`text-2xl font-bold ${statement.periodNet < 0 ? "text-red-600" : "text-green-600"}`}>
              {formatCurrency(statement.periodNet)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Closing Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(statement.closingBalance)}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Lines */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Transactions ({lines?.length || 0} entries)
          </h2>
        </div>

        {lines && lines.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead style={{ backgroundColor: "#F3F4F6" }}>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">Debit</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">Credit</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">Balance</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr
                    key={line._id || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-gray-900">{formatDate(line.transactionDate)}</td>
                    <td className="px-4 py-3 text-gray-900">{line.description || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{line.category || "-"}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900">
                      {line.direction === "debit" ? formatCurrency(line.amount) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900">
                      {line.direction === "credit" ? formatCurrency(line.amount) : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900">
                      {formatCurrency(line.runningBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            No transactions in this statement
          </div>
        )}
      </div>

      {/* Audit Information */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <button
          onClick={() => setShowAudit(!showAudit)}
          className="flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900"
        >
          <span className={`transform ${showAudit ? "rotate-90" : ""}`}>›</span>
          Audit Information
        </button>
        {showAudit && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Statement ID:</span>
              <p className="text-gray-600 font-mono text-xs">{statement._id}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Line Count:</span>
              <p className="text-gray-600">{statement.lineCount || lines?.length || 0}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Ledger Entries:</span>
              <p className="text-gray-600">{statement.ledgerEntryCount || 0}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Created:</span>
              <p className="text-gray-600">{formatDateTime(statement.createdAt)}</p>
            </div>
            {statement.approvedAt && (
              <div>
                <span className="font-semibold text-gray-700">Approved:</span>
                <p className="text-gray-600">{formatDateTime(statement.approvedAt)}</p>
              </div>
            )}
            {statement.sentAt && (
              <div>
                <span className="font-semibold text-gray-700">Sent:</span>
                <p className="text-gray-600">{formatDateTime(statement.sentAt)}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {canApprove && (
          <button
            onClick={() => onApprove(statement)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white"
            style={{ backgroundColor: MILIK_GREEN }}
          >
            <FaCheckCircle /> Approve Statement
          </button>
        )}

        {canDownloadPdf && (
          <button
            onClick={() => onDownloadPdf(statement)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white"
            style={{ backgroundColor: MILIK_ORANGE }}
          >
            <FaDownload /> Download PDF
          </button>
        )}

        {canSend && (
          <button
            onClick={() => onSend(statement)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700"
          >
            <FaPaperPlane /> Send Statement
          </button>
        )}

        {canRevise && (
          <button
            onClick={() => onRevise(statement)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-yellow-600 hover:bg-yellow-700"
          >
            <FaEdit /> Create Revision
          </button>
        )}
      </div>
    </div>
  );
};

export default StatementDetailView;
