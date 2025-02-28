import React, { useState,useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "./Modal";

const validateEmail = (value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return "Invalid email address";
  }
  return true;
};

const TeacherEnroll = () => {
  
  const getInitialStep = () => {
    const savedStep = localStorage.getItem("currentStep");
    return savedStep ? parseInt(savedStep, 10) : 1;
  };
  const [step, setStep] = useState(getInitialStep);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for loading state
    
  
  const { control, handleSubmit, trigger, reset, clearErrors, getValues, formState } = useForm({
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
      professional_Details:{
        postion:"",
        status:"",
        qualification:"",
        specialization:"",
        experience:"",
        classTeacher:""
      },
      userPass: {
        username: "",
        password: "",
        role: "teacher",
      },
    },
    mode: "onSubmit",
    // reValidateMode: "onChange", // Validate only on blur
  });
  useEffect(() => {
    localStorage.setItem("currentStep", step);
    localStorage.setItem("formData", JSON.stringify(getValues()));
    if (step === 4) {
      clearErrors();
    }
  }, [step,getValues, clearErrors]);
  
  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true,shouldValidate:true });
    if (isStepValid) {
      if (step === 4) { // Only reset Step 4 fields when moving to Step 4
        clearErrors(["userPass.username", "userPass.password"]);
      // Optional: Add a small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100)); // Reset state and clear errors
      }
      setStep((prevStep) => prevStep + 1)
      const allFields = Object.keys(getValues());
      const fieldsToClear = allFields.filter((field) => !fieldsToValidate.includes(field));
      clearErrors(fieldsToClear);
    }
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
    clearErrors(); // Clear all errors when going back to prevent lingering errors
  };

  const onSubmit = async (data) => {
    if (step === 4) {
      const isValid = await trigger(); // Validate all fields on final submit
      if (isValid) {
        setIsSubmitting(true); // Show loading state
        try {
          // Simulate an API call
         
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.2 ? resolve() : reject(new Error("Submission failed"));
            }, 1000);
          });

          setModal({
            isOpen: true,
            title: "Success!",
            message: "Your form has been submitted successfully.",
            isSuccess: true,
          });
          reset();
          setStep(1);
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
      
        
      
      }
    } else {
      console.log("Form Data Submitted:", data);
      alert("Form submitted successfully!");
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return [ "firstName", "lastName", "DOB", "gender", "image"];
      case 2:
        return [
          "teacher_contact.address",
          "teacher_contact.phoneNumber",
          "teacher_contact.email",
        ];
      case 3:
        return [
          "professional_Details.position",
          "professional_Details.status",
          "professional_Details.qualification",
          "professional_Details.specialization",
          "professional_Details.experience",
          "professional_Details.classTeacher",
        ];
      case 4:
        return ["userPass.username", "userPass.password"]; // Exclude role since it’s hidden and not required
      default:
        return [];
    }
  };
  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalDetails control={control} />;
      case 2:
        return <Contact_Details control={control} />;
      case 3:
        return <Professional_Details control={control} />;
      case 4:
        return <User_Password control={control} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col font-roboto justify-center items-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] p-10">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="lg:text-3xl font-roboto text-2xl font-medium text-gray-800 text-center mb-6">
          Staff Enroll Form
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">{renderStep()}</div>
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={isSubmitting}
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
            )}
          </div>
        </form>
      </div>
       <Modal
              isOpen={modal.isOpen}
              onClose={closeModal}
              title={modal.title}
              message={modal.message}
              isSuccess={modal.isSuccess}
            />
    </div>
  );
};

// Step 1: Personal Details (unchanged, but ensure defaultValues match)
const PersonalDetails = ({ control }) => (
  <div>
    <h2 className="lg:text-2xl text-xl text-gray-700 font-medium mb-4">Personal Details</h2>
    
    <Controller
      name="firstName"
      control={control}
      defaultValue=""
      rules={{ required: "Name is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm lg:text-lg font-medium text-gray-600"
          >
            First Name
          </label>
          <input
            id="firstName"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="lastName"
      control={control}
      defaultValue=""
      rules={{
        required: "Last Name is required",
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm lg:text-lg font-medium text-gray-600"
          >
            Last Name
          </label>
          <input
            id="lastName"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="DOB"
      control={control}
      defaultValue=""
      rules={{ required: "DOB is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="dob"
            className="block text-sm lg:text-lg font-medium text-gray-600"
          >
            Date of Birth
          </label>
          <input
            id="dob"
            {...field}
            type="date"
            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="gender"
      control={control}
      defaultValue=""
      rules={{ required: "Gender is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm  lg:text-lg font-medium text-gray-600"
          >
            Select Gender
          </label>
          <select
            id="gender"
            {...field}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="image"
      control={control}
      defaultValue={null}
      rules={{ required: "Photo is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <div className="relative">
            <input
              {...field}
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                field.onChange(file);
              }}
              value={field.value ? undefined : ""}
            />
            {!field.value && (
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Upload Photo
              </label>
            )}
            {field.value && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(field.value)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => field.onChange(null)}
                  className="mt-2 text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-3">{error.message}</p>
          )}
        </div>
      )}
    />
  </div>
);

// Step 2: Contact Details (unchanged, ensure defaultValues match)
const Contact_Details = ({ control }) => (
  <div>
    <h2 className="lg:text-2xl text-xl text-gray-700 font-medium mb-4">Contact Details</h2>
    <Controller
      name="contact_details.address"
      control={control}
      defaultValue=""
      rules={{ required: "Address is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm  lg:text-lg font-medium text-gray-600"
          >
            Address
          </label>
          <input
            id="address"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="contact_details.phoneNumber"
      control={control}
      defaultValue=""
      rules={{ required: "Phone Number is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm  lg:text-lg font-medium text-gray-600"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="contact_details.email"
      control={control}
      defaultValue=""
      rules={{
        required: "Email is required",
        validate: validateEmail,
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm lg:text-lg font-medium text-gray-600"
          >
            Email
          </label>
          <input
            id="email"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    
    
  </div>
);

// Step 3: Academic Info (unchanged, ensure defaultValues match)
const Professional_Details = ({ control }) => (
  <div>
    <h2 className="lg:text-2xl text-xl text-gray-700 font-medium mb-4">Professional Detials</h2>
    <Controller
      name="professional_Details.position"
      control={control}
      defaultValue=""
      rules={{ required: "Positon is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Position
          </label>
          <input
            id="position"
            {...field}
            placeholder="eg: Head Master, Teacher, Principle etc"
            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="professional_Details.status"
      control={control}
      defaultValue=""
      rules={{ required: "Status is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Status
          </label>
          <input
            id="status"
            placeholder="eg: Part Time, Full Time"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="professional_Details.qualification"
      control={control}
      defaultValue=""
      rules={{ required: "Qualification is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="qualification"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Qualification
          </label>
          <input
            id="qualification"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="professional_Details.specialization"
      control={control}
      defaultValue=""
      rules={{ required: "Specialization is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Specialization
          </label>
          <input
            id="specialization"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  </div>
);




// Step 4: User Password (unchanged, ensure defaultValues match)
const User_Password = ({ control }) => (
  <div>
    <h2 className="lg:text-2xl text-xl text-gray-700 font-medium mb-4">Username Password</h2>
    <Controller
      name="userPass.username"
      control={control}
      defaultValue=""
      rules={{ required: "Username is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Username
          </label>
          <input
            id="username"
            {...field}
            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="userPass.password"
      control={control}
      defaultValue=""
      rules={{ required: "Password is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Password
          </label>
          <input
            id="password"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    
  </div>
);

export default TeacherEnroll;