import React, { useState, useEffect } from "react";
import "./LoginForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import Home from "../Home";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { usePageAnimation } from "../usePageAnimation";

const LoginForm = () => {
  const location = useLocation();
  const { loginData } = location.state || {};
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector(state => state.auth?.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Use the provided animation hook
  const { formRef, controls, sectionVariants, containerVariants, cardVariants } =
    usePageAnimation(location.pathname);

  // Workaround for tab-switching visibility issue
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          controls.start("visible");
        }, 100);
      }
    };
    const handleFocus = () => {
      controls.start("visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [controls]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:9090/api/public/login', data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const { token, user } = response.data;
      dispatch(loginSuccess({ token, user }));

      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'teacher') {
        navigate('/', { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Invalid username or password");
      } else if (error.request) {
        setErrorMessage("Network error: Could not reach the server");
      } else {
        setErrorMessage(error.message || "An unexpected error occurred");
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  if (!authStatus) {
    return (
      <motion.div
        className="login-container"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          <motion.div
            key="login-box"
            ref={formRef}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            className="login-box"
          >
            <motion.h2 variants={cardVariants}>Welcome Back</motion.h2>
            {!errorMessage && <motion.p variants={cardVariants}>Please log in to your account</motion.p>}
            {errorMessage && (
              <h1 variants={cardVariants} className="text-red-500">{errorMessage}</h1>
            )}
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="form-group" variants={cardVariants}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  {...register('username', { required: 'Username is required' })}
                />
                {errors.username && <p>{errors.username.message}</p>}
              </motion.div>

              <motion.div className="form-group" variants={cardVariants} style={{ position: 'relative' }}>
                <label htmlFor="password">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register('password', { required: 'Password is required' })}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '65%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && <p>{errors.password.message}</p>}
              </motion.div>

              <input
                type="hidden"
                name="role"
                value={loginData?.role || ''}
                {...register('role')}
              />

              <motion.button
                type="submit"
                className="login-button"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
              >
                Log In
              </motion.button>

              <motion.p
                className="mt-3 text-center text-sm text-gray-600"
                variants={cardVariants}
              >
                <a
                  href="/forgot-password"
                  onClick={handleForgotPassword}
                  className="text-blue-600 hover:underline hover:text-blue-800"
                >
                  Forgot Password?
                </a>
              </motion.p>
            </form>

            <motion.div className="signup-link" variants={cardVariants}>
              Don't have an account? <a href="/signup">Sign Up</a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  } else {
    navigate('/');
    return <Home />;
  }
};

export default LoginForm;