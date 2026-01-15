// pages/AddProperty.js
import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaSave, FaTimes, FaChevronRight, FaPlus, FaTrash, FaFileInvoice,
  FaBuilding, FaCalculator, FaChartBar, FaShieldAlt, FaCog,
  FaBell, FaStickyNote, FaHome, FaWarehouse, FaCity, FaHotel
} from 'react-icons/fa';

const AddProperty = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    // General Information
    dateAcquired: '',
    letManage: 'Managing',
    landlords: [{ name: '', contact: '' }],
    propertyCode: '',
    propertyName: '',
    lrNumber: '',
    category: '',
    propertyType: '',
    specification: '',
    multiStoreyType: '',
    numberOfFloors: '',
    country: 'Kenya',
    townCityState: '',
    estateArea: '',
    roadStreet: '',
    zoneRegion: '',
    
    // Accounting & Billing
    accountLedgerType: 'Property Control Ledger In GL',
    primaryBank: '',
    alternativeTaxPin: '',
    invoicePrefix: '',
    invoicePaymentTerms: 'Please pay your invoice before due date to avoid penalty.',
    mpesaPaybill: true,
    disableMpesaStkPush: false,
    mpesaNarration: '',
    
    // Standing Charges
    standingCharges: [],
    securityDeposits: [],
    
    // SMS & Email Exemptions
    smsExemptions: {
      all: false,
      invoice: false,
      general: false,
      receipt: false,
      balance: false
    },
    emailExemptions: {
      all: false,
      invoice: false,
      general: false,
      receipt: false,
      balance: false
    },
    
    // Other Preferences
    excludeFeeSummary: false,
    
    // Banking Details
    drawerBank: '',
    bankBranch: '',
    accountName: '',
    accountNumber: '',
    
    // Notes
    notes: '',
    specificContactInfo: ''
  });

  const tabs = [
    { id: 'general', label: 'General Info', icon: <FaHome /> },
    { id: 'space', label: 'Space/Units', icon: <FaWarehouse /> },
    { id: 'accounting', label: 'Accounting', icon: <FaCalculator /> },
    { id: 'charges', label: 'Standing Charges', icon: <FaChartBar /> },
    { id: 'deposit', label: 'Security Deposit', icon: <FaShieldAlt /> },
    { id: 'preferences', label: 'Preferences', icon: <FaCog /> },
    { id: 'communications', label: 'Communications', icon: <FaBell /> },
    { id: 'banking', label: 'Banking', icon: <FaFileInvoice /> },
    { id: 'notes', label: 'Notes', icon: <FaStickyNote /> }
  ];

  const propertyTypes = [
    'Residential',
    'Commercial',
    'Mixed Use',
    'Industrial',
    'Agricultural',
    'Special Purpose'
  ];

  const buildingTypes = [
    'Multi-Unit/Multi-Spa',
    'Single Storey',
    'Multi Storey',
    'High Rise',
    'Complex',
    'Estate'
  ];

  const zones = [
    'Nairobi CBD', 'Westlands', 'Kilimani', 'Karen', 'Mombasa Road',
    'Thika Road', 'Kiambu', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'
  ];

  const handleChange = (e, section = null, index = null) => {
    const { name, value, type, checked } = e.target;
    
    if (section === 'landlords' && index !== null) {
      const updatedLandlords = [...formData.landlords];
      updatedLandlords[index][name] = value;
      setFormData(prev => ({ ...prev, landlords: updatedLandlords }));
    } else if (section === 'smsExemptions' || section === 'emailExemptions') {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addLandlord = () => {
    setFormData(prev => ({
      ...prev,
      landlords: [...prev.landlords, { name: '', contact: '' }]
    }));
  };

  const removeLandlord = (index) => {
    const updatedLandlords = formData.landlords.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, landlords: updatedLandlords }));
  };

  const addStandingCharge = () => {
    setFormData(prev => ({
      ...prev,
      standingCharges: [...prev.standingCharges, {
        serviceCharge: '',
        chargeMode: 'Monthly',
        billingCurrency: 'KES',
        costPerArea: '',
        chargeValue: '',
        vatRate: '16%',
        escalatesWithRent: false
      }]
    }));
  };

  const removeStandingCharge = (index) => {
    const updatedCharges = formData.standingCharges.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
  };

  const addSecurityDeposit = () => {
    setFormData(prev => ({
      ...prev,
      securityDeposits: [...prev.securityDeposits, {
        depositType: '',
        amount: '',
        currency: 'KES',
        refundable: true,
        terms: ''
      }]
    }));
  };

  const removeSecurityDeposit = (index) => {
    const updatedDeposits = formData.securityDeposits.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, securityDeposits: updatedDeposits }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Property Data:', formData);
    // Submit logic here
  };

  const renderGeneralInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Date Acquired *
          </label>
          <input
            type="date"
            name="dateAcquired"
            value={formData.dateAcquired}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Let/Manage *
          </label>
          <select
            name="letManage"
            value={formData.letManage}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="Managing">Managing</option>
            <option value="Letting">Letting</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Property Code *
          </label>
          <input
            type="text"
            name="propertyCode"
            value={formData.propertyCode}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., A00213A"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Property Name *
          </label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., KITUI HEIGHTS RESIDENTIAL COMPLEX"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            LR Number *
          </label>
          <input
            type="text"
            name="lrNumber"
            value={formData.lrNumber}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., 209/1201"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Residential"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select Type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Specification
          </label>
          <select
            name="specification"
            value={formData.specification}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select Specification</option>
            {buildingTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Multi Storey Type
          </label>
          <select
            name="multiStoreyType"
            value={formData.multiStoreyType}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select Type</option>
            <option value="Low Rise">Low Rise (1-4 floors)</option>
            <option value="Mid Rise">Mid Rise (5-9 floors)</option>
            <option value="High Rise">High Rise (10+ floors)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            No. Of Floors
          </label>
          <input
            type="number"
            name="numberOfFloors"
            value={formData.numberOfFloors}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Town/City/State
          </label>
          <input
            type="text"
            name="townCityState"
            value={formData.townCityState}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Nairobi"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Estate/Area
          </label>
          <input
            type="text"
            name="estateArea"
            value={formData.estateArea}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Westlands"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Road/Street
          </label>
          <input
            type="text"
            name="roadStreet"
            value={formData.roadStreet}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Moi Avenue"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Zone/Region
          </label>
          <select
            name="zoneRegion"
            value={formData.zoneRegion}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select Zone</option>
            {zones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Landlords Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Landlords *</h3>
          <button
            type="button"
            onClick={addLandlord}
            className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <FaPlus /> Add Landlord
          </button>
        </div>
        
        <div className="space-y-2">
          {formData.landlords.map((landlord, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-1 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Landlord Name {index === 0 ? '*' : ''}
                </label>
                <input
                  type="text"
                  name="name"
                  value={landlord.name}
                  onChange={(e) => handleChange(e, 'landlords', index)}
                  className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Full Name"
                  required={index === 0}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Contact Information
                </label>
                <input
                  type="text"
                  name="contact"
                  value={landlord.contact}
                  onChange={(e) => handleChange(e, 'landlords', index)}
                  className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Phone/Email"
                />
              </div>
              
              <div className="flex gap-2">
                {index === 0 ? (
                  <div className="flex-1 text-xs text-gray-500 italic">
                    Primary landlord
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeLandlord(index)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
                  >
                    <FaTrash /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccountingBilling = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Account Ledger Type
          </label>
          <input
            type="text"
            name="accountLedgerType"
            value={formData.accountLedgerType}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Primary Bank/Cash (Operating Account)
          </label>
          <input
            type="text"
            name="primaryBank"
            value={formData.primaryBank}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Bank name and account"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Alternative Tax PIN
          </label>
          <input
            type="text"
            name="alternativeTaxPin"
            value={formData.alternativeTaxPin}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., A001234567Z"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Property Invoicing No. Prefix
          </label>
          <input
            type="text"
            name="invoicePrefix"
            value={formData.invoicePrefix}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., INV"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Invoice Payment Terms
        </label>
        <textarea
          name="invoicePaymentTerms"
          value={formData.invoicePaymentTerms}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">M-PESA RECEIPTING PREFERENCE</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-gray-700">
              M-Pesa Property Paybill:
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="mpesaPaybill"
                  checked={formData.mpesaPaybill}
                  onChange={() => setFormData(prev => ({ ...prev, mpesaPaybill: true }))}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs">Yes</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="mpesaPaybill"
                  checked={!formData.mpesaPaybill}
                  onChange={() => setFormData(prev => ({ ...prev, mpesaPaybill: false }))}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs">No</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-gray-700">
              Disable Mpesa STK Push?:
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="disableMpesaStkPush"
                  checked={formData.disableMpesaStkPush}
                  onChange={() => setFormData(prev => ({ ...prev, disableMpesaStkPush: true }))}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs">Yes</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="disableMpesaStkPush"
                  checked={!formData.disableMpesaStkPush}
                  onChange={() => setFormData(prev => ({ ...prev, disableMpesaStkPush: false }))}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Disable Mpesa STK Push Narration
          </label>
          <input
            type="text"
            name="mpesaNarration"
            value={formData.mpesaNarration}
            onChange={handleChange}
            className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStandingCharges = () => (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">DEFAULT STANDING CHARGES</h3>
          <button
            type="button"
            onClick={addStandingCharge}
            className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <FaPlus /> Add Standing Charge
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.standingCharges.map((charge, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end p-3 border border-gray-100 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Service Charge/Utility
                </label>
                <input
                  type="text"
                  value={charge.serviceCharge}
                  onChange={(e) => {
                    const updatedCharges = [...formData.standingCharges];
                    updatedCharges[index].serviceCharge = e.target.value;
                    setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Water"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Charge Mode
                </label>
                <select
                  value={charge.chargeMode}
                  onChange={(e) => {
                    const updatedCharges = [...formData.standingCharges];
                    updatedCharges[index].chargeMode = e.target.value;
                    setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Billing Currency
                </label>
                <select
                  value={charge.billingCurrency}
                  onChange={(e) => {
                    const updatedCharges = [...formData.standingCharges];
                    updatedCharges[index].billingCurrency = e.target.value;
                    setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cost Per Area
                </label>
                <input
                  type="text"
                  value={charge.costPerArea}
                  onChange={(e) => {
                    const updatedCharges = [...formData.standingCharges];
                    updatedCharges[index].costPerArea = e.target.value;
                    setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., 50"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Charge Value
                </label>
                <input
                  type="number"
                  value={charge.chargeValue}
                  onChange={(e) => {
                    const updatedCharges = [...formData.standingCharges];
                    updatedCharges[index].chargeValue = e.target.value;
                    setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  VAT Rate
                </label>
                <select
                  value={charge.vatRate}
                  onChange={(e) => {
                    const updatedCharges = [...formData.standingCharges];
                    updatedCharges[index].vatRate = e.target.value;
                    setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="0%">0%</option>
                  <option value="8%">8%</option>
                  <option value="16%">16%</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={charge.escalatesWithRent}
                    onChange={(e) => {
                      const updatedCharges = [...formData.standingCharges];
                      updatedCharges[index].escalatesWithRent = e.target.checked;
                      setFormData(prev => ({ ...prev, standingCharges: updatedCharges }));
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-gray-700">Escalates?</span>
                </div>
                
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeStandingCharge(index)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors ml-2"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">DEFAULT SECURITY DEPOSIT</h3>
          <button
            type="button"
            onClick={addSecurityDeposit}
            className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <FaPlus /> Add Security Deposit
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.securityDeposits.map((deposit, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end p-3 border border-gray-100 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Deposit Type
                </label>
                <input
                  type="text"
                  value={deposit.depositType}
                  onChange={(e) => {
                    const updatedDeposits = [...formData.securityDeposits];
                    updatedDeposits[index].depositType = e.target.value;
                    setFormData(prev => ({ ...prev, securityDeposits: updatedDeposits }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Rent Deposit"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={deposit.amount}
                  onChange={(e) => {
                    const updatedDeposits = [...formData.securityDeposits];
                    updatedDeposits[index].amount = e.target.value;
                    setFormData(prev => ({ ...prev, securityDeposits: updatedDeposits }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={deposit.currency}
                  onChange={(e) => {
                    const updatedDeposits = [...formData.securityDeposits];
                    updatedDeposits[index].currency = e.target.value;
                    setFormData(prev => ({ ...prev, securityDeposits: updatedDeposits }));
                  }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={deposit.refundable}
                  onChange={(e) => {
                    const updatedDeposits = [...formData.securityDeposits];
                    updatedDeposits[index].refundable = e.target.checked;
                    setFormData(prev => ({ ...prev, securityDeposits: updatedDeposits }));
                  }}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-700">Refundable</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeSecurityDeposit(index)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunications = () => (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">SMSING EXEMPTION</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(formData.smsExemptions).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={(e) => handleChange(e, 'smsExemptions')}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-700 capitalize">
                {key === 'all' ? 'Exempt All SMS' : `Exempt ${key} SMS`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">EMAILING EXEMPTION</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(formData.emailExemptions).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={(e) => handleChange(e, 'emailExemptions')}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-700 capitalize">
                {key === 'all' ? 'Exempt All Email' : `Exempt ${key} Email`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBanking = () => (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">LANDLORD DRAWER BANKING DETAILS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Drawer Bank
            </label>
            <input
              type="text"
              name="drawerBank"
              value={formData.drawerBank}
              onChange={handleChange}
              className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Bank Name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bank Branch
            </label>
            <input
              type="text"
              name="bankBranch"
              value={formData.bankBranch}
              onChange={handleChange}
              className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Branch Name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Account Holder Name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full px-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Account Number"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Exclude In Fee Summary Report:
        </label>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="excludeFeeSummary"
              checked={formData.excludeFeeSummary}
              onChange={() => setFormData(prev => ({ ...prev, excludeFeeSummary: true }))}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs">Yes</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="excludeFeeSummary"
              checked={!formData.excludeFeeSummary}
              onChange={() => setFormData(prev => ({ ...prev, excludeFeeSummary: false }))}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs">No</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Notes/Description
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="5"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter any additional notes or descriptions about the property..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Specific Contact Info
        </label>
        <textarea
          name="specificContactInfo"
          value={formData.specificContactInfo}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter specific contact information..."
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralInfo();
      case 'accounting':
        return renderAccountingBilling();
      case 'charges':
        return renderStandingCharges();
      case 'communications':
        return renderCommunications();
      case 'banking':
        return renderBanking();
      case 'notes':
        return renderNotes();
      case 'space':
      case 'deposit':
      case 'preferences':
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <FaBuilding className="text-4xl mx-auto mb-4 text-gray-300" />
            <p className="text-sm">This section is under development</p>
            <p className="text-xs mt-2">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-1   w-full h-full overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <h1 className="text-sm font-bold text-gray-800">Add New Property</h1>
            <p className="text-xs text-gray-600">Fill in the property details below</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
            >
              <FaSave /> Save Property
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-1">
          <div className="flex flex-wrap gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-medium flex items-center gap-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white border-b-2 border-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3">
            <form onSubmit={handleSubmit}>
              {renderContent()}
            </form>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-xs text-gray-500">
            Fields marked with * are required
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                // Reset form logic
                if (window.confirm('Are you sure you want to reset all fields?')) {
                  setFormData({
                    dateAcquired: '',
                    letManage: 'Managing',
                    landlords: [{ name: '', contact: '' }],
                    propertyCode: '',
                    propertyName: '',
                    lrNumber: '',
                    category: '',
                    propertyType: '',
                    specification: '',
                    multiStoreyType: '',
                    numberOfFloors: '',
                    country: 'Kenya',
                    townCityState: '',
                    estateArea: '',
                    roadStreet: '',
                    zoneRegion: '',
                    accountLedgerType: 'Property Control Ledger In GL',
                    primaryBank: '',
                    alternativeTaxPin: '',
                    invoicePrefix: '',
                    invoicePaymentTerms: 'Please pay your invoice before due date to avoid penalty.',
                    mpesaPaybill: true,
                    disableMpesaStkPush: false,
                    mpesaNarration: '',
                    standingCharges: [],
                    securityDeposits: [],
                    smsExemptions: {
                      all: false,
                      invoice: false,
                      general: false,
                      receipt: false,
                      balance: false
                    },
                    emailExemptions: {
                      all: false,
                      invoice: false,
                      general: false,
                      receipt: false,
                      balance: false
                    },
                    excludeFeeSummary: false,
                    drawerBank: '',
                    bankBranch: '',
                    accountName: '',
                    accountNumber: '',
                    notes: '',
                    specificContactInfo: ''
                  });
                }
              }}
              className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <FaSave /> Save Property
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;