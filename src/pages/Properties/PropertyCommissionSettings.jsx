import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProperties, updateProperty } from '../../redux/propertyRedux';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FaEdit, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

const MILIK_GREEN = "bg-[#0B3B2E]";
const MILIK_GREEN_HOVER = "hover:bg-[#0A3127]";

const PropertyCommissionSettings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const { properties } = useSelector((state) => state.property);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    commissionPercentage: 0,
    commissionRecognitionBasis: 'received',
    tenantsPaysTo: 'propertyManager',
    depositHeldBy: 'propertyManager'
  });

  useEffect(() => {
    const businessId = currentCompany?._id || currentUser?.company?._id || currentUser?.company;
    if (businessId) {
      setLoading(true);
      dispatch(getProperties({ business: businessId }))
        .finally(() => setLoading(false));
    }
  }, [currentCompany?._id, currentUser?.company, dispatch]);

  const handlePropertySelect = (e) => {
    const propertyId = e.target.value;
    const property = properties.find(p => p._id === propertyId);
    
    if (property) {
      setSelectedProperty(property);
      setFormData({
        commissionPercentage: property.commissionPercentage || 0,
        commissionRecognitionBasis: property.commissionRecognitionBasis || 'received',
        tenantsPaysTo: property.tenantsPaysTo || 'propertyManager',
        depositHeldBy: property.depositHeldBy || 'propertyManager'
      });
    } else {
      setSelectedProperty(null);
      setFormData({
        commissionPercentage: 0,
        commissionRecognitionBasis: 'received',
        tenantsPaysTo: 'propertyManager',
        depositHeldBy: 'propertyManager'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'commissionPercentage' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProperty) {
      toast.error('Please select a property');
      return;
    }

    if (formData.commissionPercentage < 0 || formData.commissionPercentage > 100) {
      toast.error('Commission percentage must be between 0 and 100');
      return;
    }

    setSaving(true);
    try {
      await dispatch(updateProperty({ id: selectedProperty._id, propertyData: formData })).unwrap();
      toast.success('Commission settings updated successfully');
    } catch (error) {
      console.error('Error updating commission settings:', error);
      toast.error('Failed to update commission settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedProperty(null);
    setFormData({
      commissionPercentage: 0,
      commissionRecognitionBasis: 'received',
      tenantsPaysTo: 'propertyManager',
      depositHeldBy: 'propertyManager'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Commission Settings</h1>
              <p className="text-gray-600 mt-1">Quick edit commission for a property</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          {/* Quick Edit Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Property</label>
              <select
                value={selectedProperty?._id || ''}
                onChange={handlePropertySelect}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">-- Select Property --</option>
                {properties?.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.propertyCode} - {property.propertyName}
                  </option>
                ))}
              </select>
            </div>

            {selectedProperty && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Property Info */}
                <div className={`${MILIK_GREEN} text-white rounded-lg p-4`}>
                  <h3 className="font-bold text-lg">{selectedProperty.propertyName}</h3>
                  <p className="text-sm opacity-90">Code: {selectedProperty.propertyCode}</p>
                </div>

                {/* Commission % */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Commission (%)</label>
                  <input
                    type="number"
                    name="commissionPercentage"
                    value={formData.commissionPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of rent as management commission</p>
                </div>

                {/* Recognition Basis */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recognition Basis</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="commissionRecognitionBasis"
                        value="received"
                        checked={formData.commissionRecognitionBasis === 'received'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Received</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="commissionRecognitionBasis"
                        value="invoiced"
                        checked={formData.commissionRecognitionBasis === 'invoiced'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Invoiced</span>
                    </label>
                  </div>
                </div>

                {/* Tenants Pay To */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tenants Pay To</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="tenantsPaysTo"
                        value="propertyManager"
                        checked={formData.tenantsPaysTo === 'propertyManager'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Manager</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="tenantsPaysTo"
                        value="landlord"
                        checked={formData.tenantsPaysTo === 'landlord'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Landlord</span>
                    </label>
                  </div>
                </div>

                {/* Deposit Held By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deposits Held By</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="depositHeldBy"
                        value="propertyManager"
                        checked={formData.depositHeldBy === 'propertyManager'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Manager</span>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="depositHeldBy"
                        value="landlord"
                        checked={formData.depositHeldBy === 'landlord'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Landlord</span>
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 ${MILIK_GREEN} ${MILIK_GREEN_HOVER} text-white font-semibold rounded-lg transition disabled:opacity-50`}
                  >
                    <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition"
                  >
                    <FaTimes /> Clear
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> To view and manage all property commissions at once, visit the <strong>Commission List</strong> page from the Properties menu.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyCommissionSettings;
