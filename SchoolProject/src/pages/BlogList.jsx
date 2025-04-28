import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';
import { usePageAnimation } from './usePageAnimation'; // Adjust the import path as needed
import './BlogList.css'; // Optional: For custom styling

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Use the page animation hook
  const { formRef, controls, sectionVariants, headerVariants, containerVariants, cardVariants } =
    usePageAnimation(pathname);

  // Additional ref for the grid container to ensure animation trigger
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:9090/api/public/getBlogs'); // Added Axios request
        const validatedBlogs = response.data.map(blog => {
          let image = null;
          if (blog.image) {
            try {
              // Handle string input (e.g., /9j/4AAQSkZJRg...)
              if (typeof blog.image === 'string' && blog.image.startsWith('/9j/')) {
                image = `data:image/jpeg;base64,${btoa(atob(blog.image))}`;
              }
              // Handle byte array input (fallback)
              else if (Array.isArray(blog.image) && blog.image.length > 0) {
                const uint8Array = new Uint8Array(blog.image);
                const binary = String.fromCharCode(...uint8Array);
                image = `data:image/jpeg;base64,${btoa(binary)}`;
              }
            } catch (e) {
              console.error('Failed to convert image data for blog:', blog.title, e);
              image = 'https://via.placeholder.com/300x200?text=Image+Error';
            }
          }
          return { ...blog, image };
        });
        setBlogs(validatedBlogs);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Force animation on initial load or route change
  useEffect(() => {
    if (blogs.length > 0 || error || !loading) {
      controls.start('visible').catch((err) => console.error('Animation error:', err));
    }
  }, [blogs, error, loading, controls]);

  const handleCardClick = (blogId) => {
    navigate(`/blog-news/blog/${blogId}`);
  };

  const handleImageError = (e, title) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image+Available'; // Fallback image
  };

  return (
    <motion.div
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="container mx-auto py-6 px-2 sm:px-4 md:px-6 lg:px-8 min-h-[92vh] flex flex-col">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800"
          variants={headerVariants}
        >
          Blog Posts
        </motion.h2>
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <motion.div
              className="text-center py-6 sm:py-8 md:py-10"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <svg
                className="animate-spin h-6 w-6 mx-auto text-gray-600"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
              Loading...
            </motion.div>
          ) : error ? (
            <motion.div
              className="flex items-center justify-center py-6 sm:py-8 md:py-10"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
                <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                <p className="text-gray-600">{error}</p>
              </div>
            </motion.div>
          ) : blogs.length === 0 ? (
            <motion.div
              className="flex items-center justify-center py-6 sm:py-8 md:py-10"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
                <FaExclamationCircle className="text-gray-500 text-4xl mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No Blog Posts Found</h2>
                <p className="text-gray-600">No blog posts are available at the moment.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              ref={gridRef || formRef} // Use gridRef, fallback to formRef
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate={controls}
            >
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden"
                  variants={cardVariants}
                  onClick={() => handleCardClick(blog.id)}
                >
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-32 sm:h-36 md:h-40 lg:h-48 object-cover rounded-t-lg"
                      onError={(e) => handleImageError(e, blog.title)}
                    />
                  )}
                  <div className="p-2 sm:p-3 md:p-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 text-gray-800 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-1 sm:mb-2">
                      By {blog.author}
                    </p>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base line-clamp-3">
                      {blog.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogList;