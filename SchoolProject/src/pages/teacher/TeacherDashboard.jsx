import React from 'react';
import './TeacherDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageAnimation } from '../usePageAnimation';
import UploadMarksImg from '../../assets/teacher-rel/upload.png';
import BlogImg from '../../assets/teacher-rel/blog.png';
import MailImg from '../../assets/teacher-rel/email.png';

// SVG Icons as Components
const UploadMarksIcon = () => (
  <img 
    src={UploadMarksImg} 
    alt="Upload Marks Icon" 
    className="h-12 w-12" 
  />
);

const BlogIcon = () => (
  <img 
    src={BlogImg} 
    alt="Blog News" 
    className="h-12 w-12" 
  />
);

const MailIcon = () => (
  <img 
    src={MailImg} 
    alt="Announcements Icon" 
    className="h-12 w-12" 
  />
);

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation(location.pathname);

  // Workaround for tab-switching visibility issue
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          controls.start("visible");
        }, 100);
      }
    };
    const handleFocus = () => {
      controls.start("visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [controls]);

  return (
    <motion.div
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[80vh] font-sans"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Navigation */}
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center p-6 items-center">
            <motion.h1
              variants={cardVariants}
              className="text-3xl font-medium text-gray-800"
            >
              Teacher Dashboard
            </motion.h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <motion.div
        ref={formRef}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 dashboard-content"
      >
        {/* Cards Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {/* Upload Marks Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer card-margin"
            onClick={() => navigate('/teacher_dashboard/upload-marks')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-blue-100 mb-4">
                <UploadMarksIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Upload Marks</h3>
              </div>
            </div>
          </motion.div>

          {/* Share Resources Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer card-margin"
            onClick={() => navigate('/teacher-dashboard/create-blog')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-green-100 mb-4">
                <BlogIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Blog News</h3>
              </div>
            </div>
          </motion.div>

          {/* Post Announcements Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer card-margin"
            onClick={() => navigate('/teacher/announcements')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-yellow-100 mb-4">
                <MailIcon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Parent Mail/Call</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboard;