import React from 'react';
import { useSelector } from 'react-redux';
import {
  FaBars,
  FaBell,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBuilding
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  
  const companyName = currentUser?.company?.companyName || 'Milik';
  const userName = currentUser ? `${currentUser.surname} ${currentUser.otherNames}` : 'User';
  const profile = currentUser?.profile || 'User';

  const handleLogout = () => {
    localStorage.removeItem('milik_token');
    localStorage.removeItem('milik_user');
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-20 ${darkMode ? 'bg-gray-900' : 'bg-[#dfebed]'} border-b ${darkMode ? 'border-gray-700' : 'border-[#c5d9d3]'} shadow-md`}>
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo and Company Name */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-[#c5d9d3] text-gray-700'}`}
            >
              <FaBars />
            </button>
            
            {/* MILIK Logo and Branding */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#31694E] to-[#1f4a35] shadow-md">
                <FaBuilding className="text-white text-lg" />
              </div>
              <div>
                <h1 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>
                  {companyName}
                </h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-[#4a6b5e]'}`}>
                  Property Management System
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-[#c5d9d3] hover:bg-[#b3d1c7] text-[#1f4a35]'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-lg" />
              ) : (
                <FaMoon className="text-lg" />
              )}
            </button>

            {/* Notifications */}
            <button className={`relative p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-[#c5d9d3] text-[#4a6b5e]'}`}>
              <FaBell className="text-lg" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile */}
            <div className={`flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l ${darkMode ? 'border-gray-700' : 'border-[#c5d9d3]'}`}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#31694E] to-[#1f4a35] flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-semibold">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </span>
              </div>
              <div className="hidden md:block text-right">
                <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-[#1f4a35]'}`}>
                  {userName}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-[#4a6b5e]'}`}>
                  {profile}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-red-400' : 'hover:bg-red-100 text-[#4a6b5e] hover:text-red-600'}`}
                title="Logout"
              >
                <FaSignOutAlt className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;