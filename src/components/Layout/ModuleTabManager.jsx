// ModuleTabManager.jsx - Bottom tabs for switching between major modules
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaTimes, FaCog } from 'react-icons/fa';

const MODULES = {
  'property-management': {
    id: 'property-management',
    title: 'Property Management',
    route: '/dashboard',
    icon: <FaHome className="w-4 h-4" />,
    closable: false,
  },
  'system-setup': {
    id: 'system-setup',
    title: 'System Setup',
    route: '/system-setup',
    icon: <FaCog className="w-4 h-4" />,
    closable: true,
  },
  'company-setup': {
    id: 'company-setup',
    title: 'Company Setup',
    route: '/company-setup',
    icon: <FaCog className="w-4 h-4" />,
    closable: true,
  },
};

const detectModuleFromRoute = (pathname) => {
  if (pathname === '/dashboard' || pathname.startsWith('/properties') || 
      pathname.startsWith('/landlords') || pathname.startsWith('/units') || 
      pathname.startsWith('/tenants') || pathname.startsWith('/leases') ||
      pathname.startsWith('/vacants') || pathname.startsWith('/maintenances') ||
      pathname.startsWith('/inspections')) {
    return 'property-management';
  }
  if (pathname === '/system-setup' || pathname.startsWith('/system-setup/')) {
    return 'system-setup';
  }
  if (pathname === '/company-setup') {
    return 'company-setup';
  }
  return 'property-management'; // default
};

const ModuleTabManager = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentModule = useMemo(() => detectModuleFromRoute(location.pathname), [location.pathname]);

  const [openModules, setOpenModules] = useState(() => {
    const saved = localStorage.getItem('milik-open-modules');
    return saved ? JSON.parse(saved) : ['property-management'];
  });

  const [activeModule, setActiveModule] = useState(() => {
    const saved = localStorage.getItem('milik-active-module');
    return saved || 'property-management';
  });

  // Sync localStorage when openModules or activeModule changes
  useEffect(() => {
    localStorage.setItem('milik-open-modules', JSON.stringify(openModules));
    localStorage.setItem('milik-active-module', activeModule);
  }, [openModules, activeModule]);

  // Update active module based on route change
  useEffect(() => {
    const newActive = currentModule;
    setOpenModules(prev => {
      if (!prev.includes(newActive)) {
        return [...prev, newActive];
      }
      return prev;
    });
    setActiveModule(newActive);
  }, [currentModule]);

  const switchModule = (moduleId) => {
    const config = MODULES[moduleId];
    if (config) {
      setActiveModule(moduleId);
      navigate(config.route);
    }
  };

  const closeModule = (moduleId) => {
    if (!MODULES[moduleId]?.closable) return;
    
    const newModules = openModules.filter(m => m !== moduleId);
    setOpenModules(newModules);
    
    // If closing active, switch to another
    if (moduleId === activeModule) {
      const nextModule = newModules[0] || 'property-management';
      switchModule(nextModule);
    }
  };

  const visibleModules = useMemo(
    () => openModules.map(id => MODULES[id]).filter(Boolean),
    [openModules]
  );

  if (visibleModules.length === 0) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#1a472a] border-gray-400'
    } flex items-center px-4 py-3 gap-2 overflow-x-auto`}>
      {visibleModules.map((module) => (
        <div
          key={module.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer whitespace-nowrap transition text-sm font-medium ${
            activeModule === module.id
              ? darkMode
                ? 'bg-gray-700 text-white'
                : 'bg-[#0f766e] text-white'
              : darkMode
              ? 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              : 'bg-[#2d5a4a] text-gray-200 hover:bg-[#3a6d58]'
          }`}
          onClick={() => switchModule(module.id)}
        >
          <span className="flex-shrink-0">{module.icon}</span>
          <span className="max-w-[150px] truncate">{module.title}</span>
          {module.closable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModule(module.id);
              }}
              className={`ml-1 p-0.5 rounded hover:bg-red-600 ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-300 hover:text-white'
              }`}
              title="Close module"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModuleTabManager;
