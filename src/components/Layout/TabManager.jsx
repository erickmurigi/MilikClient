// TabManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimes, FaHome, FaPlus, FaWindowClose } from 'react-icons/fa';

const TabManager = ({ darkMode }) => {
  const [tabs, setTabs] = useState([
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      route: '/dashboard', 
      closable: false, 
      icon: <FaHome />,
      timestamp: Date.now()
    }
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabCounter, setTabCounter] = useState(1); // For unique tab IDs
  const location = useLocation();
  const navigate = useNavigate();
  const prevLocation = useRef(location.pathname);

  // Get page title from route
  const getPageTitle = (pathname, searchParams = '') => {
    const routeNames = {
      '/dashboard': 'Dashboard',
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
    
    // Try to match exact path first
    if (routeNames[pathname]) return routeNames[pathname];
    
    // Try to match by prefix
    for (const [route, title] of Object.entries(routeNames)) {
      if (pathname.startsWith(route) && route !== '/') {
        // Check if we have ID in URL for more specific title
        const match = pathname.match(/\/(\d+)$/);
        if (match) {
          return `${title} #${match[1]}`;
        }
        return title;
      }
    }
    
    // Default: extract from pathname
    const path = pathname.split('/').pop();
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
  };

  // Add new tab (called from menu items with "newTab" parameter)
  const addNewTab = (route, title) => {
    const newTabId = `${route}-${tabCounter}`;
    const newTab = {
      id: newTabId,
      title: title || getPageTitle(route),
      route: route,
      closable: true,
      icon: route === '/dashboard' ? <FaHome /> : null,
      timestamp: Date.now()
    };

    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTab(newTabId);
    setTabCounter(prev => prev + 1);
    navigate(route);
  };

  // Add tab when route changes (for backward compatibility)
  useEffect(() => {
    const pathname = location.pathname;
    const search = location.search;
    
    // Don't do anything if we're just switching between existing tabs
    if (prevLocation.current === pathname + search) {
      return;
    }
    
    const title = getPageTitle(pathname, search);
    const tabId = pathname.replace(/\//g, '-') + (search ? search.replace(/[?&=]/g, '-') : '') || 'dashboard';
    
    // Check if this is a navigation that should open a new tab
    // We'll assume that if the user clicks a menu item from the toolbar, it should open in new tab
    // But if they click on a tab to switch, it shouldn't create a new one
    
    setTabs(prevTabs => {
      // Check if tab already exists with this exact route
      const existingTab = prevTabs.find(tab => tab.route === pathname + search);
      
      if (existingTab) {
        // Tab exists, just activate it
        setActiveTab(existingTab.id);
        return prevTabs;
      }
      
      // Check if we have a similar tab (same base path) that we should replace
      // This simulates browser behavior where going to same type of page replaces current tab
      const isSameType = prevTabs.some(tab => {
        const tabBase = tab.route.split('/')[1];
        const newBase = pathname.split('/')[1];
        return tabBase === newBase && tab.id === activeTab;
      });
      
      if (isSameType) {
        // Replace current tab with new one (browser-like behavior)
        const newTabs = prevTabs.map(tab => {
          if (tab.id === activeTab) {
            return {
              ...tab,
              id: tabId,
              title,
              route: pathname + search,
              timestamp: Date.now()
            };
          }
          return tab;
        });
        setActiveTab(tabId);
        return newTabs;
      } else {
        // Add as new tab
        const newTab = {
          id: tabId,
          title,
          route: pathname + search,
          closable: pathname !== '/dashboard',
          icon: pathname === '/dashboard' ? <FaHome /> : null,
          timestamp: Date.now()
        };
        
        setActiveTab(tabId);
        return [...prevTabs, newTab];
      }
    });
    
    prevLocation.current = pathname + search;
  }, [location.pathname, location.search]);

  // Close tab
  const closeTab = (tabId, e) => {
    if (e) e.stopPropagation();
    
    if (tabs.length <= 1) return; // Don't close the last tab
    
    const tabToClose = tabs.find(tab => tab.id === tabId);
    if (!tabToClose || !tabToClose.closable) return;
    
    // Remove the tab
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If we're closing the active tab, switch to another tab
    if (tabId === activeTab) {
      const closedTabIndex = tabs.findIndex(tab => tab.id === tabId);
      let newActiveTab;
      
      if (closedTabIndex > 0) {
        // Switch to previous tab
        newActiveTab = tabs[closedTabIndex - 1].id;
        navigate(tabs[closedTabIndex - 1].route);
      } else {
        // Switch to next tab
        newActiveTab = tabs[closedTabIndex + 1].id;
        navigate(tabs[closedTabIndex + 1].route);
      }
      
      setActiveTab(newActiveTab);
    }
  };

  // Switch to tab
  const switchTab = (tabId, route) => {
    setActiveTab(tabId);
    navigate(route);
    prevLocation.current = route;
  };

  // Close all tabs except current
  const closeOtherTabs = (currentTabId) => {
    const currentTab = tabs.find(tab => tab.id === currentTabId);
    if (!currentTab) return;
    
    // Keep only the current tab and dashboard (if it's not the current)
    const newTabs = tabs.filter(tab => 
      tab.id === currentTabId || tab.id === 'dashboard'
    );
    
    // If we removed dashboard and it's not the current tab, add it back
    if (!newTabs.some(tab => tab.id === 'dashboard')) {
      const dashboardTab = tabs.find(tab => tab.id === 'dashboard');
      if (dashboardTab) {
        newTabs.unshift(dashboardTab);
      }
    }
    
    setTabs(newTabs);
    setActiveTab(currentTabId);
  };

  // Close all tabs
  const closeAllTabs = () => {
    const dashboardTab = tabs.find(tab => tab.id === 'dashboard');
    if (dashboardTab) {
      setTabs([dashboardTab]);
      setActiveTab('dashboard');
      navigate('/dashboard');
    }
  };

  // Close tabs to the right
  const closeTabsToRight = (currentTabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
    if (currentIndex === -1) return;
    
    const newTabs = tabs.slice(0, currentIndex + 1);
    setTabs(newTabs);
    
    // If current tab is not active after closing, activate it
    if (!newTabs.some(tab => tab.id === activeTab)) {
      setActiveTab(currentTabId);
    }
  };

  // Sort tabs by timestamp (most recent first)
  const sortedTabs = [...tabs].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className={`flex items-center ${darkMode ? 'bg-gray-800' : 'bg-[#ffffff]'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'} overflow-x-auto`}>
      <div className="flex items-center px-2 py-1 space-x-1 min-w-max">
        {sortedTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center px-3 py-1.5 rounded-t-md cursor-pointer transition-all duration-200 text-sm font-medium border-t border-l border-r ${
              activeTab === tab.id
                ? darkMode
                  ? 'bg-gray-900 text-white border-gray-600'
                  : 'bg-white text-gray-900 border-gray-300 shadow-sm'
                : darkMode
                ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => switchTab(tab.id, tab.route)}
            title={tab.title}
            onContextMenu={(e) => {
              e.preventDefault();
              // Show context menu options
              if (window.confirm(`Close "${tab.title}" tab?`)) {
                closeTab(tab.id, e);
              }
            }}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            <span className="text-xs truncate max-w-[120px]">{tab.title}</span>
            {tab.closable && tabs.length > 1 && (
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
        
        {/* New Tab Button */}
        <button
          onClick={() => addNewTab('/dashboard', 'New Dashboard')}
          className={`px-2 py-1.5 rounded-md ${
            darkMode 
              ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }`}
          title="Open new tab"
        >
          <FaPlus className="w-3 h-3" />
        </button>
        
        {/* Close All Button (visible when multiple tabs are open) */}
        {tabs.length > 2 && (
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
      
      {/* Tab Counter */}
      <div className={`ml-auto px-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {tabs.length} tab{tabs.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default TabManager;