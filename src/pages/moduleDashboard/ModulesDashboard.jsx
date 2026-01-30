// pages/ModulesDashboard/ModulesDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaChartLine, 
  FaWarehouse, 
  FaHotel, 
  FaCogs, 
  FaUsers, 
  FaFileInvoiceDollar,
  FaMobileAlt,
  FaLock,
  FaCheckCircle,
  FaRocket,
  FaShieldAlt,
  FaSync,
  FaCloud,
  FaBell,
  FaSearch,
  FaFilter,
  FaStar,
  FaCalendarAlt,
  FaClipboardCheck,
  FaCreditCard,
  FaChartBar,
  FaCog,
  FaHome,
  FaDoorOpen,
  FaMoneyBillWave,
  FaUserTie,
  FaWrench,
  FaClipboardList,
  FaEye,
  FaPlus,
  FaArrowRight,
  FaExternalLinkAlt,
  FaPlayCircle,
  FaInfoCircle,
  FaClock,
  FaCalendar,
  FaDownload,
  FaShare,
  FaEllipsisH,
  FaBolt,
  FaDatabase,
  FaServer,
  FaNetworkWired,
  FaRobot,
  FaAward,
  FaTrophy,
  FaMedal,
  FaCrown,
  FaGem,
  FaCubes,
  FaLightbulb,
  FaMagic,
  FaPaintBrush,
  FaLayerGroup,
  FaCube,
  FaBoxes,
  FaPalette
} from 'react-icons/fa';
import { MdDashboard, MdSecurity, MdAnalytics, MdPayment } from 'react-icons/md';
import { GiModernCity } from 'react-icons/gi';
import './ModulesDashboard.css';

