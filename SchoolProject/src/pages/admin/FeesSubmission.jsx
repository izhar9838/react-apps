import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation";
import Modal from "../Modal";
import "./FeesSubmission.css";
import axios from "axios";

const FeeSubmissionForm = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      studentId: "",
      amount: "",
      fee_type: [],
      payment_mode: "",
    },
  });

  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slipData, setSlipData] = useState(null);
  const printRef = useRef();

  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation();

  const onSubmit = async (data) => {
    const feesData = {
      amount: parseInt(data.amount, 10),
      fee_type: data.fee_type,
      payment_mode: data.payment_mode,
      studentId: data.studentId,
    };
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/feesSubmission`, feesData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSlipData({
        studentId: data.studentId,
        amount: data.amount,
        fee_type: data.fee_type,
        payment_mode: data.payment_mode,
        paymentId: response.data.paymentId || "N/A",
      });

      setModal({
        isOpen: true,
        title: "Success!",
        message: "Your Fees have been submitted successfully.",
        isSuccess: true,
      });
      reset();
    } catch (error) {
      setModal({
        isOpen: true,
        title: "Submission Failed",
        message: "Something went wrong. Please try again later.",
        isSuccess: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    setSlipData(null);
  };

  return (
    <motion.section
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] w-full min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="text-xl sm:text-2xl font-medium text-gray-800 mb-4 text-center"
          variants={fieldVariants}
        >
          Fee Submission
        </motion.h2>
        <motion.p
          className="text-sm text-gray-600 mb-4 text-center"
          variants={fieldVariants}
        >
          All fields marked with <span className="text-red-500">*</span> are required
        </motion.p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Student ID */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="studentId" className="block text-md font-medium text-gray-600">
              Student ID <span className="text-red-500">*</span>
            </label>
            <Controller
              name="studentId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  id="studentId"
                  {...field}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                    errors.studentId ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Student ID (e.g., STUD123)"
                />
              )}
            />
          </motion.div>

          {/* Amount */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="amount" className="block text-md font-medium text-gray-600">
              Amount <span className="text-red-500">*</span>
            </label>
            <Controller
              name="amount"
              control={control}
              rules={{ required: true, pattern: { value: /^\d+$/, message: "Enter a valid number" } }}
              render={({ field }) => (
                <input
                  id="amount"
                  {...field}
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter amount"
                />
              )}
            />
          </motion.div>

          {/* Fee Type */}
          <motion.div variants={fieldVariants}>
            <label className="block text-md font-medium text-gray-600">
              Fee Type <span className="text-red-500">*</span>
            </label>
            <Controller
              name="fee_type"
              control={control}
              defaultValue={[]}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-2">
                  {["Tuition Fee", "Examination Fee", "Other"].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={field.value.includes(option)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, option]
                            : field.value.filter((v) => v !== option);
                          field.onChange(newValue);
                        }}
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm sm:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </motion.div>

          {/* Payment Mode */}
          <motion.div variants={fieldVariants}>
            <label htmlFor="payment_mode" className="block text-md font-medium text-gray-600">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <Controller
              name="payment_mode"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <select
                  id="payment_mode"
                  {...field}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              )}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Printable Slip (Hidden on Screen) */}
      {slipData && (
        <motion.div
          ref={printRef}
          className="print-slip hidden print:block p-6 bg-white"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h3
            className="text-lg font-bold text-center mb-4"
            variants={fieldVariants}
          >
            Fee Submission Slip
          </motion.h3>
          <motion.div className="space-y-2" variants={containerVariants}>
            <p><strong>Student ID:</strong> {slipData.studentId}</p>
            <p><strong>Amount:</strong> ₹{slipData.amount}</p>
            <p><strong>Fee Type:</strong> {slipData.fee_type}</p>
            <p><strong>Payment Mode:</strong> {slipData.payment_mode}</p>
            <p><strong>Payment ID:</strong> {slipData.paymentId}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </motion.div>
        </motion.div>
      )}

      {/* Animated Modal */}
      {modal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title={modal.title}
            message={modal.message}
            isSuccess={modal.isSuccess}
          />
        </motion.div>
      )}
    </motion.section>
  );
};

export default FeeSubmissionForm;