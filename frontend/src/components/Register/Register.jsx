import React, { useState } from "react";
import axios from "axios";
import Stepper, { Step } from "../Stepper/Stepper";
import AlertPopup from "../AlertPopup/AlertPopup";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const validateForm = async () => {
    if (!formData.username.trim()) {
      setErrorMessage("Username is required.");
      return false;
    }
    if (!/^[a-zA-Z0-9-]+$/.test(formData.username)) {
      setErrorMessage("Username can only contain letters, numbers, and dashes.");
      return false;
    }
  
    try {
      const res = await axios.get(
        `http://localhost:8000/users/check-username/?username=${formData.username}`
      );
      if (res.data.exists) {
        setErrorMessage("Username already exists.");
        return false;
      }
    } catch (err) {
      setErrorMessage("Failed to validate username.");
      return false;
    }
  
    if (!formData.display_name.trim()) {
      setErrorMessage("Display Name is required.");
      return false;
    }
  
    if (!formData.email.trim()) {
      setErrorMessage("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Enter a valid email address.");
      return false;
    }
  
    try {
      const emailCheck = await axios.get(
        `http://localhost:8000/users/check-email/?email=${formData.email}`
      );
      if (emailCheck.data.exists) {
        setErrorMessage("Email already exists.");
        return false;
      }
    } catch (err) {
      setErrorMessage("Failed to validate email.");
      return false;
    }
  
    if (!formData.password.trim()) {
      setErrorMessage("Password is required.");
      return false;
    }
  
    return true;
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async () => {
    setShowPopup(false);
    const isValid = await validateForm();
    if (!isValid) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
      return;
    }

    setSending(true);
    setShowPopup(true);

    try {
      const response = await axios.post("http://localhost:8000/users/", formData);
      if (response.status === 201) {
        setErrorMessage("Registration successful. Admin will review your request.");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage("Registration failed.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Regestration failed.");
    } finally {
      setSending(false);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div className='register-holder'>
      <div className="register-title">Register</div>
      <div className="register-page">
        <Stepper
          initialStep={1}
          onFinalStepCompleted={handleSubmit}
          backButtonText="Previous"
          nextButtonText="Next"
          sending={sending}
          page='register'
        >
          <Step>
            <h2>Choose a Username</h2>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </Step>
          <Step>
            <h2>Choose a Display Name</h2>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Display Name"
              required
            />
          </Step>
          <Step>
            <h2>Your Email Address</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </Step>
          <Step>
            <h2>Choose a Password</h2>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </Step>
        </Stepper>

        {showPopup && (
          <AlertPopup
            message={sending ? "Registering..." : errorMessage}
            type={
              sending
                ? "info"
                : errorMessage.includes("success")
                ? "success"
                : "error"
            }
          />
        )}

        <p className="register-redirect">
          Already Registered? <a href="/login">Login Here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
