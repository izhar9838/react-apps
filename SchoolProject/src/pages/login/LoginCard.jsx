import React from 'react';
import './LoginCard.css';
import adminCard from '../../assets/icons/admin.png';
import studentCard from '../../assets/icons/profile.png';
import teacherCard from '../../assets/icons/teacher.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { usePageAnimation } from '../usePageAnimation';
import Home from '../Home';

function LoginCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth?.isAuthenticated);

  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation(location.pathname);

  if (!authStatus) {
    return (
      <motion.div
        className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[78vh] font-sans flex items-center justify-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          ref={formRef}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center"
        >
          <div className="grid-container">
            {/* Student Login Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md p-4 card-margin flex items-center justify-center"
            >
              <button
                onClick={() => {
                  const loginData = { role: 'student' };
                  navigate('loginForm', { state: { loginData }, replace: true });
                }}
                className="flex flex-col items-center text-center w-full h-full justify-center"
              >
                <img src={studentCard} alt="Student Login" className="card_image mb-3" />
                <p className="text-base font-medium text-gray-800 card-text">Students Login</p>
              </button>
            </motion.div>

            {/* Teacher Login Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md p-4 card-margin flex items-center justify-center"
            >
              <button
                onClick={() => {
                  const loginData = { role: 'teacher' };
                  navigate('loginForm', { state: { loginData }, replace: true });
                }}
                className="flex flex-col items-center text-center w-full h-full justify-center"
              >
                <img src={teacherCard} alt="Teacher Login" className="card_image mb-3" />
                <p className="text-base font-medium text-gray-800 card-text">Teachers Login</p>
              </button>
            </motion.div>

            {/* Admin Login Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md p-4 card-margin flex items-center justify-center"
            >
              <button
                onClick={() => {
                  const loginData = { role: 'admin' };
                  navigate('loginForm', { state: { loginData }, replace: true });
                }}
                className="flex flex-col items-center text-center w-full h-full justify-center"
              >
                <img src={adminCard} alt="Admin Login" className="card_image mb-3" />
                <p className="text-base font-medium text-gray-800 card-text">Admin Login</p>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  } else {
    navigate('/', { replace: true });
    return <Home />;
  }
}

export default LoginCard;