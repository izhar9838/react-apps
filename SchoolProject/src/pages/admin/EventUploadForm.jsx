import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { usePageAnimation } from '../usePageAnimation';
import './EventUploadForm.css';

const EventUploadForm = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);

  const { control, handleSubmit, reset, watch, formState: { errors }, trigger } = useForm({
    defaultValues: {
      name: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: null,
      status: 'Upcoming',
      organizer: '',
      category: '',
      registration: false,
      maxAttendees: '',
    },
    mode: "onChange",
  });

  const registration = watch('registration');

  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation(location.pathname);

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');

    const formData = new FormData();
    for (const key in data) {
      if (key === 'image' && data[key]) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:9090/api/events', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Event uploaded successfully!');
      reset();
      setImagePreview(null);
      setStep(1);
    } catch (err) {
      setError('Failed to upload event. Please try again.');
      console.error('Error uploading event:', err);
    }
  };

  const nextStep = async () => {
    const step1Fields = ['name', 'date', 'time', 'location', 'description'];
    const step2Fields = ['image', 'status', 'organizer', 'category', ...(registration ? ['maxAttendees'] : [])];

    if (step === 1) {
      const isValid = await trigger(step1Fields);
      if (isValid) setStep((prev) => prev + 1);
    } else if (step === 2) {
      const isValid = await trigger(step2Fields);
      if (isValid) handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <motion.div
      className="min-h-screen bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] flex items-center justify-center p-4 sm:p-6"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all hover:shadow-3xl"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="text-2xl md:text-2xl font-extrabold md:font-extrabold text-gray-900 mb-6 text-center tracking-tight"
          variants={fieldVariants}
        >
          Create a New Event
        </motion.h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Large Screen: Single Form */}
          <motion.div
            className="hidden md:grid md:grid-cols-2 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Left Column */}
            <motion.div className="space-y-4" variants={containerVariants}>
              <Field label="Event Name" name="name" control={control} type="text" placeholder="e.g., Annual Sports Day" required errors={errors} variants={fieldVariants} />
              <Field label="Date" name="date" control={control} type="date" required errors={errors} variants={fieldVariants} />
              <Field label="Time" name="time" control={control} type="text" placeholder="e.g., 10:00 AM - 1:00 PM" required errors={errors} variants={fieldVariants} />
              <Field label="Location" name="location" control={control} type="text" placeholder="e.g., School Ground" required errors={errors} variants={fieldVariants} />
              <Field label="Description" name="description" control={control} type="textarea" placeholder="Describe the event..." required errors={errors} variants={fieldVariants} />
            </motion.div>
            {/* Right Column */}
            <motion.div className="space-y-4" variants={containerVariants}>
              <ImageField label="Event Image" name="image" control={control} handleImageChange={handleImageChange} imagePreview={imagePreview} required errors={errors} variants={fieldVariants} />
              <SelectField label="Status" name="status" control={control} options={['Upcoming', 'Ongoing', 'Completed']} required errors={errors} variants={fieldVariants} />
              <Field label="Organizer" name="organizer" control={control} type="text" placeholder="e.g., Sports Committee" required errors={errors} variants={fieldVariants} />
              <SelectField label="Category" name="category" control={control} options={['Sports', 'Cultural', 'Academic']} required errors={errors} variants={fieldVariants} />
              <CheckboxField label="Registration Required" name="registration" control={control} variants={fieldVariants} />
              {registration && (
                <Field label="Max Attendees" name="maxAttendees" control={control} type="number" placeholder="e.g., 200" required errors={errors} variants={fieldVariants} />
              )}
            </motion.div>
          </motion.div>

          {/* Small Screen: Two-Step Form */}
          <motion.div className="md:hidden space-y-6" variants={containerVariants} initial="hidden" animate={controls}>
            {step === 1 && (
              <motion.div className="space-y-4" variants={containerVariants}>
                <Field label="Event Name" name="name" control={control} type="text" placeholder="e.g., Annual Sports Day" required errors={errors} variants={fieldVariants} />
                <Field label="Date" name="date" control={control} type="date" required errors={errors} variants={fieldVariants} />
                <Field label="Time" name="time" control={control} type="text" placeholder="e.g., 10:00 AM - 1:00 PM" required errors={errors} variants={fieldVariants} />
                <Field label="Location" name="location" control={control} type="text" placeholder="e.g., School Ground" required errors={errors} variants={fieldVariants} />
                <Field label="Description" name="description" control={control} type="textarea" placeholder="Describe the event..." required errors={errors} variants={fieldVariants} />
                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm font-medium mt-4"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Next
                </motion.button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div className="space-y-4" variants={containerVariants}>
                <ImageField label="Event Image" name="image" control={control} handleImageChange={handleImageChange} imagePreview={imagePreview} required errors={errors} variants={fieldVariants} />
                <SelectField label="Status" name="status" control={control} options={['Upcoming', 'Ongoing', 'Completed']} required errors={errors} variants={fieldVariants} />
                <Field label="Organizer" name="organizer" control={control} type="text" placeholder="e.g., Sports Committee" required errors={errors} variants={fieldVariants} />
                <SelectField label="Category" name="category" control={control} options={['Sports', 'Cultural', 'Academic']} required errors={errors} variants={fieldVariants} />
                <CheckboxField label="Registration Required" name="registration" control={control} variants={fieldVariants} />
                {registration && (
                  <Field label="Max Attendees" name="maxAttendees" control={control} type="number" placeholder="e.g., 200" required errors={errors} variants={fieldVariants} />
                )}
                <motion.div className="flex space-x-4" variants={containerVariants}>
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 text-sm font-medium mt-4"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm font-medium mt-4"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Submit
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Submit Button and Feedback for Large Screens */}
          <motion.div
            className="hidden md:block md:col-span-2 mt-6"
            variants={fieldVariants}
          >
            <motion.button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm font-semibold shadow-md transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Upload Event
            </motion.button>
            {error && (
              <motion.p
                className="text-red-500 text-sm mt-2 text-center"
                variants={fieldVariants}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-500 text-sm mt-2 text-center"
                variants={fieldVariants}
              >
                {success}
              </motion.p>
            )}
          </motion.div>

          {/* Feedback for Small Screens */}
          <motion.div
            className="md:hidden mt-6"
            variants={fieldVariants}
          >
            {error && (
              <motion.p
                className="text-red-500 text-xs mt-2 text-center"
                variants={fieldVariants}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-500 text-xs mt-2 text-center"
                variants={fieldVariants}
              >
                {success}
              </motion.p>
            )}
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Reusable Field Components
const Field = ({ label, name, control, type, placeholder, required, errors, variants }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-sm md:text-sm md:font-semibold text-gray-700 font-normal">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={required ? { required: `${label} is required` } : {}}
      render={({ field }) => (
        <>
          {type === 'textarea' ? (
            <textarea
              {...field}
              id={name}
              rows="3"
              className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
              placeholder={placeholder}
            />
          ) : (
            <input
              {...field}
              type={type}
              id={name}
              className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
              placeholder={placeholder}
            />
          )}
          {errors[name] && <p className="text-red-500 text-xs md:text-xs mt-1">{errors[name].message}</p>}
        </>
      )}
    />
  </motion.div>
);

const ImageField = ({ label, name, control, handleImageChange, imagePreview, required, errors, variants }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-sm md:text-sm md:font-semibold text-gray-700 font-normal">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={required ? { required: `${label} is required` } : {}}
      render={({ field: { onChange, value, ...field } }) => (
        <div className="relative">
          <input
            {...field}
            type="file"
            id={name}
            accept="image/*"
            onChange={(e) => handleImageChange(e, onChange)}
            className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg shadow-sm transition-all file-input"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-md" />
          )}
          {errors[name] && <p className="text-red-500 text-xs md:text-xs mt-1">{errors[name].message}</p>}
        </div>
      )}
    />
  </motion.div>
);

const SelectField = ({ label, name, control, options, required, errors, variants }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-sm md:text-sm md:font-semibold text-gray-700 font-normal">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={required ? { required: `${label} is required` } : {}}
      render={({ field }) => (
        <>
          <select
            {...field}
            id={name}
            className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option || 'Select Category'}
              </option>
            ))}
          </select>
          {errors[name] && <p className="text-red-500 text-xs md:text-xs mt-1">{errors[name].message}</p>}
        </>
      )}
    />
  </motion.div>
);

const CheckboxField = ({ label, name, control, variants }) => (
  <motion.div className="flex items-center" variants={variants}>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type="checkbox"
          id={name}
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      )}
    />
    <label htmlFor={name} className="ml-2 text-sm md:text-sm md:font-semibold text-gray-700 font-normal">
      {label}
    </label>
  </motion.div>
);

export default EventUploadForm;