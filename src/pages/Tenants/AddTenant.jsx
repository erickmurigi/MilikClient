// pages/Tenants/AddTenant.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { FaSave, FaTimes, FaChevronDown, FaSpinner, FaCalculator, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
// TODO: Import tenant Redux actions when available
// import { createTenant } from "../../redux/tenantsRedux";
import { getProperties } from "../../redux/propertyRedux";
import { getUnits } from "../../redux/unitRedux";
import { createTenant } from "../../redux/tenantsRedux";

// Milik theme constants
const MILIK_GREEN_BG = "bg-[#0B3B2E]";
const MILIK_GREEN_BG_HOVER = "hover:bg-[#0A3127]";
const MILIK_ORANGE_BG = "bg-[#FF8C00]";
const MILIK_ORANGE_BG_HOVER = "hover:bg-[#e67e00]";
const MILIK_ORANGE_RING = "focus:ring-orange-500/30";
const MILIK_ORANGE_BORDER_FOCUS = "focus:border-orange-600";

/**
 * Custom dropdown with Milik styling
 */
function MilikSelect({
  label,
  required,
  placeholder = "Select...",
  items = [],
  value,
  onChange,
  getLabel,
  getValue,
  disabled,
  error,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const selectedItem = useMemo(
    () => items.find((it) => getValue(it) === value) || null,
    [items, value, getValue]
  );

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`${className} relative`} ref={wrapRef}>
      {label ? (
        <label className="block text-sm font-bold text-slate-800 mb-1 tracking-tight">
          {label} {required ? "*" : ""}
        </label>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={[
          "w-full h-10 px-3 rounded-md bg-white text-slate-900 shadow-sm border",
          error ? "border-red-500" : "border-slate-300",
          "transition-all duration-200 ease-out hover:border-slate-400",
          `focus:outline-none focus:ring-2 ${MILIK_ORANGE_RING} ${MILIK_ORANGE_BORDER_FOCUS}`,
          "flex items-center justify-between gap-2",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <span className="text-sm font-semibold truncate">
          {selectedItem ? getLabel(selectedItem) : <span className="text-slate-400">{placeholder}</span>}
        </span>
        <FaChevronDown className="text-slate-600" />
      </button>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="max-h-56 overflow-auto">
            {items.length === 0 ? (
              <div className="px-3 py-3 text-sm text-slate-500">No items available</div>
            ) : (
              items.map((it) => {
                const v = getValue(it);
                const isSelected = v === value;
                return (
                  <button
                    type="button"
                    key={v}
                    onClick={() => {
                      onChange?.(v, it);
                      setOpen(false);
                    }}
                    className={[
                      "w-full text-left px-3 py-2 text-sm font-semibold transition-colors",
                      isSelected
                        ? `${MILIK_ORANGE_BG} text-white`
                        : "text-slate-800 hover:bg-orange-50",
                    ].join(" ")}
                  >
                    {getLabel(it)}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const AddTenant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentCompany } = useSelector((state) => state.company);
  const { isFetching: loading } = useSelector((state) => state.tenant || { isFetching: false });
  const properties = useSelector((state) => state.property?.properties || []);
  const units = useSelector((state) => state.unit?.units || []);

  // Generate next tenant code (TT + 4 digits)
  const generateNextTenantCode = () => {
    // TODO: Fetch last tenant code from backend and increment
    // For now, generate random 4-digit code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return `TT${randomCode}`;
  };

  const [formData, setFormData] = useState({
    tenantCode: generateNextTenantCode(),
    name: "",
    phone: "",
    idNumber: "",
    property: "",
    unit: "",
    moveInDate: "",
    rent: "",
    paymentMethod: "",
    status: "active",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [availableUnits, setAvailableUnits] = useState([]);

  // Fetch properties and units on mount
  useEffect(() => {
    if (currentCompany?._id) {
      dispatch(getProperties({ business: currentCompany._id }));
      dispatch(getUnits({ business: currentCompany._id }));
    }
  }, [dispatch, currentCompany]);

  // Load available units when property is selected
  useEffect(() => {
    if (formData.property) {
      // Filter units by selected property
      const propertyUnits = units.filter(u => u.property === formData.property || u.property?._id === formData.property);
      // Filter vacant units only
      const vacant = propertyUnits.filter(u => u.status === 'vacant');
      setAvailableUnits(vacant);
      // Reset unit selection when property changes
      setFormData(prev => ({ ...prev, unit: "", utilities: [] }));
    } else {
      setAvailableUnits([]);
      setFormData(prev => ({ ...prev, unit: "", utilities: [] }));
    }
  }, [formData.property, units]);

  // Load utilities when unit is selected
  useEffect(() => {
    if (formData.unit && availableUnits.length > 0) {
      const selectedUnit = availableUnits.find(u => u._id === formData.unit);
      if (selectedUnit) {
        // Auto-populate rent from unit
        setFormData(prev => ({
          ...prev,
          rent: selectedUnit.rent || "",
          // Load utilities from unit
          utilities: (selectedUnit.utilities || []).map(util => ({
            utility: util.utility?._id || util.utility || "",
            utilityLabel: util.utility?.name || "Unknown Utility",
            isIncluded: util.isIncluded,
            unitCharge: util.unitCharge || 0,
          }))
        }));
      }
    }
  }, [formData.unit, availableUnits]);

  // Input/label classes for consistency
  const inputClass =
    "w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm transition-all duration-200 ease-out hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-600";
  
  const labelClass = "block text-sm font-bold text-slate-800 mb-1 tracking-tight";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  // Calculate prorated rent if start date is not the 1st
  const calculateProratedRent = () => {
    if (!formData.moveInDate || !formData.rent) return null;

    const startDate = new Date(formData.moveInDate);
    const day = startDate.getDate();

    if (day === 1) return null; // No proration needed

    const month = startDate.getMonth();
    const year = startDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const remainingDays = daysInMonth - day + 1;
    const monthlyRent = parseFloat(formData.rent) || 0;
    const dailyRate = monthlyRent / daysInMonth;
    const proratedAmount = dailyRate * remainingDays;

    return {
      daysInMonth,
      remainingDays,
      dailyRate,
      proratedAmount,
    };
  };

  // Calculate prorated utilities if start date is not the 1st
  const calculateProratedUtilities = () => {
    if (!formData.moveInDate || formData.utilities.length === 0) return null;

    const startDate = new Date(formData.moveInDate);
    const day = startDate.getDate();

    if (day === 1) return null; // No proration needed

    const month = startDate.getMonth();
    const year = startDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const remainingDays = daysInMonth - day + 1;

    return formData.utilities.map(util => {
      const monthlyCharge = parseFloat(util.unitCharge) || 0;
      const dailyRate = monthlyCharge / daysInMonth;
      const proratedCharge = dailyRate * remainingDays;
      return {
        utility: util,
        dailyRate,
        proratedCharge,
      };
    });
  };

  const proratedInfo = calculateProratedRent();
  const proratedUtilitiesInfo = calculateProratedUtilities();

  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = "Tenant name is required";
    }
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!formData.idNumber?.trim()) {
      errors.idNumber = "ID number is required";
    }
    if (!formData.property?.trim()) {
      errors.property = "Property is required";
    }
    if (!formData.unit?.trim()) {
      errors.unit = "Unit is required";
    }
    if (!formData.moveInDate) {
      errors.moveInDate = "Move-in date is required (billing anchor)";
    }
    if (!formData.rent || parseFloat(formData.rent) <= 0) {
      errors.rent = "Valid monthly rent is required";
    }
    if (!formData.paymentMethod) {
      errors.paymentMethod = "Payment method is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      const tenantData = {
        name: formData.name,
        phone: formData.phone,
        idNumber: formData.idNumber,
        unit: formData.unit,
        rent: parseFloat(formData.rent),
        paymentMethod: formData.paymentMethod,
        moveInDate: formData.moveInDate,
        status: "active",
        emergencyContact: {
          name: formData.emergencyContactName || "",
          phone: formData.emergencyContactPhone || "",
          relationship: formData.emergencyContactRelationship || "Family",
        },
        business: currentCompany._id,
      };

      // Dispatch createTenant action
      const result = await dispatch(createTenant(tenantData)).unwrap();
      
      console.log("Tenant created successfully:", result);
      toast.success("Tenant created successfully!");
      navigate("/tenants");
    } catch (error) {
      const errorMsg = error?.message || "Failed to create tenant";
      setGeneralError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleCancel = () => {
    navigate("/tenants");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Add New Tenant
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Create a new tenant record with billing information
            </p>
          </div>

          {generalError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Tenant Code (Auto-generated, display only) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      Tenant Code (Auto-generated)
                    </label>
                    <input
                      type="text"
                      name="tenantCode"
                      value={formData.tenantCode}
                      disabled
                      className={`${inputClass} bg-gray-100 font-mono font-bold`}
                    />
                  </div>
                </div>

                {/* Tenant Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-orange-500 pb-2">
                    👤 Tenant Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`${inputClass} ${fieldErrors.name ? 'border-red-500' : ''}`}
                      />
                      {fieldErrors.name && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+254 712 345 678"
                        className={`${inputClass} ${fieldErrors.phone ? 'border-red-500' : ''}`}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        ID Number
                      </label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        placeholder="12345678"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Property & Unit Selection */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-green-500 pb-2">
                    🏢 Property & Unit
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MilikSelect
                      label="Property"
                      required
                      placeholder="Select Property"
                      items={properties}
                      value={formData.property}
                      onChange={(val) => {
                        setFormData((prev) => ({ ...prev, property: val, unit: "" }));
                        if (fieldErrors.property) {
                          setFieldErrors((prev) => ({ ...prev, property: "" }));
                        }
                      }}
                      getLabel={(p) => p.propertyName || "Unknown"}
                      getValue={(p) => p._id}
                      error={fieldErrors.property}
                    />

                    <MilikSelect
                      label="Unit (Vacant Only)"
                      required
                      placeholder="Select Unit"
                      items={availableUnits}
                      value={formData.unit}
                      onChange={(val) => {
                        const selectedUnit = availableUnits.find(u => u._id === val);
                        setFormData((prev) => ({
                          ...prev,
                          unit: val,
                          rent: selectedUnit?.rent || "",
                        }));
                        if (fieldErrors.unit) {
                          setFieldErrors((prev) => ({ ...prev, unit: "" }));
                        }
                      }}
                      getLabel={(u) => `${u.unitNumber} - Ksh ${(u.rent || 0).toLocaleString()}`}
                      getValue={(u) => u._id}
                      error={fieldErrors.unit}
                      disabled={!formData.property}
                    />
                  </div>
                </div>

                {/* Billing Information (CRITICAL) */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-blue-500 pb-2">
                    💰 Billing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        Move-In Date (Billing Anchor) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="moveInDate"
                        value={formData.moveInDate}
                        onChange={handleInputChange}
                        className={`${inputClass} ${fieldErrors.moveInDate ? 'border-red-500' : ''}`}
                      />
                      {fieldErrors.moveInDate && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.moveInDate}</p>
                      )}
                      <p className="mt-1 text-xs text-orange-600 font-semibold">
                        ⚠️ This date determines all billing calculations
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Monthly Rent (Ksh) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="rent"
                        value={formData.rent}
                        onChange={handleInputChange}
                        placeholder="30000"
                        step="0.01"
                        min="0"
                        className={`${inputClass} ${fieldErrors.rent ? 'border-red-500' : ''}`}
                      />
                      {fieldErrors.rent && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.rent}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className={`${inputClass} ${fieldErrors.paymentMethod ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="credit_card">Credit Card</option>
                      </select>
                      {fieldErrors.paymentMethod && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.paymentMethod}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={inputClass}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Prorated Rent Calculation Preview */}
                  {proratedInfo && (
                    <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <FaCalculator className="text-orange-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-orange-900 text-sm mb-2">
                            Prorated Rent Calculation (First Month)
                          </h4>
                          <div className="text-xs text-orange-800 space-y-1">
                            <p>• Days in month: <span className="font-bold">{proratedInfo.daysInMonth}</span></p>
                            <p>• Remaining days (including start date): <span className="font-bold">{proratedInfo.remainingDays}</span></p>
                            <p>• Daily rate: <span className="font-bold">Ksh {proratedInfo.dailyRate.toFixed(2)}</span></p>
                            <p className="pt-1 border-t border-orange-300">
                              <span className="font-bold text-orange-900">
                                First month bill: Ksh {proratedInfo.proratedAmount.toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Utilities Information (Auto-loaded from Unit - Reference Only) */}
                {formData.utilities && formData.utilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-green-500 pb-2">
                      ⚡ Utilities (Reference Only - Not Stored with Tenant)
                    </h3>
                    <div className="space-y-3">
                      {formData.utilities.map((util, idx) => {
                        const monthlyCharge = parseFloat(util.unitCharge) || 0;
                        const proratedCharge = proratedUtilitiesInfo?.[idx]?.proratedCharge || 0;
                        
                        return (
                          <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="text-xs font-bold text-gray-600">Utility</label>
                                <p className="text-sm font-semibold text-gray-900 mt-1">{util.utilityLabel}</p>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-600">Monthly Charge</label>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                  Ksh {monthlyCharge.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-600">Included in Rent?</label>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                  {util.isIncluded ? (
                                    <span className="text-green-600">✓ Yes</span>
                                  ) : (
                                    <span className="text-red-600">✗ No (Tenant Pays)</span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-600">First Month Charge</label>
                                {proratedInfo ? (
                                  <p className="text-sm font-semibold text-orange-600 mt-1">
                                    Ksh {proratedCharge.toFixed(2)}
                                    {proratedInfo && (
                                      <span className="text-xs text-gray-500 block">(prorated)</span>
                                    )}
                                  </p>
                                ) : (
                                  <p className="text-sm font-semibold text-gray-900 mt-1">
                                    Ksh {monthlyCharge.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b-2 border-purple-500 pb-2">
                    📞 Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={labelClass}>
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        placeholder="+254 700 000 000"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Relationship
                      </label>
                      <select
                        name="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={handleInputChange}
                        className={inputClass}
                      >
                        <option value="Family">Family</option>
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-5 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm shadow-sm hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2 ${MILIK_GREEN_BG} ${MILIK_GREEN_BG_HOVER} text-white rounded-lg font-semibold text-sm shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Tenant
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddTenant;
