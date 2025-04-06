import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/api/public/forgot-password', { email });
      setMessage(response.data);
      
      setStep(2); // Move to OTP verification step
    } catch (error) {
      setMessage(error.response?.data || 'Email id is not Exist');
      
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/api/public/verify-otp', { email, otp });
      setMessage(response.data);
      navigate(`/reset-password/${otp}`, { state: { email } });
    } catch (error) {
      setMessage(error.response?.data || 'Invalid OTP');
    }
  };

  const handleBackToLogin = (e) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] flex items-center justify-center">
      <div className="h-[92vh] flex items-center justify-center w-full">
        <div className={`bg-white p-8 rounded-lg shadow-lg m-4 w-full max-w-md ${isExiting ? 'fade-out' : 'fade-in'}`}>
          <h2 className="text-2xl font-normal text-gray-800 text-center mb-4">
            {step === 1 ? 'Forgot Password' : 'Verify OTP'}
          </h2>
          {step === 1 ? (
            <div>
              <p className="text-gray-600 text-center mb-6">Enter your email to receive OTP</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 font-semibold"
                >
                  Send OTP
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-red-700">{message}</p>
              <p className="mt-2 text-center text-sm text-gray-600">
                Remembered your password?{' '}
                <a
                  href="/login"
                  onClick={handleBackToLogin}
                  className="text-blue-600 hover:underline hover:text-blue-800"
                >
                  Log In
                </a>
              </p>
            </div>
          ) : (
            <div>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    maxLength="6"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
                >
                  Verify OTP
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;