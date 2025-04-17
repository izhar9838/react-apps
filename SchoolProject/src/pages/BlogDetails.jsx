import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { usePageAnimation } from './usePageAnimation'; // Adjust the import path as needed
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the page animation hook
  const { formRef, controls, sectionVariants, headerVariants, containerVariants } =
    usePageAnimation(pathname);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || isNaN(id)) {
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:9090/api/public/blog/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError('Failed to fetch blog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  return (
    <motion.div
      className="blog-detail-container bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      {loading && (
        <div className="status-message">
          Loading...
        </div>
      )}
      {error && (
        <div className="status-message text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && !blog && (
        <div className="status-message">
          Blog not found.
        </div>
      )}
      {!loading && !error && blog && (
        <motion.div
          ref={formRef}
          className="blog-content bg-white max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {blog.image && (
            <motion.img
              src={`data:image/jpeg;base64,${blog.image}`}
              alt={blog.title}
              className="blog-image"
              variants={headerVariants} // Applying headerVariants for simplicity
            />
          )}
          <motion.h1
            className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800"
            variants={headerVariants}
          >
            {blog.title}
          </motion.h1>
          <motion.p
            className="text-gray-700 mb-4 text-sm font-semibold sm:text-base"
            variants={headerVariants}
          >
            By {blog.author}
          </motion.p>
          <motion.div
            className="text-gray-700 prose prose-sm sm:prose-base"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            variants={headerVariants}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default BlogDetail;