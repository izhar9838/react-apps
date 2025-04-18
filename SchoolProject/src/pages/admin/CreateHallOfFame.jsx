
import React, { useState, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Modal from "../Modal";
import Cropper from "react-easy-crop";
import { getCroppedImg, fileToBase64 } from "./ImageUtil";
import { usePageAnimation } from "../usePageAnimation";

const CreateHallOfFame = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: false,
  });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation(location.pathname);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      achievement: "",
      image: null,
    },
    mode: "onChange",
  });

  const checkImageSize = (file, onError) => {
    const maxSizeMB = 2;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError(`Cropped image size exceeds ${maxSizeMB}MB limit. Please try cropping a smaller area or use a different image.`);
      return false;
    }
    return true;
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        throw new Error("Invalid crop parameters");
      }
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const file = new File([croppedImage], "halloffame.jpg", { type: "image/jpeg" });

      const sizeValid = checkImageSize(file, handleImageError);
      if (!sizeValid) {
        throw new Error("Cropped image size exceeds 2MB limit");
      }

      setValue("image", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
      setCropModalOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Crop error:", error);
      setModalState({
        isOpen: true,
        title: "Crop Error",
        message: error.message || "Failed to crop the image. Please try again.",
        isSuccess: false,
      });
    }
  }, [imageToCrop, croppedAreaPixels, setValue]);

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setCropModalOpen(true);
      onChange(file);
    }
  };

  const handleImageError = (message) => {
    setModalState({
      isOpen: true,
      title: "Image Error",
      message,
      isSuccess: false,
    });
  };

  const removeImage = () => {
    setValue("image", null, { shouldValidate: true });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!data.image) {
        throw new Error("Please upload an image");
      }
      const base64Image = await fileToBase64(data.image);
      const payload = {
        name: data.name,
        achievement: data.achievement,
        image: base64Image,
      };
      const token = localStorage.getItem("authToken");

      await axios.post("http://localhost:9090/api/admin/add-hallOfFame", payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      reset();
      setImagePreview(null);
      setModalState({
        isOpen: true,
        title: "Success!",
        message: "Entry added successfully!",
        isSuccess: true,
      });
    } catch (error) {
      console.error("Error adding entry:", error);
      setModalState({
        isOpen: true,
        title: "Error!",
        message: error.message || "Failed to add entry. Please try again.",
        isSuccess: false,
      });
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <motion.div
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 sm:mb-6 text-center text-gray-800"
          variants={fieldVariants}
        >
          Add Hall of Fame Entry
        </motion.h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Enter name"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Achievement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("achievement", { required: "Achievement is required" })}
              placeholder="Enter achievement"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                errors.achievement ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.achievement && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.achievement.message}</p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <Controller
              name="image"
              control={control}
              rules={{ required: "Image is required" }}
              render={({ field: { onChange, value, ...field } }) => (
                <div className="relative">
                  <input
                    {...field}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, onChange)}
                    className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg shadow-sm transition-all file-input"
                    ref={fileInputRef}
                  />
                  {imagePreview && (
                    <div className="mt-4 flex items-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md"
                      />
                      <motion.button
                        type="button"
                        onClick={removeImage}
                        className="text-red-500 text-xs hover:underline ml-4"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Remove
                      </motion.button>
                    </div>
                  )}
                  {errors.image && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.image.message}</p>
                  )}
                </div>
              )}
            />
          </motion.div>

          <motion.div className="flex justify-center" variants={containerVariants}>
            <motion.button
              type="submit"
              className="bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition duration-300 text-sm"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Add Entry
            </motion.button>
          </motion.div>
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

      {cropModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-4 w-[90vw] max-w-[500px]"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.h2 className="text-lg font-semibold mb-4" variants={fieldVariants}>
              Crop Image
            </motion.h2>
            <motion.div className="relative w-full h-[300px]" variants={fieldVariants}>
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </motion.div>
            <motion.div className="mt-4 flex justify-end space-x-2" variants={containerVariants}>
              <motion.button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 text-sm"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCropSave}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Save
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreateHallOfFame;
