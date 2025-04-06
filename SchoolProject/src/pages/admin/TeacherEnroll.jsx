import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "../Modal";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validateEmail = (value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value) || "Invalid email address";
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",", 1));
    reader.onerror = (error) => reject(error);
  });
};

const TeacherEnroll = () => {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const { control, handleSubmit, trigger, reset, formState: { errors }, setValue } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      DOB: "",
      gender: "",
      image: null,
      teacher_contact: {
        address: "",
        phoneNumber: "",
        email: "",
      },
      professional_Details: {
        position: "",
        status: "",
        qualification: "",
        specialization: "",
        experience: "",
        classTeacher: "",
      },
      userPass: {
        username: "",
        password: "",
        role: "teacher",
      },
    },
    mode: "onChange",
  });

  const getFieldsForStep = (step, isLargeScreen = false) => {
    if (isLargeScreen) {
      switch (step) {
        case 1: return ["firstName", "lastName", "DOB", "gender", "image", "teacher_contact.address", "teacher_contact.phoneNumber", "teacher_contact.email"];
        case 2: return ["professional_Details.position", "professional_Details.status", "professional_Details.qualification", "professional_Details.specialization", "professional_Details.experience", "professional_Details.classTeacher", "userPass.username", "userPass.password"];
        default: return [];
      }
    } else {
      switch (step) {
        case 1: return ["firstName", "lastName", "DOB", "gender", "image"];
        case 2: return ["teacher_contact.address", "teacher_contact.phoneNumber", "teacher_contact.email"];
        case 3: return ["professional_Details.position", "professional_Details.status", "professional_Details.qualification", "professional_Details.specialization", "professional_Details.experience", "professional_Details.classTeacher"];
        case 4: return ["userPass.username", "userPass.password"];
        default: return [];
      }
    }
  };

  const nextStep = async (isLargeScreen = false) => {
    const fieldsToValidate = getFieldsForStep(step, isLargeScreen);
    const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (isStepValid) {
      const maxSteps = isLargeScreen ? 2 : 4;
      if (step < maxSteps) {
        setStep((prev) => prev + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    } else {
      const firstErrorField = fieldsToValidate.find(field => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return errors[parent]?.[child];
        }
        return errors[field];
      });
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField.split('.').join('-'));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const imageBase64 = data.image ? await fileToBase64(data.image) : null;
        const teacherData = {
          firstName: data.firstName,
          lastName: data.lastName,
          DOB: data.DOB,
          gender: data.gender,
          image: imageBase64,
          teacher_contact: data.teacher_contact,
          professional_Details: data.professional_Details,
          teacher_user_pass: data.userPass,
        };
        const token = localStorage.getItem('authToken');
        const response = await axios.post("http://localhost:9090/api/admin/enrollTeacher", teacherData, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        setModal({
          isOpen: true,
          title: "Success!",
          message: response.data,
          isSuccess: true,
        });
        reset();
        setStep(1);
        setImagePreview(null);
      } catch (error) {
        console.error("Submission error:", error);
        setModal({
          isOpen: true,
          title: "Submission Failed",
          message: "Something went wrong. Please try again later.",
          isSuccess: false,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setValue('image', null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-[70vh] flex justify-center items-center bg-gray-100 p-2 sm:p-4">
      <div className="w-[85vw] bg-white rounded-lg shadow-md p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4 md:mb-6">Staff Enrollment Form</h1>
        <p className="text-sm text-gray-600 text-center mb-4">All fields marked with <span className="text-red-500">*</span> are required.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="hidden md:block space-y-4">
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                <PersonalDetails control={control} handleImageChange={handleImageChange} imagePreview={imagePreview} removeImage={removeImage} />
                <Contact_Details control={control} />
              </div>
            )}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Professional_Details control={control} />
                </div>
                <User_Password control={control} />
              </div>
            )}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 text-sm" disabled={isSubmitting}>
                  Previous
                </button>
              )}
              <button type="button" onClick={() => nextStep(true)} className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm" disabled={isSubmitting}>
                {step === 2 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
              </button>
            </div>
          </div>

          <div className="md:hidden space-y-4">
            {step === 1 && <PersonalDetails control={control} handleImageChange={handleImageChange} imagePreview={imagePreview} removeImage={removeImage} />}
            {step === 2 && <Contact_Details control={control} />}
            {step === 3 && <Professional_Details control={control} />}
            {step === 4 && <User_Password control={control} />}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 text-xs" disabled={isSubmitting}>
                  Previous
                </button>
              )}
              <button type="button" onClick={() => nextStep(false)} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 text-xs" disabled={isSubmitting}>
                {step === 4 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
              </button>
            </div>
          </div>

          {modal.isOpen && <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} isSuccess={modal.isSuccess} />}
        </form>
      </div>
    </div>
  );
};

