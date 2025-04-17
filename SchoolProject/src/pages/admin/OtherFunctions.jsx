import React from "react";
import "./OtherFunctions.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation"; // Import the updated hook
import ClassRoomImg from "../../assets/admin-rel/otherfunction/classroom.png";
import TimeTableImg from "../../assets/admin-rel/otherfunction/timetable.png";
import EventsImg from "../../assets/admin-rel/otherfunction/events.png";
import HallOfFameImg from "../../assets/admin-rel/otherfunction/HallOfFame.jpg";
import AdminImg from "../../assets/icons/admin.png";

// SVG Icons as Components
const Sections = () => (
  <img src={ClassRoomImg} alt="Upload Marks Icon" className="h-14 w-14" />
);

const CreateTimeTable = () => (
  <img src={TimeTableImg} alt="Blog News" className="h-14 w-14" />
);

const AddEvents = () => (
  <img src={EventsImg} alt="Announcements Icon" className="h-14 w-14" />
);

const HallOfFame = () => (
  <img src={HallOfFameImg} alt="Hall of Fame" className="h-14 w-14" />
);

const AdminPng = () => (
  <img src={AdminImg} alt="Add Admin" className="h-14 w-14" />
);

const OtherFunctions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use the updated animation hook
  const { formRef, controls, sectionVariants, containerVariants, headerVariants, cardVariants } =
    usePageAnimation(location.pathname);

  return (
    <motion.div
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[80vh] font-sans"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div ref={formRef} animate={controls}>
        {/* Navigation */}
        <nav>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center p-6 items-center">
              <motion.h1
                className="text-2xl font-medium text-gray-800"
                variants={headerVariants}
              >
                Other Functions
              </motion.h1>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 dashboard-content">
          {/* Cards Grid */}
          <motion.div
            className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Upload Marks Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/admin/add-section")}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 mb-4">
                  <Sections />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Sections Manage</h3>
                </div>
              </div>
            </motion.div>

            {/* Time Table Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/admin/create-time-table")}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <CreateTimeTable />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Create Time Table</h3>
                </div>
              </div>
            </motion.div>

            {/* Add Event Card */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/admin/other-Functions/add-event")}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-yellow-100 mb-4">
                  <AddEvents />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Add Events</h3>
                </div>
              </div>
            </motion.div>

            {/* Add Hall of Fame */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/admin/other-Functions/hallofFame")}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-yellow-100 mb-4">
                  <HallOfFame />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Hall of Fame</h3>
                </div>
              </div>
            </motion.div>

            {/* Add Admin */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow card-margin"
              onClick={() => navigate("/admin/other-Functions/add-admin")}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-yellow-100 mb-4">
                  <AdminPng />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Add Admin</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OtherFunctions;