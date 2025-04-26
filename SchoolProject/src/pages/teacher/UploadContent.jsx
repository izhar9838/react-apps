import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { fileToBase64 } from "../admin/ImageUtil"; // Import fileToBase64

// Modal animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

function UploadContent() {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: "", description: "", file: null, classLevel: null },
  });
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const token = localStorage.getItem("authToken");

  // Fetch classes from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:9090/api/teacher/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Expecting response.data to be an array of objects with id, name, description
        const classOptions = response.data.map((cls) => ({
          value: cls.id,
          label: cls.name, // e.g., "7th", "6th", "5th"
        }));
        setClasses(classOptions);
      } catch (error) {
        setMessage("Failed to load classes.");
      }
    };
    fetchClasses();
  }, [token]);

  // Update title based on selected class
  const dynamicTitle = selectedClass
    ? `Upload Content for ${selectedClass.label}`
    : "Select a Class to Upload Content";

  const onSubmit = async (data) => {
    if (!data.file || !data.title || !data.classLevel) {
      setMessage("Please provide a title, file, and select a class.");
      return;
    }

    try {
      // Convert file to base64
      const base64File = await fileToBase64(data.file[0]);

      // Prepare JSON payload
      const payload = {
        title: data.title,
        description: data.description,
        mimeType: data.file[0].type,
        notes: base64File, // Base64 string
        classLevel: data.classLevel.label, // Send class name (e.g., "7th") instead of ID
      };
      console.log(payload);

      await axios.post("http://localhost:9090/api/teacher/upload-notes", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setModal({
        isOpen: true,
        title: "Success",
        message: "Content uploaded successfully!",
        isSuccess: true,
      });
      reset();
      setSelectedClass(null);
    } catch (error) {
      setModal({
        isOpen: true,
        title: "Error",
        message: error.response?.data?.message || "Failed to upload content. Please try again.",
        isSuccess: false,
      });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen flex items-center justify-center p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 text-center mb-4 sm:mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {dynamicTitle}
        </motion.h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700">Select Class</label>
            <Controller
              name="classLevel"
              control={control}
              rules={{ required: "Class is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={classes}
                  value={selectedClass}
                  onChange={(value) => {
                    setSelectedClass(value);
                    field.onChange(value);
                  }}
                  placeholder="Select a class..."
                  className="basic-single w-full"
                  classNamePrefix="select"
                  isSearchable
                />
              )}
            />
            {errors.classLevel && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.classLevel.message}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700">Title</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                />
              )}
            />
            {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700">Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full p-2 sm:p-3 text-xs sm:text-sm md:text-base border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows={3}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700">Upload File (PDF/Notes)</label>
            <Controller
              name="file"
              control={control}
              rules={{ required: "File is required" }}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => onChange(e.target.files)}
                  className="mt-1 block w-full p-2 text-xs md:text-sm border border-gray-300 rounded-lg shadow-sm transition-all file-input"
                />
              )}
            />
            {errors.file && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.file.message}</p>}
          </div>
          <motion.button
            type="submit"
            className="w-full py-2 sm:py-3 text-xs sm:text-sm md:text-base bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!selectedClass}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload
          </motion.button>
          {message && <p className="mt-2 text-xs sm:text-sm text-red-500">{message}</p>}
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
                className="bg-white rounded-2xl p-4 sm:p-6 w-[90vw] sm:w-[80vw] md:max-w-md"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center mb-2 sm:mb-4">
                  {modal.isSuccess ? (
                    <FaCheckCircle className="text-green-500 text-lg sm:text-xl md:text-2xl mr-2" />
                  ) : (
                    <FaExclamationCircle className="text-red-500 text-lg sm:text-xl md:text-2xl mr-2" />
                  )}
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">{modal.title}</h2>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">{modal.message}</p>
                <div className="flex justify-end">
                  <motion.button
                    onClick={closeModal}
                    className={`px-3 sm:px-4 py-2 sm:py-2 rounded-lg text-sm sm:text-base text-white ${
                      modal.isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default UploadContent;