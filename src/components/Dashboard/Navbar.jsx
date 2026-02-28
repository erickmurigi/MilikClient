import React from 'react';
import { useSelector } from 'react-redux';
import {
  FaBars,
  FaBell,
  FaSignOutAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  
  const companyName = currentUser?.company?.companyName || 'Company';
  const userName = currentUser ? `${currentUser.surname} ${currentUser.otherNames}` : 'User';
  const profile = currentUser?.profile || 'User';

  const handleLogout = () => {
    localStorage.removeItem('milik_token');
    localStorage.removeItem('milik_user');
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-20 ${darkMode ? 'bg-[#dfebed] text-white' : 'bg-[#dfebed] text-gray-900'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
      <div className="px-5 py-1">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaBars className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
            </button>
            
            <div>
              <h1 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {companyName}
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome back, {userName.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-yellow-500 text-lg" />
              ) : (
                <FaMoon className="text-gray-600 text-lg" />
              )}
            </button>

            {/* Notifications */}
            <button className={`relative p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <FaBell className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#369519] to-[#0b570b] flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </span>
              </div>
              <div className="hidden md:block text-right">
                <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userName}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {profile}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Logout"
              >
                <FaSignOutAlt className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;