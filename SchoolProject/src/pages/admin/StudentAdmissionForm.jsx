import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Modal from "../Modal";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cropper from "react-easy-crop";
import { checkImageSize, getCroppedImg, fileToBase64, validateEmail } from "./ImageUtil";
import { motion } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation";

const StudentAdmissionForm = () => {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Use the animation hook
  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation(location.pathname);

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
        username: "",
        password: "",
        role: "student",
      },
    },
    mode: "onChange",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:9090/api/admin/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const file = new File([croppedImage], "profile.jpg", { type: "image/jpeg" });
      const sizeValid = checkImageSize(file, handleImageError);
      if (!sizeValid) {
        throw new Error("Cropped image size exceeds limit");
      }
      setValue("image", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
      setCropModalOpen(false);
    } catch (error) {
      console.error("Crop error:", error);
      setModal({
        isOpen: true,
        title: "Crop Error",
        message: error.message || "Failed to crop the image. Please try again.",
        isSuccess: false,
      });
    }
  }, [imageToCrop, croppedAreaPixels, setValue]);

  const customHandleImageChange = (e, onChange, onImageError, setImagePreview) => {
    const file = e.target.files[0];
    if (file) {
      const sizeValid = checkImageSize(file, onImageError);
      if (sizeValid) {
        const imageUrl = URL.createObjectURL(file);
        setImageToCrop(imageUrl);
        setCropModalOpen(true);
        onChange(file); // Update form state
      }
    }
  };

  const onSubmit = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const feesDetailsArray = [{
          amount: parseInt(data.fees_details.amount, 10),
          fee_type: data.fees_details.fee_type.join(", "),
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
          contact_details: data.contact_details,
          academic_info: data.academic_info,
          fees_details: feesDetailsArray,
          userPass: data.userPass,
        };
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          "http://localhost:9090/api/admin/enrollStudent",
          studentData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setModal({
          isOpen: true,
          title: "Success!",
          message: response.data.message || "Student enrolled successfully!",
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
          message: error.response?.data?.message || "Something went wrong. Please try again later.",
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
        case 1:
          return [
            "admissionId",
            "firstName",
            "lastName",
            "DOB",
            "gender",
            "image",
            "contact_details.address",
            "contact_details.phoneNumber",
            "contact_details.email",
            "contact_details.guardianName",
            "contact_details.guardianNumber",
          ];
        case 2:
          return [
            "academic_info.rollNo",
            "academic_info.standard",
            "academic_info.section",
            "academic_info.academic_year",
            "fees_details.amount",
            "fees_details.fee_type",
            "fees_details.payment_mode",
            "userPass.username",
            "userPass.password",
          ];
        default:
          return [];
      }
    } else {
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
          return [
            "fees_details.amount",
            "fees_details.fee_type",
            "fees_details.payment_mode",
          ];
        case 5:
          return ["userPass.username", "userPass.password"];
        default:
          return [];
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
      const firstErrorField = fieldsToValidate.find((field) => {
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          return errors[parent]?.[child];
        }
        return errors[field];
      });
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField.split(".").join("-"));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const removeImage = () => {
    setValue("image", null, { shouldValidate: true });
    setImagePreview(null);
  };

  const handleImageError = (message) => {
    setModal({
      isOpen: true,
      title: "Image Size Error",
      message,
      isSuccess: false,
    });
  };

  return (
    <motion.div
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[calc(100vh-120px)] flex justify-center items-center p-2 sm:p-4"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="w-[85vw] bg-white rounded-lg shadow-md p-4 md:p-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h1
          className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4 md:mb-6"
          variants={fieldVariants}
        >
          Student Admission Form
        </motion.h1>
        <motion.p
          className="text-sm text-gray-600 text-center mb-4"
          variants={fieldVariants}
        >
          All fields marked with <span className="text-red-500">*</span> are required.
        </motion.p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div className="hidden md:block space-y-4" variants={containerVariants}>
            {step === 1 && (
              <motion.div className="grid md:grid-cols-2 gap-4" variants={containerVariants}>
                <PersonalDetails
                  control={control}
                  handleImageChange={customHandleImageChange}
                  imagePreview={imagePreview}
                  removeImage={removeImage}
                  onImageError={handleImageError}
                  setImagePreview={setImagePreview}
                  variants={fieldVariants}
                  errors={errors}
                />
                <Contact_Details control={control} variants={fieldVariants} errors={errors} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div className="grid md:grid-cols-2 gap-4" variants={containerVariants}>
                <motion.div className="space-y-4" variants={containerVariants}>
                  <Academic_Info control={control} classes={classes} variants={fieldVariants} errors={errors} />
                  <FeesDetails control={control} variants={fieldVariants} errors={errors} />
                </motion.div>
                <User_Password control={control} variants={fieldVariants} errors={errors} />
              </motion.div>
            )}
            <motion.div className="flex justify-between mt-4" variants={containerVariants}>
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 text-sm"
                  disabled={isSubmitting}
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
              )}
              <motion.button
                type="button"
                onClick={() => nextStep(true)}
                className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
                disabled={isSubmitting}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step === 2 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div className="md:hidden space-y-4" variants={containerVariants}>
            {step === 1 && (
              <PersonalDetails
                control={control}
                handleImageChange={customHandleImageChange}
                imagePreview={imagePreview}
                removeImage={removeImage}
                onImageError={handleImageError}
                setImagePreview={setImagePreview}
                variants={fieldVariants}
                errors={errors}
              />
            )}
            {step === 2 && <Contact_Details control={control} variants={fieldVariants} errors={errors} />}
            {step === 3 && <Academic_Info control={control} classes={classes} variants={fieldVariants} errors={errors} />}
            {step === 4 && <FeesDetails control={control} variants={fieldVariants} errors={errors} />}
            {step === 5 && <User_Password control={control} variants={fieldVariants} errors={errors} />}
            <motion.div className="flex justify-between mt-4" variants={containerVariants}>
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 text-xs"
                  disabled={isSubmitting}
                  variants={buttonVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
              )}
              <motion.button
                type="button"
                onClick={() => nextStep(false)}
                className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 text-xs"
                disabled={isSubmitting}
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step === 5 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
              </motion.button>
            </motion.div>
          </motion.div>

          {cropModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-lg p-4 w-[90vw] max-w-[500px]"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
              >
                <motion.h2 className="text-lg font-semibold mb-4" variants={fieldVariants}>
                  Crop Image
                </motion.h2>
                <motion.div className="relative w-full h-[300px]" variants={fieldVariants}>
                  <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </motion.div>
                <motion.div className="mt-4 flex justify-end space-x-2" variants={containerVariants}>
                  <motion.button
                    type="button"
                    onClick={() => setCropModalOpen(false)}
                    className="bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 text-sm"
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCropSave}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </form>

        {/* Animated Feedback Modal */}
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              isOpen={modal.isOpen}
              onClose={closeModal}
              title={modal.title}
              message={modal.message}
              isSuccess={modal.isSuccess}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Reusable Components
