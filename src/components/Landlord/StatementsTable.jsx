import React from "react";
import {
  FaEye,
  FaCheckCircle,
  FaPaperPlane,
  FaDownload,
  FaEdit,
  FaTrash,
  FaFileAlt,
} from "react-icons/fa";

const MILIK_GREEN = "#0B3B2E";

// Status badge styles
const getStatusBadge = (status) => {
  const statusConfig = {
    draft: {
      bg: "#FEF3C7",
      text: "#92400E",
      icon: "📝",
      label: "Draft",
    },
    reviewed: {
      bg: "#DBEAFE",
      text: "#1E40AF",
      icon: "👁️",
      label: "Reviewed",
    },
    approved: {
      bg: "#DCFCE7",
      text: "#166534",
      icon: "✓",
      label: "Approved",
    },
    sent: {
      bg: "#E0E7FF",
      text: "#3730A3",
      icon: "📧",
      label: "Sent",
    },
    revised: {
      bg: "#FCE7F3",
      text: "#831843",
      icon: "🔄",
      label: "Revised",
    },
  };

  return statusConfig[status] || statusConfig.draft;
};

const StatementStatusBadge = ({ status }) => {
  const config = getStatusBadge(status);
  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
      className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2"
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

const StatementsTable = ({
  statements = [],
  loading = false,
  onViewStatement,
  onApproveStatement,
  onSendStatement,
  onReviseStatement,
  onDeleteStatement,
  onDownloadPdf,
}) => {
  const formatCurrency = (value) => {
    if (!value) return "KES 0.00";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const canApprove = (status) => status === "draft" || status === "reviewed";
  const canSend = (status) => status === "approved";
  const canRevise = (status) => status === "approved" || status === "sent";
  const canDelete = (status) => status === "draft";
  const canDownloadPdf = (status) => status === "approved" || status === "sent";

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-800" />
        <p className="mt-2 text-gray-600">Loading statements...</p>
      </div>
    );
  }

  if (!statements || statements.length === 0) {
    return (
      <div className="text-center py-12">
        <FaFileAlt className="mx-auto text-5xl text-gray-300 mb-4" />
        <p className="text-gray-500">No statements found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: MILIK_GREEN }}>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Statement #
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Property
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Landlord
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Period
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Version
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-white">
              Opening Balance
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-white">
              Closing Balance
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-white">
              Status
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {statements.map((statement) => (
            <React.Fragment key={statement._id}>
              <tr className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {statement.statementNumber || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {statement.property?.propertyName || statement.property?.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {statement.landlord?.firstName}{" "}
                  {statement.landlord?.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(statement.periodStart)} -{" "}
                  {formatDate(statement.periodEnd)}
                </td>
                <td className="px-6 py-4 text-sm text-center font-semibold">
                  v{statement.version || 1}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 font-mono">
                  {formatCurrency(statement.openingBalance)}
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-900 font-mono">
                  {formatCurrency(statement.closingBalance)}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatementStatusBadge status={statement.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onViewStatement(statement)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View"
                    >
                      <FaEye className="text-blue-600" />
                    </button>

                    {canApprove(statement.status) && (
                      <button
                        onClick={() => onApproveStatement(statement)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <FaCheckCircle className="text-green-600" />
                      </button>
                    )}

                    {canDownloadPdf(statement.status) && (
                      <button
                        onClick={() => onDownloadPdf(statement)}
                        className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <FaDownload className="text-orange-600" />
                      </button>
                    )}

                    {canSend(statement.status) && (
                      <button
                        onClick={() => onSendStatement(statement)}
                        className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                        title="Send"
                      >
                        <FaPaperPlane className="text-purple-600" />
                      </button>
                    )}

                    {canRevise(statement.status) && (
                      <button
                        onClick={() => onReviseStatement(statement)}
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                        title="Create Revision"
                      >
                        <FaEdit className="text-yellow-600" />
                      </button>
                    )}

                    {canDelete(statement.status) && (
                      <button
                        onClick={() => onDeleteStatement(statement)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="text-red-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatementsTable;
