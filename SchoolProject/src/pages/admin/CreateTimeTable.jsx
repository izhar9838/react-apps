// File: CreateTimetable.jsx
// Description: This component is used to create a new timetable entry.
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Modal from "../Modal";
import { usePageAnimation } from "../usePageAnimation";

const CreateTimetable = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      className: "Nursery",
      period: "",
      subject: "",
      teacher: "",
    },
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation(location.pathname);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/createTimeTable`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      reset({
        className: data.className,
        period: "",
        subject: "",
        teacher: "",
      });

      setModalState({
        isOpen: true,
        title: "Success!",
        message: "Timetable entry added successfully!",
        isSuccess: true,
      });
    } catch (error) {
      console.error("Error adding timetable entry:", error);
      setModalState({
        isOpen: true,
        title: "Error!",
        message: "Failed to add timetable entry. Please try again.",
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
          Add Timetable Entry
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
              Class <span className="text-red-500">*</span>
            </label>
            <select
              {...register("className", { required: true })}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.className ? "border-red-500" : "border-gray-300"
              }`}
            >
              {["Nursery", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("period", {
                required: true,
                pattern: {
                  
                  
                },
              })}
              placeholder="e.g., 8:00-8:45"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("subject", { required: true })}
              placeholder="Enter subject"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("teacher", { required: true })}
              placeholder="Enter teacher name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Add Entry
          </motion.button>
        </form>
      </motion.div>

      {/* Animated Feedback Modal */}
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

export default CreateTimetable;