const PersonalDetails = ({ control, handleImageChange, imagePreview, removeImage, onImageError, setImagePreview, variants, errors }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Personal Details
      </motion.h2>
      <Field label="Admission ID" name="admissionId" control={control} type="text" required variants={variants} errors={errors} />
      <Field label="First Name" name="firstName" control={control} type="text" required variants={variants} errors={errors} />
      <Field label="Last Name" name="lastName" control={control} type="text" required variants={variants} errors={errors} />
      <Field label="Date of Birth" name="DOB" control={control} type="date" required variants={variants} errors={errors} />
      <SelectField
        label="Gender"
        name="gender"
        control={control}
        options={["Male", "Female", "Prefer not to say"]}
        required
        variants={variants}
        errors={errors}
      />
      <ImageField
        label="Photo"
        name="image"
        control={control}
        handleImageChange={(e, onChange) => handleImageChange(e, onChange, onImageError, setImagePreview)}
        imagePreview={imagePreview}
        required
        removeImage={removeImage}
        variants={variants}
        errors={errors}
      />
    </motion.div>
  );
};

const Contact_Details = ({ control, variants, errors }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Contact Details
      </motion.h2>
      <Field label="Address" name="contact_details.address" control={control} type="text" required variants={variants} errors={errors} />
      <Field label="Phone Number" name="contact_details.phoneNumber" control={control} type="text" required variants={variants} errors={errors} />
      <Field
        label="Email"
        name="contact_details.email"
        control={control}
        type="text"
        required
        validate={validateEmail}
        variants={variants}
        errors={errors}
      />
      <Field label="Guardian Name" name="contact_details.guardianName" control={control} type="text" required variants={variants} errors={errors} />
      <Field label="Guardian Number" name="contact_details.guardianNumber" control={control} type="text" required variants={variants} errors={errors} />
    </motion.div>
  );
};

const Academic_Info = ({ control, classes = [], variants, errors }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Academic Details
      </motion.h2>
      <Field label="Roll No" name="academic_info.rollNo" control={control} type="text" required variants={variants} errors={errors} />
      <SelectField
        label="Standard"
        name="academic_info.standard"
        control={control}
        options={classes.map((cls) => cls.name)}
        required
        variants={variants}
        errors={errors}
      />
      <Field label="Section" name="academic_info.section" control={control} type="text" required variants={variants} errors={errors} />
      <Field label="Academic Year" name="academic_info.academic_year" control={control} type="text" required variants={variants} errors={errors} />
    </motion.div>
  );
};

