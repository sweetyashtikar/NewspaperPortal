import React, { useState } from "react";
import axios from "axios";
import "../Style/GlobalcssLogin.css";
import { Link } from "react-router-dom";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      const res = await axios.post("http://localhost:5000/auth/register", formData);
      setMessage(res.data.msg);
      setFormData({ email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="super-admin-signup-page-container">
      <div className="super-admin-signup-page-box">
        <h2 className="signup-title">Create your account</h2>
        <p className="signup-subtitle">It is quick and easy.</p>

        <button className="social-button">
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
          Sign in with Google
        </button>
        <button className="social-button facebook">
          <img src="https://img.icons8.com/color/16/000000/facebook-new.png" alt="Facebook" />
          Continue with Facebook
        </button>

        <div className="divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-input-wrapper">
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

          <div className="password-input-wrapper">
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
            Accept <a href="#">Terms and Conditions</a> and <a href="#">privacy policy</a>.
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
