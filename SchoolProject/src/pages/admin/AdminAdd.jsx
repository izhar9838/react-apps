import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { fileToBase64, validateEmail, getCroppedImg, validateUsername } from "./ImageUtil";
import useUsernameCheck from "./ImageUtil"; // Import the useUsernameCheck hook
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";

// Modal animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// Phone number validation
const validatePhoneNumber = (value) => {
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
  const digitsOnly = value.replace(/[\D]/g, "");
  if (!phoneRegex.test(value)) {
    return "Phone number must be 7-15 digits and may include +, -, (), or spaces";
  }
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return "Phone number must contain 7-15 digits";
  }
  return true;
};

function AdminAdd() {
  const navigate = useNavigate();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation("/admin-add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropCoordinates, setCropCoordinates] = useState(null);
  const [cropWidth, setCropWidth] = useState(150);
  const [cropHeight, setCropHeight] = useState(150);
  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      profileImage: null,
      role: "admin",
    },
    mode: "onChange", // Trigger validation on every change
  });

  const username = watch("username"); // Watch username field for changes
  const { usernameStatus } = useUsernameCheck(username, 500); // Use the hook with 500ms debounce

  // Debug errors.username
  useEffect(() => {
    console.log("Username errors:", errors.username);
  }, [errors.username]);

  const togglePasswordVisibility = () => {
    setShowCropper(false);
    setShowPassword((prev) => !prev);
  };

  const onCropChange = useCallback((cropper) => {
    const coords = cropper.getCoordinates();
    setCropCoordinates(coords);
    setCropWidth(coords.width);
    setCropHeight(coords.height);
  }, []);

  const handleImageChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file (e.g., JPG, PNG).");
      if (fileInputRef.current) fileInputRef.current.value = null;
      return;
    }

    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.onerror = () => {
      setImageError("Failed to read the image file.");
      if (fileInputRef.current) fileInputRef.current.value = null;
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    try {
      if (!imageSrc || !cropCoordinates) {
        throw new Error("Invalid crop parameters");
      }
      const croppedImageBlob = await getCroppedImg(imageSrc, {
        x: cropCoordinates.left,
        y: cropCoordinates.top,
        width: cropCoordinates.width,
        height: cropCoordinates.height,
      });

      setValue("profileImage", croppedImageBlob);
      setShowCropper(false);
      setImageSrc(URL.createObjectURL(croppedImageBlob));
    } catch (error) {
      setImageError(error.message || "Failed to crop image");
    }
  };

  const handleWidthChange = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 50 || numValue > 400) {
      setImageError("Width must be between 50 and 400 pixels.");
      return;
    }
    setCropWidth(numValue);
    if (cropperRef.current) {
      cropperRef.current.setCoordinates((prev) => ({
        ...prev,
        width: numValue,
      }));
    }
  };

  const handleHeightChange = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 50 || numValue > 400) {
      setImageError("Height must be between 50 and 400 pixels.");
      return;
    }
    setCropHeight(numValue);
    if (cropperRef.current) {
      cropperRef.current.setCoordinates((prev) => ({
        ...prev,
        height: numValue,
      }));
    }
  };

  useEffect(() => {
    if (showCropper && imageSrc && cropperRef.current) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const minDimension = Math.min(image.width, image.height, 400);
        const initialSize = Math.min(150, minDimension * 0.8);
        setCropWidth(initialSize);
        setCropHeight(initialSize);
        cropperRef.current.setCoordinates({
          width: initialSize,
          height: initialSize,
          left: (image.width - initialSize) / 2,
          top: (image.height - initialSize) / 2,
        });
      };
    }
  }, [showCropper, imageSrc]);

  const onSubmit = async (data) => {
    if (usernameStatus.exists) {
      setModal({
        isOpen: true,
        title: "Error",
        message: "Username is already taken. Please choose another.",
        isSuccess: false,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let profileImageBase64 = null;
      if (data.profileImage) {
        profileImageBase64 = await fileToBase64(data.profileImage);
      }

      const formData = {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        profileImage: profileImageBase64,
        role: data.role,
      };

      const authToken = localStorage.getItem("authToken");

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/add-admin`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      setModal({
        isOpen: true,
        title: "Success",
        message: "Admin added successfully!",
        isSuccess: true,
      });
      setTimeout(() => {
        reset();
        setImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        navigate("/admin");
      }, 2000);
    } catch (error) {
      setModal({
        isOpen: true,
        title: "Error",
        message: error.response?.data?.message || "Failed to add admin. Please try again.",
        isSuccess: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    if (!modal.isSuccess) {
      setTimeout(() => navigate("/admin-add"), 300);
    }
  };

  return (
    <motion.section
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] w-full min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-xl sm:text-2xl font-medium text-gray-800 mb-4 text-center"
          variants={fieldVariants}
        >
          Add New Admin
        </motion.h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="username" className="block text-md font-medium text-gray-600">
              Username
            </label>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                validate: validateUsername, // Add username format validation
              }}
              render={({ field }) => (
                <input
                  id="username"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e); // Update form value
                    trigger("username"); // Force re-validation
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter username"
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.username.message}</p>
            )}
            {!errors.username && usernameStatus.isChecking && (
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Checking username...</p>
            )}
            {!errors.username && !usernameStatus.isChecking && usernameStatus.exists && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{usernameStatus.message}</p>
            )}
            {!errors.username && !usernameStatus.isChecking && !usernameStatus.exists && usernameStatus.message && (
              <p className="text-green-500 text-xs sm:text-sm mt-1">{usernameStatus.message}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="email" className="block text-md font-medium text-gray-600">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                validate: validateEmail,
              }}
              render={({ field }) => (
                <input
                  id="email"
                  {...field}
                  type="email"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter email"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          {/* Phone Number */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="phoneNumber" className="block text-md font-medium text-gray-600">
              Phone Number
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: "Phone number is required",
                validate: validatePhoneNumber,
              }}
              render={({ field }) => (
                <input
                  id="phoneNumber"
                  {...field}
                  type="tel"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter phone number (e.g., +1234567890)"
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="password" className="block text-md font-medium text-gray-600">
              Password
            </label>
            <div className="relative w-full">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <input
                    id="password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Enter password"
                  />
                )}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 max-w-10 max-h-10 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                style={{ zIndex: 10 }} // Ensure the icon is above other elements
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          {/* Profile Image */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="profileImage" className="block text-md font-medium text-gray-600">
              Profile Image
            </label>
            <Controller
              name="profileImage"
              control={control}
              rules={{ required: "Profile image is required" }}
              render={({ field: { onChange } }) => (
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageChange(file);
                      onChange(file);
                    }
                  }}
                  className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg shadow-sm transition-all file-input"
                  ref={fileInputRef}
                />
              )}
            />
            {errors.profileImage && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.profileImage.message}</p>
            )}
            {imageError && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{imageError}</p>
            )}
            {imageSrc && !showCropper && (
              <div className="mt-2">
                <img
                  src={imageSrc}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
          </motion.div>

          {/* Hidden Role Field */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <input type="hidden" {...field} value="admin" />
            )}
          />

          {/* Image Cropper Modal */}
          {showCropper && imageSrc && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg max-w-md w-full border-2 border-blue-500 shadow-xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h3 className="text-lg font-medium mb-4 text-gray-900" variants={fieldVariants}>
                  Crop Profile Image
                </motion.h3>
                <motion.div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden" variants={fieldVariants}>
                  <Cropper
                    ref={cropperRef}
                    src={imageSrc}
                    onChange={onCropChange}
                    stencilProps={{
                      movable: true,
                      resizable: true,
                      minWidth: 50,
                      minHeight: 50,
                      maxWidth: 400,
                      maxHeight: 400,
                      grid: true,
                      handlers: {
                        east: true,
                        west: true,
                        north: true,
                        south: true,
                        northEast: true,
                        northWest: true,
                        southEast: true,
                        southWest: true,
                      },
                      lines: true,
                      movableX: true,
                      movableY: true,
                      overlayClassName: "bg-black bg-opacity-50",
                    }}
                    className="cropper"
                    style={{
                      containerStyle: {
                        width: "100%",
                        height: "100%",
                        background: "#333",
                      },
                      mediaStyle: {
                        objectFit: "contain",
                      },
                      stencilStyle: {
                        border: "2px dashed #3b82f6",
                        boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                        background: "rgba(59, 130, 246, 0.1)",
                      },
                    }}
                  />
                </motion.div>
                <motion.div className="mt-4 grid grid-cols-2 gap-4" variants={fieldVariants}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={cropWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      min="50"
                      max="400"
                      className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Crop width"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={cropHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      min="50"
                      max="400"
                      className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Crop height"
                    />
                  </div>
                </motion.div>
                <motion.div className="mt-4" variants={fieldVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zoom</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => {
                      const newZoom = Number(e.target.value);
                      setZoom(newZoom);
                      if (cropperRef.current) {
                        cropperRef.current.setTransform({ scale: newZoom });
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoom - 0.5) / 2.5) * 100}%, #d1d5db ${((zoom - 0.5) / 2.5) * 100}%, #d1d5db 100%)`,
                    }}
                    aria-label="Adjust image zoom"
                  />
                </motion.div>
                <motion.div className="mt-4 flex justify-end space-x-2" variants={fieldVariants}>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowCropper(false);
                      setImageSrc(null);
                      setValue("profileImage", null);
                      if (fileInputRef.current) fileInputRef.current.value = null;
                    }}
                    className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCrop}
                    className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Crop
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div className="flex justify-start" variants={fieldVariants}>
            <motion.button
              type="submit"
              disabled={isSubmitting || usernameStatus.isChecking || usernameStatus.exists}
              className="py-2 px-6 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Add Admin"
              )}
            </motion.button>
          </motion.div>

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
        </form>
      </motion.div>
    </motion.section>
  );
}

export default AdminAdd;