const FeesDetails = ({ control, variants, errors }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Fees Details
      </motion.h2>
      <Field label="Amount" name="fees_details.amount" control={control} type="text" required variants={variants} errors={errors} />
      <CheckboxGroup
        label="Fee Type"
        name="fees_details.fee_type"
        control={control}
        options={["Tuition Fee", "Examination Fee", "Other"]}
        required
        variants={variants}
        errors={errors}
      />
      <SelectField
        label="Payment Mode"
        name="fees_details.payment_mode"
        control={control}
        options={["Cash", "Bank Transfer", "UPI"]}
        required
        variants={variants}
        errors={errors}
      />
    </motion.div>
  );
};

const User_Password = ({ control, variants, errors }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Username Password
      </motion.h2>
      <Field label="Username" name="userPass.username" control={control} type="text" required autoComplete="off" variants={variants} errors={errors} />
      <PasswordField
        label="Password"
        name="userPass.password"
        control={control}
        required
        autoComplete="new-password"
        variants={variants}
        errors={errors}
      />
    </motion.div>
  );
};

// Reusable Field Components
const Field = ({ label, name, control, type, required, validate, autoComplete, variants, errors }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false, validate }}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name.replace(".", "-")}
          autoComplete={autoComplete || "off"}
          className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm ${
            errors[name.split(".")[0]]?.[name.split(".")[1]] ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}
    />
    {errors[name.split(".")[0]]?.[name.split(".")[1]] && (
      <p className="mt-1 text-xs md:text-sm text-red-500">{errors[name.split(".")[0]][name.split(".")[1]].message}</p>
    )}
  </motion.div>
);

const ImageField = ({ label, name, control, handleImageChange, imagePreview, required, removeImage, variants, errors }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field: { onChange, value, ...field } }) => (
        <div>
          <input
            {...field}
            type="file"
            id={name}
            accept="image/*"
            onChange={(e) => handleImageChange(e, onChange)}
            className="mt-1 block w-full p-2 text-sm md:text-sm border border-gray-300 rounded-lg shadow-sm transition-all file-input"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
              <motion.button
                type="button"
                onClick={removeImage}
                className="text-red-500 text-xs hover:underline mt-1"
                variants={buttonVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Remove
              </motion.button>
            </div>
          )}
        </div>
      )}
    />
    {errors[name] && (
      <p className="mt-1 text-xs md:text-sm text-red-500">{errors[name].message}</p>
    )}
  </motion.div>
);

const SelectField = ({ label, name, control, options, required, variants, errors }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <select
          {...field}
          id={name.replace(".", "-")}
          className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm ${
            errors[name.split(".")[0]]?.[name.split(".")[1]] ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    />
    {errors[name.split(".")[0]]?.[name.split(".")[1]] && (
      <p className="mt-1 text-xs md:text-sm text-red-500">{errors[name.split(".")[0]][name.split(".")[1]].message}</p>
    )}
  </motion.div>
);

const CheckboxGroup = ({ label, name, control, options, required, variants, errors }) => (
  <motion.div variants={variants}>
    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required` : false,
        validate: (value) => (required && value.length === 0 ? `${label} is required` : true),
      }}
      render={({ field }) => (
        <div className="space-y-1">
          {options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="checkbox"
                id={`${name.replace(".", "-")}_${option}`}
                value={option}
                checked={field.value.includes(option)}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    field.value.includes(value)
                      ? field.value.filter((v) => v !== value)
                      : [...field.value, value]
                  );
                }}
                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`${name.replace(".", "-")}_${option}`}
                className="text-xs md:text-sm text-gray-700"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    />
    {errors[name.split(".")[0]]?.[name.split(".")[1]] && (
      <p className="mt-1 text-xs md:text-sm text-red-500">{errors[name.split(".")[0]][name.split(".")[1]].message}</p>
    )}
  </motion.div>
);

const PasswordField = ({ control, label, name, required, autoComplete, variants, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <motion.div variants={variants}>
      <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              id={name.replace(".", "-")}
              autoComplete={autoComplete || "new-password"}
              className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm ${
                errors[name.split(".")[0]]?.[name.split(".")[1]] ? "border-red-500" : "border-gray-300"
              } pr-8`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500 h-4 w-4" />
              ) : (
                <FaEye className="text-gray-500 h-4 w-4" />
              )}
            </button>
          </div>
        )}
    />
    {errors[name.split(".")[0]]?.[name.split(".")[1]] && (
      <p className="mt-1 text-xs md:text-sm text-red-500">{errors[name.split(".")[0]][name.split(".")[1]].message}</p>
    )}
  </motion.div>
);
}
export default StudentAdmissionForm;