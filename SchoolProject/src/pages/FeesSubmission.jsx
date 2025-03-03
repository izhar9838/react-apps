import React, { useState ,useRef} from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "./Modal";
import "./FeesSubmission.css"; // Optional external CSS if needed
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
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for loading state
  const [slipData, setSlipData] = useState(null); // Store slip data for printing
  const printRef = useRef(); // Reference to the printable area

  const onSubmit = async (data) => {
    const feesData = {
      amount: parseInt(data.amount, 10),
      fee_type: data.fee_type.join(", "),
      payment_mode: data.payment_mode,
      student: { studentId: data.studentId }, // Fixed typo: "sutdentIdId" -> "studentId"
    };
    setIsSubmitting(true); // Show loading state
    try {
      // Simulate an API call
      const token = localStorage.getItem('authToken');
     
      const response= await axios.post("http://localhost:9090/api/admin/feesSubmission",feesData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      console.log(JSON.stringify(response.data));
      
      setModal({
        isOpen: true,
        title: "Success!",
        message: "Your Fees has been submitted successfully.",
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
      setIsSubmitting(false); // Hide loading state
    }
  };
  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <section className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] w-full min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4 text-center">Fee Submission</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Student ID */}
          <div>
            <label htmlFor="studentId" className="block text-md font-medium text-gray-600">
              Student ID 
            </label>
            <Controller
              name="studentId"
              control={control}
              rules={{ required: "Student ID is required" }}
              render={({ field }) => (
                <input
                  id="studentId"
                  {...field}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter Student ID (e.g., STUD123)"
                />
              )}
            />
            {errors.studentId && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.studentId.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-md font-medium text-gray-600">
              Amount
            </label>
            <Controller
              name="amount"
              control={control}
              rules={{ required: "Amount is required", pattern: { value: /^\d+$/, message: "Enter a valid number" } }}
              render={({ field }) => (
                <input
                  id="amount"
                  {...field}
                  type="number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter amount"
                />
              )}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Fee Type */}
          <div>
            <label className="block text-md font-medium text-gray-600">Fee Type</label>
            <Controller
              name="fee_type"
              control={control}
              defaultValue={[]}
              rules={{ required: "Fee Type is required" }}
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
            {errors.fee_type && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fee_type.message}</p>
            )}
          </div>

          {/* Payment Mode */}
          <div>
            <label htmlFor="payment_mode" className="block text-md font-medium text-gray-600">
              Payment Mode
            </label>
            <Controller
              name="payment_mode"
              control={control}
              rules={{ required: "Payment mode is required" }}
              render={({ field }) => (
                <select
                  id="payment_mode"
                  {...field}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              )}
            />
            {errors.payment_mode && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.payment_mode.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-1/4  py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
          >
            {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
          </button>
        </form> 
      </div>
      {/* Printable Slip (Hidden on Screen) */}
      {slipData && (
        <div ref={printRef} className="print-slip hidden print:block p-6 bg-white">
          <h3 className="text-lg font-bold text-center mb-4">Fee Submission Slip</h3>
          <div className="space-y-2">
            <p><strong>Student ID:</strong> {slipData.studentId}</p>
            <p><strong>Amount:</strong> ₹{slipData.amount}</p>
            <p><strong>Fee Type:</strong> {slipData.fee_type}</p>
            <p><strong>Payment Mode:</strong> {slipData.payment_mode}</p>
            <p><strong>Payment ID:</strong> {slipData.paymentId}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}
      <Modal
                    isOpen={modal.isOpen}
                    onClose={closeModal}
                    title={modal.title}
                    message={modal.message}
                    isSuccess={modal.isSuccess}
                  />
    </section>
  );
};

export default FeeSubmissionForm;