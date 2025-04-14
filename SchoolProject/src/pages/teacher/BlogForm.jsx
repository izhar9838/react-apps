import React, { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { getCroppedImg, fileToBase64 } from '../admin/ImageUtil';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Modal from '../Modal'; // Assuming Modal.jsx is in the same directory
import './BlogForm.css';

const BlogForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const fileInputRef = useRef(null);

  const onSubmit = async (data) => {
    console.log('Form submitted', data);
    const authToken = localStorage.getItem('authToken');
    console.log('Auth Token:', authToken);
    try {
      const payload = {
        title: data.title,
        author: data.author,
        category: data.category,
        content: data.content,
        image: data.image || null,
      };

      const response = await axios.post('http://localhost:9090/api/teacher/postBlog', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      console.log('API Response:', response.data);
      reset();
      setImagePreview(null);
      setImageSrc(null);
      setShowCropper(false);
      setImageError(null);
      setSubmitError(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      window.scrollTo(0, 0); // Scroll to top
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      window.scrollTo(0, 0); // Scroll to top
      console.error('API Error Details:', error.response ? error.response : error.message);
      if (error.response) {
        setSubmitError(error.response.data.message || 'Failed to submit blog post. Please try again.');
      } else if (error.request) {
        setSubmitError('Network error: Could not reach the server.');
      } else {
        setSubmitError('An unexpected error occurred.');
      }
      setShowErrorModal(true); // Show error modal
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
      setImageError(null);
    };
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
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
      setImageError(null);
    } catch (error) {
      console.error('Error cropping or converting image:', error);
      setImageError('Failed to crop or convert image. Please try again.');
    }
  }, [imageSrc, croppedAreaPixels, setValue]);

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    setImagePreview(null);
    setValue('image', null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create Blog/News Post</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Fields marked with <span className="text-red-600">*</span> are required</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-600">*</span></label>
            <input
              type="text"
              {...register('title', {
                required: true,
                minLength: { value: 3, message: 'Title must be at least 3 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
            />
            {errors.title?.type === 'minLength' && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author <span className="text-red-600">*</span></label>
            <input
              type="text"
              {...register('author', {
                required: true,
                minLength: { value: 2, message: 'Author name must be at least 2 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name"
            />
            {errors.author?.type === 'minLength' && <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-600">*</span></label>
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
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-600">*</span></label>
            <textarea
              {...register('content', {
                required: true,
                minLength: { value: 10, message: 'Content must be at least 10 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Write your content here..."
            ></textarea>
            {errors.content?.type === 'minLength' && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image <span className="text-red-600">*</span></label>
            <input
              type="file"
              {...register('image', { required: true })}
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg shadow-sm transition-all file-input"
              ref={fileInputRef}
            />
            {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-md max-h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Submit Error */}
          {submitError && !showErrorModal && <p className="mt-1 text-sm text-red-600">{submitError}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">Publish</button>
          </div>
        </form>

        {/* Cropper Modal */}
        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
              <div className="relative w-full h-64">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={handleCancelCrop} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                <button onClick={handleCrop} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Crop & Save</button>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default BlogForm;