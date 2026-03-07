import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRentPayments, getLandlords } from '../../redux/apiCalls';
import { getProperties } from '../../redux/propertyRedux';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FaPrint, FaFileDownload, FaFilter, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MILIK_GREEN = "#0B3B2E";
const MILIK_GREEN_BG = "bg-[#0B3B2E]";
const MILIK_ORANGE = "#FF8C00";

const CommissionReports = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const { rentPayments } = useSelector((state) => state.rentPayment);
  const { properties } = useSelector((state) => state.property);
  const { landlords } = useSelector((state) => state.landlord);

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    propertyId: '',
    landlordId: ''
  });

  useEffect(() => {
    const businessId = currentCompany?._id || currentUser?.company?._id || currentUser?.company;
    if (businessId) {
      setLoading(true);
      Promise.all([
        getRentPayments(dispatch, businessId),
        dispatch(getProperties({ business: businessId })),
        dispatch(getLandlords({ company: businessId }))
      ]).finally(() => setLoading(false));
    }
  }, [currentCompany?._id, currentUser?.company, dispatch]);

  // Calculate commissions
  const commissionData = properties?.map(property => {
    if (!property.commissionPercentage || property.commissionPercentage === 0) return null;

    const propertyPayments = rentPayments?.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      const paymentPropertyId = payment.property?._id || payment.property;
      
      return paymentPropertyId === property._id && paymentDate >= start && paymentDate <= end;
    }) || [];

    const landlordId = property.landlord?._id || property.landlord;
    const landlordData = landlords?.find(l => l._id === landlordId);

    // Calculate total rent collected
    const totalRentCollected = propertyPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    
    // Calculate commission based on recognition basis
    const basisAmount = property.commissionRecognitionBasis === 'received' 
      ? totalRentCollected 
      : totalRentCollected; // In a real system, you'd have invoiced amounts

    const commissionAmount = (basisAmount * property.commissionPercentage) / 100;

    return {
      propertyId: property._id,
      propertyName: property.propertyName,
      propertyCode: property.propertyCode,
      landlord: landlordData?.landlordName || 'N/A',
      landlordId: landlordId,
      commissionPercentage: property.commissionPercentage,
      recognitionBasis: property.commissionRecognitionBasis,
      rentCollected: totalRentCollected,
      commissionAmount
    };
  }).filter(Boolean) || [];

  // Apply filters
  const filteredData = commissionData.filter(cd => {
    const matchesProperty = !filters.propertyId || cd.propertyId === filters.propertyId;
    const matchesLandlord = !filters.landlordId || cd.landlordId === filters.landlordId;
    return matchesProperty && matchesLandlord;
  });

  // Calculate totals
  const totals = {
    rentCollected: filteredData.reduce((sum, cd) => sum + cd.rentCollected, 0),
    commission: filteredData.reduce((sum, cd) => sum + cd.commissionAmount, 0),
    properties: filteredData.length
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvData = [
      ['Property Code', 'Property Name', 'Landlord', 'Commission %', 'Recognition Basis', 'Rent Collected', 'Commission Amount'].join(','),
      ...filteredData.map(cd => [
        cd.propertyCode,
        cd.propertyName,
        cd.landlord,
        cd.commissionPercentage,
        cd.recognitionBasis,
        cd.rentCollected,
        cd.commissionAmount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commission_report_${filters.startDate}_to_${filters.endDate}.csv`;
    a.click();
    toast.success('Report exported successfully');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaMoneyBillWave style={{ color: MILIK_GREEN }} />
                  Commission Reports
                </h1>
                <p className="text-gray-600 mt-1">Management commission analysis by property</p>
              </div>
              <div className="flex gap-3 print:hidden">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  <FaFileDownload /> Export CSV
                </button>
                <button
                  onClick={handlePrint}
                  className={`flex items-center gap-2 px-4 py-2 ${MILIK_GREEN_BG} hover:bg-[#0A3127] text-white rounded-lg font-semibold transition`}
                >
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 print:hidden">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaFilter style={{ color: MILIK_ORANGE }} />
              Filters
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property</label>
                <select
                  value={filters.propertyId}
                  onChange={(e) => setFilters(prev => ({ ...prev, propertyId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Properties</option>
                  {properties?.map(prop => (
                    <option key={prop._id} value={prop._id}>{prop.propertyName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Landlord</label>
                <select
                  value={filters.landlordId}
                  onChange={(e) => setFilters(prev => ({ ...prev, landlordId: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Landlords</option>
                  {landlords?.map(landlord => (
                    <option key={landlord._id} value={landlord._id}>{landlord.landlordName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Rent Collected</div>
              <div className="text-3xl font-bold text-gray-900">
                KES {totals.rentCollected.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Commission</div>
              <div className="text-3xl font-bold" style={{ color: MILIK_GREEN }}>
                KES {totals.commission.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Properties</div>
              <div className="text-3xl font-bold" style={{ color: MILIK_ORANGE }}>{totals.properties}</div>
            </div>
          </div>

          {/* Commission Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className={`${MILIK_GREEN_BG} text-white px-6 py-4`}>
              <h3 className="text-lg font-bold">Commission Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Property</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Landlord</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Commission %</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Basis</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Rent Collected</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No commission data available for the selected period
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((cd) => (
                      <tr key={cd.propertyId} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{cd.propertyCode}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{cd.propertyName}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{cd.landlord}</td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${MILIK_ORANGE}15`, color: MILIK_ORANGE }}>
                            {cd.commissionPercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 capitalize">{cd.recognitionBasis}</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-700">
                          KES {cd.rentCollected.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-bold" style={{ color: MILIK_GREEN }}>
                          KES {cd.commissionAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-100 font-bold">
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-sm">TOTAL</td>
                    <td className="px-6 py-4 text-sm text-right">
                      KES {totals.rentCollected.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right" style={{ color: MILIK_GREEN }}>
                      KES {totals.commission.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block mt-8 text-center text-sm text-gray-600">
            <p>Generated on {new Date().toLocaleString()} | {currentCompany?.name || 'Milik Property Management'}</p>
            <p className="mt-1">Period: {new Date(filters.startDate).toLocaleDateString()} - {new Date(filters.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommissionReports;
