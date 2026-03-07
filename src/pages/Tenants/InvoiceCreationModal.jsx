import React, { useEffect, useState } from "react";
import { FaX, FaFileInvoice, FaCheck } from "react-icons/fa6";

const InvoiceCreationModal = ({ isOpen, periods = [], onConfirm, onCancel }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [billingMode, setBillingMode] = useState("combined");

  useEffect(() => {
    if (isOpen) {
      setBillingMode("combined");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get tenant and property names from first period
  const tenantName = periods.length > 0 ? periods[0].tenantName : "N/A";
  const propertyName = periods.length > 0 ? periods[0].propertyName : "N/A";
  const totalAmount = periods.reduce((sum, period) => sum + (period.rent + (period.utility || 0)), 0);

  const handleConfirm = async () => {
    setIsCreating(true);
    try {
      await onConfirm(billingMode);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <FaFileInvoice className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Create Invoices</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isCreating}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <FaX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Tenant and Property Info */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="text-gray-600">
              <span className="font-semibold">Tenant:</span> {tenantName}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Property:</span> {propertyName}
            </p>
          </div>

          {/* Periods List */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Selected Periods ({periods.length})</p>
            <div className="space-y-2">
              {periods.map((period, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{period.description}</p>
                    <p className="text-gray-600">{period.from} to {period.to}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      KES {(period.rent + (period.utility || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-900">Total Amount:</span>
              <span className="font-bold text-lg text-blue-900">KES {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-amber-900 mb-2">Invoice Billing Mode</p>
            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="billingMode"
                  checked={billingMode === "combined"}
                  onChange={() => setBillingMode("combined")}
                  disabled={isCreating}
                />
                <span>
                  <strong>Combined</strong>: one invoice per period with Rent + Utility (if any).
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="billingMode"
                  checked={billingMode === "separate"}
                  onChange={() => setBillingMode("separate")}
                  disabled={isCreating}
                />
                <span>
                  <strong>Separate</strong>: one Rent invoice and one Utility invoice (if utility exists).
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            disabled={isCreating}
            className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isCreating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCheck size={14} />
            {isCreating ? "Creating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreationModal;
