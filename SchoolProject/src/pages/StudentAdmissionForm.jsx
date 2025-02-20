import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

const validateEmail=(value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Invalid email address';
  }
  return true;
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1); // Track current step
  const { control, handleSubmit, trigger } = useForm(); // React Hook Form

  // Move to the next step
  const nextStep = async () => {
    const isStepValid = await trigger(); // Validate current step
    if (isStepValid) setStep((prevStep) => prevStep + 1);
  };

  // Move to the previous step
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    alert("Form submitted successfully!");
  };

  // Render the current step
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
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-medium text-center mb-6">Student Registration Form</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">{renderStep()}</div>
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Step 1: Personal Details
const PersonalDetails = ({ control }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
    <Controller
      name="admissionId"
      control={control}
      defaultValue=""
      rules={{
        required: "admission id is required",
        
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label htmlFor="admissionId" className="block  font-medium text-gray-700">
        Admission Id
        </label>
          <input
            id="admissionId"
            {...field}

            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="firstName"
            {...field}
            placeholder="firstName"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="lastName"
      control={control}
      defaultValue=""
      rules={{
        required: "lastName is required",
        
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="lastName"
            {...field}
            placeholder="lastName"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            id="dob"
            {...field}
            placeholder="DOB"
            type="date"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="gender"
      control={control}
      defaultValue=""
      rules={{ required: "gender is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
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
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
              value={field.value ? undefined : ''}
            />
            {!field.value && ( // Only show the upload button if no file is selected
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Upload 
              </label>
            )}
            {field.value && ( // Show the preview and remove button if a file is selected
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
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    
  </div>
);

// Step 2: Contact Detials
const Contact_Details = ({ control }) => (
  
  <div>
    <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
    <Controller
      name="contact_details.address"
      control={control}
      defaultValue=""
      rules={{ required: "Address is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Address"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="contact_details.phoneNumber"
      control={control}
      defaultValue=""
      rules={{ required: "phoneNumber is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
        Phone Number
          </label>
          <input
          id="phoneNumber"
            {...field}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="contact_details.email"
      control={control}
      defaultValue=""
      rules={{ required: "Email is required" ,
                validate:validateEmail
      }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
          <input
            {...field}
            placeholder="Guardian Name"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
          <input
            {...field}
            placeholder="Guardian Number"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

// Step 3: Academic Info
const Academic_Info = ({ control }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Study Details</h2>
    <Controller
      name="academic_info.rollNo"
      control={control}
      defaultValue=""
      rules={{ required: "Roll No is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Roll No"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
          <input
            {...field}
            placeholder="Standard"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
          <input
            {...field}
            placeholder="Section"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
          <input
            {...field}
            placeholder="Academic year"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

// Step 4: Fees Details
const FeesDetails = ({ control }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Fees Details</h2>
    <Controller
      name="fees_details.amount"
      control={control}
      defaultValue=""
      rules={{ required: "Amount is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Amount"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    
    <Controller
  name="fees_details.fee_type"
  control={control}
  defaultValue={[]}
  rules={{ required: "Fee Type is required" }}
  render={({ field, fieldState: { error } }) => (
    <div className="mb-4">
      {["Tution Fee", "Examination Fee", "Other"].map((option) => (
        <div key={option}>
          <label>
            <input
              type="checkbox"
              value={option}
              checked={field.value.includes(option)} // Check if option is in the array
              onChange={(e) => {
                const value = e.target.value;
                const newValue = field.value.includes(value)
                  ? field.value.filter((v) => v !== value) // Deselect option
                  : [...field.value, value]; // Select option
                field.onChange(newValue); // Pass the updated array of selected values
              }}
            />
            {option}
          </label>
        </div>
      ))}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )}
/>

    <Controller
      name="fees_details.payment_mode"
      control={control}
      defaultValue=""
      rules={{  }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <select
            {...field}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="Bank Trasnfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

export default MultiStepForm;