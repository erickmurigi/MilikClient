// pages/EditProperty.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  FaSave, FaTimes, FaPlus, FaTrash, FaFileInvoice,
  FaBuilding, FaCalculator, FaChartBar, FaShieldAlt, FaCog,
  FaBell, FaStickyNote, FaHome, FaWarehouse, FaSpinner
} from 'react-icons/fa';
import { getPropertyById, updateProperty} from '../../redux/propertyRedux';
import { toast } from 'react-toastify';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProperty, loading, error } = useSelector((state) => state.property);

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(getProperty(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProperty) {
      // Transform the property data to match form structure
      const transformedData = {
        ...currentProperty,
        drawerBank: currentProperty.bankingDetails?.drawerBank || '',
        bankBranch: currentProperty.bankingDetails?.bankBranch || '',
        accountName: currentProperty.bankingDetails?.accountName || '',
        accountNumber: currentProperty.bankingDetails?.accountNumber || '',
        dateAcquired: currentProperty.dateAcquired 
          ? new Date(currentProperty.dateAcquired).toISOString().split('T')[0]
          : ''
      };
      setFormData(transformedData);
    }
  }, [currentProperty]);

  // ... All the form handler functions from AddProperty (handleChange, addLandlord, etc.)
  // Copy all the handler functions from AddProperty.js

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.propertyCode.trim() || !formData.propertyName.trim() || !formData.lrNumber.trim()) {
      toast.error('Please fill all required fields (*)');
      return;
    }

    try {
      const result = await dispatch(updateProperty({ 
        id, 
        propertyData: formData 
      })).unwrap();
      
      toast.success(result.message || 'Property updated successfully!');
      navigate(`/properties/${id}`);
    } catch (err) {
      toast.error(err || 'Failed to update property');
    }
  };

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // ... All the render functions from AddProperty
  // Copy all the render functions from AddProperty.js

  return (
    <DashboardLayout>
      <div className="p-1 w-full h-full overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <div>
            <h1 className="text-sm font-bold text-gray-800">Edit Property</h1>
            <p className="text-xs text-gray-600">{formData.propertyName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/properties/${id}`)}
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
                  <FaSave /> Update Property
                </>
              )}
            </button>
          </div>
        </div>

        {/* ... Rest of the JSX from AddProperty */}
        {/* Copy the JSX structure from AddProperty.js */}
      </div>
    </DashboardLayout>
  );
};

export default EditProperty;