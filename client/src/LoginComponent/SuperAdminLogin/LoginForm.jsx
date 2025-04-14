import React, { useState } from "react";
import axios from "axios";
import "../Style/GlobalcssLogin.css";
import { MdAlternateEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/super-admin/login ",
        formData
      );
      setSuccess(response.data.msg);
      localStorage.setItem("token", response.data.token);
      console.log("Logged in super admin:", response.data);
      navigate('/admin-create-register')
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="super-admin-login-container">
      <div className="super-admin-login-box">
        <h2 className="login-heading">Welcome back</h2>

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

          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
