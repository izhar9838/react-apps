import React from "react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, message, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all animate-fadeIn">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h2 className={`text-2xl font-semibold text-center ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {title}
        </h2>
        <p className="text-gray-600 text-center mt-2">{message}</p>
        <button
          onClick={onClose}
          className={`mt-6 w-full py-2 rounded-lg text-white font-medium ${
            isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isSuccess: PropTypes.bool.isRequired,
};

if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("modal-styles");
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "modal-styles";
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export default Modal;