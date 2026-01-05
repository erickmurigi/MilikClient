import React from 'react';
import {
  FaBars,
  FaBell,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  return (
    <nav className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
      <div className="px-6 py-4">
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
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dashboard Overview
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome back, Ezekiel
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

            {/* Demo Warning */}
            <div className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg
                          ${darkMode 
                            ? 'bg-amber-900/20 border border-amber-800' 
                            : 'bg-amber-50 border border-amber-200'
                          }`}>
              <FaExclamationTriangle className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
              <span className={`text-sm font-medium ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                Demo Account
              </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 
                            flex items-center justify-center">
                <span className="text-white font-semibold">EM</span>
              </div>
              <div className="hidden md:block text-right">
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ezekiel Muki
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Admin
                </p>
              </div>
              <Link to="/logout">
                <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <FaSignOutAlt className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;