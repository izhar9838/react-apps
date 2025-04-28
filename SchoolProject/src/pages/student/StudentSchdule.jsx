import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';
import { usePageAnimation } from '../usePageAnimation'; // Adjust the import path as needed

// Animation variants (consistent with NotesDisplay)
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, staggerChildren: 0.1 } },
};

const StudentSchedule = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the page animation hook with a static route
  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation('/student/schedule');

  useEffect(() => {
    const fetchTimetable = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const startTime = Date.now();
        const response = await axios.get(
          `http://localhost:9090/api/student/schedule`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 1000 - elapsedTime;

        setTimeout(() => {
          setTimetableData(response.data);
          setLoading(false);
        }, remainingTime > 0 ? remainingTime : 0);
      } catch (err) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 1000 - elapsedTime;

        setTimeout(() => {
          setError(
            'Failed to fetch timetable. Please check if the server is running or try again later.'
          );
          setLoading(false);
        }, remainingTime > 0 ? remainingTime : 0);
      }
    };

    fetchTimetable();
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
          className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading</h2>
          <p className="text-gray-600">Fetching your timetable...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (error || timetableData.length === 0) {
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
          className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <FaExclamationCircle className="text-gray-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error ? 'Error' : 'No Timetable Available'}
          </h2>
          <p className="text-gray-600">
            {error || 'No timetable data found for your class.'}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Group timetable data by period for better display
  const periods = [...new Set(timetableData.map(item => item.period))].sort((a, b) => {
    // Parse start time from period (e.g., "9:00-9:45" -> "9:00")
    const getStartTime = (period) => {
      const [start] = period.split('-').map(s => s.trim());
      const [hours, minutes] = start.split(':').map(Number);
      return hours * 60 + minutes; // Convert to minutes for comparison
    };
    return getStartTime(a) - getStartTime(b);
  });
  const subjectsByPeriod = periods.map(period => ({
    period,
    details: timetableData.filter(item => item.period === period),
  }));

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
          <motion.h1
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl sm:text-3xl font-bold text-white text-center"
          >
            Your Timetable
          </motion.h1>
        </motion.div>

        {/* Timetable Section */}
        <motion.div
          className="p-6 sm:p-10"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-center text-gray-800 font-semibold">
                    Period
                  </th>
                  <th className="py-2 px-4 border-b text-center text-gray-800 font-semibold">
                    Subject
                  </th>
                  <th className="py-2 px-4 border-b text-center text-gray-800 font-semibold">
                    Teacher
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjectsByPeriod.map(({ period, details }, index) => (
                  <motion.tr
                    key={period}
                    className="hover:bg-gray-50"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="py-2 px-4 border-b text-gray-600 text-center">{period}</td>
                    <td className="py-2 px-4 border-b text-gray-600 text-center">
                      {details.map(detail => detail.subject).join(', ')}
                    </td>
                    <td className="py-2 px-4 border-b text-gray-600 text-center">
                      {details.map(detail => detail.teacher).join(', ')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StudentSchedule;