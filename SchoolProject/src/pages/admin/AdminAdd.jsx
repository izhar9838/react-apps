import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation";
import Cropper from "react-easy-crop";
import { checkImageSize, fileToBase64, validateEmail, getCroppedImg } from "./ImageUtil";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

function AdminAdd() {
  const navigate = useNavigate();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation("/admin-add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      profileImage: null,
      role: "admin",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (file) => {
    if (!file) return;

    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const sizeValid = checkImageSize(croppedImageBlob, (error) => setImageError(error));
      if (!sizeValid) {
        setImageSrc(null);
        setShowCropper(false);
        setValue("profileImage", null);
        return;
      }

      setValue("profileImage", croppedImageBlob);
      setShowCropper(false);
      setImageSrc(URL.createObjectURL(croppedImageBlob));
    } catch (error) {
      setImageError("Failed to crop image");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let profileImageBase64 = null;
      if (data.profileImage) {
        profileImageBase64 = await fileToBase64(data.profileImage);
      }

      const formData = {
        username: data.username,
        email: data.email,
        password: data.password,
        profileImage: profileImageBase64,
        role: data.role,
      };

      const authToken = localStorage.getItem("authToken");

      const response = await axios.post("http://localhost:9090/api/admin/add-admin", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Admin added successfully!");
        reset();
        setImageSrc(null);
        navigate("admin/admin-list");
      } else {
        throw new Error("Failed to add admin");
      }
    } catch (error) {
      alert("Error adding admin: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
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
        animate={controls}
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
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <input
                  id="username"
                  {...field}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter username"
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.username.message}</p>
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

          {/* Password */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="password" className="block text-md font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
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
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Enter password"
                  />
                )}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
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
              <input
                type="hidden"
                {...field}
                value="admin"
              />
            )}
          />

          {/* Image Cropper Modal */}
          {showCropper && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                <h3 className="text-lg font-medium mb-4">Crop Image</h3>
                <div className="relative w-full h-64">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowCropper(false);
                      setImageSrc(null);
                      setValue("profileImage", null);
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
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-start">
            <motion.button
              type="submit"
              disabled={isSubmitting}
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
          </div>
        </form>
      </motion.div>
    </motion.section>
  );
}

export default AdminAdd;