import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const CreateTimetable = ({ onTimetableAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      className: "Nursery",
      period: "",
      subject: "",
      teacher: "",
    },
  });

  const onSubmit = (data) => {
    const token = localStorage.getItem('authToken');
    axios
      .post("http://localhost:9090/api/admin/createTimeTable", data,{
        headers: { "Authorization": `Bearer ${token}` },
      })
      .then(() => {
        onTimetableAdded();
        reset({
          className: data.className, // Keep the selected class
          period: "",
          subject: "",
          teacher: "",
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)]">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Add Timetable Entry
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          All fields marked with <span className="text-red-500">*</span> are required
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              {...register("className", { required: true })}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.className ? "border-red-500" : ""
              }`}
            >
              {["Nursery", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"].map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("period", {
                required: true,
                pattern: {
                  value: /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/,
                  message: "Format should be HH:MM-HH:MM (e.g., 8:00-8:45)",
                },
              })}
              placeholder="e.g., 8:00-8:45"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.period ? "border-red-500" : ""
              }`}
            />
            {errors.period?.type === "pattern" && (
              <p className="mt-1 text-sm text-red-500">{errors.period.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("subject", { required: true })}
              placeholder="Enter subject"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.subject ? "border-red-500" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("teacher", { required: true })}
              placeholder="Enter teacher name"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.teacher ? "border-red-500" : ""
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTimetable; 