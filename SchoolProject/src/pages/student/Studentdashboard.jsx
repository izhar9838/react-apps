import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation"; // Assumed custom hook
import NotesImg from "../../assets/student-rel/note.png";
import AssignmentsImg from "../../assets/student-rel/assignment.png";
import ScheduleImg from "../../assets/student-rel/study-time.png";
import GradesImg from "../../assets/student-rel/score.png";
import ProfileImg from "../../assets/student-rel/student.png";

// SVG Icons as Components
const NotesIcon = () => (
  <img src={NotesImg} alt="Notes Icon" className="h-12 w-12" />
);

const AssignmentsIcon = () => (
  <img src={AssignmentsImg} alt="Assignments Icon" className="h-12 w-12" />
);

const ScheduleIcon = () => (
  <img src={ScheduleImg} alt="Schedule Icon" className="h-12 w-12" />
);

const GradesIcon = () => (
  <img src={GradesImg} alt="Grades Icon" className="h-12 w-12" />
);

const ProfileIcon = () => (
  <img src={ProfileImg} alt="Profile Icon" className="h-12 w-12" />
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the provided animation hook (fallback if not available)
  const { formRef, controls, containerVariants, fieldVariants } =
    usePageAnimation(location.pathname) || {
      formRef: React.useRef(),
      controls: null,
      containerVariants: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } },
      },
      fieldVariants: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      },
    };

  // Custom variants for the card grid
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

  // Custom variants for individual cards
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
    <div className="bg-[linear-gradient(135deg,_#f0e4ff,_#e0f0fa)] min-h-[85vh] font-sans">
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
              Student Dashboard
            </motion.h1>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 dashboard-content">
          {/* Cards Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-full place-content-center"
            variants={cardGridVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Notes Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/student/notes")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 mb-4">
                  <NotesIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Notes</h3>
                </div>
              </div>
            </motion.div>

            {/* Assignments Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow card-margin"
              onClick={() => navigate("/student/assignments")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <AssignmentsIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Assignments</h3>
                </div>
              </div>
            </motion.div>

            {/* Schedule Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/student/schedule")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-yellow-100 mb-4">
                  <ScheduleIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Schedule</h3>
                </div>
              </div>
            </motion.div>

            {/* Grades Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow card-margin"
              onClick={() => navigate("/student/grades")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-purple-100 mb-4">
                  <GradesIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Grades</h3>
                </div>
              </div>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow card-margin"
              onClick={() => navigate("/student/student-profile")}
              variants={cardVariants}
              initial="hidden"
              animate="rest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-indigo-100 mb-4">
                  <ProfileIcon />
                </div>
                <div>
                  <h3 className="text-[16px] font-medium text-gray-800">Profile</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;