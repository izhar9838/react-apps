import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

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
        return <Address control={control} />;
      case 3:
        return <StudyDetails control={control} />;
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
      name="name"
      control={control}
      defaultValue=""
      rules={{ required: "Name is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="email"
      control={control}
      defaultValue=""
      rules={{
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
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
      name="phone"
      control={control}
      defaultValue=""
      rules={{ required: "Phone is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

// Step 2: Address
const Address = ({ control }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Address</h2>
    <Controller
      name="address.street"
      control={control}
      defaultValue=""
      rules={{ required: "Street is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Street"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="address.city"
      control={control}
      defaultValue=""
      rules={{ required: "City is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="City"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="address.state"
      control={control}
      defaultValue=""
      rules={{ required: "State is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="State"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="address.zip"
      control={control}
      defaultValue=""
      rules={{ required: "Zip Code is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Zip Code"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

// Step 3: Study Details
const StudyDetails = ({ control }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Study Details</h2>
    <Controller
      name="study.course"
      control={control}
      defaultValue=""
      rules={{ required: "Course is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Course"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="study.year"
      control={control}
      defaultValue=""
      rules={{ required: "Year is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Year"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
    <Controller
      name="study.institution"
      control={control}
      defaultValue=""
      rules={{ required: "Institution is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <input
            {...field}
            placeholder="Institution"
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
      name="fees.amount"
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
      name="fees.paymentMethod"
      control={control}
      defaultValue=""
      rules={{ required: "Payment Method is required" }}
      render={({ field, fieldState: { error } }) => (
        <div className="mb-4">
          <select
            {...field}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  </div>
);

export default MultiStepForm;