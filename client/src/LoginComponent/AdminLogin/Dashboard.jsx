import React from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const adminData = location.state?.adminData || JSON.parse(localStorage.getItem("createdAdmin"));

  return (
    <div>
      <h1>Welcome, {adminData?.name}</h1>
      <p>Email: {adminData?.email}</p>
      <p>Contact No: {adminData?.contactNo}</p>
      <p>Portal: {adminData?.portalName}</p>
      <p>Language: {adminData?.language}</p>
      <p>Address: {adminData?.address}</p>

      <h3>Navbar Items:</h3>
      <ul>
        {adminData?.Navbar?.map((item, i) => (
          <li key={i}>{item.title} - {item.link}</li>
        ))}
      </ul>

      <h3>Footer:</h3>
      <p>{adminData?.footer?.copyright}</p>
      <ul>
        {adminData?.footer?.links?.map((link, i) => (
          <li key={i}>{link.title} - {link.link}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
