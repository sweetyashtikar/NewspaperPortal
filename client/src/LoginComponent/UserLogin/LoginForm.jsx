import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/GlobalcssLogin.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { MdAlternateEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Password visibility toggle state
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        formData
      );
      setSuccess(response.data.msg);
      localStorage.setItem("token", response.data.token);
      console.log("Logged in user:", response.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  // Handle Google Sign-In Success
  const handleGoogleSuccess = async (response) => {


    if (!response.credential) {
      console.error("Google credential missing");
      return;
    }


    try {
      const res = await fetch('http://localhost:5000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await res.json();



      // Extract user ID from token
      const tokenParts = data.token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.userId; // Change _id to userId

      const userWithId = {
        ...data.user,
        _id: userId,
      };

      // Create auth data object
      const authData = { user: userWithId, token: data.token };
      console.log("auth", authData)

      // Update local storage first
      localStorage.setItem('auth', JSON.stringify(authData));

      // Then update state
      alert("succesful")
    } catch (error) {
      console.error('Google login error:', error);

    } finally {
    }
  };

  // Initialize Google Sign-In - Only once on component mount
  useEffect(() => {
    // Load Google API Script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    let googleInitialized = false;

    script.onload = () => {
      if (window.google && !googleInitialized) {
        googleInitialized = true;
        window.google.accounts.id.initialize({
          client_id: '588239284344-1u9ukf7uq5bgugl4s898i3ap366m4cqb.apps.googleusercontent.com',
          callback: handleGoogleSuccess,
        });

        const googleButton = document.getElementById("GoogleSignIn");
        if (googleButton) {
          window.google.accounts.id.renderButton(googleButton, {
            // Leave this empty or customize minimal attributes
            shape: "rectangular",
          });
        }
      }
    };

    return () => {
      // Clean up script on component unmount
      const loadedScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (loadedScript) {
        document.body.removeChild(loadedScript);
      }
      // Cancel any Google sign-in processes
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []); // Empty dependency array to run only once

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Welcome back</h2>

        {/* <button className="social-btn google-btn" id='GoogleSignIn'>
          <FcGoogle className="mr-2 text-xl" />
          Sign in with Google
        </button> */}

        <button id='GoogleSignIn' onClick={handleGoogleSuccess}>
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google"
          />

          Sign in with Google
        </button>

        <button className="social-btn facebook-btn">
          <FaFacebookF className="mr-2" />
          Continue with Facebook
        </button>

        <div className="divider">
          <hr className="hr-line" />
          <span className="or-text">or</span>
          <hr className="hr-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <span className="input-icon">
              <MdAlternateEmail />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <span className="input-icon">
              <TbLockPassword />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </div>

          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <p className="footer-text">
          New to The Indian Express?
          <br />
          <a href="#" className="footer-link">
            Create an account to get started.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
