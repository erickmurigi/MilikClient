import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRentPayments } from '../../redux/apiCalls';
import { getProperties } from '../../redux/propertyRedux';
import { getTenants } from '../../redux/tenantsRedux';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FaPrint, FaFileDownload, FaFilter, FaFileInvoiceDollar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MILIK_GREEN = "#0B3B2E";
const MILIK_GREEN_BG = "bg-[#0B3B2E]";
const MILIK_ORANGE = "#FF8C00";

const TaxReports = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const currentCompany = useSelector((state) => state.company?.currentCompany);
  const { rentPayments } = useSelector((state) => state.rentPayment);
  const { properties } = useSelector((state) => state.property);
  const { tenants } = useSelector((state) => state.tenants);

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    propertyId: '',
    taxType: 'vat' // vat, withholding
  });

  const VAT_RATE = 0.16; // 16% VAT
  const WITHHOLDING_TAX_RATE = 0.10; // 10% Withholding tax

  useEffect(() => {
    const businessId = currentCompany?._id || currentUser?.company?._id || currentUser?.company;
    if (businessId) {
      setLoading(true);
      Promise.all([
        getRentPayments(dispatch, businessId),
        dispatch(getProperties({ business: businessId })),
        dispatch(getTenants({ business: businessId }))
      ]).finally(() => setLoading(false));
    }
  }, [currentCompany?._id, currentUser?.company, dispatch]);

  // Filter payments by date
  const filteredPayments = rentPayments?.filter(payment => {
    const paymentDate = new Date(payment.paymentDate);
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const matchesDate = paymentDate >= start && paymentDate <= end;
    const matchesProperty = !filters.propertyId || payment.property?._id === filters.propertyId || payment.property === filters.propertyId;
    return matchesDate && matchesProperty;
  }) || [];

  // Calculate tax breakdown
  const taxData = filteredPayments.map(payment => {
    const propertyId = payment.property?._id || payment.property;
    const propertyData = properties?.find(p => p._id === propertyId);
    const tenantId = payment.tenant?._id || payment.tenant;
    const tenantData = tenants?.find(t => t._id === tenantId);

    const amountBeforeTax = payment.amountPaid || 0;
    const vatAmount = amountBeforeTax * VAT_RATE;
    const withholdingTaxAmount = amountBeforeTax * WITHHOLDING_TAX_RATE;

    return {
      paymentId: payment._id,
      date: payment.paymentDate,
      tenant: tenantData?.tenantName || 'N/A',
      property: propertyData?.propertyName || 'N/A',
      unit: payment.unit?.unitNumber || 'N/A',
      amountBeforeTax,
      vatAmount,
      withholdingTaxAmount,
 receiptNumber: payment.receiptNumber || 'N/A'
    };
  });

  // Calculate totals
  const totals = {
    amountBeforeTax: taxData.reduce((sum, td) => sum + td.amountBeforeTax, 0),
    vatAmount: taxData.reduce((sum, td) => sum + td.vatAmount, 0),
    withholdingTaxAmount: taxData.reduce((sum, td) => sum + td.withholdingTaxAmount, 0)
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvData = [
      ['Date', 'Tenant', 'Property', 'Unit', 'Amount Before Tax', 'VAT (16%)', 'Withholding Tax (10%)', 'Receipt #'].join(','),
      ...taxData.map(td => [
        new Date(td.date).toLocaleDateString(),
        td.tenant,
        td.property,
        td.unit,
        td.amountBeforeTax,
        td.vatAmount.toFixed(2),
        td.withholdingTaxAmount.toFixed(2),
        td.receiptNumber
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_report_${filters.startDate}_to_${filters.endDate}.csv`;
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
                  <FaFileInvoiceDollar style={{ color: MILIK_GREEN }} />
                  Tax Reports
                </h1>
                <p className="text-gray-600 mt-1">VAT and Withholding Tax analysis</p>
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
            <div className="grid grid-cols-3 gap-4">
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
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Amount Before Tax</div>
              <div className="text-3xl font-bold text-gray-900">
                KES {totals.amountBeforeTax.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">VAT (16%)</div>
              <div className="text-3xl font-bold" style={{ color: MILIK_ORANGE }}>
                KES {totals.vatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Withholding Tax (10%)</div>
              <div className="text-3xl font-bold" style={{ color: MILIK_GREEN }}>
                KES {totals.withholdingTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Tax Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className={`${MILIK_GREEN_BG} text-white px-6 py-4`}>
              <h3 className="text-lg font-bold">Tax Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tenant</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Property</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">VAT (16%)</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">W/H Tax (10%)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Receipt #</th>
                  </tr>
                </thead>
                <tbody>
                  {taxData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No tax data available for the selected period
                      </td>
                    </tr>
                  ) : (
                    taxData.map((td) => (
                      <tr key={td.paymentId} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(td.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{td.tenant}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{td.property}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{td.unit}</td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                          KES {td.amountBeforeTax.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold" style={{ color: MILIK_ORANGE }}>
                          KES {td.vatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold" style={{ color: MILIK_GREEN }}>
                          KES {td.withholdingTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{td.receiptNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-100 font-bold">
                  <tr>
                    <td colSpan="4" className="px-6 py-4text-sm">TOTAL</td>
                    <td className="px-6 py-4 text-sm text-right">
                      KES {totals.amountBeforeTax.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right" style={{ color: MILIK_ORANGE }}>
                      KES {totals.vatAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-right" style={{ color: MILIK_GREEN }}>
                      KES {totals.withholdingTaxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
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

export default TaxReports;
