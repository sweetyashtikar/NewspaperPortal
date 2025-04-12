import React, { useState } from "react";
import axios from "axios";
import "../Style/GlobalcssLogin.css";
import { MdAlternateEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

// Optional: Set base URL if backend is on a different port
axios.defaults.baseURL = "http://localhost:5000"; // Replace with actual backend URL if deployed

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/admin/login", formData);

      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Login successful!");
      setError(null);

      // Optional: Redirect to dashboard or home page
      setTimeout(() => {
        window.location.href = "/admin/dashboard"; // Update this route as needed
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred. Please try again.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminlogin-container">
      <div className="adminlogin-box">
        <h2 className="adminlogin-heading">Welcome back</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper1">
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

          <div className="input-wrapper1">
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

          <button type="submit" className="continue-btn" disabled={loading}>
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
