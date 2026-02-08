// pages/AddProperty.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaSave, FaTimes, FaPlus, FaTrash, FaFileInvoice,
  FaBuilding, FaCalculator, FaChartBar, FaShieldAlt, FaCog,
  FaBell, FaStickyNote, FaHome, FaWarehouse, FaSpinner
} from 'react-icons/fa';
import { createProperty } from '../../redux/propertyRedux';
import { toast } from 'react-toastify';

const AddProperty = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.property);
  const { currentBusiness } = useSelector((state) => state.business);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    // General Information
    dateAcquired: '',
    letManage: 'Managing',
    landlords: [{ name: '', contact: '', isPrimary: true }],
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
    address: '',
    
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
    specificContactInfo: '',
    description: '',
    
    // Status
    status: 'active',
    images: []
  });

  // Handle form field changes
  const handleChange = (e, section = null, index = null) => {
    const { name, value, type, checked } = e.target;
    
    if (section === 'landlords' && index !== null) {
      const updatedLandlords = [...formData.landlords];
      updatedLandlords[index] = {
        ...updatedLandlords[index],
        [name]: value,
        isPrimary: index === 0
      };
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

  // Add/remove landlords
  const addLandlord = () => {
    setFormData(prev => ({
      ...prev,
      landlords: [...prev.landlords, { name: '', contact: '', isPrimary: false }]
    }));
  };

  const removeLandlord = (index) => {
    const updatedLandlords = formData.landlords.filter((_, i) => i !== index);
    // Ensure first landlord is primary
    if (index === 0 && updatedLandlords.length > 0) {
      updatedLandlords[0].isPrimary = true;
    }
    setFormData(prev => ({ ...prev, landlords: updatedLandlords }));
  };

  // Add/remove standing charges
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

  // Add/remove security deposits
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.propertyCode.trim() || !formData.propertyName.trim() || !formData.lrNumber.trim()) {
      toast.error('Please fill all required fields (*)');
      return;
    }

    if (!formData.landlords[0]?.name.trim()) {
      toast.error('Primary landlord name is required');
      return;
    }

    // Prepare data for API
    const propertyData = {
      ...formData,
      business: currentBusiness?._id || user?.business,
      createdBy: user?._id,
      updatedBy: user?._id
    };

    try {
      const result = await dispatch(createProperty(propertyData)).unwrap();
      toast.success(result.message || 'Property created successfully!');
      navigate('/properties'); // Redirect to properties list
    } catch (err) {
      toast.error(err || 'Failed to create property');
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setFormData({
        dateAcquired: '',
        letManage: 'Managing',
        landlords: [{ name: '', contact: '', isPrimary: true }],
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
        address: '',
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
        specificContactInfo: '',
        description: '',
        status: 'active',
        images: []
      });
    }
  };



  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // ... rest of the component code (render functions) remains the same ...

  return (
    <DashboardLayout>
      <div className="p-1 w-full h-full overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <h1 className="text-sm font-bold text-gray-800">Add New Property</h1>
            <p className="text-xs text-gray-600">Fill in the property details below</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-1 text-xs border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-1 text-xs bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Property
                </>
              )}
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
                disabled={loading}
                className={`px-4 py-2 text-xs font-medium flex items-center gap-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white border-b-2 border-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              onClick={() => navigate(-1)}
              disabled={loading}
              className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Property
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ... rest of the render functions remain exactly the same ...

export default AddProperty;