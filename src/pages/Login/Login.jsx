import React, { useState, useEffect } from 'react';
import { 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaSpinner, 
  FaArrowLeft, 
  FaUser, 
  FaShieldAlt, 
  FaMobileAlt,
  FaBuilding,
  FaChartLine,
  FaUsers,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaLeaf,
  FaHome,
  FaMoneyBillWave
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [floatingIcons] = useState([
    { icon: <FaBuilding />, top: '15%', left: '8%', delay: '0s', color: 'text-green-100' },
    { icon: <FaChartLine />, top: '25%', right: '10%', delay: '0.5s', color: 'text-blue-100' },
    { icon: <FaUsers />, bottom: '30%', left: '12%', delay: '1s', color: 'text-purple-100' },
    { icon: <FaMoneyBillWave />, bottom: '20%', right: '15%', delay: '1.5s', color: 'text-yellow-100' },
  ]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      text: "Milik reduced my rent collection time by 70% and eliminated payment tracking headaches.",
      author: "David M., Nairobi",
      role: "Property Manager",
      avatar: "DM"
    },
    {
      text: "As a diaspora landlord, I can now manage my properties in Kenya from anywhere in the world.",
      author: "Sarah K., London",
      role: "Diaspora Landlord",
      avatar: "SK"
    },
    {
      text: "The M-PESA integration alone has saved me 10 hours of work every month. Worth every shilling!",
      author: "James O., Mombasa",
      role: "Real Estate Agent",
      avatar: "JO"
    }
  ];

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    // Check password strength
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
    
    return () => clearInterval(interval);
  }, [formData.password, testimonials.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email or username is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && formData.email.length < 3) {
      newErrors.email = 'Please enter a valid email or username';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } 
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with progressive loading
    setTimeout(() => {
      setLoading(false);
      setLoginSuccess(true);
      navigate('/dashboard');
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        setLoginSuccess(false);
        console.log('Login successful!', formData);

      }, 2000);
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Forgot password logic
    console.log('Forgot password clicked');
  };

  const getPasswordStrengthColor = (strength) => {
    switch(strength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-blue-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch(strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Very Weak';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-200 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Floating Icons */}
        {floatingIcons.map((icon, index) => (
          <div
            key={index}
            className={`absolute text-4xl animate-float ${icon.color}`}
            style={{
              top: icon.top,
              left: icon.left,
              right: icon.right,
              bottom: icon.bottom,
              animationDelay: icon.delay
            }}
          >
            {icon.icon}
          </div>
        ))}
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-green-100 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Back Button */}
      <Link 
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 bg-white text-gray-700 hover:text-[#027333] transition-all px-4 py-2.5 rounded-lg z-20 group shadow-sm hover:shadow-md border border-gray-200"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 z-10">
        {/* Left Side - Brand & Testimonials */}
        <div className="lg:w-2/5 flex flex-col justify-between">
          {/* Brand Section */}
          <div className="mb-8 lg:mb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#027333] to-[#026227] flex items-center justify-center shadow-lg">
                <FaBuilding className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Milik</h1>
                <p className="text-gray-600">Property Management System</p>
              </div>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Professional Property Management <span className="text-[#027333]">Made Simple</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of landlords and property managers who trust Milik to automate their rental business.
            </p>
            
            {/* Features List */}
            <div className="space-y-4 mb-8">
              {[
                { icon: <FaMobileAlt />, text: 'M-PESA Integration' },
                { icon: <FaChartLine />, text: 'Real-time Reports' },
                { icon: <FaUsers />, text: 'Tenant Portal' },
                { icon: <FaLeaf />, text: 'Mobile App' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-[#027333]">
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#027333] to-[#026227] flex items-center justify-center text-white font-semibold">
                {testimonials[currentTestimonial].avatar}
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold">{testimonials[currentTestimonial].author}</h4>
                <p className="text-gray-500 text-sm">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic mb-4 border-l-4 border-[#027333] pl-4 py-1">
              "{testimonials[currentTestimonial].text}"
            </p>
            
            {/* Testimonial Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${index === currentTestimonial ? 'w-8 bg-[#027333]' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-3/5">
          {/* Success Message */}
          {loginSuccess && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl text-center animate-fade-in shadow-sm">
              <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-1">
                <FaCheckCircle className="animate-bounce" />
                Login Successful!
              </div>
              <p className="text-green-600 text-sm">Redirecting to your dashboard...</p>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#027333] to-[#026227] p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm border border-white/30">
                  <FaKey className="text-white text-3xl" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Secure Login</h1>
                <p className="text-white/90">Access your Milik dashboard</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 relative">
              {/* Loader Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-3xl z-20">
                  <div className="text-center">
                    <div className="relative">
                      <FaSpinner className="animate-spin text-[#027333] text-5xl mb-4 mx-auto" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 bg-gradient-to-r from-[#027333] to-[#026227] rounded-full animate-ping opacity-75"></div>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium text-lg mb-2">Authenticating...</p>
                    <p className="text-gray-600 text-sm">Securely connecting to your account</p>
                    <div className="mt-4 flex justify-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 w-1 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email/Username Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-500" />
                      Email or Username
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-4 pr-3 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#027333] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 ${
                        errors.email ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email or username"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <FaTimesCircle />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaLock className="text-gray-500" />
                        Password
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-[#027333] hover:text-[#026227] font-medium transition-colors flex items-center gap-1"
                      disabled={loading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-4 pr-12 py-3.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#027333] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-500 ${
                        errors.password ? 'border-red-400' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  
                  
                  {errors.password && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <FaTimesCircle />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="sr-only"
                        disabled={loading}
                      />
                      <div 
                        onClick={() => !loading && setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
                        className={`h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-all ${
                          formData.rememberMe 
                            ? 'bg-[#027333] border-[#027333]' 
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        {formData.rememberMe && (
                          <FaCheckCircle className="text-white text-xs" />
                        )}
                      </div>
                    </div>
                    <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-700 cursor-pointer">
                      Remember this device
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaShieldAlt className="text-[#027333]" />
                    <span>Secure Connection</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#027333] to-[#026227] text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-3" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all group shadow-sm"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-gray-700">Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all group shadow-sm"
                    disabled={loading}
                  >
                    <FaMobileAlt className="mr-3 text-gray-700 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700">M-PESA</span>
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600">
                    New to Milik?{' '}
                    <Link 
                      to="/signup" 
                      className="text-[#027333] hover:text-[#026227] font-semibold transition-colors hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Free 30-day trial • No credit card required
                  </p>
                </div>
              </form>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <FaShieldAlt className="text-green-600" />
                  SSL Encrypted
                </span>
                <span className="h-3 w-px bg-gray-300"></span>
                <span className="flex items-center gap-1">
                  <FaInfoCircle className="text-blue-600" />
                  GDPR Compliant
                </span>
                <span className="h-3 w-px bg-gray-300"></span>
                <span className="flex items-center gap-1">
                  <FaMobileAlt className="text-purple-600" />
                  Mobile Ready
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
              <div className="text-lg font-bold text-gray-900">99.9%</div>
              <div className="text-xs text-gray-600">Uptime</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
              <div className="text-lg font-bold text-gray-900">24/7</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm">
              <div className="text-lg font-bold text-gray-900">256-bit</div>
              <div className="text-xs text-gray-600">Encryption</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="absolute bottom-6 right-6 bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 z-20 shadow-lg">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#027333] to-[#026227] flex items-center justify-center">
          <FaShieldAlt className="text-white" />
        </div>
        <div>
          <div className="text-gray-900 text-sm font-semibold">Secure Login</div>
          <div className="text-gray-500 text-xs">End-to-end encrypted connection</div>
        </div>
      </div>

      {/* Floating Particles Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `rgba(${Math.random() > 0.5 ? '2, 115, 51' : '74, 222, 128'}, ${Math.random() * 0.1 + 0.05})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Login;