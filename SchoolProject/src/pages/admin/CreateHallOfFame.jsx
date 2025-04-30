import React, { useState, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Modal from "../Modal";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
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
  const [cropCoordinates, setCropCoordinates] = useState(null);
  const [cropWidth, setCropWidth] = useState(150);
  const [cropHeight, setCropHeight] = useState(150);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

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

  const onCropChange = useCallback((cropper) => {
    const coords = cropper.getCoordinates();
    setCropCoordinates(coords);
    setCropWidth(coords.width);
    setCropHeight(coords.height);
    console.log("Crop coordinates:", coords);
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
      const file = new File([croppedImageBlob], "halloffame.jpg", { type: "image/jpeg" });

      const sizeValid = checkImageSize(file, handleImageError);
      if (!sizeValid) {
        throw new Error("Cropped image size exceeds 2MB limit");
      }

      setValue("image", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
      setCropModalOpen(false);
      setImageToCrop(null);
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
  }, [imageToCrop, cropCoordinates, setValue]);

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setModalState({
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
        setModalState({
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

  const handleDimensionChange = (dimension, value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 50 || numValue > 1000) {
      setModalState({
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
        animate="visible"
      >
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-medium mb-4 sm:mb-6 text-center text-gray-800"
          variants={fieldVariants}
        >
          Add Hall of Fame Entry
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600 mb-4 text-center"
          variants={fieldVariants}
        >
          All fields marked with <span className="text-red-500">*</span> are required
        </motion.p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Enter name"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Achievement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("achievement", { required: true })}
              placeholder="Enter achievement"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <Controller
              name="image"
              control={control}
              rules={{ required: true }}
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

      {cropModalOpen && imageToCrop && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-4 w-[90vw] max-w-[500px] border-2 border-blue-500"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 className="text-lg font-semibold mb-4 text-gray-900" variants={fieldVariants}>
              Crop Image
            </motion.h2>
            <motion.div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden" variants={fieldVariants}>
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
            </motion.div>
            <motion.div className="mt-4 grid grid-cols-2 gap-4" variants={fieldVariants}>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={cropWidth}
                  onChange={(e) => handleDimensionChange("width", e.target.value)}
                  min="50"
                  max="1000"
                  className="w-full p-2 border rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Crop width"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={cropHeight}
                  onChange={(e) => handleDimensionChange("height", e.target.value)}
                  min="50"
                  max="1000"
                  className="w-full p-2 border rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Crop height"
                />
              </div>
            </motion.div>
            <motion.div className="mt-4" variants={fieldVariants}>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Zoom</label>
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
            </motion.div>
            <motion.div className="mt-4 flex justify-end space-x-2" variants={containerVariants}>
              <motion.button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setImageToCrop(null);
                  setValue("image", null);
                  setImagePreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
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