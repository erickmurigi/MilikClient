import React, { useState } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Navbar from '../Dashboard/Navbar';
import { Toaster } from 'react-hot-toast';
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#FFFFFF',
            color: darkMode ? '#FFFFFF' : '#374151',
            border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
          },
        }}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'fixed inset-0 z-50 lg:relative lg:z-auto' : 'hidden lg:block'}
        `}>
          <div className={`
            ${sidebarOpen ? 'fixed inset-y-0 left-0 w-64' : 'lg:relative lg:w-64'}
          `}>
            <Sidebar 
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="max-w-full">
              {/* Pass darkMode to all child components */}
              {React.Children.map(children, child => {
                return React.cloneElement(child, { darkMode });
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;