import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserCircle, FaEdit, FaKey } from "react-icons/fa";
import { useLocation,Navigate } from "react-router-dom";
import { usePageAnimation } from "../usePageAnimation";


const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Use the provided animation hook
  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation(location.pathname);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get("http://localhost:9090/api/public/accountInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Debug API response
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching account details:", error);
        setLoading(false);
      }
    };
    fetchAccountDetails();
  }, []);

  // Force re-animation on tab change or focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Delay to ensure inView detection stabilizes
        setTimeout(() => {
          controls.start("visible");
        }, 100);
      }
    };

    const handleFocus = () => {
      // Additional trigger for focus events
      controls.start("visible");
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [controls]);

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
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </motion.div>
    );
  }

 // Check if user is logged in
 const token = localStorage.getItem("authToken");
 if (!token) {
   return <Navigate to="/login" replace />;
 }

  // Handle user.image as a base64 string or URL
  let profileImageSrc = "https://via.placeholder.com/150";
  if (user.image) {
    if (user.image.startsWith("data:image/")) {
      profileImageSrc = user.image;
    } else if (user.image.startsWith("http://") || user.image.startsWith("https://")) {
      profileImageSrc = user.image;
    } else {
      profileImageSrc = `data:image/jpeg;base64,${user.image}`;
    }
  }
  console.log("Profile Image Source:", profileImageSrc); // Debug image source

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
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.img
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              src={profileImageSrc}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
              onError={(e) => {
                console.error("Image failed to load:", profileImageSrc);
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <div className="text-center sm:text-left">
              <motion.h1
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl sm:text-3xl font-bold text-white"
              >
                {user.fullName || "N/A"}
              </motion.h1>
              <motion.p
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="text-blue-100 text-sm sm:text-base"
              >
                @{user.username || "N/A"}
              </motion.p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaUserCircle className="mr-2 text-blue-500" /> Role
              </h2>
              <p className="text-gray-600">{user.role || "N/A"}</p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold text-gray-800">ID</h2>
              <p className="text-gray-600">{user.id || "N/A"}</p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-lg font-semibold text-gray-800">Email</h2>
              <p className="text-gray-600">{user.email || "N/A"}</p>
            </motion.div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.a
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              href="/accountInfo/edit-profile"
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </motion.a>
            <motion.a
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              href="/change-password"
              className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              <FaKey className="mr-2" /> Change Password
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccountPage;