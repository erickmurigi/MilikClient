import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { loginUser } from '../../redux/apiCalls';
import './login.css';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('milik_token');
    if (token) {
      navigate('/moduleDashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
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
    
    try {
      await dispatch(loginUser(formData.email, formData.password));
      toast.success('Login successful!');
      navigate('/moduleDashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eef5f1] via-[#e7f1eb] to-[#f4efe7] flex items-center justify-center p-4">
      <img
        src="/logo.png"
        alt="Milik watermark"
        className="pointer-events-none select-none absolute inset-0 m-auto w-[70vw] max-w-[760px] opacity-[0.13]"
      />

      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-[#0B3B2E]/20">
          <div className="bg-gradient-to-r from-[#0B3B2E] to-[#0A3127] p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src="/logo.png"
                alt="Milik logo"
                className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-md"
              />
              <h1 className="text-4xl font-extrabold tracking-wide text-white">Milik</h1>
            </div>
            <p className="text-[#DDEFE1] text-sm font-semibold">Property Management System</p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-extrabold text-[#0B3B2E] mb-1 text-center">Welcome Back</h2>
            <p className="text-center text-sm font-semibold text-slate-600 mb-6">Sign in to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-extrabold text-[#0B3B2E] mb-2 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-[#0B3B2E]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={[
                      "w-full pl-10 pr-4 py-3 border-2 rounded-lg outline-none transition-all text-[#0B3B2E] font-bold placeholder:text-slate-500",
                      "focus:ring-2 focus:ring-[#0B3B2E]/20 focus:border-[#0B3B2E]",
                      errors.email ? "border-red-400 bg-red-50" : "border-[#b9d3c7] bg-white",
                    ].join(" ")}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm font-bold text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-extrabold text-[#0B3B2E] mb-2 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-[#0B3B2E]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={[
                      "w-full pl-10 pr-12 py-3 border-2 rounded-lg outline-none transition-all text-[#0B3B2E] font-bold placeholder:text-slate-500",
                      "focus:ring-2 focus:ring-[#0B3B2E]/20 focus:border-[#0B3B2E]",
                      errors.password ? "border-red-400 bg-red-50" : "border-[#b9d3c7] bg-white",
                    ].join(" ")}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#0B3B2E] hover:text-[#FF8C00]"
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm font-bold text-red-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0B3B2E] to-[#0A3127] text-white py-3 px-4 rounded-lg font-extrabold tracking-wide hover:shadow-lg hover:from-[#0A3127] hover:to-[#0B3B2E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
