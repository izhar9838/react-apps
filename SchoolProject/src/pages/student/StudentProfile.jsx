import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';
import { usePageAnimation } from '../usePageAnimation'; // Adjust the import path as needed
import './StudentProfile.css'; // Import external CSS

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation('/student/student-profile');

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/student/getprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentData(response.data);
        console.log(response.data);
        
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

  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100"
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
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 px-4"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center"
        >
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">Error</h2>
          <p className="text-black font-medium">
            {error || 'No student data found for the authenticated user.'}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const {
    studentId,
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
      className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-6 px-4 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        ref={formRef}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden"
      >
        {/* Header Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 flex flex-col sm:flex-row items-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            src={profileImageSrc}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-md object-cover mb-4 sm:mb-0 sm:mr-6"
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
              className="text-blue-200 text-sm sm:text-base font-medium"
            >
              @{userPass?.username || 'N/A'}
            </motion.p>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          className="p-6 sm:p-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-2">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <h3 className="text-md font-semibold text-black">First Name</h3>
                <p className="text-black font-medium">{firstName || 'N/A'}</p>
              </motion.div>
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <h3 className="text-md font-semibold text-black">Student ID</h3>
                <p className="text-black font-medium">{studentId}</p>
              </motion.div>
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <h3 className="text-md font-semibold text-black">Admission ID</h3>
                <p className="text-black font-medium">{admissionId || 'N/A'}</p>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-bold text-black">Role</h2>
              <p className="text-black font-medium">{userPass?.role || 'N/A'}</p>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-bold text-black">Date of Birth</h2>
              <p className="text-black font-medium">
                {DOB ? new Date(DOB).toLocaleDateString() : 'N/A'}
              </p>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-bold text-black">Gender</h2>
              <p className="text-black font-medium">{gender || 'N/A'}</p>
            </motion.div>
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-bold text-black">Admission Date</h2>
              <p className="text-black font-medium">
                {admissionDate ? new Date(admissionDate).toLocaleDateString() : 'N/A'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact and Academic Details */}
        <motion.div
          className="p-6 sm:p-8 border-t border-gray-200"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="contact-academic-container flex flex-col sm:flex-row sm:gap-6 max-sm:gap-12">
            {/* Contact Details */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="flex-1"
            >
              <h3 className="text-lg font-bold text-black">Contact Details</h3>
              <p className="text-black mt-2 font-medium">
                Email : &nbsp;&nbsp;{contact_details?.email || 'N/A'}
              </p>
              <p className="text-black mt-1 font-medium">
                Phone : &nbsp;&nbsp;{contact_details?.phoneNumber || 'N/A'}
              </p>
              <p className="text-black mt-1 font-medium">
                Address : &nbsp;&nbsp;{contact_details?.address || 'N/A'}
              </p>
              <p className="text-black mt-1 font-medium">
                Guardian : &nbsp;&nbsp;{contact_details?.guardianName || 'N/A'}
              </p>
              <p className="text-black mt-1 font-medium">
                Guardian Number : &nbsp;&nbsp;{contact_details?.guardianNumber || 'N/A'}
              </p>
            </motion.div>

            {/* Academic Details */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="flex-1"
            >
              <h3 className="text-lg font-bold text-black">Academic Details</h3>
              <p className="text-black mt-2 font-medium">
                Roll No : &nbsp;&nbsp;{academic_info?.rollNo || 'N/A'}
              </p>
              <p className="text-black mt-1 font-medium">
                Standard : &nbsp;&nbsp;{academic_info?.standard || 'N/A'}
              </p>
              <p className="text-black mt-1 font-medium">
                Section :&nbsp;&nbsp; {academic_info?.section || 'N/A'}
              </p>
              <p className="text-black mt-1 font-medium">
                Academic Year : &nbsp;&nbsp; {academic_info?.academic_year || 'N/A'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Fees Details Table */}
        <motion.div
  className="p-6 sm:p-8 border-t border-gray-200"
  variants={cardVariants}
  initial="hidden"
  animate="visible"
>
  <h3 className="text-lg font-bold text-black mb-4">Fees Details</h3>
  {fees_details && fees_details.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center text-sm font-bold text-black">
              Amount
            </th>
            <th className="py-2 px-4 border-b text-center text-sm font-bold text-black">
              Fee Types
            </th>
            <th className="py-2 px-4 border-b text-center text-sm font-bold text-black">
              Payment Mode
            </th>
          </tr>
        </thead>
        <tbody>
          {fees_details.map((fee, index) => (
            <motion.tr
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="hover:bg-gray-50"
            >
              <td className="py-2 px-4 border-b text-sm text-black font-medium text-center">
                ₹ {fee.amount}
              </td>
              <td className="py-2 px-4 border-b text-sm text-black font-medium text-center">
                {fee.fee_type?.join(', ') || 'N/A'}
              </td>
              <td className="py-2 px-4 border-b text-sm text-black font-medium text-center">
                {fee.payment_mode || 'N/A'}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <motion.p
      className="text-black font-medium"
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