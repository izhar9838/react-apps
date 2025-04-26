import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from '../../store/authSlice';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa";

// Animation variants (unchanged)
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

// Password strength validation (unchanged)
const validatePasswordStrength = (value) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(value) || "Password must be at least 8 characters long and include letters and numbers";
};

// Confirm password validation (unchanged)
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
  const dispatch = useDispatch();
  const newPassword = watch("newPassword");

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

        const response = await axios.patch(
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
        setTimeout(() => {
          dispatch(logout());
          navigate("/login");
        }, 2000);
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
    setTimeout(() => navigate("/accountInfo"), 300);
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
          <motion.div className="flex flex-col space-y-4" variants={containerVariants}>
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

// Updated Field Component with Show/Hide Password (unchanged)
const Field = ({ label, name, control, type, required, validate, variants, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div variants={variants}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          rules={{ required: required ? `${label} is required` : false, validate }}
          render={({ field }) => (
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              id={name}
              autoComplete="off"
              className={`w-full p-3 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0  max-w-10 max-h-10 flex items-center pr-3 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
        </button>
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
      )}
    </motion.div>
  );
};

export default ChangePassword;