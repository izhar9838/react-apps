import React from 'react';
import { motion } from 'framer-motion';
import { usePageAnimation } from './usePageAnimation'; // Adjust the import path as needed

function ErrorPage({ error }) {
  // Use a static pathname for the error page
  const pathname = '/error';

  // Use the page animation hook
  const { formRef, controls, sectionVariants, headerVariants, containerVariants, cardVariants } =
    usePageAnimation(pathname);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="p-6 bg-white rounded-lg shadow-lg text-center"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h1
          className="text-4xl font-bold text-red-600"
          variants={headerVariants}
        >
          {error?.status === 404 ? "404 - Page Not Found" : "Oops! An Error Occurred"}
        </motion.h1>
        <motion.p
          className="mt-2 text-gray-600"
          variants={cardVariants}
        >
          {error?.statusText || "Something went wrong. Please try again later."}
        </motion.p>
        <motion.button
          onClick={() => (window.location.href = '/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          variants={cardVariants}
        >
          Go Home
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default ErrorPage;