import { useEffect, useRef, useState } from "react";
import { useInView, useAnimation } from "framer-motion";

export const usePageAnimation = (pathname,step) => {
  const [isPageVisible, setIsPageVisible] = useState(true);
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, margin: "-150px" });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

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

  useEffect(() => {
    setHasAnimated(false);
    controls.start("hidden");
  }, [pathname,step, controls]);

  useEffect(() => {
    if (isPageVisible && isFormInView && !hasAnimated) {
      controls.start("visible").then(() => {
        setHasAnimated(true);
      }).catch((err) => console.error("Animation error:", err));
    } else if (isPageVisible && !hasAnimated && isFormInView) {
      controls.start("visible").then(() => {
        setHasAnimated(true);
      }).catch((err) => console.error("Animation error:", err));
    }
  }, [isPageVisible, isFormInView, controls, hasAnimated,step]);

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