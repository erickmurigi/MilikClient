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
    // Backend will auto-generate if field is empty
    return "";
  };

  const [formData, setFormData] = useState({
    tenantCode: generateNextTenantCode(),
    name: "",
    phone: "",
    idNumber: "",
    property: "",
    unit: "",
    moveInDate: "",
    moveOutDate: "",
    leaseType: "at_will",
    rent: "",
    paymentMethod: "",
    status: "active",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    utilities: [],
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [availableUnits, setAvailableUnits] = useState([]);
  const [additionalUtilities, setAdditionalUtilities] = useState([]);

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
      setAdditionalUtilities([]);
    } else {
      setAvailableUnits([]);
      setFormData(prev => ({ ...prev, unit: "", utilities: [] }));
      setAdditionalUtilities([]);
    }
  }, [formData.property, units]);

  // Load utilities when unit is selected
  useEffect(() => {
    if (formData.unit && availableUnits.length > 0) {
      const selectedUnit = availableUnits.find((u) => u._id === formData.unit);
      if (selectedUnit) {
        // Auto-populate rent from unit
        const mappedUtilities = (selectedUnit.utilities || []).map((util) => {
          let utilityLabel = "Unknown Utility";
          let utilityValue = "";
          
          // Case 1: utility is a populated object (from .populate())
          if (util.utility && typeof util.utility === 'object' && !Array.isArray(util.utility)) {
            utilityValue = util.utility._id || "";
            utilityLabel = util.utility.name || util.utility.utilityName || "Unknown Utility";
          }
          // Case 2: utility is a non-empty string
          else if (util.utility && typeof util.utility === 'string' && util.utility.trim() !== '') {
            utilityValue = util.utility;
            utilityLabel = util.utility;
          }
          // Case 3: utility field is missing/null/undefined/empty - use fallback
          else {
            utilityValue = "";
            utilityLabel = "Unknown Utility";
          }
          
          return {
            utility: utilityValue,
            utilityLabel: utilityLabel,
            isIncluded: util.isIncluded,
            unitCharge: util.unitCharge || 0,
          };
        });
        
        setFormData((prev) => ({
          ...prev,
          rent: selectedUnit.rent || "",
          utilities: mappedUtilities,
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

  // Additional Utilities Management (for utilities not on the unit)
  const addAdditionalUtility = () => {
    setAdditionalUtilities(prev => [...prev, { utility: "", unitCharge: "", isIncluded: false }]);
  };

  const removeAdditionalUtility = (index) => {
    setAdditionalUtilities(prev => prev.filter((_, i) => i !== index));
  };

  const updateAdditionalUtility = (index, field, value) => {
    setAdditionalUtilities(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

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
    if (formData.leaseType === "fixed" && !formData.moveOutDate) {
      errors.moveOutDate = "Move-out date is required for fixed-term leases";
    }
    if (formData.leaseType === "fixed" && formData.moveInDate && formData.moveOutDate) {
      const moveIn = new Date(formData.moveInDate);
      const moveOut = new Date(formData.moveOutDate);
      if (moveOut <= moveIn) {
        errors.moveOutDate = "Move-out date must be after move-in date";
      }
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
        leaseType: formData.leaseType || "at_will",
        moveInDate: formData.moveInDate,
        moveOutDate: formData.leaseType === "fixed" ? formData.moveOutDate : null,
        status: "active",
        emergencyContact: {
          name: formData.emergencyContactName || "",
          phone: formData.emergencyContactPhone || "",
          relationship: formData.emergencyContactRelationship || "Family",
        },
        business: currentCompany._id,
        // Include both auto-loaded and additional utilities
        utilities: [
          ...formData.utilities,
          ...additionalUtilities.filter(u => u.utility) // Only include utilities with a type selected
        ]
      };

      // Dispatch createTenant action
      const result = await dispatch(createTenant(tenantData)).unwrap();
      
      toast.success("Tenant created successfully!");
      setAdditionalUtilities([]); // Clear additional utilities after successful creation
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
              Tenant Details
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
                {/* Tenant Code (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      Tenant Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="tenantCode"
                      value={formData.tenantCode}
                      onChange={handleInputChange}
                      placeholder="Leave blank for auto-generation"
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Leave blank and the system will auto-assign a code
                    </p>
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
                        // Just set the unit value - let the useEffect handle populating rent and utilities
                        setFormData((prev) => ({ ...prev, unit: val }));
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                    {/* Utilities Quick View */}
                    <div>
                      <label className={labelClass}>
                        Utilities & Charges (Ksh)
                      </label>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 min-h-10 max-h-32 overflow-y-auto">
                        {formData.utilities && formData.utilities.length > 0 ? (
                          <div className="space-y-1">
                            {formData.utilities.map((util, idx) => {
                              const charge = parseFloat(util.unitCharge) || 0;
                              return (
                                <div key={idx} className="text-xs flex justify-between items-center">
                                  <span className="text-green-700 font-medium">{util.utilityLabel}:</span>
                                  <span className="text-green-900 font-bold">Ksh {charge.toFixed(2)}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-green-600">No utilities</p>
                        )}
                      </div>
                    </div>

                    {/* Total Monthly Bill */}
                    <div>
                      <label className={labelClass}>
                        Total Monthly Bill (Ksh)
                      </label>
                      <div className="bg-gradient-to-br from-orange-100 to-red-50 border-2 border-orange-400 rounded-lg p-3 min-h-10 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-black text-orange-900">
                            {(parseFloat(formData.rent || 0) + (formData.utilities?.reduce((sum, u) => sum + (parseFloat(u.unitCharge) || 0), 0) || 0)).toFixed(2)}
                          </p>
                          <p className="text-xs text-orange-700 mt-0.5">Rent + Utilities</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="md:col-span-4 md:col-start-1">
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

                    <div className="md:col-span-2">
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

                    <div className="md:col-span-1">
                      <label className={labelClass}>
                        Lease Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="leaseType"
                        value={formData.leaseType}
                        onChange={handleInputChange}
                        className={inputClass}
                      >
                        <option value="at_will">At Will</option>
                        <option value="fixed">Fixed Term</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-600">
                        At Will / Fixed Term
                      </p>
                    </div>
                  </div>

                  {/* Move-Out Date for Fixed Leases */}
                  {formData.leaseType === "fixed" && (
                    <div className="mt-4">
                      <label className={labelClass}>
                        Move-Out Date (End of Lease) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="moveOutDate"
                        value={formData.moveOutDate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border border-slate-300 rounded-md shadow-sm transition-all duration-200 ease-out hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-600 ${
                          fieldErrors.moveOutDate ? 'border-red-500' : ''
                        }`}
                      />
                      {fieldErrors.moveOutDate && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.moveOutDate}</p>
                      )}
                    </div>
                  )}

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

                {/* ✨ CREATIVE: Add Additional Utilities (Not on Unit) */}
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-dashed border-indigo-300 rounded-xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                        ➕ Additional Utilities (Optional)
                      </h3>
                      <p className="text-xs text-indigo-700 mt-1">
                        Add utilities not included in the unit. These will be tracked as extra charges for this tenant.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addAdditionalUtility}
                      className="h-10 px-4 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                      <FaPlus /> Add Utility
                    </button>
                  </div>

                  {additionalUtilities.length === 0 ? (
                    <div className="text-center py-8 text-indigo-600">
                      <p className="text-sm font-medium">No additional utilities added yet</p>
                      <p className="text-xs text-indigo-500 mt-1">Click "Add Utility" to include extra utilities for this tenant</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {additionalUtilities.map((util, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-4 bg-white border border-indigo-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div>
                            <MilikSelect
                              label="Utility Type"
                              placeholder="Select"
                              items={["Water", "Garbage", "Electricity", "Service Charge", "Security", "Others"]}
                              value={util.utility}
                              onChange={(val) => updateAdditionalUtility(idx, "utility", val)}
                              getLabel={(x) => x}
                              getValue={(x) => x}
                              disabled={loading}
                            />
                          </div>

                          <div>
                            <label className={labelClass}>Monthly Charge (KES)</label>
                            <input
                              type="number"
                              value={util.unitCharge}
                              onChange={(e) => updateAdditionalUtility(idx, "unitCharge", e.target.value)}
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              className={inputClass}
                              disabled={loading}
                            />
                          </div>

                          <div className="flex items-center h-10">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={util.isIncluded}
                                onChange={(e) => updateAdditionalUtility(idx, "isIncluded", e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                disabled={loading}
                              />
                              <span className="text-xs font-medium text-slate-700">In Rent</span>
                            </label>
                          </div>

                          <div className="text-sm text-right">
                            <span className="font-semibold text-indigo-700">
                              Ksh {(parseFloat(util.unitCharge) || 0).toFixed(2)}
                            </span>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {util.isIncluded ? "Included" : "Extra"}
                            </p>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeAdditionalUtility(idx)}
                              className="h-10 px-3 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors flex items-center justify-center"
                              disabled={loading}
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {additionalUtilities.length > 0 && (
                    <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4 mt-4">
                      <p className="text-xs font-semibold text-indigo-900 mb-2">💡 Summary:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {additionalUtilities.map((util, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-indigo-700 font-medium">{util.utility}:</span>
                            <span className="text-indigo-900 font-bold">Ksh {(parseFloat(util.unitCharge) || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-indigo-300 mt-2 pt-2">
                        <p className="text-right text-indigo-900 font-bold">
                          Total Extra: Ksh {additionalUtilities.reduce((sum, u) => sum + (parseFloat(u.unitCharge) || 0), 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

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
