import React, { useEffect, useMemo, useState } from "react";
import { FaBook, FaSearch, FaLayerGroup, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getRentPayments } from "../../redux/apiCalls";

const CUSTOM_ACCOUNTS_STORAGE_KEY = "milik_custom_coa_accounts";

const ACCOUNT_GROUPS = [
  {
    key: "assets",
    label: "Assets",
    color: "bg-emerald-50 border-emerald-200",
    tag: "text-emerald-700 bg-emerald-100",
    accounts: [
      { code: "1100", name: "Cash on Hand", type: "Current Asset", isSystem: true, isPosting: true },
      { code: "1110", name: "Bank Accounts", type: "Current Asset", isSystem: true, isPosting: true },
      { code: "1130", name: "M-Pesa Collections", type: "Current Asset", isSystem: true, isPosting: true },
      { code: "1200", name: "Tenant Receivables", type: "Current Asset", isSystem: true, isPosting: true },
      {
        code: "1210",
        name: "Landlord Advances Recoverable",
        type: "Current Asset",
        isSystem: true,
        isPosting: true,
      },
      { code: "1220", name: "Utility Recoverables", type: "Current Asset", isSystem: true, isPosting: true },
      { code: "1230", name: "Deposit Held", type: "Current Asset", isSystem: true, isPosting: true },
    ],
  },
  {
    key: "liabilities",
    label: "Liabilities",
    color: "bg-rose-50 border-rose-200",
    tag: "text-rose-700 bg-rose-100",
    accounts: [
      { code: "2100", name: "Security Deposits Payable", type: "Current Liability", isSystem: true, isPosting: true },
      { code: "2110", name: "Landlord Payables", type: "Current Liability", isSystem: true, isPosting: true },
      { code: "2120", name: "Accrued Expenses", type: "Current Liability", isSystem: true, isPosting: true },
      { code: "2130", name: "Unallocated Receipts", type: "Current Liability", isSystem: true, isPosting: true },
      { code: "2140", name: "Tax Payables", type: "Current Liability", isSystem: true, isPosting: true },
    ],
  },
  {
    key: "equity",
    label: "Equity",
    color: "bg-violet-50 border-violet-200",
    tag: "text-violet-700 bg-violet-100",
    accounts: [
      { code: "3100", name: "Owner's Equity", type: "Equity", isSystem: true, isPosting: true },
      { code: "3200", name: "Retained Earnings", type: "Equity", isSystem: true, isPosting: true },
    ],
  },
  {
    key: "income",
    label: "Income",
    color: "bg-blue-50 border-blue-200",
    tag: "text-blue-700 bg-blue-100",
    accounts: [
      { code: "4100", name: "Rent Income", type: "Operating Income", isSystem: true, isPosting: true },
      { code: "4101", name: "Service Charge Income", type: "Operating Income", isSystem: true, isPosting: true },
      { code: "4102", name: "Utility Recharge Income", type: "Operating Income", isSystem: true, isPosting: true },
      {
        code: "4103",
        name: "Penalty / Late Fee Income",
        type: "Operating Income",
        isSystem: true,
        isPosting: true,
      },
      { code: "4200", name: "Management Fee Income", type: "Operating Income", isSystem: true, isPosting: true },
      { code: "4210", name: "Commission Income", type: "Operating Income", isSystem: true, isPosting: true },
      { code: "4300", name: "Other Property Income", type: "Other Income", isSystem: true, isPosting: true },
    ],
  },
  {
    key: "expenses",
    label: "Expenses",
    color: "bg-amber-50 border-amber-200",
    tag: "text-amber-700 bg-amber-100",
    accounts: [
      { code: "5100", name: "Maintenance Expense", type: "Operating Expense", isSystem: true, isPosting: true },
      { code: "5101", name: "Repairs Expense", type: "Operating Expense", isSystem: true, isPosting: true },
      { code: "5102", name: "Cleaning Expense", type: "Operating Expense", isSystem: true, isPosting: true },
      { code: "5103", name: "Security Expense", type: "Operating Expense", isSystem: true, isPosting: true },
      { code: "5104", name: "Utility Expense", type: "Operating Expense", isSystem: true, isPosting: true },
      { code: "5200", name: "Management Expense", type: "Operating Expense", isSystem: true, isPosting: true },
      { code: "5201", name: "Bank Charges", type: "Operating Expense", isSystem: true, isPosting: true },
      { code: "5202", name: "Legal / Compliance Expense", type: "Operating Expense", isSystem: true, isPosting: true },
    ],
  },
];

const blankForm = {
  code: "",
  name: "",
  type: "",
  group: "assets",
  isPosting: true,
};

