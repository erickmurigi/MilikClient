import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

const PropertiesOverview = ({ darkMode }) => {
  const properties = useSelector(state => state.property?.properties || []);
  const units = useSelector(state => state.unit?.units || []);
  const rentPayments = useSelector(state => state.rentPayment?.rentPayments || []);
  const propertiesLoading = useSelector(state => state.property?.loading);

  // Filter for active properties only to match dashboard metrics
  const activeProperties = useMemo(() => 
    properties.filter(p => p.status === 'active'), 
    [properties]
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getId = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    return value._id || null;
  };

  const formatMoney = (value) => {
    if (value >= 1000000) return `KSh ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `KSh ${(value / 1000).toFixed(1)}K`;
    return `KSh ${Math.round(value).toLocaleString()}`;
  };

  const propertiesWithStats = useMemo(() => {
    const propertyStats = activeProperties.map(property => {
      const propertyId = property._id;
      const propertyUnits = units.filter(unit => getId(unit.property) === propertyId);

      const unitIds = new Set(propertyUnits.map(unit => unit._id));
      const occupiedUnits = propertyUnits.filter(unit => unit.status === 'occupied').length;
      const vacantUnits = propertyUnits.filter(unit => unit.status === 'vacant').length;
      const totalUnits = propertyUnits.length;

      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
      const expectedRevenue = propertyUnits.reduce((sum, unit) => sum + Number(unit.rent || 0), 0);

      const monthlyCollection = rentPayments
        .filter(payment => {
          const paymentDate = new Date(payment.paymentDate || payment.createdAt);
          if (Number.isNaN(paymentDate.getTime())) return false;
          const unitId = getId(payment.unit);
          return (
            unitId &&
            unitIds.has(unitId) &&
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

      const collectionRate = expectedRevenue > 0 ? (monthlyCollection / expectedRevenue) * 100 : 0;

      return {
        id: propertyId,
        name: property.propertyName || property.name || 'Unnamed Property',
        code: property.propertyCode || '---',
        totalUnits,
        occupiedUnits,
        vacantUnits,
        occupancyRate,
        expectedRevenue,
        monthlyCollection,
        collectionRate
      };
    });

    return propertyStats.sort((a, b) => b.occupancyRate - a.occupancyRate);
  }, [activeProperties, units, rentPayments, currentMonth, currentYear]);

  const portfolioOccupancy = useMemo(() => {
    const totalUnits = propertiesWithStats.reduce((sum, item) => sum + item.totalUnits, 0);
    const occupiedUnits = propertiesWithStats.reduce((sum, item) => sum + item.occupiedUnits, 0);
    return totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
  }, [propertiesWithStats]);

  return (
    <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-base font-extrabold uppercase tracking-tight ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>
          Properties Overview
        </h2>
        <button className="text-xs font-bold text-[#31694E] hover:text-[#E85C0D] transition-colors uppercase tracking-wide">
          View All →
        </button>
      </div>

      <div className={`mb-4 p-3 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-[#31694E]/20 bg-[#dfebed]/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-[#31694E]'}`}>
              Portfolio Occupancy
            </p>
            <p className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>
              {portfolioOccupancy.toFixed(1)}%
            </p>
          </div>
          <div className="text-right">
            <p className={`text-[11px] font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-[#31694E]'}`}>
              Properties
            </p>
            <p className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>
              {propertiesWithStats.length}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#31694E]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#31694E]/50">
        {propertiesWithStats.length === 0 ? (
          <div className={`p-6 rounded-lg border text-center ${
            darkMode
              ? 'bg-gray-700/30 border-gray-600 text-gray-400'
              : 'bg-gray-50/80 border-gray-200 text-gray-500'
          }`}>
            {propertiesLoading ? 'Loading properties...' : 'No properties found'}
          </div>
        ) : (
          propertiesWithStats.map((property) => (
            <div
              key={property.id}
              className={`p-4 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700/30 border-gray-600'
                  : 'bg-gray-50/80 border-gray-200'
              } hover:shadow-md hover:border-[#31694E]/30 transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className={`font-extrabold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {property.name}
                  </h4>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-0.5 font-semibold uppercase tracking-wide`}>
                    Code: {property.code}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-[#31694E]'}`}>
                    {property.occupancyRate.toFixed(0)}%
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-bold uppercase tracking-wide`}>
                    Occupancy
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`p-2 rounded-md border ${darkMode ? 'border-gray-600' : 'border-[#31694E]/20 bg-white/80'}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-[#31694E]'}`}>Units</div>
                  <div className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>
                    {property.occupiedUnits}/{property.totalUnits}
                  </div>
                </div>
                <div className={`p-2 rounded-md border ${darkMode ? 'border-gray-600' : 'border-[#E85C0D]/20 bg-white/80'}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-[#c7490a]'}`}>Vacant</div>
                  <div className="text-sm font-extrabold text-[#E85C0D]">{property.vacantUnits}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-bold`}>Occupancy</span>
                    <span className={`font-extrabold ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>
                      {property.occupancyRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#31694E] to-[#4a9976] rounded-full shadow-sm"
                      style={{ width: `${Math.min(property.occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-bold`}>Collection</span>
                    <span className="font-extrabold text-[#E85C0D]">
                      {formatMoney(property.monthlyCollection)} / {formatMoney(property.expectedRevenue)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E85C0D] to-[#ff8c42] rounded-full shadow-sm"
                      style={{ width: `${Math.min(property.collectionRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`mt-3 text-[11px] font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Live updates every 30 seconds
      </div>
    </div>
  );
};

export default PropertiesOverview;
