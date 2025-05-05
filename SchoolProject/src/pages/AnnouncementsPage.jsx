import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { usePageAnimation } from "../pages/usePageAnimation";
import { FaExclamationCircle } from "react-icons/fa";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { sectionVariants, containerVariants, fieldVariants, cardVariants } = usePageAnimation(location.pathname);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/public/announcements`, {

        });
        setAnnouncements(response.data || []);
      } catch (err) {
        setError("Failed to fetch announcements. Please try again later.");
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

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
          className="bg-white p-4 rounded-lg shadow-md max-w-xs w-[80%] sm:w-[300px] h-auto min-h-[200px] text-center flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-base text-gray-700">Loading announcements...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen w-full  p-4 bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-semibold text-center text-gray-800 mb-8"
        variants={fieldVariants}
      >
        Announcements
      </motion.h1>
      
      <motion.div
        className="w-full flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {announcements.length > 0 ? (
            <div className="w-full max-w-5xl  mx-auto grid gap-6">
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  className="bg-white p-4  sm:text-[12px] text-[12px] lg:text-[16px] lg:min-w-60 sm:min-w-50 rounded-lg shadow-md border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="lg:text-xl sm:text-lg  text-lg font-semibold text-gray-700 mb-2">
                    {announcement.title}
                  </h2>
                  <p className="text-gray-600 mb-2">{announcement.content}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(announcement.createdDate).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-4 rounded-lg shadow-md w-full max-w-xs sm:max-w-md mx-auto h-auto min-h-[200px] text-center flex flex-col items-center justify-center"
            >
              <FaExclamationCircle
                className={`text-${error ? "red-500" : "gray-500"} text-3xl mb-4`}
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {error ? "Error" : "No Announcements"}
              </h2>
              <p className="text-gray-600 text-sm">
                {error || "No announcements available at this time."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AnnouncementsPage;