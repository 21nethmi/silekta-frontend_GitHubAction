'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/navigation';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'success'>('request');
  const [employeeId, setEmployeeId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock verification code sending
    if (employeeId.trim()) {
      setMessage('A verification code has been sent to your registered email address.');
      setTimeout(() => {
        setStep('verify');
        setMessage('');
      }, 2000);
    } else {
      setError('Please enter your Employee ID');
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Mock code verification (demo: accept "123456")
    if (verificationCode === '123456') {
      setMessage('Code verified successfully!');
      setTimeout(() => {
        setStep('reset');
        setMessage('');
      }, 1500);
    } else {
      setError('Invalid verification code. Demo code: 123456');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must contain uppercase, lowercase, and numbers');
      return;
    }

    // Mock password reset
    setMessage('Password reset successful!');
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const renderRequestStep = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-[#0B5351] rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">Enter your Employee ID to receive a verification code</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleRequestReset} className="space-y-6">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-700 mb-2">
            Employee ID
          </label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
            placeholder="Enter your Employee ID"
            className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#0B5351] text-white py-3 rounded-lg font-semibold hover:bg-[#094240] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Send Verification Code
        </button>

        <div className="text-center">
          <Link href="/login" className="text-[#0B5351] hover:text-[#094240] font-medium text-sm">
            ← Back to Login
          </Link>
        </div>
      </form>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-[#0B5351] rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
        <p className="text-gray-600">We've sent a code to your registered email</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div>
          <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full px-4 py-3 text-center text-2xl tracking-widest text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200"
            required
          />
          <p className="text-xs text-gray-500 mt-2">Demo code: 123456</p>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0B5351] text-white py-3 rounded-lg font-semibold hover:bg-[#094240] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Verify Code
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setStep('request')}
            className="text-[#0B5351] hover:text-[#094240] font-medium text-sm"
          >
            ← Back
          </button>
        </div>
      </form>
    </div>
  );

  const renderResetStep = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-[#0B5351] rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
        <p className="text-gray-600">Create a strong password for your account</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B5351] focus:border-[#0B5351] transition-all duration-200"
            required
          />
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold mb-1">Password requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0B5351] text-white py-3 rounded-lg font-semibold hover:bg-[#094240] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Reset Password
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
      <p className="text-gray-600 mb-8">Your password has been updated successfully.</p>
      
      <button
        onClick={() => router.push('/login')}
        className="w-full bg-[#0B5351] text-white py-3 rounded-lg font-semibold hover:bg-[#094240] transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Continue to Login
      </button>
    </div>
  );

  return (
    <div className={`flex min-h-screen bg-gray-50 ${poppins.className}`}>
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
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
          </div>

          {/* Render current step */}
          {step === 'request' && renderRequestStep()}
          {step === 'verify' && renderVerifyStep()}
          {step === 'reset' && renderResetStep()}
          {step === 'success' && renderSuccessStep()}
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0B5351] to-[#8CBCB9] items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <h2 className="text-3xl font-bold mb-4">Secure Password Recovery</h2>
            <p className="text-[#80DED9] text-lg">
              Regain access to your account securely with our multi-step verification process
            </p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Employee ID Verification</h3>
                <p className="text-sm text-[#80DED9]">Identify yourself with your unique Employee ID</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Verification Code</h3>
                <p className="text-sm text-[#80DED9]">Receive a secure code to your registered email</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Strong Password Creation</h3>
                <p className="text-sm text-[#80DED9]">Set a new secure password for your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
