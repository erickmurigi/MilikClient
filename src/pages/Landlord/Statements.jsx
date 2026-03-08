import React, { useEffect, useMemo, useState } from "react";
import { propertyBelongsToLandlord } from "./propertyUtils";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { FaPlus, FaFilter, FaSearch, FaHistory, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import StatementsTable from "../../components/Landlord/StatementsTable";
import StatementDetailView from "../../components/Landlord/StatementDetailView";
import GenerateStatementModal from "../../components/Modals/GenerateStatementModal";
import ApproveStatementModal from "../../components/Modals/ApproveStatementModal";
import CreateRevisionModal from "../../components/Modals/CreateRevisionModal";
import MilikConfirmDialog from "../../components/Modals/MilikConfirmDialog";
import {
  getStatements,
  getStatement,
  createDraftStatement,
  approveStatement,
  sendStatement,
  createStatementRevision,
  deleteDraftStatement,
  downloadStatementPdf,
  validateStatementAudit,
  getLandlords,
} from "../../redux/apiCalls";
import { getProperties } from "../../redux/propertyRedux";

const MILIK_GREEN = "#0B3B2E";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
};

const getLandlordDisplayName = (landlord) => {
  const fullName = `${landlord?.firstName || ""} ${landlord?.lastName || ""}`.trim();
  return fullName || landlord?.landlordName || landlord?.name || "Unnamed Landlord";
};


const getMonthOptions = () => [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 3; y <= currentYear + 1; y += 1) {
    years.push(String(y));
  }
  return years;
};

const buildPeriodFromMonthYear = (month, year) => {
  const m = Number(month);
  const y = Number(year);
  if (!m || !y) return { periodStart: "", periodEnd: "" };

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);

  const toISODate = (d) => d.toISOString().slice(0, 10);
  return {
    periodStart: toISODate(start),
    periodEnd: toISODate(end),
  };
};

