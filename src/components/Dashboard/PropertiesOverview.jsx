import React from 'react';
import { FaBuilding } from 'react-icons/fa';

const PropertiesOverview = ({ darkMode }) => {
  const properties = [
    { id: 1, name: 'Greenview Apartments', units: 15, occupied: 12, occupancy: '80%', revenue: 'KSh 450,000' },
    { id: 2, name: 'Riverside Villas', units: 8, occupied: 8, occupancy: '100%', revenue: 'KSh 320,000' },
    { id: 3, name: 'City Center Flats', units: 20, occupied: 10, occupancy: '50%', revenue: 'KSh 280,000' },
    { id: 4, name: 'Hilltop Estate', units: 12, occupied: 9, occupancy: '75%', revenue: 'KSh 360,000' }
  ];

  return (
    <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Properties Overview</h2>
        <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
          View All →
        </button>
      </div>
      <div className="space-y-4">
        {properties.map((property) => (
          <div 
            key={property.id}
            className={`p-4 rounded-xl border ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            } hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold dark:text-white">{property.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {property.occupied}/{property.units} units occupied
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold dark:text-white">{property.occupancy}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Occupancy</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                <span className="font-semibold dark:text-white">{property.revenue}/month</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                  style={{ width: property.occupancy }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesOverview;