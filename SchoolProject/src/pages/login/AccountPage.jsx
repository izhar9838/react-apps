import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEdit, FaKey } from 'react-icons/fa';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/account', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching account details:', error);
        setLoading(false);
      }
    };
    fetchAccountDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-600">Error loading account details</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={user.profilePictureUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.fullName}</h1>
              <p className="text-blue-100 text-sm sm:text-base">@{user.username}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaUserCircle className="mr-2 text-blue-500" /> Role
              </h2>
              <p className="text-gray-600">{user.role}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">School ID</h2>
              <p className="text-gray-600">{user.schoolId || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Class/Department</h2>
              <p className="text-gray-600">{user.classOrDepartment || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Email</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="sm:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
              <p className="text-gray-600">{user.bio || 'No bio provided'}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Joined</h2>
              <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/edit-profile"
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/change-password"
              className="flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              <FaKey className="mr-2" /> Change Password
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountPage;