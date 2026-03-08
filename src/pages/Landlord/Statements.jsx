import React, { useEffect, useState, useMemo } from "react";
import { FaPlus, FaFilter, FaSearch, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import StatementsTable from "../../components/Landlord/StatementsTable";
import StatementDetailView from "../../components/Landlord/StatementDetailView";
import GenerateStatementModal from "../../components/Modals/GenerateStatementModal";
import ApproveStatementModal from "../../components/Modals/ApproveStatementModal";
import CreateRevisionModal from "../../components/Modals/CreateRevisionModal";
import MilikConfirmDialog from "../../components/Modals/MilikConfirmDialog";

const MILIK_GREEN = "#0B3B2E";
const MILIK_ORANGE = "#FF8C00";

const MOCK_STATEMENTS = [
  // Mock data for demonstration
];

const Statements = () => {
  // State
  const [statements, setStatements] = useState(MOCK_STATEMENTS);
  const [properties, setProperties] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [selectedStatementLines, setSelectedStatementLines] = useState([]);
  const [view, setView] = useState("list"); // list or detail

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSendConfirm, setShowSendConfirm] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    landlordId: "",
    propertyId: "",
    searchText: "",
  });

  // Load mock data on mount
  useEffect(() => {
    // In production, these would be API calls
    // loadStatements();
    // loadProperties();
    // loadLandlords();
  }, []);

  const filteredStatements = useMemo(() => {
    let filtered = statements;

    if (filters.status !== "all") {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    if (filters.landlordId) {
      filtered = filtered.filter((s) => s.landlord?._id === filters.landlordId);
    }

    if (filters.propertyId) {
      filtered = filtered.filter((s) => s.property?._id === filters.propertyId);
    }

    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.statementNumber?.toLowerCase().includes(search) ||
          s.property?.name?.toLowerCase().includes(search) ||
          `${s.landlord?.firstName} ${s.landlord?.lastName}`
            .toLowerCase()
            .includes(search)
      );
    }

    return filtered;
  }, [statements, filters]);

  // Handlers
  const handleGenerateDraft = async (formData) => {
    setLoading(true);
    try {
      // API call would go here
      // const result = await dispatch(createDraftStatement(formData));
      toast.success("Draft statement generated successfully");
      // setStatements([...statements, result]);
      setShowGenerateModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to generate statement");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStatement = async (statementId, approvalNotes) => {
    setLoading(true);
    try {
      // API call would go here
      // const result = await dispatch(approveStatement(statementId, approvalNotes));
      toast.success("Statement approved successfully");
      // Update local state
      setStatements(
        statements.map((s) =>
          s._id === statementId ? { ...s, status: "approved" } : s
        )
      );
      setShowApproveModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to approve statement");
    } finally {
      setLoading(false);
    }
  };

  const handleSendStatement = async (statement) => {
    setLoading(true);
    try {
      // API call would go here
      // const result = await dispatch(sendStatement(statement._id));
      toast.success("Statement sent successfully");
      setStatements(
        statements.map((s) =>
          s._id === statement._id ? { ...s, status: "sent" } : s
        )
      );
      setShowSendConfirm(null);
    } catch (error) {
      toast.error(error.message || "Failed to send statement");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRevision = async (statementId, revisionReason) => {
    setLoading(true);
    try {
      // API call would go here
      // const result = await dispatch(createStatementRevision(statementId, revisionReason));
      toast.success("Revision created successfully");
      setShowRevisionModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to create revision");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStatement = async (statement) => {
    setLoading(true);
    try {
      // API call would go here
      // await dispatch(deleteDraftStatement(statement._id));
      toast.success("Statement deleted successfully");
      setStatements(statements.filter((s) => s._id !== statement._id));
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete statement");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (statement) => {
    try {
      setLoading(true);
      // API call would go here
      // const pdfBuffer = await downloadStatementPdf(statement._id);
      // Create a blob and trigger download
      // const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `Statement_${statement.statementNumber}.pdf`;
      // a.click();
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStatement = async (statement) => {
    setSelectedStatement(statement);
    // In production, fetch lines from API
    // const result = await dispatch(getStatement(statement._id));
    setSelectedStatementLines(statement.lines || []);
    setView("detail");
  };

  if (view === "detail" && selectedStatement) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <StatementDetailView
            statement={selectedStatement}
            lines={selectedStatementLines}
            loading={loading}
            onBack={() => setView("list")}
            onApprove={(stmt) => {
              setSelectedStatement(stmt);
              setShowApproveModal(true);
            }}
            onSend={(stmt) => setShowSendConfirm(stmt)}
            onRevise={(stmt) => {
              setSelectedStatement(stmt);
              setShowRevisionModal(true);
            }}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Landlord Statements
            </h1>
            <p className="text-gray-600 mt-1">
              Manage immutable statement snapshots and revisions
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: MILIK_GREEN }}
          >
            <FaPlus /> Generate Statement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Statements",
              value: statements.length,
              color: MILIK_GREEN,
            },
            {
              label: "Drafts",
              value: statements.filter((s) => s.status === "draft").length,
              color: "#FCD34D",
            },
            {
              label: "Approved",
              value: statements.filter((s) => s.status === "approved").length,
              color: "#10B981",
            },
            {
              label: "Sent",
              value: statements.filter((s) => s.status === "sent").length,
              color: "#6366F1",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
            <FaFilter /> Filters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search statements..."
                value={filters.searchText}
                onChange={(e) =>
                  setFilters({ ...filters, searchText: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="sent">Sent</option>
              <option value="revised">Revised</option>
            </select>

            {/* Property Filter */}
            <select
              value={filters.propertyId}
              onChange={(e) =>
                setFilters({ ...filters, propertyId: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="">All Properties</option>
              {properties.map((prop) => (
                <option key={prop._id} value={prop._id}>
                  {prop.name}
                </option>
              ))}
            </select>

            {/* Landlord Filter */}
            <select
              value={filters.landlordId}
              onChange={(e) =>
                setFilters({ ...filters, landlordId: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="">All Landlords</option>
              {landlords.map((landlord) => (
                <option key={landlord._id} value={landlord._id}>
                  {landlord.firstName} {landlord.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statements Table */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <StatementsTable
            statements={filteredStatements}
            loading={loading}
            onViewStatement={handleViewStatement}
            onApproveStatement={(stmt) => {
              setSelectedStatement(stmt);
              setShowApproveModal(true);
            }}
            onSendStatement={(stmt) => setShowSendConfirm(stmt)}
            onReviseStatement={(stmt) => {
              setSelectedStatement(stmt);
              setShowRevisionModal(true);
            }}
            onDeleteStatement={(stmt) => setShowDeleteConfirm(stmt)}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>

        {/* Modals */}
        <GenerateStatementModal
          isOpen={showGenerateModal}
          properties={properties}
          landlords={landlords}
          onClose={() => setShowGenerateModal(false)}
          onGenerateDraft={handleGenerateDraft}
          loading={loading}
        />

        <ApproveStatementModal
          isOpen={showApproveModal}
          statement={selectedStatement}
          onClose={() => setShowApproveModal(false)}
          onApprove={handleApproveStatement}
          loading={loading}
        />

        <CreateRevisionModal
          isOpen={showRevisionModal}
          statement={selectedStatement}
          onClose={() => setShowRevisionModal(false)}
          onCreateRevision={handleCreateRevision}
          loading={loading}
        />

        <MilikConfirmDialog
          isOpen={!!showDeleteConfirm}
          title="Delete Draft Statement?"
          message={`Are you sure you want to delete draft statement ${showDeleteConfirm?.statementNumber}? This action cannot be undone.`}
          confirmText="Delete"
          confirmButtonColor="red"
          onConfirm={() => handleDeleteStatement(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
          loading={loading}
        />

        <MilikConfirmDialog
          isOpen={!!showSendConfirm}
          title="Send Statement?"
          message={`Send statement ${showSendConfirm?.statementNumber} to the landlord? This will mark it as sent.`}
          confirmText="Send"
          onConfirm={() => handleSendStatement(showSendConfirm)}
          onCancel={() => setShowSendConfirm(null)}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Statements;
