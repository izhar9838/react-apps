import React, { useState,useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "../Modal";
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const validateEmail = (value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return "Invalid email address";
  }
  return true;
};

const MultiStepForm = () => {
  
 
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for loading state
  const [classes, setClasses] = useState([]);
  const { control, handleSubmit, trigger, reset, clearErrors, getValues, formState } = useForm({
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
        username: "",
        password: "",
        role: "student",
      },
    },
    mode: "onSubmit",
    // reValidateMode: "onChange", // Validate only on blur
  });
  useEffect(() => {
    fetchClasses()
    if (step === 5) {
      clearErrors();
    }
  }, [step, clearErrors]);
  const fetchClasses = async () => {
    const token=localStorage.getItem('authToken');
    try {
      const response = await axios.get("http://localhost:9090/api/admin/classes",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true,shouldValidate:true });
    if (isStepValid) {
      if (step === 4) { // Only reset Step 5 fields when moving to Step 5
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
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
        reader.onerror = (error) => reject(error);
    });
};
  const onSubmit = async (data) => {
    if (step === 5 && !isSubmitting) { // Add !isSubmitting check
      const isValid = await trigger();
      if (isValid) {
        setIsSubmitting(true);
        try {
          const feesDetailsArray = [{
            amount: data.fees_details.amount,
            fee_type: data.fees_details.fee_type,
            payment_mode: data.fees_details.payment_mode,
          }];
          
          const imageBase64 = data.image ? await fileToBase64(data.image) : null;

        // Construct the Student object
        const studentData = {
            admissionId: data.admissionId,
            firstName: data.firstName,
            lastName: data.lastName,
            DOB: data.DOB, // Assuming DOB is a Date object
            gender: data.gender,
            image: imageBase64, // Base64 string
            academic_info: data.academic_info,
            contact_details: data.contact_details,
            fees_details: feesDetailsArray,
            userPass: data.userPass
        };
          console.log("Submitting data:", studentData); // Log to verify single submission
          const token = localStorage.getItem('authToken');
          console.log(token);
          
          const response = await axios.post(
            "http://localhost:9090/api/admin/enrollStudent",
            studentData,
            {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          
          setModal({
            isOpen: true,
            title: "Success!",
            message: response.data,
            isSuccess: true,
          });
          reset();
          setStep(1);
          localStorage.removeItem("formData"); // Clear form data after success
          localStorage.setItem("currentStep", "1");
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
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ["admissionId", "firstName", "lastName", "DOB", "gender", "image"];
      case 2:
        return [
          "contact_details.address",
          "contact_details.phoneNumber",
          "contact_details.email",
          "contact_details.guardianName",
          "contact_details.guardianNumber",
        ];
      case 3:
        return [
          "academic_info.rollNo",
          "academic_info.standard",
          "academic_info.section",
          "academic_info.academic_year",
        ];
      case 4:
        return ["fees_details.amount", "fees_details.fee_type", "fees_details.payment_mode"];
      case 5:
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
        return <Academic_Info control={control} />;
      case 4:
        return <FeesDetails control={control} />;
      case 5:
        return <User_Password control={control} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="lg:text-3xl text-2xl font-medium text-gray-800 text-center mb-6">
          Student Registration Form
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
            {step < 5 ? (
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
      name="admissionId"
      control={control}
      defaultValue=""
      rules={{
        required: "Admission ID is required",
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="admissionId"
            className="block text-sm lg:text-lg font-medium text-gray-600"
          >
            Admission Id
          </label>
          <input
            id="admissionId"
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
            htmlFor="DOB"
            className="block text-sm lg:text-lg font-medium text-gray-600"
          >
            Date of Birth
          </label>
          <input
            id="DOB"
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
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
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
    <Controller
      name="contact_details.guardianName"
      control={control}
      defaultValue=""
      rules={{ required: "Guardian Name is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="guardianName"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Guardian Name
          </label>
          <input
            id="guardianName"
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
      name="contact_details.guardianNumber"
      control={control}
      defaultValue=""
      rules={{ required: "Guardian Number is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label

            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Guardian Number
          </label>
          <input
            id="guardianNumber"
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
const Academic_Info = ({ control }) => (
  <div>
    <h2 className="lg:text-2xl text-xl text-gray-700 font-medium mb-4">Study Details</h2>
    <Controller
      name="academic_info.rollNo"
      control={control}
      defaultValue=""
      rules={{ required: "Roll No is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="rollNo"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Roll No
          </label>
          <input
            id="rollNo"
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
      name="academic_info.standard"
      control={control}
      defaultValue=""
      rules={{ required: "Standard is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="standard"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Standard
          </label>
          <select {...field} className="w-full p-2 border rounded">
            <option value="">Select Standard</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
    <Controller
      name="academic_info.section"
      control={control}
      defaultValue=""
      rules={{ required: "Section is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="section"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Section
          </label>
          <input
            id="section"
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
      name="academic_info.academic_year"
      control={control}
      defaultValue=""
      rules={{ required: "Academic year is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="academic_year"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Academic Year
          </label>
          <input
            id="academic_year"
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

// Step 4: Fees Details (unchanged, ensure defaultValues match)
const FeesDetails = ({ control }) => (
  <div>
    <h2 className="lg:text-2xl text-xl text-gray-700 font-medium mb-4">Fees Details</h2>
    <Controller
      name="fees_details.amount"
      control={control}
      defaultValue=""
      rules={{ required: "Amount is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Amount
          </label>
          <input
            id="amount"
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
  name="fees_details.fee_type"
  control={control}
  defaultValue={[]} // Array to store multiple selected values
  rules={{ required: "Fee Type is required" }}
  render={({ field, fieldState: { error } }) => (
    <div className="mb-4">
      <label
        htmlFor="fee_type"
        className="block text-sm font-medium text-gray-600 lg:text-lg mb-2"
      >
        Fee Type
      </label>
      <div className="space-y-2">
        {["Tuition Fee", "Examination Fee", "Other"].map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={`fee_type_${option.toLowerCase().replace(" ", "_")}`} // Unique ID for each checkbox
              value={option}
              checked={field.value.includes(option)}
              onChange={(e) => {
                const value = e.target.value;
                const newValue = field.value.includes(value)
                  ? field.value.filter((v) => v !== value) // Remove if already selected
                  : [...field.value, value]; // Add if not selected
                field.onChange(newValue);
              }}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`fee_type_${option.toLowerCase().replace(" ", "_")}`}
              className="text-sm text-gray-700"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  )}
/>
    <Controller
      name="fees_details.payment_mode"
      control={control}
      defaultValue=""
      rules={{}}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label
            htmlFor="payment_mode"
            className="block text-sm font-medium text-gray-600 lg:text-lg"
          >
            Payment Mode
          </label>
          <select
            id="payment_mode"
            {...field}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
          </select>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  </div>
);

// Step 5: User Password (unchanged, ensure defaultValues match)
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
  render={({ field, fieldState: { error } }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-600 lg:text-lg"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            {...field}
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded pr-10" // Added pr-10 for padding-right to accommodate the icon
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-500" />
            ) : (
              <FaEye className="text-gray-500" />
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}
      </div>
    );
  }}
/>
    
  </div>
);

export default MultiStepForm;