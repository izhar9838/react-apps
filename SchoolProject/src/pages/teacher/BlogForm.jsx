import React, { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { getCroppedImg, fileToBase64 } from '../admin/ImageUtil';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { usePageAnimation } from '../usePageAnimation';
import Modal from '../Modal';
import './BlogForm.css';

const BlogForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropCoordinates, setCropCoordinates] = useState(null);
  const [cropWidth, setCropWidth] = useState(300);
  const [cropHeight, setCropHeight] = useState(200);
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation(location.pathname);

  // Workaround for tab-switching visibility issue
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          controls.start("visible");
        }, 100);
      }
    };
    const handleFocus = () => {
      controls.start("visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [controls]);

  const onSubmit = async (data) => {
    const authToken = localStorage.getItem('authToken');
    try {
      let imageBase64 = data.image || null;
      if (imageBase64 && imageBase64.startsWith('data:image/')) {
        imageBase64 = imageBase64.split(',')[1];
      }

      const payload = {
        title: data.title,
        author: data.author,
        category: data.category,
        content: data.content,
        image: imageBase64,
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/postBlog`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      reset();
      setImagePreview(null);
      setImageSrc(null);
      setShowCropper(false);
      setImageError(null);
      setSubmitError(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      window.scrollTo(0, 0);
      setShowSuccessModal(true);
    } catch (error) {
      window.scrollTo(0, 0);
      console.error('API Error Details:', error.response ? error.response : error.message);
      if (error.response) {
        setSubmitError(error.response.data.message || 'Failed to submit blog post. Please try again.');
      } else if (error.request) {
        setSubmitError('Network error: Could not reach the server.');
      } else {
        setSubmitError('An unexpected error occurred.');
      }
      setShowErrorModal(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (e.g., JPG, PNG).');
      if (fileInputRef.current) fileInputRef.current.value = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
      setImageError(null);
    };
    reader.onerror = () => {
      setImageError('Failed to read the image file.');
      if (fileInputRef.current) fileInputRef.current.value = null;
    };
  };

  const onCropChange = useCallback((cropper) => {
    const coords = cropper.getCoordinates();
    setCropCoordinates(coords);
    setCropWidth(coords.width);
    setCropHeight(coords.height);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      if (!imageSrc || !cropCoordinates) {
        throw new Error('Invalid crop parameters');
      }
      const croppedImageBlob = await getCroppedImg(imageSrc, {
        x: cropCoordinates.left,
        y: cropCoordinates.top,
        width: cropCoordinates.width,
        height: cropCoordinates.height,
      });
      const maxSizeInMB = 2;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (croppedImageBlob.size > maxSizeInBytes) {
        setImageError(`Cropped image size exceeds ${maxSizeInMB}MB. Please crop a smaller area or try a different image.`);
        setShowCropper(false);
        setImageSrc(null);
        setImagePreview(null);
        setValue('image', null);
        if (fileInputRef.current) fileInputRef.current.value = null;
        return;
      }

      const croppedImageBase64 = await fileToBase64(croppedImageBlob);
      setImagePreview(croppedImageBase64);
      setValue('image', croppedImageBase64);
      setShowCropper(false);
      setImageSrc(null);
      setImageError(null);
    } catch (error) {
      console.error('Error cropping or converting image:', error);
      setImageError(error.message || 'Failed to crop or convert image. Please try again.');
    }
  }, [imageSrc, cropCoordinates, setValue]);

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setImagePreview(null);
    setValue('image', null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 50 || numValue > 1000) {
      setImageError('Please enter a value between 50 and 1000 pixels.');
      return;
    }
    if (dimension === 'width') {
      setCropWidth(numValue);
    } else {
      setCropHeight(numValue);
    }
    if (cropperRef.current) {
      cropperRef.current.setCoordinates({
        width: dimension === 'width' ? numValue : cropWidth,
        height: dimension === 'height' ? numValue : cropHeight,
      });
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] flex items-center justify-center p-4"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        ref={formRef}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6"
      >
        <motion.h2 variants={cardVariants} className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Create Blog/News Post
        </motion.h2>
        <motion.p variants={cardVariants} className="text-sm text-gray-600 mb-6 text-center">
          Fields marked with <span className="text-red-600">*</span> are required
        </motion.p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <motion.div variants={cardVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register('title', {
                required: true,
                minLength: { value: 3, message: 'Title must be at least 3 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
            />
            {errors.title?.type === 'minLength' && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
            {errors.title?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Title is required</p>
            )}
          </motion.div>

          {/* Author */}
          <motion.div variants={cardVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register('author', {
                required: true,
                minLength: { value: 2, message: 'Author name must be at least 2 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name"
            />
            {errors.author?.type === 'minLength' && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
            {errors.author?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Author is required</p>
            )}
          </motion.div>

          {/* Category */}
          <motion.div variants={cardVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-600">*</span>
            </label>
            <select
              {...register('category', { required: true })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="news">News</option>
              <option value="blog">Blog</option>
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
            {errors.category?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Category is required</p>
            )}
          </motion.div>

          {/* Content */}
          <motion.div variants={cardVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register('content', {
                required: true,
                minLength: { value: 10, message: 'Content must be at least 10 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Write your content here..."
            ></textarea>
            {errors.content?.type === 'minLength' && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            {errors.content?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Content is required</p>
            )}
          </motion.div>

          {/* Image Upload */}
          <motion.div variants={cardVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              {...register('image', { required: true })}
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg shadow-sm file-input"
              ref={fileInputRef}
            />
            {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
            {errors.image?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Featured Image is required</p>
            )}
            {imagePreview && (
              <motion.div variants={cardVariants} className="mt-4">
                <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-md max-h-48 object-cover" />
              </motion.div>
            )}
          </motion.div>

          {/* Submit Error */}
          {submitError && !showErrorModal && (
            <motion.p variants={cardVariants} className="mt-1 text-sm text-red-600">{submitError}</motion.p>
          )}

          {/* Submit Button */}
          <motion.div variants={cardVariants} className="flex justify-end">
            <motion.button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md"
              whileHover={{ scale: 1.05 }}
            >
              Publish
            </motion.button>
          </motion.div>
        </form>

        {/* Cropper Modal */}
        <AnimatePresence>
          {showCropper && imageSrc && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-lg border-2 border-blue-500"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.h3 variants={cardVariants} className="text-lg font-semibold mb-4 text-gray-900">
                  Crop Image
                </motion.h3>
                <motion.div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden" variants={cardVariants}>
                  <Cropper
                    ref={cropperRef}
                    src={imageSrc}
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
                <motion.div className="mt-4 grid grid-cols-2 gap-4" variants={cardVariants}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={cropWidth}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
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
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                      min="50"
                      max="1000"
                      className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Crop height"
                    />
                  </div>
                </motion.div>
                <motion.div className="mt-4" variants={cardVariants}>
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
                </motion.div>
                <motion.div variants={cardVariants} className="mt-4 flex justify-end space-x-2">
                  <motion.button
                    onClick={handleCancelCrop}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleCrop}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    Crop & Save
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={closeSuccessModal}
          title="Success"
          message="Your blog post has been published successfully."
          isSuccess={true}
        />

        {/* Error Modal */}
        <Modal
          isOpen={showErrorModal}
          onClose={closeErrorModal}
          title="Error"
          message={submitError || "An unexpected error occurred."}
          isSuccess={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default BlogForm;
