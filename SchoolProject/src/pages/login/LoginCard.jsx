import React from 'react';
import './LoginCard.css';
import adminCard from '../../assets/icons/admin.png';
import studentCard from '../../assets/icons/profile.png';
import teacherCard from '../../assets/icons/teacher.png';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../Home';

function LoginCard() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth?.isAuthenticated);

  if (!authStatus) {
    return (
      <div className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[78vh] font-sans">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[78vh]  login-content">
          {/* Cards Grid */}
          <div className="grid grid-cols-3 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full place-content-center items-center">
            {/* Student Login Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow card-margin">
              <button
                onClick={() => {
                  const loginData = { role: 'student' };
                  navigate('loginForm', { state: { loginData }, replace: true });
                }}
                className="flex flex-col items-center text-center w-full"
              >
                <img src={studentCard} alt="Student Login" className="card_image mb-4" />
                <p className="text-lg font-medium text-gray-800">Students Login</p>
              </button>
            </div>

            {/* Teacher Login Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow card-margin">
              <button
                onClick={() => {
                  const loginData = { role: 'teacher' };
                  navigate('loginForm', { state: { loginData }, replace: true });
                }}
                className="flex flex-col items-center text-center w-full"
              >
                <img src={teacherCard} alt="Teacher Login" className="card_image mb-4" />
                <p className="text-lg font-medium text-gray-800">Teachers Login</p>
              </button>
            </div>

            {/* Admin Login Card */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow card-margin">
              <button
                onClick={() => {
                  const loginData = { role: 'admin' };
                  navigate('loginForm', { state: { loginData }, replace: true });
                }}
                className="flex flex-col items-center text-center w-full"
              >
                <img src={adminCard} alt="Admin Login" className="card_image mb-4" />
                <p className="text-lg font-medium text-gray-800">Admin Login</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    navigate('/', { replace: true });
    return <Home />;
  }
}

export default LoginCard;