const ModulesDashboard = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [hoveredModule, setHoveredModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [stats, setStats] = useState({
    activeModules: 4,
    totalUsers: 124,
    storageUsed: '2.4GB',
    uptime: '99.99%'
  });

  // Sample purchased modules data based on account type
  const purchasedModules = [
    {
      id: 'property-management',
      title: 'Property Management',
      description: 'Complete property lifecycle management from acquisition to disposal',
      icon: <FaBuilding className="text-4xl" />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradient: 'from-indigo-500 to-purple-600',
      status: 'active',
      features: ['Tenant Management', 'Lease Tracking', 'Maintenance Requests', 'Property Analytics'],
      subscription: 'Enterprise',
      usage: '98%',
      lastUsed: 'Just now',
      redirectTo: '/dashboard',
      badge: 'Most Used'
    },
    {
      id: 'accounts',
      title: 'Accounts & Finance',
      description: 'Comprehensive financial management and accounting system',
      icon: <FaChartLine className="text-4xl" />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      gradient: 'from-pink-500 to-red-500',
      status: 'active',
      features: ['Invoicing', 'Expense Tracking', 'Financial Reports', 'Tax Management'],
      subscription: 'Pro',
      usage: '85%',
      lastUsed: '2 hours ago',
      redirectTo: '/accounts',
      badge: 'Popular'
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      description: 'Real-time inventory tracking and warehouse management',
      icon: <FaWarehouse className="text-4xl" />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      gradient: 'from-blue-500 to-cyan-500',
      status: 'active',
      features: ['Stock Control', 'Warehouse Management', 'Supplier Tracking', 'Barcode System'],
      subscription: 'Enterprise',
      usage: '72%',
      lastUsed: 'Yesterday',
      redirectTo: '/inventory',
      badge: null
    },
    {
      id: 'hotels',
      title: 'Hotel Management',
      description: 'Complete hotel operations and guest management system',
      icon: <FaHotel className="text-4xl" />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      gradient: 'from-green-500 to-teal-400',
      status: 'active',
      features: ['Room Booking', 'Guest Services', 'Housekeeping', 'Restaurant POS'],
      subscription: 'Pro',
      usage: '65%',
      lastUsed: '3 days ago',
      redirectTo: '/hotels',
      badge: 'New'
    },
    {
      id: 'maintenance',
      title: 'Maintenance System',
      description: 'Preventive and corrective maintenance management',
      icon: <FaWrench className="text-4xl" />,
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      gradient: 'from-pink-400 to-yellow-400',
      status: 'available',
      features: ['Work Orders', 'Scheduled Maintenance', 'Vendor Management', 'Asset Tracking'],
      subscription: 'Basic',
      usage: '0%',
      lastUsed: 'Never',
      redirectTo: '/maintenance',
      badge: 'Coming Soon'
    },
    {
      id: 'tenant-portal',
      title: 'Tenant Portal',
      description: 'Self-service portal for tenants and residents',
      icon: <FaDoorOpen className="text-4xl" />,
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      gradient: 'from-teal-500 to-purple-900',
      status: 'active',
      features: ['Online Payments', 'Service Requests', 'Document Access', 'Communication'],
      subscription: 'Enterprise',
      usage: '92%',
      lastUsed: 'Today',
      redirectTo: '/tenant-portal',
      badge: 'Essential'
    }
  ];

  // Available modules (not purchased yet)
  const availableModules = [
    {
      id: 'crm',
      title: 'CRM System',
      description: 'Customer relationship management and sales pipeline',
      icon: <FaUsers className="text-4xl" />,
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      gradient: 'from-cyan-200 to-pink-200',
      status: 'locked',
      features: ['Lead Management', 'Sales Pipeline', 'Client Communication', 'Deal Tracking'],
      subscription: 'Premium',
      price: '$299/month'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Business intelligence and predictive analytics',
      icon: <MdAnalytics className="text-4xl" />,
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      gradient: 'from-red-200 to-orange-200',
      status: 'locked',
      features: ['Real-time Dashboards', 'Predictive Models', 'Custom Reports', 'Data Export'],
      subscription: 'Enterprise',
      price: '$499/month'
    },
    {
      id: 'mobile-app',
      title: 'Mobile App Builder',
      description: 'Create custom mobile apps for your business',
      icon: <FaMobileAlt className="text-4xl" />,
      color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      gradient: 'from-purple-300 to-pink-300',
      status: 'locked',
      features: ['iOS & Android', 'Custom Branding', 'Push Notifications', 'Offline Mode'],
      subscription: 'Premium',
      price: '$399/month'
    }
  ];

  useEffect(() => {
    // Simulate loading modules data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleModuleClick = (module) => {
    if (module.status === 'active' || module.status === 'available') {
      setActiveModule(module.id);
      setTimeout(() => {
        navigate(module.redirectTo || '/dashboard');
      }, 300);
    }
  };

  const filteredModules = [...purchasedModules, ...availableModules].filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || module.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'available': return 'bg-blue-500';
      case 'locked': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'available': return 'Available';
      case 'locked': return 'Locked';
      default: return 'Unknown';
    }
  };

  // Quick stats cards
  const quickStats = [
    { label: 'Active Modules', value: stats.activeModules, icon: <FaCubes />, color: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
    { label: 'Total Users', value: stats.totalUsers, icon: <FaUsers />, color: 'bg-gradient-to-br from-green-500 to-teal-500' },
    { label: 'Storage Used', value: stats.storageUsed, icon: <FaDatabase />, color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { label: 'System Uptime', value: stats.uptime, icon: <FaServer />, color: 'bg-gradient-to-br from-orange-500 to-red-500' },
  ];

  // Recent activity
  const recentActivity = [
    { module: 'Property Management', action: 'New lease added', time: '2 min ago', user: 'John Doe' },
    { module: 'Accounts', action: 'Invoice generated', time: '15 min ago', user: 'Jane Smith' },
    { module: 'Inventory', action: 'Stock level updated', time: '1 hour ago', user: 'Mike Johnson' },
    { module: 'Hotel Management', action: 'Room booking confirmed', time: '3 hours ago', user: 'Sarah Williams' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 20 + 10}s`
            }}
          />
        ))}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                            linear-gradient(to bottom, #888 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 p-3 rounded-lg">
                    <FaCubes className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Modules Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">Manage your enterprise solutions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <button className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                  <FaBell />
                </button>
                
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold cursor-pointer">
                    MK
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                    <div className="p-4">
                      <p className="font-semibold text-gray-900">Milik Corp</p>
                      <p className="text-sm text-gray-600">Enterprise Plan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full -translate-y-32 translate-x-16 opacity-30"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome back, <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Milik Corporation</span>
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Your enterprise is currently using <span className="font-semibold text-green-600">4 of 6</span> purchased modules
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <FaAward className="text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">Enterprise Plan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-green-500" />
                        <span className="text-sm text-gray-600">Active until Dec 2024</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
                    <FaRocket />
                    <span>Upgrade Plan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    Live
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Modules Section */}
            <div className="lg:col-span-2">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Your Modules</h3>
                  <p className="text-gray-600">Click any module to launch</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['all', 'active', 'locked'].map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          filter === filterType
                            ? 'bg-white text-gray-900 shadow'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    <FaEllipsisH className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Modules Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                      <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredModules.map((module) => (
                    <div
                      key={module.id}
                      onMouseEnter={() => setHoveredModule(module.id)}
                      onMouseLeave={() => setHoveredModule(null)}
                      onClick={() => handleModuleClick(module)}
                      className={`bg-white rounded-2xl border-2 transition-all duration-300 ${
                        module.status === 'locked'
                          ? 'border-gray-200 cursor-not-allowed opacity-80'
                          : 'border-transparent hover:border-green-500 cursor-pointer hover:shadow-2xl'
                      } ${
                        hoveredModule === module.id ? 'transform -translate-y-1' : ''
                      } overflow-hidden group`}
                    >
                      <div className="p-6">
                        {/* Module Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl`} style={{ background: module.color }}>
                            <div className="text-white">{module.icon}</div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {module.badge && (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                module.badge === 'Most Used' ? 'bg-yellow-100 text-yellow-800' :
                                module.badge === 'Popular' ? 'bg-pink-100 text-pink-800' :
                                module.badge === 'New' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {module.badge}
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)} text-white`}>
                              {getStatusText(module.status)}
                            </span>
                          </div>
                        </div>

                        {/* Module Content */}
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h4>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        
                        {/* Features */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {module.features?.slice(0, 3).map((feature, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {feature}
                              </span>
                            ))}
                            {module.features?.length > 3 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                +{module.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            {module.usage && (
                              <div className="flex items-center space-x-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full"
                                    style={{ 
                                      width: `${module.usage}`,
                                      background: module.color
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{module.usage} usage</span>
                              </div>
                            )}
                            
                            {module.lastUsed && (
                              <span className="text-sm text-gray-500">
                                <FaClock className="inline mr-1" />
                                {module.lastUsed}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {module.status === 'locked' ? (
                              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                Upgrade to Access
                              </button>
                            ) : (
                              <>
                                <span className="text-sm font-semibold text-gray-700">
                                  {module.subscription}
                                </span>
                                <div className={`p-2 rounded-lg ${
                                  module.status === 'active' 
                                    ? 'bg-indigo-100 text-green-600' 
                                    : 'bg-gray-100 text-gray-600'
                                } group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                                  <FaArrowRight />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:via-indigo-50/50 group-hover:to-indigo-50/30 transition-all duration-300 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Activity */}
              <div className="mt-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Recent Activity</h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaBuilding className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.module} • {activity.user}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Subscription Status */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Subscription Status</h4>
                  <FaCrown className="text-yellow-400" />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Enterprise Plan</span>
                    <span className="font-semibold">$1,299/mo</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Renewal: Dec 15, 2024</span>
                    <span>75% used</span>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                  Manage Subscription
                </button>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">System Health</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'API Response', value: '98ms', status: 'good' },
                    { label: 'Database', value: 'Healthy', status: 'good' },
                    { label: 'Cache', value: '92%', status: 'warning' },
                    { label: 'Storage', value: '2.4/10GB', status: 'good' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.label}</span>
                      <span className={`font-medium ${
                        item.status === 'good' ? 'text-green-600' :
                        item.status === 'warning' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center space-x-3">
                    <FaCheckCircle className="text-green-600 text-xl" />
                    <div>
                      <p className="font-semibold text-green-800">All systems operational</p>
                      <p className="text-sm text-green-700">Last checked: Just now</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-center group">
                    <FaPlus className="text-indigo-600 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Add Module</span>
                  </button>
                  
                  <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-center group">
                    <FaDownload className="text-green-600 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Export Data</span>
                  </button>
                  
                  <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center group">
                    <FaShare className="text-purple-600 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Share Access</span>
                  </button>
                  
                  <button className="p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors text-center group">
                    <FaCog className="text-yellow-600 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-900">Settings</span>
                  </button>
                </div>
              </div>

              {/* Awards & Recognition */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Awards</h4>
                  <FaTrophy className="text-yellow-600" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FaMedal className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Top Enterprise User 2024</p>
                      <p className="text-sm text-gray-600">Awarded for exceptional usage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaGem className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Innovation Excellence</p>
                      <p className="text-sm text-gray-600">Advanced module implementation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src="/logo.png" alt="Milik Logo" className="h-8" />
                <p className="text-gray-600 text-sm">
                  © 2024 Milik Corporation. All rights reserved.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Support
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>

     
    </div>
  );
};

export default ModulesDashboard;