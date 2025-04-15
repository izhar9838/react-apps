import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || isNaN(id)) {
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:9090/api/public/blog/${id}`);
        // console.log('Blog details fetched successfully:', response.data);
        setBlog(response.data);
      } catch (err) {
        setError('Failed to fetch blog details. Please try again later.');
        // console.error('Error fetching blog:', err.response?.status, err.response?.data, err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  return (
    <div className="blog-detail-container bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
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
        <div className="blog-content bg-white max-w-3xl mx-auto">
          {blog.image && (
            <img
              src={`data:image/jpeg;base64,${blog.image}`}
              alt={blog.title}
              className="blog-image"
            />
          )}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">{blog.title}</h1>
          <p className="text-gray-700 mb-4 text-sm font-semibold sm:text-base">By {blog.author}</p>
          <div
            className="text-gray-700 prose prose-sm sm:prose-base"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      )}
    </div>
  );
};

export default BlogDetail;