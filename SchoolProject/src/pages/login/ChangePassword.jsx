import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// Animation variants (same as EditProfile)
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// Password strength validation
const validatePasswordStrength = (value) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(value) || "Password must be at least 8 characters long and include letters and numbers";
};

// Confirm password validation
const validateConfirmPassword = (value, newPassword) => {
  return value === newPassword || "Passwords do not match";
};

const ChangePassword = () => {
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Watch newPassword for confirmPassword validation
  const newPassword = watch("newPassword");

  // Check if user is logged in
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const payload = {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        };

        const response = await axios.put(
          "http://localhost:9090/api/public/change-password",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setModal({
          isOpen: true,
          title: "Success",
          message: response.data.message || "Password changed successfully!",
          isSuccess: true,
        });
      } catch (error) {
        console.error("Password change error:", error);
        setModal({
          isOpen: true,
          title: "Error",
          message: error.response?.data?.message || "Failed to change password. Please try again.",
          isSuccess: false,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    setTimeout(() => navigate("/accountInfo"), 300); // Navigate after animation
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl font-bold text-gray-800 text-center mb-6"
          variants={fieldVariants}
        >
          Change Password
        </motion.h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Fields */}
          <motion.div className="grid grid-cols-1 gap-4" variants={containerVariants}>
            <Field
              label="Current Password"
              name="currentPassword"
              control={control}
              type="password"
              required
              variants={fieldVariants}
              errors={errors}
            />
            <Field
              label="New Password"
              name="newPassword"
              control={control}
              type="password"
              required
              validate={validatePasswordStrength}
              variants={fieldVariants}
              errors={errors}
            />
            <Field
              label="Confirm Password"
              name="confirmPassword"
              control={control}
              type="password"
              required
              validate={(value) => validateConfirmPassword(value, newPassword)}
              variants={fieldVariants}
              errors={errors}
            />
          </motion.div>

          {/* Buttons */}
          <motion.div className="flex justify-end space-x-3" variants={containerVariants}>
            <motion.button
              type="button"
              onClick={() => navigate("/accountInfo")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              disabled={isSubmitting}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isSubmitting ? "Saving..." : "Change Password"}
            </motion.button>
          </motion.div>
        </form>

        {/* Feedback Modal */}
        <AnimatePresence>
          {modal.isOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 w-[90vw] max-w-md"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center mb-4">
                  {modal.isSuccess ? (
                    <FaCheckCircle className="text-green-500 text-2xl mr-2" />
                  ) : (
                    <FaExclamationCircle className="text-red-500 text-2xl mr-2" />
                  )}
                  <h2 className="text-lg font-semibold text-gray-800">{modal.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{modal.message}</p>
                <div className="flex justify-end">
                  <motion.button
                    onClick={closeModal}
                    className={`px-4 py-2 rounded-lg text-white ${
                      modal.isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Reusable Field Component (same as EditProfile)
const Field = ({ label, name, control, type, required, validate, variants, errors }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false, validate }}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name}
          autoComplete="off"
          className={`w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
    )}
  </motion.div>
);

export default ChangePassword;