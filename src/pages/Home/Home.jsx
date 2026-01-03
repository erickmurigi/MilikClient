import React from 'react';
import './home.css';
import {
  FaBuilding,
  FaUserFriends,
  FaFileContract,
  FaTools,
  FaMoneyBillWave,
  FaReceipt,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaBolt,
  FaUserCheck,
  FaPlus,
  FaPhoneAlt,
  FaCommentDots,
  FaEnvelope,
  FaWhatsapp
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Home() {
  // FAQ Data
  const faqs = [
    {
      question: "Does Milik support M-PESA rent collection?",
      answer: "Yes. We support Paybill and Till with automatic matching and digital receipts."
    },
    {
      question: "Can I generate Rent Roll and Aged Receivables?",
      answer: "Absolutely. Reports include Rent Roll, Aged Receivables, P&L, Cash Flow, and more."
    },
    {
      question: "Is my data secure?",
      answer: "We use encryption at rest/in transit, daily backups, and MFA with role-based access."
    },
    {
      question: "Do you offer onboarding and training?",
      answer: "Yes. We provide assisted setup, data import templates, and live training for your team."
    }
  ];

  // Features Data
  const features = [
    {
      icon: <FaBuilding />,
      title: "Properties",
      description: "Create buildings and units, set rent, utilities, and availability from a single dashboard."
    },
    {
      icon: <FaUserFriends />,
      title: "Tenants",
      description: "Keep verified tenant records, contacts, rent history, and documents in sync."
    },
    {
      icon: <FaFileContract />,
      title: "Leases",
      description: "Generate, e-sign, track expiries, and renew leases without paperwork."
    },
    {
      icon: <FaTools />,
      title: "Maintenances",
      description: "Log repair requests, assign vendors, track SLAs, and close jobs faster."
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Rent Payments",
      description: "Automate M-PESA collections and reconcile bank deposits with ease."
    },
    {
      icon: <FaReceipt />,
      title: "Expenses",
      description: "Categorize operating expenses for clean books and audit trails."
    }
  ];

  // KPI Data
  const kpis = [
    { icon: <FaBuilding />, value: "1,000+", label: "Properties Managed" },
    { icon: <FaUserFriends />, value: "10,000+", label: "Active Tenants" },
    { icon: <FaMoneyBillWave />, value: "Millions", label: "Payments Tracked" },
    { icon: <FaShieldAlt />, value: "99.9%", label: "Uptime" }
  ];

  // How It Works Steps
  const steps = [
    {
      icon: <FaBuilding />,
      title: "1. Sign Up & Onboard",
      description: "Create your account. Guided setup helps you add properties, units, and lease templates."
    },
    {
      icon: <FaBuilding />,
      title: "2. Add Properties & Units",
      description: "Upload images, define unit details — rent, size, availability — from your dashboard."
    },
    {
      icon: <FaMoneyBillWave />,
      title: "3. Set Up Payment Collection",
      description: "Connect Paybill/Till or bank API. Configure recurring M-PESA and bank deposits."
    },
    {
      icon: <FaTools />,
      title: "4. Manage Maintenance & Communication",
      description: "Tenants submit requests online. Track progress and message tenants in one place."
    },
    {
      icon: <FaReceipt />,
      title: "5. Monitor Financial Reports",
      description: "Generate Rent Roll, P&L, Aged Receivables, and Cash Flow."
    },
    {
      icon: <FaMobileAlt />,
      title: "6. Access Anywhere, Anytime",
      description: "Cloud-based & mobile friendly — manage from Nairobi or abroad."
    }
  ];

  // Who Can Use
  const userTypes = [
    {
      icon: <FaUserFriends />,
      title: "Individual Landlords",
      description: "Manage a few units or many — track rent, leases & maintenance effortlessly."
    },
    {
      icon: <FaBuilding />,
      title: "Property Managers",
      description: "Oversee portfolios — centralize communications, billing & reporting."
    },
    {
      icon: <FaBuilding />,
      title: "Real Estate Agencies",
      description: "Offer value-added services — bulk onboarding & branded reports."
    },
    {
      icon: <FaMobileAlt />,
      title: "Diaspora Landlords",
      description: "Stay in control from abroad with real-time dashboards & alerts."
    },
    {
      icon: <FaBuilding />,
      title: "Homeowners with Rentals",
      description: "Turn extra rooms into income — bookings, payments & contracts."
    },
    {
      icon: <FaTools />,
      title: "Facility Managers",
      description: "Coordinate teams, log service requests & monitor SLAs."
    }
  ];

  const [activeFaq, setActiveFaq] = React.useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Fixed with shadow and proper spacing */}
      <nav  className="sticky top-0 z-50 bg-white shadow-md py-4">
        <div className="container mx-auto px-8">
          <div className="flex items-center  justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-lg bg-[#027333] flex items-center justify-center mr-3">
                <FaBuilding className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-[#027333]">Milik</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#027333] font-medium transition-colors text-base">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#027333] font-medium transition-colors text-base">
                How It Works
              </a>
              <a href="#faq" className="text-gray-700 hover:text-[#027333] font-medium transition-colors text-base">
                FAQ
              </a>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Link to="/login">
                <button className="px-5 py-2.5 border border-[#027333] text-[#027333] rounded-lg font-medium hover:bg-[#f0f9f2] transition-colors">
                  Sign In
                </button></Link>
                <button className="px-5 py-2.5 bg-[#027333] text-white rounded-lg font-medium hover:bg-[#026227] transition-colors shadow-md">
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with better spacing */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-gray-50 to-[#f0f9f2] py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#f0f9f2] text-[#027333] rounded-full px-4 py-2 text-sm font-semibold mb-4">
                <FaCheckCircle className="text-[#027333]" />
                Made for Kenya — M-PESA Ready
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight mb-4 text-gray-900">
                Property Management System in Kenya
              </h1>
              <p className="text-[#027333] text-xl font-semibold mb-4">
                Complete Rental Management & Landlord Software
              </p>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl">
                Automate rent collection, streamline lease workflows, and maximize returns — all in one powerful, cloud dashboard.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                <button className="inline-flex items-center justify-center bg-[#027333] text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#026227] transition-all">
                  Start Free
                </button>
                <button className="inline-flex items-center justify-center border border-gray-300 bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Explore Features
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-gray-600 text-sm">
                <span className="inline-flex items-center">
                  <FaShieldAlt className="text-[#027333] mr-2" />
                  Bank-grade security
                </span>
                <span className="inline-flex items-center">
                  <FaHeadset className="text-[#027333] mr-2" />
                  Kenyan support
                </span>
                <span className="inline-flex items-center">
                  <FaMobileAlt className="text-[#027333] mr-2" />
                  Mobile friendly
                </span>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl p-4">
                <div className="bg-gradient-to-br from-[#027333] to-[#026227] rounded-xl p-6">
                  {/* Mock Dashboard UI */}
                  <div className="bg-white/95 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-sm text-gray-500">Total Balance</div>
                        <div className="text-2xl font-bold text-gray-900">KES 1,245,000</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-[#f0f9f2] flex items-center justify-center">
                        <FaBuilding className="text-[#027333]" />
                      </div>
                    </div>
                    
                    {/* Mini Charts */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Occupancy</div>
                        <div className="text-lg font-bold text-gray-900">94%</div>
                        <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
                          <div className="h-1 w-3/4 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Collections</div>
                        <div className="text-lg font-bold text-gray-900">98%</div>
                        <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
                          <div className="h-1 w-4/5 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <FaUserCheck className="text-green-600 text-sm" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">New Tenant Added</div>
                            <div className="text-xs text-gray-500">Apartment B12</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">Just now</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <FaMoneyBillWave className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Rent Received</div>
                            <div className="text-xs text-gray-500">KES 45,000</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Bar */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <span className="font-medium">Trusted by landlords & agencies across Kenya</span>
              <span className="hidden sm:inline h-4 w-px bg-gray-300"></span>
              <span className="inline-flex items-center gap-2">
                <FaShieldAlt className="text-[#027333]" />
                Encrypted at rest & in transit
              </span>
              <span className="hidden sm:inline h-4 w-px bg-gray-300"></span>
              <span className="inline-flex items-center gap-2">
                <FaBolt className="text-[#027333]" />
                Fast onboarding
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Section with better spacing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {kpis.map((kpi, index) => (
              <div 
                key={index}
                className="rounded-xl bg-gray-50 p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-[#027333] text-2xl mb-3 flex justify-center">
                  {kpi.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</div>
                <div className="text-gray-600 text-sm">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with better spacing */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Powerful Features to Optimize Your Rental Business
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
            Everything you need — centralized in one modern workspace.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group"
              >
                <div className="h-full rounded-xl bg-white shadow-sm border border-gray-100 text-center p-8 transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-lg">
                  <div className="text-[#027333] text-3xl mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h5 className="font-semibold text-xl mb-3 text-gray-900">{feature.title}</h5>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center bg-[#027333] text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#026227] transition-all">
              View All Features
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section with better spacing */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-gray-900">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="rounded-xl bg-gray-50 p-6 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-start">
                  <div className="text-[#027333] text-2xl mr-4">
                    {step.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg mb-2 text-gray-900">{step.title}</h5>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center bg-[#027333] text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#026227] transition-all">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Who Can Use Section with better spacing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-gray-900">
            Who Can Use Milik
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {userTypes.map((user, index) => (
              <div 
                key={index}
                className="rounded-xl bg-white shadow-sm border border-gray-100 text-center p-8 transition-all duration-200 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="text-[#027333] text-3xl mb-4 flex justify-center">
                  {user.icon}
                </div>
                <h5 className="font-semibold text-xl mb-3 text-gray-900">{user.title}</h5>
                <p className="text-gray-600">{user.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center bg-[#027333] text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#026227] transition-all">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section with better spacing */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Everything about Milik for landlords and managers in Kenya.
            </p>
          </div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="rounded-xl bg-gray-50 p-6 transition-colors hover:bg-gray-100 border border-gray-200"
              >
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-800 text-lg pr-4">
                    {faq.question}
                  </span>
                  <span className={`text-gray-500 text-xl transition-transform ${activeFaq === index ? 'rotate-45' : ''}`}>
                    <FaPlus />
                  </span>
                </button>
                
                {activeFaq === index && (
                  <div className="text-gray-600 mt-4 pt-4 border-t border-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with better spacing */}
      <section className="py-20 text-white text-center bg-gradient-to-br from-[#027333] to-[#026227]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            You didn't become a landlord to be a bookkeeper.
          </h2>
          <p className="mb-8 text-white/90 max-w-2xl mx-auto text-lg">
            Grow your portfolio — let Milik handle rent, accounting & reporting.
          </p>
          <button className="inline-flex items-center justify-center bg-white text-[#027333] font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-lg">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer with better spacing */}
      <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-lg bg-[#027333] flex items-center justify-center mr-3">
                  <FaBuilding className="text-white" />
                </div>
                <span className="text-2xl font-bold text-[#027333]">Milik</span>
              </div>
              <p className="text-gray-600 mb-6">
                All-in-one platform to manage properties, automate rent, and engage tenants across Kenya.
              </p>
              <div className="flex gap-3">
                <a href="tel:+254725345345" className="p-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                  <FaPhoneAlt />
                </a>
                <a href="https://wa.me/254725345345" className="p-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                  <FaCommentDots />
                </a>
                <a href="mailto:hello@milik.com" className="p-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                  <FaEnvelope />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-[#027333] transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-[#027333] transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-[#027333] transition-colors">How It Works</a></li>
                <li><a href="#faq" className="text-gray-600 hover:text-[#027333] transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#027333] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-6">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-[#027333] transition-colors">Bank Deposits</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#027333] transition-colors">M-Pesa Deposits</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#027333] transition-colors">Rent Automation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#027333] transition-colors">Water Billing</a></li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-6">Get Started</h3>
              <div className="space-y-4">
                <button className="w-full px-5 py-3 bg-[#027333] text-white rounded-lg font-medium hover:bg-[#026227] transition-colors shadow-md">
                  Register Now
                </button>
                <button className="w-full px-5 py-3 border border-[#027333] text-[#027333] rounded-lg font-medium hover:bg-[#f0f9f2] transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-300 text-center text-gray-600">
            <p className="mb-4">© 2026 Milik Property Management System. All rights reserved.</p>
            <div className="space-x-6">
              <a href="#" className="hover:text-[#027333] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#027333] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="https://wa.me/254791483607"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-2xl" />
        </a>
      </div>
    </div>
  );
}

export default Home;