const Statements = ({ legacyEntry = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isPrimaryLegacyRoute = legacyEntry || location.pathname === "/financial/landlord-statement";

  const statementsState = useSelector((state) => state.statements);
  const statements = statementsState?.statements || [];
  const selectedReduxStatement = statementsState?.selectedStatement;
  const statementLines = statementsState?.statementLines || [];
  const statementsLoading = statementsState?.loading || false;

  const propertiesState = useSelector((state) => state.property);
  const properties = propertiesState?.properties || [];
  const propertyLoading = propertiesState?.loading || false;

  const landlordState = useSelector((state) => state.landlord);
  const landlords = landlordState?.landlords || [];
  const landlordLoading = landlordState?.isFetching || false;

  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const businessId = currentCompany?._id;

  const [loading, setLoading] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [view, setView] = useState("list");
  const [auditInfo, setAuditInfo] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSendConfirm, setShowSendConfirm] = useState(null);

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    landlordId: searchParams.get("landlordId") || "",
    propertyId: searchParams.get("propertyId") || "",
    searchText: "",
  });

  const [legacyDraftForm, setLegacyDraftForm] = useState({
    landlordId: searchParams.get("landlordId") || "",
    propertyId: searchParams.get("propertyId") || "",
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    statementType: "provisional",
  });

  useEffect(() => {
    if (!businessId) return;
    dispatch(getProperties({ business: businessId }));
    dispatch(getLandlords({ company: businessId }));
  }, [dispatch, businessId]);

  useEffect(() => {
    if (!businessId) return;

    const filterParams = {};
    if (filters.status !== "all") filterParams.status = filters.status;
    if (filters.landlordId) filterParams.landlordId = filters.landlordId;
    if (filters.propertyId) filterParams.propertyId = filters.propertyId;

    dispatch(getStatements(filterParams)).catch((err) => {
      console.error("Failed to load statements:", err);
    });
  }, [dispatch, businessId, filters.status, filters.landlordId, filters.propertyId]);

  const legacyPropertyOptions = useMemo(() => {
    if (!legacyDraftForm.landlordId) return [];
    const selectedLandlord = landlords.find(l => l._id === legacyDraftForm.landlordId);
    return properties.filter((property) => propertyBelongsToLandlord(
      property,
      legacyDraftForm.landlordId,
      selectedLandlord?.landlordName
    ));
  }, [properties, legacyDraftForm.landlordId, landlords]);

  useEffect(() => {
    if (!isPrimaryLegacyRoute) return;

    if (landlords.length === 1 && !legacyDraftForm.landlordId) {
      const landlordId = landlords[0]._id;
      setLegacyDraftForm((prev) => ({ ...prev, landlordId }));
      setFilters((prev) => ({ ...prev, landlordId, propertyId: "" }));
    }
  }, [isPrimaryLegacyRoute, landlords, legacyDraftForm.landlordId]);

  useEffect(() => {
    if (!isPrimaryLegacyRoute) return;
    if (!legacyDraftForm.landlordId || legacyDraftForm.propertyId) return;
    if (legacyPropertyOptions.length === 1) {
      const propertyId = legacyPropertyOptions[0]._id;
      setLegacyDraftForm((prev) => ({ ...prev, propertyId }));
      setFilters((prev) => ({ ...prev, propertyId }));
    }
  }, [isPrimaryLegacyRoute, legacyDraftForm.landlordId, legacyDraftForm.propertyId, legacyPropertyOptions]);

  const propertyById = useMemo(() => {
    const map = new Map();
    properties.forEach((property) => map.set(normalizeId(property?._id), property));
    return map;
  }, [properties]);

  const landlordById = useMemo(() => {
    const map = new Map();
    landlords.forEach((landlord) => map.set(normalizeId(landlord?._id), landlord));
    return map;
  }, [landlords]);

  const enrichedStatements = useMemo(() => {
    return statements.map((statement) => {
      const propertyId = normalizeId(statement?.property?._id || statement?.property);
      const landlordId = normalizeId(statement?.landlord?._id || statement?.landlord);
      return {
        ...statement,
        property: statement?.property?.propertyName || statement?.property?.name ? statement.property : propertyById.get(propertyId) || statement.property,
        landlord:
          statement?.landlord?.firstName || statement?.landlord?.lastName
            ? statement.landlord
            : landlordById.get(landlordId) || statement.landlord,
      };
    });
  }, [statements, propertyById, landlordById]);

  const filteredStatements = useMemo(() => {
    let filtered = enrichedStatements;

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
      filtered = filtered.filter((s) => {
        const propertyName = s.property?.propertyName || s.property?.name || "";
        const landlordName = `${s.landlord?.firstName || ""} ${s.landlord?.lastName || ""}`.trim();
        return (
          s.statementNumber?.toLowerCase().includes(search) ||
          propertyName.toLowerCase().includes(search) ||
          landlordName.toLowerCase().includes(search)
        );
      });
    }

    return filtered;
  }, [enrichedStatements, filters]);

  const recentStatements = useMemo(() => {
    if (showAllHistory) return filteredStatements;
    return filteredStatements.slice(0, 6);
  }, [filteredStatements, showAllHistory]);

  const reloadStatements = () => {
    const filterParams = {};
    if (filters.status !== "all") filterParams.status = filters.status;
    if (filters.landlordId) filterParams.landlordId = filters.landlordId;
    if (filters.propertyId) filterParams.propertyId = filters.propertyId;
    return dispatch(getStatements(filterParams));
  };

  const handleGenerateDraft = async (formData) => {
    setLoading(true);
    try {
      const createdStatement = await dispatch(createDraftStatement(formData));
      toast.success("Draft statement generated. Opening preview...");
      setShowGenerateModal(false);
      await reloadStatements();
      if (createdStatement?._id) {
        await handleViewStatement(createdStatement);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to generate statement");
    } finally {
      setLoading(false);
    }
  };

  const handleLegacyGenerate = async () => {
    const { landlordId, propertyId, month, year, statementType } = legacyDraftForm;
    if (!landlordId || !propertyId || !month || !year) {
      toast.error("Please select landlord, property, month and year");
      return;
    }

    const { periodStart, periodEnd } = buildPeriodFromMonthYear(month, year);
    const typeLabel = statementType === "final" ? "Final" : "Provisional";
    const notes = `[Statement Type: ${typeLabel}] Generated from Commission & L.L Statements quick flow for ${month}/${year}.`;

    setLoading(true);
    try {
      const createdStatement = await dispatch(
        createDraftStatement({
          landlordId,
          propertyId,
          periodStart,
          periodEnd,
          notes,
          statementType,
        })
      );

      setFilters((prev) => ({
        ...prev,
        landlordId,
        propertyId,
        status: "draft",
      }));

      await dispatch(getStatements({ landlordId, propertyId, status: "draft" }));
      toast.success(`${typeLabel} statement generated. Opening preview...`);
      if (createdStatement?._id) {
        await handleViewStatement(createdStatement);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to generate statement");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStatement = async (statementId, approvalNotes) => {
    setLoading(true);
    try {
      await dispatch(approveStatement(statementId, approvalNotes));
      toast.success("Statement approved successfully");
      setShowApproveModal(false);
      await reloadStatements();
      if (view === "detail") setView("list");
      // Navigate to Processed Statements page
      navigate("/landlord/processed-statements");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to approve statement");
    } finally {
      setLoading(false);
    }
  };

  const handleSendStatement = async (statement) => {
    setLoading(true);
    try {
      await dispatch(sendStatement(statement._id));
      toast.success("Statement sent successfully");
      setShowSendConfirm(null);
      await reloadStatements();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to send statement");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRevision = async (statementId, revisionReason) => {
    setLoading(true);
    try {
      await dispatch(createStatementRevision(statementId, revisionReason));
      toast.success("Revision created successfully");
      setShowRevisionModal(false);
      setView("list");
      await reloadStatements();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to create revision");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStatement = async (statement) => {
    setLoading(true);
    try {
      await dispatch(deleteDraftStatement(statement._id));
      toast.success("Statement deleted successfully");
      setShowDeleteConfirm(null);
      await reloadStatements();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to delete statement");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (statement) => {
    setLoading(true);
    try {
      await downloadStatementPdf(statement._id);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateStatement = async (statement) => {
    setLoading(true);
    try {
      const result = await dispatch(validateStatementAudit(statement._id));
      setAuditInfo(result);
      toast.success(result?.valid ? "Statement audit passed" : "Statement audit has mismatches");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to validate statement");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStatement = async (statement) => {
    setSelectedStatement(statement);
    setAuditInfo(null);
    setLoading(true);
    try {
      await dispatch(getStatement(statement._id));
      setView("detail");
    } catch (error) {
      toast.error("Failed to load statement details");
    } finally {
      setLoading(false);
    }
  };

  if (view === "detail" && selectedStatement) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <StatementDetailView
            statement={selectedReduxStatement || selectedStatement}
            lines={statementLines}
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
            onValidate={handleValidateStatement}
            auditInfo={auditInfo}
            company={currentCompany}
          />
        </div>
      </DashboardLayout>
    );
  }

  const title = isPrimaryLegacyRoute ? "Commission & Landlord Statements" : "Landlord Statements";
  const subtitle = isPrimaryLegacyRoute
    ? "Use the familiar workflow to generate, review, approve and send landlord statements"
    : "Manage immutable statement snapshots and revisions";

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: MILIK_GREEN }}
          >
            <FaPlus /> Generate & Preview Statement
          </button>
        </div>

        {isPrimaryLegacyRoute && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
              <FaCalendarAlt /> Commission & L.L Quick Generate
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={legacyDraftForm.landlordId}
                onChange={(e) => {
                  const landlordId = e.target.value;
                  setLegacyDraftForm({ ...legacyDraftForm, landlordId, propertyId: "" });
                  setFilters((prev) => ({ ...prev, landlordId, propertyId: "" }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                disabled={landlordLoading || loading}
              >
                <option value="">{landlordLoading ? "Loading landlords..." : "Select Landlord"}</option>
                {landlords.map((landlord) => (
                  <option key={landlord._id} value={landlord._id}>
                    {getLandlordDisplayName(landlord)}
                  </option>
                ))}
              </select>

              <select
                value={legacyDraftForm.propertyId}
                onChange={(e) => {
                  const propertyId = e.target.value;
                  setLegacyDraftForm({ ...legacyDraftForm, propertyId });
                  setFilters((prev) => ({ ...prev, propertyId }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                disabled={!legacyDraftForm.landlordId || propertyLoading || loading}
              >
                <option value="">
                  {!legacyDraftForm.landlordId
                    ? "Select landlord first"
                    : propertyLoading
                    ? "Loading properties..."
                    : "Select Property"}
                </option>
                {legacyPropertyOptions.map((prop) => (
                  <option key={prop._id} value={prop._id}>
                    {prop.propertyName || prop.name || "Unnamed Property"}
                  </option>
                ))}
              </select>

              <select
                value={legacyDraftForm.month}
                onChange={(e) => setLegacyDraftForm({ ...legacyDraftForm, month: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                disabled={loading}
              >
                {getMonthOptions().map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>

              <select
                value={legacyDraftForm.year}
                onChange={(e) => setLegacyDraftForm({ ...legacyDraftForm, year: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                disabled={loading}
              >
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={legacyDraftForm.statementType}
                onChange={(e) => setLegacyDraftForm({ ...legacyDraftForm, statementType: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                disabled={loading}
              >
                <option value="provisional">Provisional</option>
                <option value="final">Final</option>
              </select>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Provisional/Final remains visible for business familiarity. In the current backend, the selected type is saved in statement notes/metadata for audit context.
            </p>
            <div className="mt-4">
              <button
                onClick={handleLegacyGenerate}
                className="px-4 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: MILIK_GREEN }}
                disabled={loading || !legacyDraftForm.landlordId || !legacyDraftForm.propertyId}
              >
                {loading ? "Generating..." : "Generate & Preview Statement"}
              </button>
            </div>
          </div>
        )}

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-900 font-medium">
            Workflow: Generate statement - Review full advice - Confirm figures - Print/PDF - Approve - Send.
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <FaFilter /> Filters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search statements..."
                value={filters.searchText}
                onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="sent">Sent</option>
              <option value="revised">Revised</option>
            </select>

            <select
              value={filters.propertyId}
              onChange={(e) => setFilters({ ...filters, propertyId: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">All Properties</option>
              {properties.map((prop) => (
                <option key={prop._id} value={prop._id}>
                  {prop.propertyName || prop.name || "Unnamed Property"}
                </option>
              ))}
            </select>

            <select
              value={filters.landlordId}
              onChange={(e) => setFilters({ ...filters, landlordId: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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

        <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <FaHistory /> Recent Statement History
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Locked after approval</span>
            <button
              onClick={() => setShowAllHistory((prev) => !prev)}
              className="text-sm font-semibold"
              style={{ color: MILIK_GREEN }}
            >
              {showAllHistory ? "Show Recent Only" : "Show Full History"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <StatementsTable
            statements={recentStatements}
            loading={statementsLoading || loading}
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
