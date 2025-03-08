// UploadMarksEntry.jsx
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Validation schema for each student row
const studentResultSchema = yup.object().shape({
  studentId: yup.string().required(),
  marks: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .min(0, 'Marks cannot be negative')
    .max(100, 'Marks cannot exceed 100')
    .typeError('Marks must be a number'),
  grade: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});

// Validation schema for the entire form (array of student results)
const schema = yup.object().shape({
  results: yup.array().of(studentResultSchema),
});

const UploadMarksEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract selected values from location state
  const { className, subject, examination } = location.state || {};

  // State for students
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      results: [],
    },
  });

  // Use useFieldArray to manage the dynamic array of student results
  const { fields } = useFieldArray({
    control,
    name: 'results',
  });

  // Fetch students on component mount
  useEffect(() => {
    if (!className || !subject || !examination) {
      alert('Invalid selection. Please go back and select all required fields.');
      navigate('/teacher/upload-marks');
      return;
    }

    setLoading(true); // Start loading
    axios
      .get(`/api/teacher/students/class/${className}`)
      .then((response) => {
        console.log('Students Response:', response.data);
        const studentList = Array.isArray(response.data) ? response.data : [];
        setStudents(studentList);

        // Initialize form data with students
        reset({
          results: studentList.map((student) => ({
            studentId: student.id.toString(),
            marks: '',
            grade: '',
          })),
        });
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setStudents([]);
      })
      .finally(() => setLoading(false)); // Stop loading
  }, [className, reset, navigate]);

  // Handle form submission
  const onSubmit = (data) => {
    const payload = data.results.map((result) => ({
      student: { id: result.studentId },
      subject: { id: subject.id },
      examination: { id: examination.id },
      marks: result.marks !== null ? parseFloat(result.marks) : null,
      grade: result.grade || null,
    }));

    if (payload.length === 0) {
      alert('No students available to upload marks for.');
      return;
    }

    axios
      .post('/api/teacher/upload-marks/bulk', payload) // Bulk upload for all students
      .then(() => {
        alert(
          `Marks for ${subject.subject} (${examination.type}) uploaded successfully for all students in ${className}!`
        );
        navigate('/teacher/dashboard');
      })
      .catch((error) => {
        console.error('Error uploading marks:', error);
        alert('Failed to upload marks. Please try again.');
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[93vh]">Loading...</div>;
  }

  return (
    <div className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[93vh] font-sans">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center p-6 items-center">
          <h1 className="text-2xl font-medium text-gray-800">
            Upload Marks for {className} - {subject.subject} ({examination.type})
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Table of Students */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Student Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Marks (0-100)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.length > 0 ? (
                    fields.map((field, index) => {
                      const student = students[index];
                      return (
                        <tr key={field.id}>
                          <td className="border border-gray-300 px-4 py-2">
                            {student ? student.name : 'Unknown'}
                            <input
                              type="hidden"
                              {...register(`results.${index}.studentId`)}
                              value={field.studentId}
                            />
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <input
                              type="number"
                              {...register(`results.${index}.marks`)}
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {errors.results?.[index]?.marks && (
                              <p className="text-red-600 text-sm">
                                {errors.results[index].marks.message}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <input
                              type="text"
                              {...register(`results.${index}.grade`)}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {errors.results?.[index]?.grade && (
                              <p className="text-red-600 text-sm">
                                {errors.results[index].grade.message}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                        No students available for {className}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload Marks
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMarksEntry;