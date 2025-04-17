import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { usePageAnimation } from "./usePageAnimation"; // Adjust the import path as needed
import './Timetable.css'; // External CSS file

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [periods, setPeriods] = useState([]);
  const { pathname } = useLocation();

  // Use the page animation hook
  const { formRef, controls, sectionVariants, headerVariants, containerVariants, cardVariants } =
    usePageAnimation(pathname);
      // Scroll to top on mount with fallback
      useEffect(() => {
        window.history.scrollRestoration = "manual"; // Disable browser scroll restoration
        window.scrollTo(0, 0); // Initial scroll to top
        const handleScroll = () => {
          if (window.scrollY > 0) {
            window.scrollTo(0, 0); // Fallback if scroll position persists
          }
        };
        handleScroll(); // Immediate check
        window.addEventListener("load", handleScroll); // Ensure on page load
        return () => window.removeEventListener("load", handleScroll);
      }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/public/getTimeTable")
      .then((response) => {
        setTimetables(response.data);
        const uniquePeriods = [...new Set(response.data.map(item => item.period))];
        setPeriods(uniquePeriods);
      })
      .catch((error) => console.error(error));
  }, []);

  const classes = ["Nursery", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

  return (
    <motion.div
      className="min-h-screen flex justify-center p-4 bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="w-full max-w-7xl my-4">
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800"
          variants={headerVariants}
        >
          School Timetable
        </motion.h2>
        <motion.p
          className="text-xs sm:text-sm text-red-600 mb-4 text-center"
          variants={headerVariants}
        >
          Note: Timetable data is managed and inserted by the admin.
        </motion.p>
        <motion.div
          ref={formRef}
          className="overflow-x-auto shadow-lg rounded-lg"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <table className="w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 sm:p-3 text-left text-xs sm:text-sm md:text-base font-semibold sticky left-0 bg-gray-200 z-10">
                  Time
                </th>
                {classes.map((className) => (
                  <th
                    key={className}
                    className="border p-2 sm:p-3 text-xs sm:text-sm md:text-base font-semibold"
                  >
                    {className}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody variants={containerVariants}>
              {periods.map((period) => (
                <motion.tr
                  key={period}
                  className="hover:bg-gray-50"
                  variants={cardVariants}
                >
                  <td className="border p-2 sm:p-3 text-xs sm:text-sm md:text-base sticky left-0 bg-white z-10">
                    {period}
                  </td>
                  {classes.map((className) => {
                    const entry = timetables.find(
                      (t) => t.className === className && t.period === period
                    );
                    return (
                      <td
                        key={`${className}-${period}`}
                        className="border p-2 sm:p-3 text-xs sm:text-sm md:text-base"
                      >
                        {entry ? (
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">
                              {entry.subject.toUpperCase()}
                            </span>
                            <span className="text-gray-600">
                              {entry.teacher}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Timetable;