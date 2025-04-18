
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Modal from "../Modal";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { getCroppedImg, fileToBase64, validateEmail } from "./ImageUtil";
import { motion } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4">
          <h2>Error Rendering Component</h2>
          <p>{this.state.error?.message || "Something went wrong."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const TeacherEnroll = () => {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropCoordinates, setCropCoordinates] = useState(null);
  const [cropWidth, setCropWidth] = useState(150);
  const [cropHeight, setCropHeight] = useState(150);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation(location.pathname, step);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };
    handleScroll();
    window.addEventListener("load", handleScroll);
    return () => window.removeEventListener("load", handleScroll);
  }, []);

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

  const onCropChange = useCallback((cropper) => {
    const coords = cropper.getCoordinates();
    setCropCoordinates(coords);
    setCropWidth(coords.width);
    setCropHeight(coords.height);
    console.log("Crop coordinates:", coords);
  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      if (!imageToCrop || !cropCoordinates) {
        throw new Error("Invalid crop parameters");
      }
      const croppedImageBlob = await getCroppedImg(imageToCrop, {
        x: cropCoordinates.left,
        y: cropCoordinates.top,
        width: cropCoordinates.width,
        height: cropCoordinates.height,
      });
      const croppedImageFile = new File([croppedImageBlob], "profile.jpg", { type: "image/jpeg" });

      setValue("image", croppedImageFile, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(croppedImageFile));
      setCropModalOpen(false);
      setImageToCrop(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Crop error:", error);
      setModal({
        isOpen: true,
        title: "Crop Error",
        message: error.message || "Failed to crop the image. Please try again.",
        isSuccess: false,
      });
    }
  }, [imageToCrop, cropCoordinates, setValue]);

  const customHandleImageChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setModal({
          isOpen: true,
          title: "Invalid File",
          message: "Please select a valid image file (e.g., JPG, PNG).",
          isSuccess: false,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCropModalOpen(true);
        onChange(file);
      };
      reader.onerror = () => {
        console.error("FileReader error");
        setModal({
          isOpen: true,
          title: "Image Error",
          message: "Failed to read the image file. Please try again.",
          isSuccess: false,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getFieldsForStep = (step, isLargeScreen = false) => {
    if (isLargeScreen) {
      switch (step) {
        case 1:
          return [
            "firstName",
            "lastName",
            "DOB",
            "gender",
            "image",
            "teacher_contact.address",
            "teacher_contact.phoneNumber",
            "teacher_contact.email",
          ];
        case 2:
          return [
            "professional_Details.position",
            "professional_Details.status",
            "professional_Details.qualification",
            "professional_Details.specialization",
            "professional_Details.experience",
            "professional_Details.classTeacher",
            "userPass.username",
            "userPass.password",
          ];
        default:
          return [];
      }
    } else {
      switch (step) {
        case 1:
          return ["firstName", "lastName", "DOB", "gender", "image"];
        case 2:
          return ["teacher_contact.address", "teacher_contact.phoneNumber", "teacher_contact.email"];
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
      const maxSteps = isLargeScreen ? 2 : 4;
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

  const onSubmit = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        if (!data.image) {
          throw new Error("Please upload an image");
        }
        const imageBase64 = await fileToBase64(data.image);
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
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        const response = await axios.post(
          "http://localhost:9090/api/admin/enrollTeacher",
          teacherData,
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
          message: typeof response.data === "string" ? response.data : "Teacher enrolled successfully!",
          isSuccess: true,
        });
        reset();
        setStep(1);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Submission error:", error);
        setModal({
          isOpen: true,
          title: "Submission Failed",
          message: error.message || error.response?.data?.message || "Something went wrong. Please try again later.",
          isSuccess: false,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const removeImage = () => {
    setValue("image", null, { shouldValidate: true });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 50 || numValue > 1000) {
      setModal({
        isOpen: true,
        title: "Invalid Input",
        message: "Please enter a value between 50 and 1000 pixels.",
        isSuccess: false,
      });
      return;
    }
    if (dimension === "width") {
      setCropWidth(numValue);
    } else {
      setCropHeight(numValue);
    }
    if (cropperRef.current) {
      cropperRef.current.setCoordinates({
        width: dimension === "width" ? numValue : cropWidth,
        height: dimension === "height" ? numValue : cropHeight,
      });
    }
  };

  return (
    <motion.div
      className="bg-[linear-gradient(135deg,_#e0cff2,_#d7e2f5)] min-h-[70vh] flex justify-center items-center p-2 sm:p-4"
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.div
        ref={formRef}
        className="w-[85vw] bg-white rounded-lg shadow-md p-4 md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-xl md:text-2xl font-semibold text-gray-800 text-center mb-4 md:mb-6"
          variants={fieldVariants}
        >
          Staff Enrollment Form
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
                  errors={errors}
                  fileInputRef={fileInputRef}
                  variants={fieldVariants}
                />
                <Contact_Details control={control} errors={errors} variants={fieldVariants} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div className="grid md:grid-cols-2 gap-4" variants={containerVariants}>
                <motion.div className="space-y-4" variants={containerVariants}>
                  <Professional_Details control={control} errors={errors} variants={fieldVariants} />
                </motion.div>
                <User_Password control={control} errors={errors} variants={fieldVariants} />
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
                  whileHover="hover"
                  whileTap="tap"
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
                whileHover="hover"
                whileTap="tap"
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
                errors={errors}
                fileInputRef={fileInputRef}
                variants={fieldVariants}
              />
            )}
            {step === 2 && <Contact_Details control={control} errors={errors} variants={fieldVariants} />}
            {step === 3 && <Professional_Details control={control} errors={errors} variants={fieldVariants} />}
            {step === 4 && <User_Password control={control} errors={errors} variants={fieldVariants} />}
            <motion.div className="flex justify-between mt-4" variants={containerVariants}>
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 text-xs"
                  disabled={isSubmitting}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
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
                whileHover="hover"
                whileTap="tap"
              >
                {step === 4 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
              </motion.button>
            </motion.div>
          </motion.div>

          {cropModalOpen && imageToCrop && (
            <ErrorBoundary>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-4 w-[90vw] max-w-[500px] border-2 border-blue-500"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h2 className="text-lg font-semibold mb-4" variants={fieldVariants}>
                    Crop Image
                  </motion.h2>
                  <motion.div className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden" variants={fieldVariants}>
                    <Cropper
                      ref={cropperRef}
                      src={imageToCrop}
                      onChange={onCropChange}
                      stencilProps={{
                        movable: true,
                        resizable: true,
                        minWidth: 50,
                        minHeight: 50,
                        maxWidth: 1000,
                        maxHeight: 1000,
                        handlers: true,
                        lines: true,
                        overlayClassName: "bg-black bg-opacity-50",
                      }}
                      className="cropper"
                      style={{
                        containerStyle: {
                          width: "100%",
                          height: "100%",
                          background: "#333",
                        },
                        mediaStyle: {
                          objectFit: "contain",
                        },
                        stencilStyle: {
                          border: "2px dashed #3b82f6",
                          boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                          background: "rgba(59, 130, 246, 0.1)",
                        },
                      }}
                    />
                  </motion.div>
                  <motion.div className="mt-4 grid grid-cols-2 gap-4" variants={fieldVariants}>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={cropWidth}
                        onChange={(e) => handleDimensionChange("width", e.target.value)}
                        min="50"
                        max="1000"
                        className="w-full p-2 border rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Crop width"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={cropHeight}
                        onChange={(e) => handleDimensionChange("height", e.target.value)}
                        min="50"
                        max="1000"
                        className="w-full p-2 border rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Crop height"
                      />
                    </div>
                  </motion.div>
                  <motion.div className="mt-4" variants={fieldVariants}>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Zoom</label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => {
                        const newZoom = Number(e.target.value);
                        setZoom(newZoom);
                        if (cropperRef.current) {
                          cropperRef.current.setTransform({ scale: newZoom });
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoom - 0.1) / 2.9) * 100}%, #d1d5db ${((zoom - 0.1) / 2.9) * 100}%, #d1d5db 100%)` }}
                      aria-label="Adjust image zoom"
                    />
                  </motion.div>
                  <motion.div className="mt-4 flex justify-end space-x-2" variants={containerVariants}>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setCropModalOpen(false);
                        setImageToCrop(null);
                        setValue("image", null);
                        setImagePreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 text-sm"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleCropSave}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Save
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </ErrorBoundary>
          )}
        </form>

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
const PersonalDetails = ({ control, handleImageChange, imagePreview, removeImage, errors, fileInputRef, variants }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Personal Details
      </motion.h2>
      <Field label="First Name" name="firstName" control={control} type="text" required errors={errors} variants={variants} />
      <Field label="Last Name" name="lastName" control={control} type="text" required errors={errors} variants={variants} />
      <Field label="Date of Birth" name="DOB" control={control} type="date" required errors={errors} variants={variants} />
      <SelectField
        label="Gender"
        name="gender"
        control={control}
        options={["Male", "Female", "Prefer not to say"]}
        required
        errors={errors}
        variants={variants}
      />
      <ImageField
        label="Photo"
        name="image"
        control={control}
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        required
        removeImage={removeImage}
        errors={errors}
        fileInputRef={fileInputRef}
        variants={variants}
      />
    </motion.div>
  );
};

const Contact_Details = ({ control, errors, variants }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Contact Details
      </motion.h2>
      <Field label="Address" name="teacher_contact.address" control={control} type="text" required errors={errors} variants={variants} />
      <Field label="Phone Number" name="teacher_contact.phoneNumber" control={control} type="text" required errors={errors} variants={variants} />
      <Field
        label="Email"
        name="teacher_contact.email"
        control={control}
        type="text"
        required
        validate={validateEmail}
        errors={errors}
        variants={variants}
      />
    </motion.div>
  );
};

const Professional_Details = ({ control, errors, variants }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Professional Details
      </motion.h2>
      <Field label="Position" name="professional_Details.position" control={control} type="text" required errors={errors} variants={variants} />
      <Field label="Status" name="professional_Details.status" control={control} type="text" required errors={errors} variants={variants} />
      <Field
        label="Qualification"
        name="professional_Details.qualification"
        control={control}
        type="text"
        required
        errors={errors}
        variants={variants}
      />
      <Field
        label="Specialization"
        name="professional_Details.specialization"
        control={control}
        type="text"
        required
        errors={errors}
        variants={variants}
      />
      <Field label="Experience" name="professional_Details.experience" control={control} type="text" required errors={errors} variants={variants} />
      <Field label="Class Teacher" name="professional_Details.classTeacher" control={control} type="text" required errors={errors} variants={variants} />
    </motion.div>
  );
};

const User_Password = ({ control, errors, variants }) => {
  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Username Password
      </motion.h2>
      <Field label="Username" name="userPass.username" control={control} type="text" required autoComplete="off" errors={errors} variants={variants} />
      <PasswordField
        label="Password"
        name="userPass.password"
        control={control}
        required
        autoComplete="new-password"
        errors={errors}
        variants={variants}
      />
    </motion.div>
  );
};

const Field = ({ label, name, control, type, required, validate, autoComplete, errors, variants }) => {
  const getErrorMessage = () => {
    if (!errors) return null;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      return errors[parent]?.[child]?.message;
    }
    return errors[name]?.message;
  };

  return (
    <motion.div variants={variants}>
      <label htmlFor={name.replace(".", "-")} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : false,
          validate,
        }}
        render={({ field }) => (
          <div>
            <input
              {...field}
              type={type}
              id={name.replace(".", "-")}
              autoComplete={autoComplete || "off"}
              className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm ${
                getErrorMessage() ? "border-red-500" : "border-gray-300"
              }`}
            />
            {getErrorMessage() && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage()}</p>
            )}
          </div>
        )}
      />
    </motion.div>
  );
};

const ImageField = ({ label, name, control, handleImageChange, imagePreview, required, removeImage, errors, fileInputRef, variants }) => {
  return (
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
              ref={fileInputRef}
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                <motion.button
                  type="button"
                  onClick={removeImage}
                  className="text-red-500 text-xs hover:underline mt-1"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Remove
                </motion.button>
              </div>
            )}
          </div>
        )}
      />
    </motion.div>
  );
};

const SelectField = ({ label, name, control, options, required, errors, variants }) => {
  const getErrorMessage = () => {
    if (!errors) return null;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      return errors[parent]?.[child]?.message;
    }
    return errors[name]?.message;
  };

  return (
    <motion.div variants={variants}>
      <label htmlFor={name.replace(".", "-")} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <div>
            <select
              {...field}
              id={name.replace(".", "-")}
              className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm ${
                getErrorMessage() ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {getErrorMessage() && <p className="text-red-500 text-xs mt-1">{getErrorMessage()}</p>}
          </div>
        )}
      />
    </motion.div>
  );
};

const PasswordField = ({ label, name, control, required, autoComplete, errors, variants }) => {
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = () => {
    if (!errors) return null;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      return errors[parent]?.[child]?.message;
    }
    return errors[name]?.message;
  };

  return (
    <motion.div variants={variants}>
      <label htmlFor={name.replace(".", "-")} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
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
              className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm pr-8 ${
                getErrorMessage() ? "border-red-500" : "border-gray-300"
              }`}
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
            {getErrorMessage() && <p className="text-red-500 text-xs mt-1">{getErrorMessage()}</p>}
          </div>
        )}
      />
    </motion.div>
  );
};

export default TeacherEnroll;
