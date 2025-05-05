import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { usePageAnimation } from './usePageAnimation';
import './BlogDetail.css';

// Configure DOMPurify for server-side rendering
let purify = DOMPurify;
if (typeof window === 'undefined') {
  const { JSDOM } = require('jsdom');
  const { window } = new JSDOM('');
  purify = DOMPurify(window);
}

const BlogDetail = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { formRef, controls, sectionVariants, headerVariants, containerVariants, cardVariants } =
    usePageAnimation(pathname);

  const contentRef = useRef(null);

  const fetchBlog = async () => {
    if (!id || isNaN(id)) {
      setError('Invalid blog ID');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/public/blog/${id}`);
      setBlog({
        ...response.data,
        image: response.data.image
          ? `data:image/jpeg;base64,${response.data.image}`
          : 'https://via.placeholder.com/800x400?text=No+Image+Available',
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching blog details:', err);
      setError('Failed to fetch blog details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (blog || error || !loading) {
      controls.start('visible').catch((err) => console.error('Animation error:', err));
    }
  }, [blog, error, loading, controls]);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/800x400?text=No+Image+Available';
  };

  return (
    <motion.div
      className="min-h-[92vh] bg-gradient-to-br from-[#e0cff2] to-[#d7e2f5] py-6 px-4 sm:px-6 md:px-8"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="text-center py-8" role="status" aria-live="polite">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-gray-600"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {error && (
          <div
            className="text-center py-8 text-red-600 flex flex-col items-center gap-4"
            role="alert"
            aria-live="assertive"
          >
            <p>{error}</p>
            <button
              onClick={fetchBlog}
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              aria-label="Retry fetching blog details"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && !blog && (
          <div className="text-center py-8 text-gray-600" role="status" aria-live="polite">
            Blog not found.
          </div>
        )}
        {!loading && !error && blog && (
          <motion.div
            ref={contentRef || formRef}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-3xl mx-auto"
            variants={cardVariants}
            initial="hidden"
            animate={controls}
          >
            {blog.image && (
              <motion.img
                src={blog.image}
                alt={blog.title || 'Blog image'}
                className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg mb-4 sm:mb-6"
                onError={handleImageError}
                variants={headerVariants}
              />
            )}
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-800"
              variants={headerVariants}
            >
              {blog.title}
            </motion.h1>
            <motion.p
              className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base font-medium"
              variants={headerVariants}
            >
              By {blog.author || 'Unknown'} | {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
            </motion.p>
            <motion.div
              className="prose prose-sm sm:prose-base prose-gray max-w-none"
              dangerouslySetInnerHTML={{
                __html: blog.content ? purify.sanitize(blog.content) : '',
              }}
              variants={containerVariants}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogDetail;