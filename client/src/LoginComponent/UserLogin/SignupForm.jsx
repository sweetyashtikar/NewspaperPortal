import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/GlobalcssLogin.css";
import { Link } from "react-router-dom";
import {
  MdAlternateEmail,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Visibility toggle state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/register",
        formData
      );
      setMessage(res.data.msg);
      setFormData({ email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
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

    const handleFBLogin = () => {
      window.FB.login(function (response) {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
  
          axios.post('http://localhost:5000/auth/facebook', {
            accessToken,
            userID
          })
          .then(res => {
            console.log('User:', res.data.user);
            alert('Login Successful');
          })
          .catch(err => {
            console.error(err);
            alert('Login Failed');
          });
  
        } else {
          alert('Facebook login was not authorized.');
        }
      }, { scope: 'public_profile,email' });
    };
  

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Create your account</h2>
        <p className="signup-subtitle">It is quick and easy.</p>

        <button  id='GoogleSignIn' onClick={handleGoogleSuccess}>
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google"
          />
          
          Sign in with Google
        </button>
        <button className="social-button facebook" onClick={handleFBLogin}>
          <img
            src="https://img.icons8.com/color/16/000000/facebook-new.png"
            alt="Facebook"
          />
         
          Continue with Facebook
        </button>

        <div className="divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <span className="input-icon">
              <MdAlternateEmail />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* ✅ Password field with visibility toggle */}
          <div className="password-input-wrapper">
            <span className="input-icon">
              <TbLockPassword />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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

          {/* ✅ Confirm Password field with visibility toggle */}
          <div className="password-input-wrapper">
            <span className="input-icon">
              <TbLockPassword />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </div>

          <label className="checkbox-label">
            <input type="checkbox" />
            Yes, I'd like to receive The Indian Express daily newsletter.
          </label>

          <label className="checkbox-label">
            <input type="checkbox" required />
            Accept <a href="#">Terms and Conditions</a> and{" "}
            <a href="#">privacy policy</a>.
          </label>

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="signin-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
