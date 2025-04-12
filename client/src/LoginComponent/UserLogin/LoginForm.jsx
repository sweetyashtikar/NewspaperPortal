import React, { useState } from "react";
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

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Welcome back</h2>

        <button className="social-btn google-btn">
          <FcGoogle className="mr-2 text-xl" />
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
