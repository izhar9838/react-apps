import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { usePageAnimation } from "./usePageAnimation";
import HallOfFame from '../assets/admin-rel/otherfunction/HallOfFame.jpg';
import TimeTable from '../assets/admin-rel/otherfunction/timetable.png';
import BlogNews from '../assets/teacher-rel/Blog:News.jpg';
import Announcment from '../assets/icons/announcment.png';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { formRef: heroRef, controls: heroControls, ...heroVariants } = usePageAnimation("/home-hero");
  const { formRef: adminRef, controls: adminControls, ...adminVariants } = usePageAnimation("/home-admin");
  const { formRef: newsRef, controls: newsControls, ...newsVariants } = usePageAnimation("/home-news");
  let userRole = useSelector((state) => state.auth?.user?.role);
  let authStatus = useSelector((state) => state.auth.isAuthenticated);

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

  return (
    <motion.section 
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
    >
      {/* Hero Section with Fancy Background */}
      <motion.section
        ref={heroRef}
        className="text-gray-800 py-16 w-full h-[92vh] flex flex-wrap items-center"
        variants={heroVariants.sectionVariants}
        initial="hidden"
        animate={heroControls}
      >
        <div className="container mx-auto text-center px-4 sm:px-6">
          <motion.h1 
            className="lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold mb-6 text-gray-800"
            variants={heroVariants.headerVariants}
          >
            <div className="waves text-gray-700" data-word="Welcome to S.M Central Academy">
              Welcome to S.M Central Academy
            </div>
          </motion.h1>
          <motion.p 
            className="lg:text-lg md:text-base sm:text-sm text-xs mb-8"
            variants={heroVariants.sectionVariants}
          >
            Empowering students to achieve excellence in education and life.
          </motion.p>
          <motion.a
            href="#"
            className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 text-sm sm:text-base"
            variants={heroVariants.sectionVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Now
          </motion.a>
        </div>
      </motion.section>

      {/* Admin Section */}
      {userRole === "admin" && authStatus && (
        <motion.section
          ref={adminRef}
          className="container mx-auto py-10 w-full px-0 sm:px-0 md:px-4"
          variants={adminVariants.sectionVariants}
          initial="hidden"
          animate={adminControls}
        >
          <motion.div 
            className="home-grid"
            variants={adminVariants.containerVariants}
          >
            <motion.button
              className="cursor-pointer"
              onClick={() => navigate("/studentform")}
              variants={adminVariants.cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-48 h-48 flex flex-col justify-center items-center">
                <h3 className="text-sm font-bold mb-2 text-gray-800 text-center">Admissions</h3>
                <p className="text-gray-700 text-xs text-center">
                  Learn about our admission process and requirements.
                </p>
              </div>
            </motion.button>
            <motion.button 
              className="cursor-pointer"
              variants={adminVariants.cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-48 h-48 flex flex-col justify-center items-center">
                <h3 className="text-sm font-bold mb-2 text-center">Calendar</h3>
                <p className="text-gray-700 text-xs text-center">
                  Stay updated with important school events and dates.
                </p>
              </div>
            </motion.button>
            <motion.button 
              className="cursor-pointer"
              variants={adminVariants.cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-48 h-48 flex flex-col justify-center items-center">
                <h3 className="text-sm font-bold mb-2 text-center">News</h3>
                <p className="text-gray-700 text-xs text-center">
                  Read the latest news and announcements.
                </p>
              </div>
            </motion.button>
          </motion.div>
        </motion.section>
      )}

      {/* Latest News Section */}
      <motion.h2 
        ref={newsRef}
        className="text-2xl sm:text-3xl font-bold text-center mb-6 border-b-2 border-gray-800 text-gray-800 pb-3"
        variants={newsVariants.headerVariants}
        initial="hidden"
        animate={newsControls}
      >
        Latest News
      </motion.h2>
      <motion.section
        className="py-10 w-full container mx-auto px-0 sm:px-0 md:px-4"
        variants={newsVariants.sectionVariants}
        initial="hidden"
        animate={newsControls}
      >
        <motion.div 
          className="home-grid"
          variants={newsVariants.containerVariants}
        >
          <motion.button
            className="cursor-pointer"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/time-table");
            }}
            variants={newsVariants.cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-white p-4 rounded-lg shadow-lg h-48 w-48 flex flex-col justify-between hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <img
                  src={TimeTable}
                  alt="School Time Table"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-gray-300 object-cover mb-2"
                  loading="lazy"
                />
                <h3 className="text-sm font-medium mb-2 text-gray-800 text-center">School Time Table</h3>
                <p className="text-gray-700 text-xs text-center flex-grow">
                  Get the Latest Time Table of School
                </p>
              </div>
            </div>
          </motion.button>
          <motion.button
            className="cursor-pointer"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/hall-of-fame");
            }}
            variants={newsVariants.cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-white p-4 rounded-lg shadow-lg h-48 w-48 flex flex-col justify-between hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <img
                  src={HallOfFame}
                  alt="Hall of Fame"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-gray-300 object-cover mb-2"
                  loading="lazy"
                />
                <h3 className="text-sm font-medium mb-2 text-gray-800 text-center">Hall of Fame</h3>
                <p className="text-gray-700 text-xs text-center flex-grow">
                  Top Students who scored highest in exams & sports
                </p>
              </div>
            </div>
          </motion.button>
          <motion.button
            className="cursor-pointer"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/blog-news");
            }}
            variants={newsVariants.cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-white p-4 rounded-lg shadow-lg h-48 w-48 flex flex-col justify-between hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <img
                  src={BlogNews}
                  alt="Blogs News"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-gray-300 object-cover mb-2"
                  loading="lazy"
                />
                <h3 className="text-sm font-medium mb-2 text-gray-800 text-center">Blogs News</h3>
                <p className="text-gray-700 text-xs text-center flex-grow">
                  Read the latest blogs and news articles.
                </p>
              </div>
            </div>
          </motion.button>
          <motion.button
            className="cursor-pointer"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/blog-news");
            }}
            variants={newsVariants.cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="bg-white p-4 rounded-lg shadow-lg h-48 w-48 flex flex-col justify-between hover:shadow-xl transition duration-300">
              <div className="flex flex-col items-center">
                <img
                  src={Announcment}
                  alt="Blogs News"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-gray-300 object-cover mb-2"
                  loading="lazy"
                />
                <h3 className="text-sm font-medium mb-2 text-gray-800 text-center">Announcement</h3>
                <p className="text-gray-700 text-xs text-center flex-grow">
                  Get the Announcement of School.
                </p>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </motion.section>
    </motion.section>
  );
}

export default Home;