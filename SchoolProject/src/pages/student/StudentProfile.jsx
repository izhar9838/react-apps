import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';
import { usePageAnimation } from '../usePageAnimation'; // Adjust the import path as needed

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the page animation hook with a static route
  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation('/student/student-profile');

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/students/getProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          'Failed to fetch student data. Please check if the server is running or try again later.'
        );
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Force re-animation on tab change or focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeout(() => {
          controls.start('visible');
        }, 100);
      }
    };

    const handleFocus = () => {
      controls.start('visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [controls]);

  // Check if user is logged in
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></motion.div>
      </motion.div>
    );
  }

  if (error || !studentData) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center"
        >
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">
            {error || 'No student data found for the authenticated user.'}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const {
    firstName,
    lastName,
    DOB,
    gender,
    admissionId,
    admissionDate,
    image,
    userPass,
    contact_details,
    academic_info,
    fees_details,
  } = studentData;

  // Handle profile image as base64 string or URL
  let profileImageSrc = 'https://via.placeholder.com/150';
  if (userPass?.profileImage || image) {
    const img = userPass?.profileImage || image;
    if (img.startsWith('data:image/')) {
      profileImageSrc = img;
    } else if (img.startsWith('http://') || img.startsWith('https://')) {
      profileImageSrc = img;
    } else {
      profileImageSrc = `data:image/jpeg;base64,${img}`;
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] py-12 px-4 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        ref={formRef}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
      >
        {/* Header Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-10"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.img
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              src={profileImageSrc}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            <div className="text-center sm:text-left">
              <motion.h1
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl sm:text-3xl font-bold text-white"
              >
                {firstName} {lastName}
              </motion.h1>
              <motion.p
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="text-blue-100 text-sm sm:text-base"
              >
                @{userPass?.username || 'N/A'}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          className="p-6 sm:p-10"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-semibold text-gray-800">Role</h2>
              <p className="text-gray-600">{userPass?.role || 'N/A'}</p>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-semibold text-gray-800">Admission ID</h2>
              <p className="text-gray-600">{admissionId || 'N/A'}</p>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-semibold text-gray-800">Date of Birth</h2>
              <p className="text-gray-600">
                {DOB ? new Date(DOB).toLocaleDateString() : 'N/A'}
              </p>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-semibold text-gray-800">Gender</h2>
              <p className="text-gray-600">{gender || 'N/A'}</p>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-semibold text-gray-800">Admission Date</h2>
              <p className="text-gray-600">
                {admissionDate ? new Date(admissionDate).toLocaleDateString() : 'N/A'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact and Academic Details */}
        <motion.div
          className="p-6 sm:p-10 border-t border-gray-200"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Details */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h3 className="text-lg font-semibold text-gray-800">Contact Details</h3>
              <p className="text-gray-600 mt-2">Email: {contact_details?.email || 'N/A'}</p>
              <p className="text-gray-600 mt-1">
                Phone: {contact_details?.phoneNumber || 'N/A'}
              </p>
              <p className="text-gray-600 mt-1">Address: {contact_details?.address || 'N/A'}</p>
              <p className="text-gray-600 mt-1">
                Guardian: {contact_details?.guardianName || 'N/A'}
              </p>
              <p className="text-gray-600 mt-1">
                Guardian Number: {contact_details?.guardianNumber || 'N/A'}
              </p>
            </motion.div>

            {/* Academic Details */}
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h3 className="text-lg font-semibold text-gray-800">Academic Details</h3>
              <p className="text-gray-600 mt-2">Roll No: {academic_info?.rollNo || 'N/A'}</p>
              <p className="text-gray-600 mt-1">Standard: {academic_info?.standard || 'N/A'}</p>
              <p className="text-gray-600 mt-1">Section: {academic_info?.section || 'N/A'}</p>
              <p className="text-gray-600 mt-1">
                Academic Year: {academic_info?.academic_year || 'N/A'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Fees Details */}
        <motion.div
          className="p-6 sm:p-10 border-t border-gray-200"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-lg font-semibold text-gray-800">Fees Details</h3>
          {fees_details && fees_details.length > 0 ? (
            <div className="mt-4 space-y-4">
              {fees_details.map((fee, index) => (
                <motion.div
                  key={index}
                  className="border p-4 rounded-lg"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-gray-600">Amount: ${fee.amount}</p>
                  <p className="text-gray-600">
                    Fee Types: {fee.fee_type?.join(', ') || 'N/A'}
                  </p>
                  <p className="text-gray-600">Payment Mode: {fee.payment_mode || 'N/A'}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              className="text-gray-600 mt-2"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              No fees details available
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StudentProfile;