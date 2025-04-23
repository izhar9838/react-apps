import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation"; // Import the provided hook
import StuImg from "../../assets/admin-rel/Student.png";
import TeachImg from "../../assets/admin-rel/teacher.png";
import FeesImg from "../../assets/admin-rel/Fees.jpg";
import FunctionImg from "../../assets/admin-rel/additional-fun.png";
import './AdminDashboard.css'

// SVG Icons as Components
const StudentIcon = () => (
  <img src={StuImg} alt="Student Icon" className="h-12 w-12" />
);

const TeacherIcon = () => (
  <img src={TeachImg} alt="Teacher Icon" className="h-12 w-12" />
);

const FeesIcon = () => (
  <img src={FeesImg} alt="Fees Icon" className="h-12 w-12" />
);

const FunctionIcon = () => (
  <img src={FunctionImg} alt="Function Icon" className="h-12 w-12" />
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the provided animation hook
  const { formRef, controls, containerVariants, fieldVariants, buttonVariants } =
    usePageAnimation(location.pathname);

  // Custom variants for the card grid to disable staggering
  const cardGridVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0,
      },
    },
  };

  // Custom variants for individual cards to ensure consistent scaling
  const cardVariants = {
    rest: { scale: 1, opacity: 1 },
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[85vh] font-sans">
      <motion.div
        ref={formRef}
        animate={controls}
        variants={containerVariants}
        initial="hidden"
      >
        {/* Navigation */}
        <nav>
          <div className="flex justify-center p-6 items-center">
            <motion.h1
              className="text-2xl font-medium text-gray-800"
              variants={fieldVariants}
            >
              Admin Dashboard
            </motion.h1>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 dashboard-content">
          {/* Cards Grid */}
          <motion.div
            className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full place-content-center"
            variants={cardGridVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Student Enrolled Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/admin/studentform")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 mb-4">
                  <StudentIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Student Enrolled</h3>
                </div>
              </div>
            </motion.div>

            {/* Teacher Enrolled Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow card-margin"
              onClick={() => navigate("/admin/staffForm")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <TeacherIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Teacher Enrolled</h3>
                </div>
              </div>
            </motion.div>

            {/* Fees Submission Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/admin/feesSubmission")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-yellow-100 mb-4">
                  <FeesIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Fees Submission</h3>
                </div>
              </div>
            </motion.div>

            {/* Other Functions Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow card-margin"
              onClick={() => navigate("/admin/other-Functions")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 mb-4">
                  <FunctionIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Other Functions</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

     
    </div>
  );
};

export default AdminDashboard;