import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";
import './Timetable.css';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pathname } = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 0) window.scrollTo(0, 0);
    };
    handleScroll();
    window.addEventListener("load", handleScroll);
    return () => window.removeEventListener("load", handleScroll);
  }, []);

  // Fetch timetable data
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/public/getTimeTable`);
        console.log("API Response:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Normalize data
          const normalizedData = response.data.map(item => ({
            ...item,
            className: (item.className || item.class || "")?.trim()?.toLowerCase() || "",
            period: item.period?.trim() || "",
            subject: item.subject?.trim() || "",
            teacher: item.teacher?.trim() || "",
          }));
          console.log("Normalized Timetables:", normalizedData);
          setTimetables(normalizedData);

          // Get unique periods and sort chronologically
          const uniquePeriods = [...new Set(normalizedData.map(item => item.period))]
            .filter(p => p)
            .sort((a, b) => {
              // Parse start time from period (e.g., "9:00AM-9:45AM" or "9:00-9:45")
              const getStartTime = (period) => {
                const [start] = period.split('-').map(s => s.trim());
                let hours, minutes;
                
                // Handle AM/PM format
                if (start.includes('AM') || start.includes('PM')) {
                  const isPM = start.includes('PM');
                  const cleanTime = start.replace(/(AM|PM)/i, '').trim();
                  [hours, minutes = 0] = cleanTime.split(':').map(Number);
                  if (isPM && hours !== 12) hours += 12; // Convert PM to 24-hour
                  if (!isPM && hours === 12) hours = 0; // Convert 12 AM to 0
                } else {
                  // Assume 24-hour format
                  [hours, minutes = 0] = start.split(':').map(Number);
                }
                
                return hours * 60 + minutes; // Convert to minutes for comparison
              };
              
              return getStartTime(a) - getStartTime(b);
            });
          console.log("Unique Periods:", uniquePeriods);
          setPeriods(uniquePeriods);
        } else {
          setError("No timetable data available.");
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
        setError("Failed to fetch timetable. Please check if the server is running or try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const classes = [
    "Nursery", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading</h2>
          <p className="text-gray-600">Fetching timetable...</p>
        </div>
      </div>
    );
  }

  // Error or empty data state
  if (error || periods.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <FaExclamationCircle className="text-gray-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error ? "Error" : "No Timetable Available"}
          </h2>
          <p className="text-gray-600">
            {error || "No timetable data found for any class."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center p-4 bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
      <div className="w-full max-w-7xl my-4">
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate="visible"
        >
          School Timetable
        </motion.h2>
        <motion.p
          className="text-xs sm:text-sm text-red-600 mb-4 text-center"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate="visible"
        >
          Note: Timetable data is managed and inserted by the admin.
        </motion.p>
        <div className="overflow-x-auto shadow-lg rounded-lg timetable-container">
          <table className="timetable w-full bg-white border-collapse">
            <thead>
              <tr className="table-head">
                <th className="sticky-col">Time</th>
                {classes.map((className) => (
                  <th key={className} className="table-head">
                    {className}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period} className="hover:bg-gray-50">
                  <td className="sticky-col">{period}</td>
                  {classes.map((className) => {
                    const entry = timetables.find(
                      (t) => t.className === className.toLowerCase() && t.period === period
                    );
                    
                    return (
                      <td key={`${className}-${period}`} className="table-cell">
                        {entry ? (
                          <div className="cell-content">
                            <span className="subject">
                              {(entry.subject || "N/A").toUpperCase()}
                            </span>
                            <span className="teacher">
                              {entry.teacher || "Unknown"}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timetable;