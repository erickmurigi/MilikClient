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
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaBars className="text-gray-600 dark:text-gray-400" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, Ezekiel</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-yellow-500 text-lg" />
              ) : (
                <FaMoon className="text-gray-600 text-lg" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FaBell className="text-gray-600 dark:text-gray-400 text-lg" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Demo Warning */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 
                          border border-amber-200 dark:border-amber-800 rounded-lg">
              <FaExclamationTriangle className="text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Demo Account</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 
                            flex items-center justify-center">
                <span className="text-white font-semibold">EM</span>
              </div>
              <div className="hidden md:block text-right">
                <p className="font-semibold text-gray-900 dark:text-white">Ezekiel Muki</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
              </div>
              <Link to="/logout">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FaSignOutAlt className="text-gray-600 dark:text-gray-400 text-lg" />
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