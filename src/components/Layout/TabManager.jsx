// TabManager.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimes, FaHome, FaPlus, FaWindowClose } from 'react-icons/fa';

const TabManager = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState(() => {
    // Load tabs from localStorage or start with dashboard
    const saved = localStorage.getItem('app-tabs');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { 
        id: 'dashboard', 
        title: 'Dashboard', 
        route: '/dashboard', 
        closable: false, 
        timestamp: Date.now()
      }
    ];
  });
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('active-tab');
    return saved || 'dashboard';
  });

  // Save to localStorage whenever tabs or activeTab changes
  useEffect(() => {
    localStorage.setItem('app-tabs', JSON.stringify(tabs));
    localStorage.setItem('active-tab', activeTab);
  }, [tabs, activeTab]);

  // Get page title from route
  const getPageTitle = (pathname) => {
    const routeNames = {
      '/dashboard': 'Dashboard',
      '/system-setup': 'System Setup',
      '/system-setup/companies': 'Companies',
      '/system-setup/users': 'Users',
      '/system-setup/rights': 'System Rights',
      '/system-setup/database': 'Database',
      '/system-setup/sessions': 'Sessions',
      '/system-setup/audit': 'Audit Log',
      '/company-setup': 'Company Setup',
      '/properties': 'Properties',
      '/properties/new': 'New Property',
      '/tenants': 'Tenants',
      '/tenants/new': 'New Tenant',
      '/invoices': 'Invoices',
      '/invoices/new': 'New Invoice',
      '/receipts': 'Receipts',
      '/receipts/new': 'New Receipt',
      '/financial': 'Financial',
      '/reports': 'Reports',
      '/settings': 'Settings',
      '/users': 'Users',
      '/landlords': 'Landlords',
      '/leases': 'Leases',
      '/units': 'Units',
      '/agreements': 'Agreements',
      '/maintenance': 'Maintenance',
      '/inspections': 'Inspections',
    };
    
    if (routeNames[pathname]) return routeNames[pathname];
    
    // For dynamic routes like /properties/123
    const parts = pathname.split('/');
    if (parts.length === 3 && !isNaN(parts[2])) {
      const baseRoute = `/${parts[1]}`;
      const id = parts[2];
      if (routeNames[baseRoute]) {
        return `${routeNames[baseRoute]} #${id}`;
      }
    }
    
    return parts[parts.length - 1].charAt(0).toUpperCase() + 
           parts[parts.length - 1].slice(1) || 'New Tab';
  };

  // Helper functions to identify module contexts
  const isSystemSetupRoute = (route = "") => route.startsWith('/system-setup');
  const isCompanySetupRoute = (route = "") => route.startsWith('/company-setup');
  const isPropertyManagementRoute = (route = "") => !isSystemSetupRoute(route) && !isCompanySetupRoute(route);

  // Add new tab when URL changes (only if not already open)
  // Keep tabs for BOTH contexts in memory; only filter visibility at render time
  useEffect(() => {
    const currentPath = location.pathname;

    // Skip dashboard as it's already there
    if (currentPath === '/dashboard') {
      setActiveTab('dashboard');
      return;
    }

    const existingTab = tabs.find(tab => tab.route === currentPath);
    
    if (existingTab) {
      // Tab already exists, just activate it
      setActiveTab(existingTab.id);
    } else {
      // Create new tab
      const newTabId = `tab-${Date.now()}`;
      const newTab = {
        id: newTabId,
        title: getPageTitle(currentPath),
        route: currentPath,
        closable: true,
        timestamp: Date.now()
      };
      
      setTabs(prev => [...prev, newTab]);
      setActiveTab(newTabId);
    }
  }, [location.pathname, tabs]);

  // Switch to tab (navigate without reload)
  const switchTab = (tabId, route) => {
    setActiveTab(tabId);
    navigate(route);
  };

  // Close tab
  const closeTab = (tabId, e) => {
    if (e) e.stopPropagation();
    
    if (tabs.length <= 1) return;
    
    const tabToClose = tabs.find(tab => tab.id === tabId);
    if (!tabToClose || !tabToClose.closable) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    // If closing the active tab, determine contextual fallback based on current module
    if (activeTab === tabId) {
      const currentPath = location.pathname;
      const isSystemSetup = currentPath.startsWith('/system-setup');
      const isCompanySetup = currentPath.startsWith('/company-setup');
      
      let contextualTabs;
      if (isSystemSetup) {
        contextualTabs = newTabs.filter(tab => isSystemSetupRoute(tab.route));
      } else if (isCompanySetup) {
        contextualTabs = newTabs.filter(tab => isCompanySetupRoute(tab.route));
      } else {
        contextualTabs = newTabs.filter(tab => isPropertyManagementRoute(tab.route));
      }
      
      if (contextualTabs.length > 0) {
        const nextTab = contextualTabs.slice(-1)[0];
        setActiveTab(nextTab.id);
        navigate(nextTab.route);
      } else {
        // Fallback to appropriate default for each module
        if (isSystemSetup) {
          setActiveTab('dashboard');
          navigate('/system-setup');
        } else if (isCompanySetup) {
          setActiveTab('dashboard');
          navigate('/company-setup');
        } else {
          setActiveTab('dashboard');
          navigate('/dashboard');
        }
      }
    }
  };

  // Close all tabs except dashboard
  const closeAllTabs = () => {
    const dashboardTab = tabs.find(tab => !tab.closable);
    if (dashboardTab) {
      setTabs([dashboardTab]);
      setActiveTab('dashboard');
      navigate('/dashboard');
    }
  };

  // Add a new dashboard tab
  const addNewDashboardTab = () => {
    const newTabId = `dashboard-${Date.now()}`;
    const newTab = {
      id: newTabId,
      title: 'Dashboard',
      route: '/dashboard',
      closable: true,
      timestamp: Date.now()
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTabId);
    navigate('/dashboard');
  };

  // Sort tabs by timestamp (oldest first)
  const sortedTabs = [...tabs].sort((a, b) => a.timestamp - b.timestamp);

  // Strict context filtering: separate tabs for each module context
  const currentPath = location.pathname;
  const isSystemSetupContext = currentPath.startsWith('/system-setup');
  const isCompanySetupContext = currentPath.startsWith('/company-setup');
  
  const displayTabs = isSystemSetupContext
    ? sortedTabs.filter(tab => isSystemSetupRoute(tab.route))
    : isCompanySetupContext
    ? sortedTabs.filter(tab => isCompanySetupRoute(tab.route))
    : sortedTabs.filter(tab => isPropertyManagementRoute(tab.route));
  
  return (
    <div className={`flex items-center ${darkMode ? 'bg-gray-800' : 'bg-[#31694E]'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} overflow-x-auto`}>
      <div className="flex items-center px-2 py-1 space-x-1 min-w-max">
        {displayTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center px-3 py-1.5 rounded-t-md cursor-pointer transition-all duration-200 text-sm font-medium border-t border-l border-r ${
              activeTab === tab.id
                ? darkMode
                  ? 'bg-gray-900 text-white border-gray-600'
                  : 'bg-[#E85C0D] text-white border-gray-300 shadow-sm font-semibold'
                : darkMode
                ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => switchTab(tab.id, tab.route)}
            title={tab.title}
            onContextMenu={(e) => {
              e.preventDefault();
              if (tab.closable && window.confirm(`Close "${tab.title}" tab?`)) {
                closeTab(tab.id, e);
              }
            }}
          >
            {tab.route === '/dashboard' && <FaHome className="mr-2 w-3 h-3" />}
            <span className="text-xs truncate max-w-[120px]">{tab.title}</span>
            {tab.closable && displayTabs.length > 1 && (
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className={`ml-2 p-0.5 rounded-full ${
                  darkMode 
                    ? 'hover:bg-red-500 hover:text-white text-gray-400' 
                    : 'hover:bg-red-100 hover:text-red-600 text-gray-500'
                }`}
                title="Close tab"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        
        {/* New Tab Button - Only on property side */}
        {!isSystemSetupContext && !isCompanySetupContext && (
          <button
            onClick={addNewDashboardTab}
            className={`px-2 py-1.5 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
            title="Open new tab"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        )}
        
        {/* Close All Button - Only on property side */}
        {!isSystemSetupContext && !isCompanySetupContext && displayTabs.length > 1 && (
          <button
            onClick={closeAllTabs}
            className={`px-2 py-1.5 rounded-md ${
              darkMode 
                ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
            title="Close all tabs"
          >
            <FaWindowClose className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {/* Tab Counter - Only on property side */}
      {!isSystemSetupContext && !isCompanySetupContext && (
        <div className={`ml-auto px-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {displayTabs.length} tab{displayTabs.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TabManager;