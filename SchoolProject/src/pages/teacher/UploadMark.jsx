import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Validation schema for selections
const schema = yup.object().shape({
  className: yup.string().required('Class is required'),
  sectionId: yup.string().required('Section is required'),
  subjectId: yup.string().required('Subject is required'),
  examinationId: yup.string().required('Examination is required'),
});

const UploadMarksSelection = () => {
  const navigate = useNavigate();

  // State for dropdown options
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      className: '',
      sectionId: '',
      subjectId: '',
      examinationId: '',
    },
  });

  // Watch fields
  const className = watch('className');
  const sectionId = watch('sectionId');

  // Fetch classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(false);
    setError(null);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:9090/api/teacher/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(Array.isArray(response.data) ? response.data : []);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError(error)
      setClasses([]);
    }
    finally{
      setLoading(false);
    }
  };
  // Fetch sections when class changes (specifically for 10th A)
  useEffect(() => {
    if (className === '10th A') {
      const fetchSections = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get(`/api/teacher/sections/class/${className}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Sections response:', response.data); // Debug log
          const sectionList = Array.isArray(response.data) ? response.data : [];
          setSections(sectionList);
        } catch (error) {
          console.error('Error fetching sections:', error);
          setError('Failed to fetch sections. Please try again.');
          setSections([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSections();
    } else {
      setSections([]);
      setSubjects([]);
    }
  }, [className]);

  // Fetch subjects when section changes
  useEffect(() => {
    if (sectionId) {
      const fetchSubjects = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get(
            `/api/teacher/subjects/class/${className}/section/${sectionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log('Subjects response:', response.data); // Debug log
          const subjectList = Array.isArray(response.data) ? response.data : [];
          setSubjects(subjectList);
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setError('Failed to fetch subjects. Please try again.');
          setSubjects([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSubjects();
    }
  }, [sectionId, className]);
  
  // Handle form submission
  const onSubmit = (data) => {
    const selectedSection = sections.find((s) => s.id === data.sectionId);
    const selectedSubject = subjects.find((s) => s.id === data.subjectId);
    const selectedExamination = examinations.find((e) => e.id === data.examinationId);

    if (!selectedSection || !selectedSubject || !selectedExamination) {
      alert('Invalid selection. Please try again.');
      return;
    }

    navigate('/teacher/upload-marks/entry', {
      state: {
        className: data.className,
        section: selectedSection,
        subject: selectedSubject,
        examination: selectedExamination,
      },
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[93vh]">Loading...</div>;
  }

  return (
    <div className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[93vh] font-sans">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center p-6 items-center">
          <h1 className="text-2xl font-medium text-gray-800">Select Details to Upload Marks</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select
                {...register('className')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Select a class</option>
                {Array.isArray(classes) && classes.length > 0 ? (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No classes available</option>
                )}
              </select>
              {errors.className && (
                <p className="text-red-600 text-sm">{errors.className.message}</p>
              )}
            </div>

            {/* Section Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <select
                {...register('sectionId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={className !== '10th A'}
              >
                <option value="">Select a section</option>
                {Array.isArray(sections) && sections.length > 0 ? (
                  sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No sections available</option>
                )}
              </select>
              {errors.sectionId && (
                <p className="text-red-600 text-sm">{errors.sectionId.message}</p>
              )}
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                {...register('subjectId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={!sectionId}
              >
                <option value="">Select a subject</option>
                {Array.isArray(subjects) && subjects.length > 0 ? (
                  subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subject}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No subjects available</option>
                )}
              </select>
              {errors.subjectId && (
                <p className="text-red-600 text-sm">{errors.subjectId.message}</p>
              )}
            </div>

            {/* Examination Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Examination</label>
              <select
                {...register('examinationId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={!sectionId}
              >
                <option value="">Select an exam</option>
                {Array.isArray(examinations) && examinations.length > 0 ? (
                  examinations.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.type}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No exams available</option>
                )}
              </select>
              {errors.examinationId && (
                <p className="text-red-600 text-sm">{errors.examinationId.message}</p>
              )}
            </div>

            {/* Proceed Button */}
            <div>
              <button
                type="submit"
                className="w-full p-[12px] bg-[#6a11cb] text-[#fff] border-[none] rounded-[8px] text-[16px] cursor-pointer [transition:background_0.3s_ease]"
                disabled={!sectionId}
              >
                Proceed to Enter Marks
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMarksSelection;