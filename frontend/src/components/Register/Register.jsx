import React, { useState } from "react";
import axios from "axios";
import Stepper, { Step } from "../Stepper/Stepper";
import AlertPopup from "../AlertPopup/AlertPopup";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const validateForm = () => {
    if (!formData.username.trim()) {
      setErrorMessage("Username is required.");
      return false;
    }
    if (!formData.displayName.trim()) {
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
    if (!validateForm()) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
      return;
    }

    setSending(true);
    setShowPopup(true);

    try {
      const response = await axios.post("https://your-backend-api.com/api/register/", formData);
      if (response.data.success && response.data.user.is_accepted) {
        // Successful register
        setErrorMessage("register successful");
        // Redirect to dashboard or homepage here
      } else {
        setErrorMessage("User not accepted yet or invalid credentials.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("register failed. Try again later.");
    } finally {
      setSending(false);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  return (
    <div className='register-holder'>
    <div className="register-title">
        Register
    </div>
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
            name="displayName"
            value={formData.displayName}
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

      {/* Popup Notification */}
      {showPopup && (
        <AlertPopup
          message={sending ? "Registering in..." : errorMessage}
          type={sending ? "info" : errorMessage.includes("success") ? "success" : "error"}
        />
      )}

      <p className="register-redirect">
        Already Registered? <a href="/register">Login Here</a>
      </p>
    </div>
    </div>
  );
};

export default Register;
