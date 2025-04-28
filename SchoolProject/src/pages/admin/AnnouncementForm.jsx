// File: AnnouncementForm.jsx
// Description: This component is used to create a new school announcement.
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Modal from '../Modal';
import { usePageAnimation } from '../usePageAnimation';

const AnnouncementForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: false,
  });

  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } =
    usePageAnimation(location.pathname);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:8080/api/announcements', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      reset({
        title: '',
        content: '',
      });

      setModalState({
        isOpen: true,
        title: 'Success!',
        message: 'Announcement created successfully!',
        isSuccess: true,
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      setModalState({
        isOpen: true,
        title: 'Error!',
        message: 'Failed to create announcement. Please try again.',
        isSuccess: false,
      });
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="text-2xl font-bold mb-4 text-center text-gray-800"
          variants={fieldVariants}
        >
          Create School Announcement
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600 mb-4 text-center"
          variants={fieldVariants}
        >
          All fields marked with <span className="text-red-500">*</span> are required
        </motion.p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters long',
                },
              })}
              placeholder="Enter announcement title"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('content', {
                required: 'Content is required',
                minLength: {
                  value: 10,
                  message: 'Content must be at least 10 characters long',
                },
              })}
              placeholder="Enter announcement content"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.content ? 'border-red-500' : ''
              }`}
              rows="5"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Create Announcement
          </motion.button>
        </form>
      </motion.div>

      {modalState.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Modal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            title={modalState.title}
            message={modalState.message}
            isSuccess={modalState.isSuccess}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnnouncementForm;