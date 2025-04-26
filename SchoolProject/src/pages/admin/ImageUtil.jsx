import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

// Function to check if an image file is within the size limit (2MB)
export const checkImageSize = (file, errorCallback) => {
  const maxSizeInMB = 2;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // 2MB in bytes
  if (file && file.size > maxSizeInBytes) {
    errorCallback(`Image size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`);
    return false;
  }
  return true;
};

// Function to handle image file selection (not used in CreateHallOfFame, but kept for completeness)
export const handleImageChange = (event, onChange, onError, onPreview) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const sizeValid = checkImageSize(file, onError);
  if (!sizeValid) {
    event.target.value = null; // Clear the input
    return;
  }

  // Update form value with the file
  onChange(file);

  // Generate preview URL and call the preview callback
  if (onPreview) {
    const previewUrl = URL.createObjectURL(file);
    onPreview(previewUrl);
  }
};

// Function to get cropped image
export const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.8 // Quality
    );
  });
};

// Function to validate email (not used in CreateHallOfFame, but kept)
export const validateEmail = (value) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value) || "Invalid email address";
};

// Function to convert file to Base64 (return full data URL)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract only the base64 string, removing the data URL prefix
      const base64String = reader.result.split(',')[1];
      resolve(base64String); // Return only the base64 part (e.g., /9j/...)
    };
    reader.onerror = (error) => reject(error);
  });
};
const useUsernameCheck = (username,debounceMs = 500) => {
  const [usernameStatus, setUsernameStatus] = useState({
    exists: false,
    message: "",
    isChecking: false,
  });

  const checkUsername = useCallback(
    debounce(async (usernameToCheck) => {
      if (usernameToCheck.trim() === "") {
        setUsernameStatus({ exists: false, message: "", isChecking: false });
        return;
      }

      try {
        setUsernameStatus((prev) => ({ ...prev, isChecking: true }));
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          "http://localhost:9090/api/admin/check-username",
          { username: usernameToCheck },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsernameStatus({
          exists: response.data.exists,
          message: response.data.message,
          isChecking: false,
        });
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus({
          exists: false,
          message: "Error checking username availability",
          isChecking: false,
        });
      }
    }, debounceMs ),
    [debounceMs]
  );

  useEffect(() => {
    checkUsername(username);
    return () => checkUsername.cancel();
  }, [username, checkUsername]);

  return { usernameStatus, setUsernameStatus };
};

export default useUsernameCheck;