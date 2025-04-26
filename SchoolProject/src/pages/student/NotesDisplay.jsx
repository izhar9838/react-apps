import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaDownload, FaExclamationCircle } from 'react-icons/fa';
import { saveAs } from 'file-saver';

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, staggerChildren: 0.1 } },
};

const NotesDisplay = () => {
  const [notes, setNotes] = useState([]);
  const [classLevel, setClassLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MIME type mapping for simplified extensions to full MIME types
  const mimeTypeMap = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('authToken');
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9090/api/student/getNotes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);

        setNotes(response.data);
        // Set classLevel from the first note, if available
        if (response.data.length > 0) {
          setClassLevel(response.data[0].classLevel);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notes. Please try again later.');
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Check if user is logged in
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Handle download using file-saver
  const handleDownload = (note) => {
    let fileExtension = note.mimeType; // Use simplified MIME type as extension (e.g., "pdf")
    let fullMimeType = mimeTypeMap[note.mimeType.toLowerCase()] || 'application/octet-stream'; // Map to full MIME type

    // Extract base64 data (remove data URI prefix if present)
    let base64Data = note.notes;
    if (base64Data.startsWith('data:')) {
      base64Data = base64Data.split(',')[1];
    }

    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fullMimeType });

    // Use file-saver to trigger download
    saveAs(blob, `${note.title}.${fileExtension}`);
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen flex justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </motion.div>
      </motion.div>
    );
  }

  if (notes.length === 0) {
    return (
      <motion.div
        className="min-h-screen flex justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <FaExclamationCircle className="text-gray-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Notes Available</h2>
          <p className="text-gray-600">
            {classLevel ? `No notes found for ${classLevel}.` : 'No notes available for your class.'}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex justify-center bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
            {classLevel ? `Notes for ${classLevel}` : 'Your Notes'}
          </h1>
        </div>

        {/* Notes List */}
        <div className="p-6 sm:p-8">
          <motion.div
            className="space-y-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            {notes.map((note) => (
              <motion.div
                key={note.id}
                className="border border-gray-200 p-6 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3">
                  {note.description || 'No description available'}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-gray-500 text-sm">
                    File Type: {note.mimeType.toUpperCase()}
                  </p>
                  <button
                    onClick={() => handleDownload(note)}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotesDisplay;