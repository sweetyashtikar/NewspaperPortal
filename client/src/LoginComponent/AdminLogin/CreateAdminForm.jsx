import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Style/GlobalcssLogin.css";
import {jwtDecode} from "jwt-decode"; // You need to install jwt-decode

const CreateAdminForm = () => {
  const navigate = useNavigate();
  // Check if the user is a super admin
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("decoded", decodedToken)
      if (decodedToken.role === "superAdmin") {
        setIsSuperAdmin(true);
       
      } else {
       alert("unathorised user")
      }
    } else {
      navigate("/login"); // Redirect to login if no token
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    portalName: "",
    language: "",
    address: "",
    Navbar: [{ title: "", link: "" }],
    footer: {
      copyright: "",
      links: [{ title: "", link: "" }],
    },
  });

  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("Navbar")) {
      const [_, index, field] = name.split(".");
      const updatedNavbar = [...formData.Navbar];
      updatedNavbar[parseInt(index)][field] = value;
      setFormData({ ...formData, Navbar: updatedNavbar });
    } else if (name.startsWith("footer.links")) {
      const [, _, index, field] = name.split(".");
      const updatedLinks = [...formData.footer.links];
      updatedLinks[parseInt(index)][field] = value;
      setFormData({
        ...formData,
        footer: { ...formData.footer, links: updatedLinks },
      });
    } else if (name.startsWith("footer.")) {
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
    setFormData({
      ...formData,
      Navbar: [...formData.Navbar, { title: "", link: "" }],
    });
  };

  const handleAddFooterLink = () => {
    setFormData({
      ...formData,
      footer: {
        ...formData.footer,
        links: [...formData.footer.links, { title: "", link: "" }],
      },
    });
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      contactNo: "",
      portalName: "",
      language: "",
      address: "",
      Navbar: [{ title: "", link: "" }],
      footer: {
        copyright: "",
        links: [{ title: "", link: "" }],
      },
    });
    setLogo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      for (const [key, value] of Object.entries(formData)) {
        if (key === "Navbar" || key === "footer") {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      }

      if (logo) data.append("logo", logo);

      const res = await axios.post("http://localhost:5000/superadmin/create-admin  ", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:`Bearer ${token}`,
        },
      });

      setMessage(res.data.msg);
      resetForm();
      alert("form submitted")
      navigate('/')
    } catch (err) {
      console.log("error", err)
      setError(
        err.response?.data?.msg || "Error occurred while creating admin."
      );
    }
  };

  return isSuperAdmin ?(
    <div className="createnewadminregister">
      <div className="adminlogin-box">
        <h2 className="adminlogin-heading">Create Admin</h2>

        <form
          className="signup-form2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Basic Info */}
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

          {/* Logo */}
          <input
            type="file"
            onChange={handleLogoChange}
            accept="image/*"
            required
          />

          {/* Navbar Items */}
          <h4>Navbar Items:</h4>
          {formData.Navbar.map((item, index) => (
            <div key={index}>
              <input
                name={`Navbar.${index}.title`}
                type="text"
                placeholder={`Navbar Title ${index + 1}`}
                value={item.title}
                onChange={handleChange}
                required
              />
              <input
                name={`Navbar.${index}.link`}
                type="text"
                placeholder={`Navbar Link ${index + 1}`}
                value={item.link}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddNavbar}>
            + Add Navbar Item
          </button>

          {/* Footer */}
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
            <div key={index}>
              <input
                name={`footer.links.${index}.title`}
                type="text"
                placeholder={`Footer Link Title ${index + 1}`}
                value={link.title}
                onChange={handleChange}
                required
              />
              <input
                name={`footer.links.${index}.link`}
                type="text"
                placeholder={`Footer Link URL ${index + 1}`}
                value={link.link}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddFooterLink}>
            + Add Footer Link
          </button>

          {/* Submit */}
          <button type="submit" className="continue-btn">
            Create Admin
          </button>
        </form>

        {/* Feedback */}
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  ): null;
};

export default CreateAdminForm;