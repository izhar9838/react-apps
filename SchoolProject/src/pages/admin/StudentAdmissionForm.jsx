import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "../Modal";
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validateEmail = (value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value) || "Invalid email address";
};

const StudentAdmissionForm = () => {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const { control, handleSubmit, trigger, reset, formState: { errors }, setValue } = useForm({
    defaultValues: {
      admissionId: "",
      firstName: "",
      lastName: "",
      DOB: "",
      gender: "",
      image: null,
      contact_details: {
        address: "",
        phoneNumber: "",
        email: "",
        guardianName: "",
        guardianNumber: "",
      },
      academic_info: {
        rollNo: "",
        standard: "",
        section: "",
        academic_year: "",
      },
      fees_details: {
        amount: "",
        fee_type: [],
        payment_mode: "",
      },
      userPass: {
        username: "", // Explicitly empty
        password: "", // Explicitly empty
        role: "student",
      },
    },
    mode: "onChange",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get("http://localhost:9090/api/admin/classes", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const feesDetailsArray = [{
          amount: data.fees_details.amount,
          fee_type: data.fees_details.fee_type,
          payment_mode: data.fees_details.payment_mode,
        }];
        const imageBase64 = data.image ? await fileToBase64(data.image) : null;
        const studentData = {
          admissionId: data.admissionId,
          firstName: data.firstName,
          lastName: data.lastName,
          DOB: data.DOB,
          gender: data.gender,
          image: imageBase64,
          academic_info: data.academic_info,
          contact_details: data.contact_details,
          fees_details: feesDetailsArray,
          userPass: data.userPass,
        };
        const token = localStorage.getItem('authToken');
        const response = await axios.post("http://localhost:9090/api/admin/enrollStudent", studentData, {
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

  const getFieldsForStep = (step, isLargeScreen = false) => {
    if (isLargeScreen) {
      switch (step) {
        case 1: return ["admissionId", "firstName", "lastName", "DOB", "gender", "image", "contact_details.address", "contact_details.phoneNumber", "contact_details.email", "contact_details.guardianName", "contact_details.guardianNumber"];
        case 2: return ["academic_info.rollNo", "academic_info.standard", "academic_info.section", "academic_info.academic_year", "fees_details.amount", "fees_details.fee_type", "fees_details.payment_mode", "userPass.username", "userPass.password"];
        default: return [];
      }
    } else {
      switch (step) {
        case 1: return ["admissionId", "firstName", "lastName", "DOB", "gender", "image"];
        case 2: return ["contact_details.address", "contact_details.phoneNumber", "contact_details.email", "contact_details.guardianName", "contact_details.guardianNumber"];
        case 3: return ["academic_info.rollNo", "academic_info.standard", "academic_info.section", "academic_info.academic_year"];
        case 4: return ["fees_details.amount", "fees_details.fee_type", "fees_details.payment_mode"];
        case 5: return ["userPass.username", "userPass.password"];
        default: return [];
      }
    }
  };

  const nextStep = async (isLargeScreen = false) => {
    const fieldsToValidate = getFieldsForStep(step, isLargeScreen);
    const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (isStepValid) {
      const maxSteps = isLargeScreen ? 2 : 5;
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
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4 md:mb-6">Student Admission Form</h1>
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
                  <Academic_Info control={control} classes={classes} />
                  <FeesDetails control={control} />
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
            {step === 3 && <Academic_Info control={control} classes={classes} />}
            {step === 4 && <FeesDetails control={control} />}
            {step === 5 && <User_Password control={control} />}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 text-xs" disabled={isSubmitting}>
                  Previous
                </button>
              )}
              <button type="button" onClick={() => nextStep(false)} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 text-xs" disabled={isSubmitting}>
                {step === 5 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
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
      <Field label="Admission ID" name="admissionId" control={control} type="text" required />
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
      <Field label="Address" name="contact_details.address" control={control} type="text" required />
      <Field label="Phone Number" name="contact_details.phoneNumber" control={control} type="text" required />
      <Field label="Email" name="contact_details.email" control={control} type="text" required validate={validateEmail} />
      <Field label="Guardian Name" name="contact_details.guardianName" control={control} type="text" required />
      <Field label="Guardian Number" name="contact_details.guardianNumber" control={control} type="text" required />
    </div>
  );
};

const Academic_Info = ({ control, classes = [] }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg md:text-xl text-gray-700 font-medium">Academic Details</h2>
      <Field label="Roll No" name="academic_info.rollNo" control={control} type="text" required />
      <SelectField label="Standard" name="academic_info.standard" control={control} options={classes.map(cls => cls.name)} required />
      <Field label="Section" name="academic_info.section" control={control} type="text" required />
      <Field label="Academic Year" name="academic_info.academic_year" control={control} type="text" required />
    </div>
  );
};

const FeesDetails = ({ control }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg md:text-xl text-gray-700 font-medium">Fees Details</h2>
      <Field label="Amount" name="fees_details.amount" control={control} type="text" required />
      <CheckboxGroup label="Fee Type" name="fees_details.fee_type" control={control} options={["Tuition Fee", "Examination Fee", "Other"]} required />
      <SelectField label="Payment Mode" name="fees_details.payment_mode" control={control} options={["Cash", "Bank Transfer", "UPI"]} required />
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
      rules={{ required: required ? true : false, validate }}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name.replace('.', '-')}
          autoComplete={autoComplete || "off"} // Default to "off" if not specified
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
      rules={{ required: required ? true : false }}
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
      rules={{ required: required ? true : false }}
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

const CheckboxGroup = ({ label, name, control, options, required }) => (
  <div>
    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? true : false, validate: value => value.length > 0 || true }}
      render={({ field }) => (
        <div className="space-y-1">
          {options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="checkbox"
                id={`${name.replace('.', '-')}_${option}`}
                value={option}
                checked={field.value.includes(option)}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(field.value.includes(value) ? field.value.filter(v => v !== value) : [...field.value, value]);
                }}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor={`${name.replace('.', '-')}_${option}`} className="text-xs md:text-sm text-gray-700">{option}</label>
            </div>
          ))}
        </div>
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
        rules={{ required: required ? true : false }}
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              id={name.replace('.', '-')}
              autoComplete={autoComplete || "new-password"} // Prevent autofill
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

export default StudentAdmissionForm;