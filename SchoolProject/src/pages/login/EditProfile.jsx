import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import axios from "axios";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaTrash, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { fileToBase64, getCroppedImg } from "../admin/ImageUtil";

// Animation variants
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

const validateEmail = (value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value) || "Invalid email address";
};

const EditProfile = () => {
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropCoordinates, setCropCoordinates] = useState(null);
  const [cropWidth, setCropWidth] = useState(150);
  const [cropHeight, setCropHeight] = useState(150);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      image: null,
    },
    mode: "onChange",
  });

  // Check if user is logged in
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/public/edit-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { fullName, email, phoneNumber, image } = response.data;
        const [firstName, lastName] = fullName.split(" ");
        reset({ firstName, lastName, email, phoneNumber });
        if (image) {
          setImagePreview(`data:image/jpeg;base64,${image}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setModal({
          isOpen: true,
          title: "Error",
          message: "Failed to load profile data. Please try again.",
          isSuccess: false,
        });
      }
    };
    fetchProfile();
  }, [reset, token]);

  const onCropChange = useCallback((cropper) => {
    const coords = cropper.getCoordinates();
    setCropCoordinates(coords);
    setCropWidth(coords.width);
    setCropHeight(coords.height);

  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      if (!imageToCrop || !cropCoordinates) {
        throw new Error("Invalid crop parameters");
      }

      const croppedImageBlob = await getCroppedImg(imageToCrop, {
        x: cropCoordinates.left,
        y: cropCoordinates.top,
        width: cropCoordinates.width,
        height: cropCoordinates.height,
      });
      const croppedImageFile = new File([croppedImageBlob], "profile.jpg", { type: "image/jpeg" });

      setValue("image", croppedImageFile, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(croppedImageFile));
      setCropModalOpen(false);
      setImageToCrop(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Crop error:", error);
      setModal({
        isOpen: true,
        title: "Crop Error",
        message: error.message || "Failed to crop the image. Please try again.",
        isSuccess: false,
      });
    }
  }, [imageToCrop, cropCoordinates, setValue]);

  const customHandleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setModal({
        isOpen: true,
        title: "Invalid File",
        message: "Please select a valid image file (e.g., JPG, PNG).",
        isSuccess: false,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result);
      setCropModalOpen(true);
      onChange(file);
    };
    reader.onerror = () => {
      console.error("FileReader error");
      setModal({
        isOpen: true,
        title: "Image Error",
        message: "Failed to read the image file. Please try again.",
        isSuccess: false,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const imageBase64 = data.image ? await fileToBase64(data.image) : null;

        const profileData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          profileImage: imageBase64,
        };
        const response = await axios.put(
          "http://localhost:9090/api/public/updateProfile",
          profileData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data;
        dispatch(loginSuccess({ token, user }));

        setModal({
          isOpen: true,
          title: "Success",
          message: response.data.message || "Profile updated successfully!",
          isSuccess: true,
        });
      } catch (error) {
        console.error("Submission error:", error);
        setModal({
          isOpen: true,
          title: "Error",
          message: error.response?.data?.message || "Something went wrong. Please try again later.",
          isSuccess: false,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    setTimeout(() => navigate("/accountInfo"), 300); // Navigate to /accountInfo after animation
  };

  const removeImage = () => {
    setValue("image", null, { shouldValidate: true });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 50 || numValue > 1000) {
      setModal({
        isOpen: true,
        title: "Invalid Input",
        message: "Please enter a value between 50 and 1000 pixels.",
        isSuccess: false,
      });
      return;
    }
    if (dimension === "width") {
      setCropWidth(numValue);
    } else {
      setCropHeight(numValue);
    }
    if (cropperRef.current) {
      cropperRef.current.setCoordinates({
        width: dimension === "width" ? numValue : cropWidth,
        height: dimension === "height" ? numValue : cropHeight,
      });
    }
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
          Edit Profile
        </motion.h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <motion.div className="flex justify-center mb-6" variants={fieldVariants}>
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-2xl md:text-3xl">No Image</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <label htmlFor="image" className="cursor-pointer">
                  <FaCamera className="text-white text-xl md:text-2xl" />
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => customHandleImageChange(e, (file) => setValue("image", file))}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="ml-2 text-white"
                  >
                    <FaTrash className="text-xl md:text-2xl" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
          {errors.image && (
            <p className="text-red-500 text-sm text-center">{errors.image.message}</p>
          )}

          {/* Form Fields */}
          <motion.div className="grid grid-cols-1 gap-4" variants={containerVariants}>
            <Field
              label="First Name"
              name="firstName"
              control={control}
              type="text"
              required
              variants={fieldVariants}
              errors={errors}
            />
            <Field
              label="Last Name"
              name="lastName"
              control={control}
              type="text"
              required={false}
              variants={fieldVariants}
              errors={errors}
            />
            <Field
              label="Email"
              name="email"
              control={control}
              type="email"
              required
              validate={validateEmail}
              variants={fieldVariants}
              errors={errors}
            />
            <Field
              label="Phone Number"
              name="phoneNumber"
              control={control}
              type="tel"
              required
              variants={fieldVariants}
              errors={errors}
            />
          </motion.div>

          {/* Buttons */}
          <motion.div className="flex justify-end space-x-3" variants={containerVariants}>
            <motion.button
              type="button"
              onClick={() => navigate("/account")}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </motion.button>
          </motion.div>
        </form>

        {/* Crop Modal */}
        <AnimatePresence>
          {cropModalOpen && (
            <motion.div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-xl p-6 w-[90vw] max-w-md border-2 border-blue-500"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Crop Image</h2>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <Cropper
                    ref={cropperRef}
                    src={imageToCrop}
                    onChange={onCropChange}
                    stencilProps={{
                      movable: true,
                      resizable: true,
                      minWidth: 50,
                      minHeight: 50,
                      maxWidth: 1000,
                      maxHeight: 1000,
                      handlers: true,
                      lines: true,
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
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={cropWidth}
                      onChange={(e) => handleDimensionChange("width", e.target.value)}
                      min="50"
                      max="1000"
                      className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Crop width"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={cropHeight}
                      onChange={(e) => handleDimensionChange("height", e.target.value)}
                      min="50"
                      max="1000"
                      className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Crop height"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zoom</label>
                  <input
                    type="range"
                    min="0.1"
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
                    style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoom - 0.1) / 2.9) * 100}%, #d1d5db ${((zoom - 0.1) / 2.9) * 100}%, #d1d5db 100%)` }}
                    aria-label="Adjust image zoom"
                  />
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setCropModalOpen(false);
                      setImageToCrop(null);
                      setValue("image", null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCropSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

// Reusable Field Component
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

export default EditProfile;