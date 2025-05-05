  
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";
import { usePageAnimation } from "./usePageAnimation"; // Adjust the import path as needed

const HallOfFame = () => {
  const [hallOfFameData, setHallOfFameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pathname } = useLocation();

  // Use the page animation hook
  const {
    formRef,
    controls,
    sectionVariants,
    headerVariants,
    containerVariants,
    cardVariants,
  } = usePageAnimation(pathname);

  // Additional ref for the grid container to ensure animation trigger
  const gridRef = useRef(null);

  // Fetch data from the API
  const fetchHallOfFameData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/public/getHallOfFame`);
      setHallOfFameData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching Hall of Fame data:", err);
      setError("Failed to load Hall of Fame data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHallOfFameData();
  }, []);

  // Force animation on initial load or route change
  useEffect(() => {
    if (hallOfFameData.length > 0 || error || !loading) {
      controls.start("visible").catch((err) => console.error("Animation error:", err));
    }
  }, [hallOfFameData, error, loading, controls]);

  return (
    <motion.div
      className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] py-4 sm:py-6 md:py-8"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <motion.h1
          className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center text-gray-800 mb-6 sm:mb-8 md:mb-10"
          variants={headerVariants}
        >
          Hall of Fame
        </motion.h1>
        <motion.p
          className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto"
          variants={headerVariants}
        >
          Celebrating the outstanding achievements of our remarkable individuals who have made a lasting impact.
        </motion.p>

        {loading ? (
          <motion.div
            className="text-center text-gray-600 text-sm sm:text-base"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            Loading...
          </motion.div>
        ) : error ? (
          <motion.div
            className="flex items-center justify-center"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
              <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </motion.div>
        ) : hallOfFameData.length === 0 ? (
          <motion.div
            className="flex items-center justify-center"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
              <FaExclamationCircle className="text-gray-500 text-4xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Records Found</h2>
              <p className="text-gray-600">No Hall of Fame entries found.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            ref={gridRef || formRef} // Use gridRef, fallback to formRef
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {hallOfFameData.map((member) => (
              <motion.div
                key={member.id}
                className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-xl"
                variants={cardVariants}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full mb-3 sm:mb-4 object-cover border-4 border-blue-500"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150"; // Fallback image
                  }}
                />
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                  {member.name}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  {member.achievement}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HallOfFame;