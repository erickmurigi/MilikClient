import React, { useState } from "react";
import { FaTimes, FaReceipt } from "react-icons/fa";

const MILIK_ORANGE = "bg-[#FF8C00]";
const MILIK_ORANGE_HOVER = "hover:bg-[#E67E00]";

const PostCommissionModal = ({ statement, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    postingDate: new Date().toISOString().split("T")[0],
    amount: statement?.commissionAmount || 0,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCurrency = (value) => {
    if (!value) return "KES 0.00";
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(value);
  };

  const getCommissionBasisLabel = (basis) => {
    const labels = {
      received: "Cash (Received)",
      invoiced: "Accrual (Invoiced)",
      received_manager_only: "Manager Receipts Only",
    };
    return labels[basis] || basis || "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${MILIK_ORANGE} text-white px-6 py-4 flex justify-between items-center rounded-t-lg`}>
          <div className="flex items-center gap-2">
            <FaReceipt className="text-xl" />
            <h2 className="text-xl font-bold">Post Commission</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Statement Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Commission Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Landlord</p>
                <p className="font-semibold">{statement?.landlord?.landlordName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Property</p>
                <p className="font-semibold">{statement?.property?.propertyName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Period</p>
                <p className="font-semibold">
                  {new Date(statement?.periodStart).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Commission Rate</p>
                <p className="font-semibold">{statement?.commissionPercentage || 0}%</p>
              </div>
              <div>
                <p className="text-gray-600">Recognition Basis</p>
                <p className="font-semibold">{getCommissionBasisLabel(statement?.commissionBasis)}</p>
              </div>
              <div>
                <p className="text-gray-600">Commission Amount</p>
                <p className="font-semibold text-orange-600 text-lg">{formatCurrency(statement?.commissionAmount)}</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> This will create a journal entry posting commission income to your books. 
              Ensure the commission amount is correct before proceeding.
            </p>
          </div>

          {/* Commission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Posting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="postingDate"
                  value={formData.postingDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (KES) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Additional notes about this commission posting..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 ${MILIK_ORANGE} ${MILIK_ORANGE_HOVER} text-white rounded-lg transition font-semibold flex items-center gap-2`}
              >
                <FaReceipt /> Post Commission
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCommissionModal;
