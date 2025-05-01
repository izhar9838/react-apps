import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Modal from "../Modal";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { getCroppedImg, fileToBase64, validateEmail, validateUsername } from "./ImageUtil";
import useUsernameCheck from './ImageUtil'
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
  const [cropCoordinates, setCropCoordinates] = useState(null);
  const [cropWidth, setCropWidth] = useState(150);
  const [cropHeight, setCropHeight] = useState(150);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  const location = useLocation();
  const { formRef, controls, sectionVariants, containerVariants, fieldVariants, buttonVariants } = usePageAnimation(location.pathname, step);

  const { control, handleSubmit, trigger, reset, formState: { errors }, setValue, watch } = useForm({
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

  const username = watch("userPass.username");
  const { usernameStatus } = useUsernameCheck(username, 500);

  useEffect(() => {
    fetchClasses();
  }, []);

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

  const onCropChange = useCallback((cropper) => {
    const coords = cropper.getCoordinates();
    setCropCoordinates(coords);
    setCropWidth(coords.width);
    setCropHeight(coords.height);
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

  const onSubmit = async (data) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        if (usernameStatus.exists) {
          setModal({
            isOpen: true,
            title: "Invalid Username",
            message: "This username already exists. Please choose a different username.",
            isSuccess: false,
          });
          return;
        }

        const feesDetailsArray = [{
          amount: parseInt(data.fees_details.amount, 10),
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
        animate="visible"
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <motion.div className="hidden md:block space-y-4" variants={containerVariants}>
            {step === 1 && (
              <motion.div className="flex justify-center gap-5 [&>*]:flex-1" variants={containerVariants}>
                <PersonalDetails
                  control={control}
                  handleImageChange={customHandleImageChange}
                  imagePreview={imagePreview}
                  removeImage={removeImage}
                  setImagePreview={setImagePreview}
                  variants={fieldVariants}
                  errors={errors}
                  fileInputRef={fileInputRef}
                />
                <Contact_Details control={control} variants={fieldVariants} errors={errors} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div className="flex justify-center gap-5 [&>*]:flex-1" variants={containerVariants}>
                <motion.div className="space-y-4" variants={containerVariants}>
                  <Academic_Info control={control} classes={classes} variants={fieldVariants} errors={errors} />
                  <FeesDetails control={control} variants={fieldVariants} errors={errors} />
                </motion.div>
                <User_Password
                  control={control}
                  watch={watch}
                  trigger={trigger}
                  variants={fieldVariants}
                  errors={errors}
                  usernameStatus={usernameStatus}
                />
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
                disabled={isSubmitting || usernameStatus.exists}
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
                setImagePreview={setImagePreview}
                variants={fieldVariants}
                errors={errors}
                fileInputRef={fileInputRef}
              />
            )}
            {step === 2 && <Contact_Details control={control} variants={fieldVariants} errors={errors} />}
            {step === 3 && <Academic_Info control={control} classes={classes} variants={fieldVariants} errors={errors} />}
            {step === 4 && <FeesDetails control={control} variants={fieldVariants} errors={errors} />}
            {step === 5 && (
              <User_Password
                control={control}
                watch={watch}
                trigger={trigger}
                variants={fieldVariants}
                errors={errors}
                usernameStatus={usernameStatus}
              />
            )}
            <motion.div className="flex justify-between gap-[80px] mt-4 p-2" variants={containerVariants}>
              {step > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 text-xs"
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
                disabled={isSubmitting || usernameStatus.exists}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
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
const PersonalDetails = ({ control, handleImageChange, imagePreview, removeImage, setImagePreview, variants, errors, fileInputRef }) => {
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
        handleImageChange={handleImageChange}
        imagePreview={imagePreview}
        required
        removeImage={removeImage}
        variants={variants}
        errors={errors}
        fileInputRef={fileInputRef}
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

const User_Password = ({ control, watch, trigger, variants, errors, usernameStatus }) => {
  const username = watch("userPass.username");

  return (
    <motion.div className="space-y-3" variants={variants}>
      <motion.h2 className="text-lg md:text-xl text-gray-700 font-medium" variants={variants}>
        Username Password
      </motion.h2>
      <motion.div variants={variants}>
        <label htmlFor="userPass.username" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          Username <span className="text-red-500">*</span>
        </label>
        <Controller
          name="userPass.username"
          control={control}
          rules={{
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            validate: validateUsername,
          }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="userPass-username"
              autoComplete="off"
              onChange={(e) => {
                field.onChange(e);
                trigger("userPass.username");
              }}
              className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm ${
                errors.userPass?.username ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        {errors.userPass?.username && (
          <p className="mt-1 text-xs md:text-sm text-red-500">{errors.userPass.username.message}</p>
        )}
        {!errors.userPass?.username && usernameStatus.isChecking && (
          <p className="mt-1 text-xs md:text-sm text-gray-500">Checking...</p>
        )}
        {!errors.userPass?.username && !usernameStatus.isChecking && usernameStatus.exists && (
          <p className="mt-1 text-xs md:text-sm text-red-500">{usernameStatus.message}</p>
        )}
        {!errors.userPass?.username && !usernameStatus.isChecking && !usernameStatus.exists && usernameStatus.message && (
          <p className="mt-1 text-xs md:text-sm text-green-500">{usernameStatus.message}</p>
        )}
      </motion.div>
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

// PasswordField (unchanged)
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
              } pr-8 md:pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 max-w-10 max-h-10 flex items-center pr-2 md:pr-3"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500 h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <FaEye className="text-gray-500 h-4 w-4 md:h-5 md:w-5" />
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
};

// Reusable Field Components (unchanged)
const Field = ({ label, name, control, type, required, validate, autoComplete, variants, errors }) => (
  <motion.div variants={variants}>
    <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required , validate }}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name.replace(".", "-")}
          autoComplete={autoComplete || "off"}
          className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm "border-gray-300"
          }`}
        />
      )}
    />
    {errors[name.split(".")[0]]?.[name.split(".")[1]] && (
      <p className="mt-1 text-xs md:text-sm text-red-500">{errors[name.split(".")[0]][name.split(".")[1]].message}</p>
    )}
  </motion.div>
);

const ImageField = ({ label, name, control, handleImageChange, imagePreview, required, removeImage, errors, fileInputRef, variants }) => {
  return (
    <motion.div variants={variants}>
      <label htmlFor={name} className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required  }}
        render={({ field: { onChange, value, ...field } }) => (
          <div>
            <input
              {...field}
              type="file"
              id={name}
              accept="image/*"
              onChange={(e) => handleImageChange(e, onChange)}
              className="mt-1 block w-full p-2 text-xs md:text-sm border border-gray-300 rounded-lg shadow-sm transition-all file-input"
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
          className={`w-full p-1.5 md:p-2 border rounded-md text-xs md:text-sm  "border-gray-300"
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

export default StudentAdmissionForm;