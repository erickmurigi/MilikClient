import React, { useState } from "react";
import { FaTimes, FaMoneyBillWave } from "react-icons/fa";

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3327]";

const PayLandlordModal = ({ statement, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split("T")[0],
    amount: statement?.netAmountDue || 0,
    paymentMethod: "Bank Transfer",
    referenceNumber: "",
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${MILIK_GREEN} text-white px-6 py-4 flex justify-between items-center rounded-t-lg`}>
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-xl" />
            <h2 className="text-xl font-bold">Pay Landlord</h2>
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
            <h3 className="font-semibold text-gray-800 mb-3">Statement Details</h3>
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
                <p className="text-gray-600">Net Amount Due</p>
                <p className="font-semibold text-green-700 text-lg">{formatCurrency(statement?.netAmountDue)}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Cash">Cash</option>
                  <option value="Mobile Money">Mobile Money (M-Pesa)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  placeholder="Transaction/Check number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                placeholder="Additional payment details or notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
                className={`px-6 py-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER} text-white rounded-lg transition font-semibold flex items-center gap-2`}
              >
                <FaMoneyBillWave /> Record Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayLandlordModal;
