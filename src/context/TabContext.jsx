// TabContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TabContext = createContext();

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState([
    { 
      id: 'dashboard', 
      title: 'Dashboard', 
      route: '/dashboard', 
      closable: false, 
      timestamp: Date.now()
    }
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabCounter, setTabCounter] = useState(1);
  const navigate = useNavigate();

  // Helper function to get page title from route
  const getPageTitle = (pathname) => {
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
    
    return routeNames[pathname] || 
           pathname.split('/').pop().charAt(0).toUpperCase() + 
           pathname.split('/').pop().slice(1) || 'New Tab';
  };

  // Add a new tab
  const addNewTab = (route, title = null) => {
    const tabTitle = title || getPageTitle(route);
    const newTabId = `${route.replace(/\//g, '-')}-${tabCounter}`;
    
    const newTab = {
      id: newTabId,
      title: tabTitle,
      route: route,
      closable: route !== '/dashboard',
      timestamp: Date.now()
    };

    setTabs(prevTabs => {
      // Check if tab with same route already exists
      const existingTabIndex = prevTabs.findIndex(tab => tab.route === route);
      if (existingTabIndex !== -1) {
        // Update existing tab and move it to the end
        const updatedTabs = [...prevTabs];
        updatedTabs[existingTabIndex] = {
          ...updatedTabs[existingTabIndex],
          timestamp: Date.now()
        };
        setActiveTab(updatedTabs[existingTabIndex].id);
        navigate(route);
        return updatedTabs;
      }
      
      // Add new tab
      const newTabs = [...prevTabs, newTab];
      setActiveTab(newTabId);
      setTabCounter(prev => prev + 1);
      navigate(route);
      return newTabs;
    });
  };

  // Switch to an existing tab
  const switchTab = (tabId, route) => {
    setActiveTab(tabId);
    navigate(route);
  };

  // Close a tab
  const closeTab = (tabId) => {
    if (tabs.length <= 1) return;
    
    const tabToClose = tabs.find(tab => tab.id === tabId);
    if (!tabToClose || !tabToClose.closable) return;
    
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If we're closing the active tab, switch to another tab
      if (tabId === activeTab) {
        const closedTabIndex = prevTabs.findIndex(tab => tab.id === tabId);
        let newActiveTab;
        
        if (closedTabIndex > 0) {
          // Switch to previous tab
          newActiveTab = prevTabs[closedTabIndex - 1].id;
          navigate(prevTabs[closedTabIndex - 1].route);
        } else {
          // Switch to next tab
          newActiveTab = prevTabs[closedTabIndex + 1].id;
          navigate(prevTabs[closedTabIndex + 1].route);
        }
        
        setActiveTab(newActiveTab);
      }
      
      return newTabs;
    });
  };

  // Close all tabs except current
  const closeOtherTabs = (currentTabId) => {
    const currentTab = tabs.find(tab => tab.id === currentTabId);
    if (!currentTab) return;
    
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => 
        tab.id === currentTabId || !tab.closable
      );
      return newTabs;
    });
  };

  // Close all tabs
  const closeAllTabs = () => {
    const dashboardTab = tabs.find(tab => !tab.closable);
    if (dashboardTab) {
      setTabs([dashboardTab]);
      setActiveTab(dashboardTab.id);
      navigate(dashboardTab.route);
    }
  };

  // Close tabs to the right
  const closeTabsToRight = (currentTabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
    if (currentIndex === -1) return;
    
    setTabs(prevTabs => {
      const newTabs = prevTabs.slice(0, currentIndex + 1);
      return newTabs;
    });
  };

  return (
    <TabContext.Provider value={{
      tabs,
      activeTab,
      addNewTab,
      switchTab,
      closeTab,
      closeOtherTabs,
      closeAllTabs,
      closeTabsToRight
    }}>
      {children}
    </TabContext.Provider>
  );
};