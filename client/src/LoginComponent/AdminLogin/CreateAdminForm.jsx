import React, { useState } from "react";
import axios from "axios";
import "../Style/GlobalcssLogin.css";

const CreateAdminForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    portalName: "",
    language: "",
    address: "",
    Navbar: [""],
    footer: { copyright: "", links: [""] },
  });

  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("footer.links")) {
      const index = parseInt(name.split(".")[2]);
      const updatedLinks = [...formData.footer.links];
      updatedLinks[index] = value;
      setFormData({
        ...formData,
        footer: { ...formData.footer, links: updatedLinks },
      });
    } else if (name.includes("Navbar")) {
      const index = parseInt(name.split("[")[1]);
      const updatedNavbar = [...formData.Navbar];
      updatedNavbar[index] = value;
      setFormData({ ...formData, Navbar: updatedNavbar });
    } else if (name.includes("footer.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        footer: { ...formData.footer, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddNavbar = () => {
    setFormData({ ...formData, Navbar: [...formData.Navbar, ""] });
  };

  const handleAddFooterLink = () => {
    setFormData({
      ...formData,
      footer: {
        ...formData.footer,
        links: [...formData.footer.links, ""],
      },
    });
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "Navbar" || key === "footer") {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      if (logo) {
        data.append("logo", logo);
      }

      const response = await axios.post("/superadmin/create-admin", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.msg);
      setFormData({
        name: "",
        email: "",
        contactNo: "",
        portalName: "",
        language: "",
        address: "",
        Navbar: [""],
        footer: { copyright: "", links: [""] },
      });
      setLogo(null);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Error occurred while creating admin."
      );
    }
  };

  return (
    <div className="createnewadminregister">
      <div className="adminlogin-box">
        <h2 className="adminlogin-heading">Create Admin</h2>

        <form
          className="signup-form2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="contactNo"
            type="text"
            placeholder="Contact No"
            value={formData.contactNo}
            onChange={handleChange}
            required
          />
          <input
            name="portalName"
            type="text"
            placeholder="Portal Name"
            value={formData.portalName}
            onChange={handleChange}
            required
          />
          <input
            name="language"
            type="text"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            onChange={handleLogoChange}
            accept="image/*"
            required
          />

          <h4>Navbar Items:</h4>
          {formData.Navbar.map((item, index) => (
            <input
              key={index}
              name={`Navbar[${index}]`}
              type="text"
              placeholder={`Navbar item ${index + 1}`}
              value={item}
              onChange={handleChange}
              required
            />
          ))}
          <button type="button" onClick={handleAddNavbar}>
            + Add Navbar Item
          </button>

          <h4>Footer:</h4>
          <input
            name="footer.copyright"
            type="text"
            placeholder="Footer Copyright"
            value={formData.footer?.copyright}
            onChange={handleChange}
            required
          />
          {formData.footer.links.map((link, index) => (
            <input
              key={index}
              name={`footer.links.${index}`}
              type="text"
              placeholder={`Footer Link ${index + 1}`}
              value={link}
              onChange={handleChange}
              required
            />
          ))}
          <button type="button" onClick={handleAddFooterLink}>
            + Add Footer Link
          </button>

          <button type="submit" className="continue-btn">
            Create Admin
          </button>
        </form>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default CreateAdminForm;
