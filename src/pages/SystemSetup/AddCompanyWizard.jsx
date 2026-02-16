import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCompany } from "../../redux/apiCalls"; 
import {
  FaBuilding,
  FaUsers,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaEye,
  FaFileExport,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaDatabase,
  FaKey,
  FaUserClock,
  FaHistory,
  FaSave,
  FaCheck,
  FaSpinner,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaMoneyBill,
  FaToggleOn,
  FaToggleOff,
  FaCog,
  FaWallet,
  FaChartLine,
  FaHome,
  FaHotel,
  FaShoppingCart,
  FaUsers as FaUsersIcon,
  FaUserTie,
  FaFileAlt,
  FaProjectDiagram,
  FaChartBar,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaVenusMars,
  FaLock as FaLockIcon,
  FaShieldAlt,
  FaUserCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import StartMenu from "../../components/StartMenu/StartMenu";

// Animation Components
const SavingAnimation = ({ isSaving, isComplete, step }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isSaving) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isSaving]);

  if (!isSaving && !isComplete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {isSaving && !isComplete && (
            <>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <FaSpinner className="w-24 h-24 text-teal-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaCog className="w-12 h-12 text-teal-800 animate-spin-slow" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Configuring {step}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Please wait while we set up your company configuration...
              </p>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{progress}% Complete</p>
            </>
          )}
          
          {isComplete && (
            <>
              <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <FaCheck className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Configuration Complete!
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Your company has been successfully set up.
              </p>
              <button 
                onClick={() => window.location.href = "/system-setup"}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                View Companies
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Module Toggle Component
const ModuleToggle = ({ label, icon: Icon, enabled, onChange, description }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${enabled ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-500'}`}>
        <Icon className="text-sm" />
      </div>
      <div>
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {description && <div className="text-xs text-slate-500">{description}</div>}
      </div>
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        enabled ? 'bg-teal-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);
// Add Company Wizard Component
const AddCompanyWizard = ({ onClose, onSave }) => {
   const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);
    const [companyData, setCompanyData] = useState({
        // same initial state as before
        companyName: "",
        registrationNo: "",
        taxPIN: "",
        taxExemptCode: "",
        postalAddress: "",
        country: "Kenya",
        town: "",
        roadStreet: "",
        latitude: "",
        longitude: "",
        baseCurrency: "KES",
        taxRegime: "VAT",
        modules: {
            propertyManagement: { enabled: true, required: true },
            inventory: { enabled: false, required: false },
            telcoDealership: { enabled: false, required: false },
            procurement: { enabled: false, required: false },
            hr: { enabled: false, required: false },
            facilityManagement: { enabled: false, required: false },
            hotelManagement: { enabled: false, required: false },
            accounts: { enabled: true, required: true },
            billing: { enabled: true, required: true },
            propertySale: { enabled: false, required: false },
            frontOffice: { enabled: false, required: false },
            dms: { enabled: false, required: false },
            academics: { enabled: false, required: false },
            projectManagement: { enabled: false, required: false },
            assetValuation: { enabled: false, required: false },
        },
        fiscalStartMonth: "January",
        fiscalStartYear: new Date().getFullYear(),
        fiscalPeriods: {
            monthly: true,
            quarterly: false,
            fourMonths: false,
            semiAnnual: false,
        },
        operationPeriodType: "Monthly",
    });


  const totalSteps = 3;
  const steps = [
    { number: 1, name: "General Information", icon: <FaBuilding /> },
    { number: 2, name: "Module Configuration", icon: <FaCog /> },
    { number: 3, name: "Fiscal Periods", icon: <FaCalendarAlt /> },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

 const handleSave = async () => {
  setIsSaving(true);
  try {
    const savedCompany = await dispatch(createCompany(companyData))
    // unwrap() gives you the resolved value or throws on error
    setIsComplete(true);
    setTimeout(() => onSave(savedCompany), 2000);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsSaving(false);
  }
};

  const toggleModule = (moduleKey) => {
    setCompanyData({
      ...companyData,
      modules: {
        ...companyData.modules,
        [moduleKey]: {
          ...companyData.modules[moduleKey],
          enabled: !companyData.modules[moduleKey].enabled,
        },
      },
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
        <StartMenu></StartMenu>
      {/* General Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FaBuilding className="text-teal-600" />
          General Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyData.companyName}
              onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Registration No.</label>
            <input
              type="text"
              value={companyData.registrationNo}
              onChange={(e) => setCompanyData({...companyData, registrationNo: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter registration number"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Tax PIN</label>
            <input
              type="text"
              value={companyData.taxPIN}
              onChange={(e) => setCompanyData({...companyData, taxPIN: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter tax PIN"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Tax Exempt Code</label>
            <input
              type="text"
              value={companyData.taxExemptCode}
              onChange={(e) => setCompanyData({...companyData, taxExemptCode: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter tax exempt code"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FaMapMarkerAlt className="text-teal-600" />
          Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-700">
              Postal Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyData.postalAddress}
              onChange={(e) => setCompanyData({...companyData, postalAddress: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter postal address"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Country</label>
            <select
              value={companyData.country}
              onChange={(e) => setCompanyData({...companyData, country: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
            >
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Town</label>
            <input
              type="text"
              value={companyData.town}
              onChange={(e) => setCompanyData({...companyData, town: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter town"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Road/Street</label>
            <input
              type="text"
              value={companyData.roadStreet}
              onChange={(e) => setCompanyData({...companyData, roadStreet: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter road/street"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Latitude</label>
            <input
              type="text"
              value={companyData.latitude}
              onChange={(e) => setCompanyData({...companyData, latitude: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter latitude"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Longitude</label>
            <input
              type="text"
              value={companyData.longitude}
              onChange={(e) => setCompanyData({...companyData, longitude: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              placeholder="Enter longitude"
            />
          </div>
        </div>
      </div>

      {/* Currency & Statutory */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FaMoneyBill className="text-teal-600" />
          Currency & Statutory Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Base Currency <span className="text-red-500">*</span>
            </label>
            <select
              value={companyData.baseCurrency}
              onChange={(e) => setCompanyData({...companyData, baseCurrency: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
            >
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">
              Tax Regime <span className="text-red-500">*</span>
            </label>
            <select
              value={companyData.taxRegime}
              onChange={(e) => setCompanyData({...companyData, taxRegime: e.target.value})}
              className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
            >
              <option value="VAT">VAT</option>
              <option value="GST">GST</option>
              <option value="Sales Tax">Sales Tax</option>
              <option value="No Tax">No Tax</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - Core Modules */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Core Modules</h3>
          <div className="space-y-2">
            <ModuleToggle
              label="Property Management"
              icon={FaHome}
              enabled={companyData.modules.propertyManagement.enabled}
              onChange={() => toggleModule('propertyManagement')}
              description="Manage properties, units, and tenants"
            />
            <ModuleToggle
              label="Accounts Module"
              icon={FaWallet}
              enabled={companyData.modules.accounts.enabled}
              onChange={() => toggleModule('accounts')}
              description="Financial accounting and reporting"
            />
            <ModuleToggle
              label="Billing/Revenue Collection"
              icon={FaMoneyBill}
              enabled={companyData.modules.billing.enabled}
              onChange={() => toggleModule('billing')}
              description="Invoice generation and payment collection"
            />
            <ModuleToggle
              label="Inventory Module"
              icon={FaShoppingCart}
              enabled={companyData.modules.inventory.enabled}
              onChange={() => toggleModule('inventory')}
              description="Stock and inventory management"
            />
            <ModuleToggle
              label="HR Module"
              icon={FaUsersIcon}
              enabled={companyData.modules.hr.enabled}
              onChange={() => toggleModule('hr')}
              description="Human resources and payroll"
            />
            <ModuleToggle
              label="Procurement Module"
              icon={FaShoppingCart}
              enabled={companyData.modules.procurement.enabled}
              onChange={() => toggleModule('procurement')}
              description="Purchase and supplier management"
            />
          </div>
        </div>

        {/* Right Column - Specialized Modules */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Specialized Modules</h3>
          <div className="space-y-2">
            <ModuleToggle
              label="Facility Management"
              icon={FaBuilding}
              enabled={companyData.modules.facilityManagement.enabled}
              onChange={() => toggleModule('facilityManagement')}
              description="Maintenance and facility operations"
            />
            <ModuleToggle
              label="Hotel/Vacation Management"
              icon={FaHotel}
              enabled={companyData.modules.hotelManagement.enabled}
              onChange={() => toggleModule('hotelManagement')}
              description="Hotel booking and room management"
            />
            <ModuleToggle
              label="Telco Dealership"
              icon={FaPhone}
              enabled={companyData.modules.telcoDealership.enabled}
              onChange={() => toggleModule('telcoDealership')}
              description="Telecom services and airtime"
            />
            <ModuleToggle
              label="Property Sale"
              icon={FaChartLine}
              enabled={companyData.modules.propertySale.enabled}
              onChange={() => toggleModule('propertySale')}
              description="Property sales and marketing"
            />
            <ModuleToggle
              label="Project Management"
              icon={FaProjectDiagram}
              enabled={companyData.modules.projectManagement.enabled}
              onChange={() => toggleModule('projectManagement')}
              description="Project planning and tracking"
            />
            <ModuleToggle
              label="Asset Valuation"
              icon={FaChartBar}
              enabled={companyData.modules.assetValuation.enabled}
              onChange={() => toggleModule('assetValuation')}
              description="Asset appraisal and valuation"
            />
          </div>
        </div>
      </div>

      {/* Additional Modules */}
      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Additional Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <ModuleToggle
            label="Front Office"
            icon={FaUserTie}
            enabled={companyData.modules.frontOffice.enabled}
            onChange={() => toggleModule('frontOffice')}
          />
          <ModuleToggle
            label="DMS Module"
            icon={FaFileAlt}
            enabled={companyData.modules.dms.enabled}
            onChange={() => toggleModule('dms')}
          />
          <ModuleToggle
            label="Academics Module"
            icon={FaUsersIcon}
            enabled={companyData.modules.academics.enabled}
            onChange={() => toggleModule('academics')}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Fiscal Period Set Up</h3>
        
        {/* Book Start Month/Year */}
        <div className="bg-slate-50 p-4 rounded-lg mb-4">
          <label className="text-xs font-medium text-slate-700 block mb-2">
            Book Start Month/Year
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-600">Start Month *</label>
              <select
                value={companyData.fiscalStartMonth}
                onChange={(e) => setCompanyData({...companyData, fiscalStartMonth: e.target.value})}
                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
              >
                {["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600">Start Year</label>
              <input
                type="number"
                value={companyData.fiscalStartYear}
                onChange={(e) => setCompanyData({...companyData, fiscalStartYear: parseInt(e.target.value)})}
                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-600"
                min="2000"
                max="2100"
              />
            </div>
          </div>
        </div>

        {/* Select Fiscal Periods */}
        <div className="bg-slate-50 p-4 rounded-lg mb-4">
          <label className="text-xs font-medium text-slate-700 block mb-2">
            Select Fiscal Periods To Use
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'monthly', label: 'Monthly Periods' },
              { key: 'quarterly', label: 'Quarterly Periods' },
              { key: 'fourMonths', label: 'Four Months Periods' },
              { key: 'semiAnnual', label: 'Semi Annual Periods' },
            ].map(period => (
              <label key={period.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={companyData.fiscalPeriods[period.key]}
                  onChange={(e) => setCompanyData({
                    ...companyData,
                    fiscalPeriods: {
                      ...companyData.fiscalPeriods,
                      [period.key]: e.target.checked
                    }
                  })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-200"
                />
                <span className="text-sm text-slate-700">{period.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Operation Accounting Period */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <label className="text-xs font-medium text-slate-700 block mb-2">
            Operation Accounting Period
          </label>
          <div>
            <label className="text-xs text-slate-600">Period Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              {[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Four months', label: 'Four months' },
                { value: 'Bi annual', label: 'Bi annual' },
                { value: 'Annual', label: 'Annual' },
              ].map(period => (
                <label key={period.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="operationPeriodType"
                    value={period.value}
                    checked={companyData.operationPeriodType === period.value}
                    onChange={(e) => setCompanyData({...companyData, operationPeriodType: e.target.value})}
                    className="text-teal-600 focus:ring-teal-200"
                  />
                  <span className="text-sm text-slate-700">{period.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-xs font-semibold text-slate-900 mb-2">Configuration Summary</h4>
        <div className="bg-teal-50 p-3 rounded-lg">
          <p className="text-xs text-teal-800">
            <strong>Company:</strong> {companyData.companyName || 'Not set'} • 
            <strong> Currency:</strong> {companyData.baseCurrency} • 
            <strong> Tax Regime:</strong> {companyData.taxRegime} • 
            <strong> Fiscal Start:</strong> {companyData.fiscalStartMonth} {companyData.fiscalStartYear}
          </p>
          <p className="text-xs text-teal-600 mt-1">
            <strong>Modules enabled:</strong> {
              Object.entries(companyData.modules)
                .filter(([_, m]) => m.enabled)
                .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
                .join(', ')
            }
          </p>
        </div>
      </div>
    </div>
  );

  return (
     <>
            <SavingAnimation isSaving={isSaving} isComplete={isComplete} step={`Step ${step} of ${totalSteps}`} />
            
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 overflow-y-auto">
                <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 my-8">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Company Set Up Wizard</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                            This wizard will assist you in setting up new company.
                        </p>
                        {error && (
                            <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Progress Steps */}
                    <div className="px-6 pt-6">
                        {/* ... same as before ... */}
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-200 flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={step === 1 || isSaving}
                            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2
                                ${step === 1 || isSaving ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'}`}
                        >
                            <FaArrowLeft /> Previous
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <FaSpinner className="animate-spin" /> Saving...
                                    </>
                                ) : step === totalSteps ? (
                                    'Save Configuration'
                                ) : (
                                    <>
                                        Next <FaArrowRight />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AddCompanyWizard;