// Reusable Components
const PersonalDetails = ({ control, handleImageChange, imagePreview, removeImage }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg md:text-xl text-gray-700 font-medium">Personal Details</h2>
      <Field label="First Name" name="firstName" control={control} type="text" required />
      <Field label="Last Name" name="lastName" control={control} type="text" required />
      <Field label="Date of Birth" name="DOB" control={control} type="date" required />
      <SelectField label="Gender" name="gender" control={control} options={["Male", "Female", "Prefer not to say"]} required />
      <ImageField label="Photo" name="image" control={control} handleImageChange={handleImageChange} imagePreview={imagePreview} required removeImage={removeImage} />
    </div>
  );
};

const Contact_Details = ({ control }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg md:text-xl text-gray-700 font-medium">Contact Details</h2>
      <Field label="Address" name="teacher_contact.address" control={control} type="text" required />
      <Field label="Phone Number" name="teacher_contact.phoneNumber" control={control} type="text" required />
      <Field label="Email" name="teacher_contact.email" control={control} type="text" required validate={validateEmail} />
    </div>
  );
};

const Professional_Details = ({ control }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg md:text-xl text-gray-700 font-medium">Professional Details</h2>
      <Field label="Position" name="professional_Details.position" control={control} type="text" required />
      <Field label="Status" name="professional_Details.status" control={control} type="text" required />
      <Field label="Qualification" name="professional_Details.qualification" control={control} type="text" required />
      <Field label="Specialization" name="professional_Details.specialization" control={control} type="text" required />
      <Field label="Experience" name="professional_Details.experience" control={control} type="text" required />
      <Field label="Class Teacher" name="professional_Details.classTeacher" control={control} type="text" required />
    </div>
  );
};

const User_Password = ({ control }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg md:text-xl text-gray-700 font-medium">Username Password</h2>
      <Field label="Username" name="userPass.username" control={control} type="text" required autoComplete="off" />
      <PasswordField label="Password" name="userPass.password" control={control} required autoComplete="new-password" />
    </div>
  );
};

// Reusable Field Components
const Field = ({ label, name, control, type, required, validate, autoComplete }) => (
  <div>
    <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false, validate }}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name.replace('.', '-')}
          autoComplete={autoComplete || "off"}
          className="w-full p-1.5 md:p-2 border border-gray-300 rounded-md text-xs md:text-sm"
        />
      )}
    />
  </div>
);

const ImageField = ({ label, name, control, handleImageChange, imagePreview, required, removeImage }) => (
  <div>
    <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field: { onChange, value, ...field } }) => (
        <div>
          <input
            {...field}
            type="file"
            id={name}
            accept="image/*"
            onChange={(e) => handleImageChange(e, onChange)}
            className="w-full p-1.5 md:p-2 border border-gray-300 rounded-md text-xs md:text-sm"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
              <button
                type="button"
                onClick={removeImage}
                className="text-red-500 text-xs hover:underline mt-1"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    />
  </div>
);

const SelectField = ({ label, name, control, options, required }) => (
  <div>
    <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => (
        <select
          {...field}
          id={name.replace('.', '-')}
          className="w-full p-1.5 md:p-2 border border-gray-300 rounded-md text-xs md:text-sm"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}
    />
  </div>
);

const PasswordField = ({ label, name, control, required, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? "This field is required" : false }}
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              id={name.replace('.', '-')}
              autoComplete={autoComplete || "new-password"}
              className="w-full p-1.5 md:p-2 border border-gray-300 rounded-md text-xs md:text-sm pr-8"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              {showPassword ? <FaEyeSlash className="text-gray-500 h-4 w-4" /> : <FaEye className="text-gray-500 h-4 w-4" />}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default TeacherEnroll;