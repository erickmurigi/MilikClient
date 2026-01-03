import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner, FaArrowLeft, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setLoginSuccess(true);
      
      // Reset success state after 2 seconds and redirect (simulated)
      setTimeout(() => {
        setLoginSuccess(false);
        // In a real app, you would redirect here:
        // navigate('/dashboard');
        console.log('Login successful!', formData);
      }, 2000);
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#f0f9f2] flex items-center justify-center p-4">
      {/* Back Button */}
      <Link 
        to="/"
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center text-[#027333] hover:text-[#026227] transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Success Message */}
        {loginSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <div className="text-green-600 font-semibold mb-1">Login Successful!</div>
            <p className="text-green-500 text-sm">Redirecting to your dashboard...</p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#027333] to-[#026227] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <FaUser className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/80">Sign in to your Milik account</p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {/* Loader Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-[#027333] text-4xl mb-4 mx-auto" />
                  <p className="text-gray-600 font-medium">Authenticating...</p>
                  <p className="text-gray-500 text-sm mt-1">Please wait</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Username Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#027333] focus:border-transparent outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email or username"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#027333] hover:text-[#026227] font-medium transition-colors"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-[#027333] focus:border-transparent outline-none transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Terms */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#027333] focus:ring-[#027333] border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#027333] to-[#026227] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  <FaUser className="mr-2 text-gray-600" />
                  SSO
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-[#027333] hover:text-[#026227] font-semibold transition-colors"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-[#027333] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#027333] hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Secure Login</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Your login is protected with end-to-end encryption and two-factor authentication options.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#027333]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#026227]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default Login;