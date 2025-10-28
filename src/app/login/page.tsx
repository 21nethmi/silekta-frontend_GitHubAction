'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { mockLogin, setCurrentUser } from '@/lib/mockAuth';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock authentication
    const user = mockLogin(formData.employeeId, formData.password);
    
    if (user) {
      // Store user data
      setCurrentUser(user);
      
      // Role-based redirect
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/home');
      }
    } else {
      setError('Invalid Employee ID or Password');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src="/Logo (2).png"
                alt="Silekta Logo"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Login Portal</h1>
            <p className="text-gray-600">Role-Based Access Control System</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            {/* Demo Credentials Info */}
            {/* <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">🔐 Demo Credentials:</p>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Admin:</strong> ADMIN001 / Admin@123</p>
                <p><strong>Employee:</strong> EMP001 / Employee@123</p>
              </div>
            </div> */}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee ID Input */}
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  type="text"
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your Employee ID (e.g., EMP001)"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#0B5351] border-gray-300 rounded focus:ring-[#0B5351] focus:ring-2"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#0B5351] hover:text-[#8CBCB9] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#8CBCB9] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#0B5351] transition-all duration-200 shadow-md"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Contact IT Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Need access to the system?{' '}
              <Link
                href="/contact-it"
                className="font-semibold text-[#0B5351] hover:text-[#8CBCB9] transition-colors"
              >
                Contact IT Support
              </Link>
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Only authorized employees can access this system
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Branding/Image */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#0B5351] to-[#8CBCB9] items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative bg-white/90 rounded-2xl p-4 backdrop-blur-sm">
              <Image
                src="/Logo (2).png"
                alt="Silekta Logo"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-lg text-white/90 font-medium mb-4 italic">
              Sustainable Paper Solutions for Every Need
            </p>
            <h2 className="text-4xl font-bold mb-4">Silekta</h2>
            <p className="text-xl text-white/90 mb-3">
              Internal Management Information System
            </p>
            <p className="text-sm text-white/80">
              Employee Access Only
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
