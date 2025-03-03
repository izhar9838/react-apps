import React, { useState } from "react";
import "./LoginForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { store } from '../../store/store';
import Home from "../Home";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons

const LoginForm = () => {
    const location = useLocation();
    const { loginData } = location.state || {};
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.auth?.isAuthenticated);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const onSubmit = async (data) => {
        try {
            console.log(data);
            const response = await axios.post('http://localhost:9090/api/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const { token, user } = response.data;
            console.log(response.data);
            
            dispatch(loginSuccess({ token, user }));

            if (user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (user.role === 'teacher') {
                navigate('/');
            } else {
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.log("Login failed", error.response );
            
            
        }
    };

    if (!authStatus) {
        return (
            <div className="login-container">
                <div className="login-box">
                    <h2>Welcome Back</h2>
                    <p>Please log in to your account</p>
                    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                {...register('username', { required: 'Username is required' })}
                            />
                            {errors.username && <p>{errors.username.message}</p>}
                        </div>

                        <div className="form-group" style={{ position: 'relative' }}>
                            <label htmlFor="password">Password</label>
                            <input
                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                id="password"
                                {...register('password', { required: 'Password is required' })}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '65%', // Adjust based on your styling
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            {errors.password && <p>{errors.password.message}</p>}
                        </div>

                        <input
                            type="hidden"
                            name="role"
                            value={loginData?.role || ''}
                            {...register('role')}
                        />

                        <button type="submit" className="login-button">
                            Log In
                        </button>
                    </form>

                    <div className="signup-link">
                        Don't have an account? <a href="/signup">Sign Up</a>
                    </div>
                </div>
            </div>
        );
    } else {
        navigate('/');
        return <Home />;
    }
};

export default LoginForm;