const ChartOfAccounts = () => {
  const dispatch = useDispatch();
  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const rentPayments = useSelector((state) => state.rentPayment?.rentPayments || []);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState(blankForm);
  const [customAccounts, setCustomAccounts] = useState([]);

  useEffect(() => {
    if (!currentCompany?._id) return;
    getRentPayments(dispatch, currentCompany._id);
  }, [dispatch, currentCompany?._id]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_ACCOUNTS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const byCompany = Array.isArray(parsed?.[currentCompany?._id]) ? parsed[currentCompany._id] : [];
      setCustomAccounts(byCompany);
    } catch (error) {
      console.error("Failed to load custom accounts", error);
      setCustomAccounts([]);
    }
  }, [currentCompany?._id]);

  const persistCustomAccounts = (next) => {
    try {
      const raw = localStorage.getItem(CUSTOM_ACCOUNTS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[currentCompany?._id || "default"] = next;
      localStorage.setItem(CUSTOM_ACCOUNTS_STORAGE_KEY, JSON.stringify(parsed));
      setCustomAccounts(next);
    } catch (error) {
      console.error("Failed to save custom accounts", error);
      toast.error("Failed to save chart account changes");
    }
  };

  const cashbookAccounts = useMemo(() => {
    const confirmedManagerReceipts = (rentPayments || []).filter((payment) => {
      if (!payment?.isConfirmed) return false;
      if (String(payment?.ledgerType || "receipts").toLowerCase() === "invoices") return false;
      return !payment?.paidDirectToLandlord;
    });

    const names = Array.from(
      new Set(confirmedManagerReceipts.map((payment) => String(payment?.cashbook || "").trim()).filter(Boolean))
    );

    return names.map((name, index) => ({
      code: `11CB${String(index + 1).padStart(2, "0")}`,
      name: `${name}`,
      type: "Current Asset",
      isSystem: true,
      isPosting: true,
      source: "cashbook",
      cashbookName: name,
      group: "assets",
    }));
  }, [rentPayments]);

  const accountBalances = useMemo(() => {
    const balances = {
      "1100": 0,
      "1110": 0,
      "1130": 0,
      "1200": 0,
      "4100": 0,
      "4102": 0,
    };

    const cashbookCodeByName = {};
    cashbookAccounts.forEach((account) => {
      cashbookCodeByName[account.cashbookName] = account.code;
      balances[account.code] = 0;
    });

    const resolveBaseCashbookCode = (cashbook) => {
      const value = String(cashbook || "").toLowerCase();
      if (value.includes("bank")) return "1110";
      if (value.includes("m-pesa") || value.includes("mpesa") || value.includes("mobile")) return "1130";
      if (value.includes("cash")) return "1100";
      return "1110";
    };

    (rentPayments || []).forEach((payment) => {
      const amount = Number(payment?.amount || 0);
      if (!amount) return;

      const ledgerType = String(payment?.ledgerType || "receipts").toLowerCase();
      const paymentType = String(payment?.paymentType || "").toLowerCase();

      if (ledgerType === "invoices") {
        balances["1200"] += amount;
        if (paymentType === "utility") {
          balances["4102"] += amount;
        } else {
          balances["4100"] += amount;
        }
        return;
      }

      if (payment?.isConfirmed && !payment?.paidDirectToLandlord) {
        const cashbookName = String(payment?.cashbook || "").trim();
        const dynamicCashbookCode = cashbookCodeByName[cashbookName];
        const baseCode = resolveBaseCashbookCode(cashbookName);

        if (dynamicCashbookCode) {
          balances[dynamicCashbookCode] += amount;
        }
        balances[baseCode] += amount;
        balances["1200"] -= amount;
      }
    });

    return balances;
  }, [cashbookAccounts, rentPayments]);

  const groupedAccounts = useMemo(() => {
    const customByGroup = customAccounts.reduce((acc, account) => {
      const groupKey = account.group || "assets";
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push({ ...account, isSystem: false });
      return acc;
    }, {});

    return ACCOUNT_GROUPS.map((group) => {
      const baseAccounts = group.accounts;
      const dynamicCashbookForGroup = group.key === "assets" ? cashbookAccounts : [];
      const customForGroup = customByGroup[group.key] || [];

      return {
        ...group,
        accounts: [...baseAccounts, ...dynamicCashbookForGroup, ...customForGroup],
      };
    });
  }, [cashbookAccounts, customAccounts]);

  const normalized = search.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!normalized) return groupedAccounts;

    return groupedAccounts
      .map((group) => ({
        ...group,
        accounts: group.accounts.filter((account) => {
          const hay = `${account.code} ${account.name} ${account.type} ${group.label}`.toLowerCase();
          return hay.includes(normalized);
        }),
      }))
      .filter((group) => group.accounts.length > 0);
  }, [groupedAccounts, normalized]);

  const totalAccounts = groupedAccounts.reduce((sum, group) => sum + group.accounts.length, 0);

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const openAddForm = () => {
    setEditingCode(null);
    setFormData(blankForm);
    setShowForm(true);
  };

  const openEditForm = (account) => {
    setEditingCode(account.code);
    setFormData({
      code: account.code,
      name: account.name,
      type: account.type,
      group: account.group || "assets",
      isPosting: account.isPosting !== false,
    });
    setShowForm(true);
  };

  const handleSaveAccount = () => {
    const code = String(formData.code || "").trim();
    const name = String(formData.name || "").trim();
    const type = String(formData.type || "").trim();
    const group = String(formData.group || "assets");

    if (!code || !name || !type || !group) {
      toast.error("Code, account name, class, and group are required.");
      return;
    }

    const systemCodes = new Set(groupedAccounts.flatMap((groupItem) => groupItem.accounts.map((a) => a.code)));
    const codeExists = systemCodes.has(code) && code !== editingCode;
    if (codeExists) {
      toast.error("Account code already exists. Use a unique code.");
      return;
    }

    const payload = {
      code,
      name,
      type,
      group,
      isPosting: formData.isPosting !== false,
      createdAt: new Date().toISOString(),
    };

    let next = [];
    if (editingCode) {
      next = customAccounts.map((account) => (account.code === editingCode ? payload : account));
      toast.success("Posting account updated");
    } else {
      next = [...customAccounts, payload];
      toast.success("Posting account added");
    }

    persistCustomAccounts(next);
    setShowForm(false);
    setEditingCode(null);
    setFormData(blankForm);
  };

  const handleDeleteAccount = (accountCode) => {
    const next = customAccounts.filter((account) => account.code !== accountCode);
    persistCustomAccounts(next);
    toast.success("Posting account removed");
  };

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FaBook className="text-[#0B3B2E]" /> Chart of Accounts
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Property-management chart with live receipt/invoice balances and cashbook-aware posting accounts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-700 font-semibold">
                  Total Accounts: <span className="text-[#0B3B2E]">{totalAccounts}</span>
                </div>
                <button
                  onClick={openAddForm}
                  className="px-3 py-2 text-sm rounded-lg font-semibold text-white bg-[#0B3B2E] hover:bg-[#082d24] flex items-center gap-2"
                >
                  <FaPlus /> Add Posting Account
                </button>
              </div>
            </div>

            <div className="mt-4 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-[420px] pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Search account code, name, class, or group"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredGroups.map((group) => (
              <section key={group.key} className={`border rounded-xl ${group.color} overflow-hidden`}>
                <div className="px-4 py-3 bg-white/60 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FaLayerGroup className="text-slate-600" />
                    {group.label}
                  </h2>
                  <span className={`px-2 py-1 rounded text-[11px] font-semibold ${group.tag}`}>
                    {group.accounts.length} accounts
                  </span>
                </div>

                <div className="overflow-x-auto bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0B3B2E] text-white">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold">Code</th>
                        <th className="text-left px-3 py-2 font-semibold">Account Name</th>
                        <th className="text-left px-3 py-2 font-semibold">Class</th>
                        <th className="text-right px-3 py-2 font-semibold">Balance</th>
                        <th className="text-right px-3 py-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.accounts.map((account, idx) => (
                        <tr key={`${group.key}-${account.code}-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="px-3 py-2 font-mono text-slate-800">{account.code}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{account.name}</span>
                              {account.source === "cashbook" && (
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                                  Cashbook
                                </span>
                              )}
                              {account.isPosting && (
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                  Posting
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-slate-600">{account.type}</td>
                          <td className="px-3 py-2 text-right font-mono text-slate-900">
                            {formatMoney(accountBalances[account.code] || 0)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {account.isSystem ? (
                              <span className="text-[11px] text-slate-400">System</span>
                            ) : (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => openEditForm(account)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit account"
                                >
                                  <FaEdit size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteAccount(account.code)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete account"
                                >
                                  <FaTrash size={13} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              No accounts found for your search.
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[120] bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCode ? "Edit Posting Account" : "Add Posting Account"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Posting accounts support compact journal and ledger drill-downs.</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-slate-700">
                  Account Code
                  <input
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded border border-slate-300"
                    placeholder="e.g. 1115"
                    disabled={Boolean(editingCode)}
                  />
                </label>

                <label className="text-sm text-slate-700">
                  Group
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData((prev) => ({ ...prev, group: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded border border-slate-300"
                  >
                    <option value="assets">Assets</option>
                    <option value="liabilities">Liabilities</option>
                    <option value="equity">Equity</option>
                    <option value="income">Income</option>
                    <option value="expenses">Expenses</option>
                  </select>
                </label>
              </div>

              <label className="text-sm text-slate-700 block">
                Account Name
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded border border-slate-300"
                  placeholder="e.g. Agency Float Collections"
                />
              </label>

              <label className="text-sm text-slate-700 block">
                Class
                <input
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 rounded border border-slate-300"
                  placeholder="e.g. Current Asset"
                />
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isPosting !== false}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPosting: e.target.checked }))}
                />
                Posting Account
              </label>
            </div>

            <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCode(null);
                  setFormData(blankForm);
                }}
                className="px-3 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAccount}
                className="px-3 py-2 rounded bg-[#0B3B2E] text-white hover:bg-[#082d24]"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ChartOfAccounts;
