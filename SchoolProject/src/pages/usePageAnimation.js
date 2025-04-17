import { useEffect, useRef, useState } from "react";
import { useInView, useAnimation } from "framer-motion";

export const usePageAnimation = (pathname) => {
  const [isPageVisible, setIsPageVisible] = useState(true); // Assume visible initially
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, margin: "-150px" }); // Trigger only once
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has run

  // Animation variants for the entire section (page-level)
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  // Animation variants for the container (e.g., form or grid)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Animation variants for headers (e.g., h1, h2)
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for individual cards or items
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for form fields
  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for buttons
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Handle visibility changes (e.g., tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      setIsPageVisible(visible);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Reset animation state on route change
  useEffect(() => {
    setHasAnimated(false); // Reset when pathname changes
    controls.start("hidden"); // Start in hidden state
  }, [pathname, controls]);

  // Trigger animations when the element is in view or initially visible
  useEffect(() => {
    if (isPageVisible && isFormInView && !hasAnimated) {
      controls.start("visible").then(() => {
        setHasAnimated(true); // Lock animation after completion
      }).catch((err) => console.error("Animation error:", err));
    } else if (isPageVisible && !hasAnimated && isFormInView) {
      // Handle initial load with element in view
      controls.start("visible").then(() => {
        setHasAnimated(true);
      }).catch((err) => console.error("Animation error:", err));
    }
  }, [isPageVisible, isFormInView, controls, hasAnimated]);

  // Debugging (remove in production)
  useEffect(() => {
    console.log("isFormInView:", isFormInView, "hasAnimated:", hasAnimated);
  }, [isFormInView, hasAnimated]);

  return {
    formRef,
    controls,
    sectionVariants,
    containerVariants,
    headerVariants,
    cardVariants,
    fieldVariants,
    buttonVariants,
  };
};