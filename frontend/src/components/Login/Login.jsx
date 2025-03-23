import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Stepper, { Step } from "../Stepper/Stepper";
import AlertPopup from "../AlertPopup/AlertPopup";
import "./Login.css";
import { useAuth } from "../../contexts/AuthContext"; // ✅ typo fixed

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Track current step
  const inputRefs = useRef([]); // Array of refs for each input field
  const { login } = useAuth();

  // Auto-focus the input field when the step changes
  useEffect(() => {
    if (inputRefs.current[currentStep - 1]) {
      // Focus the input field after a slight delay to allow the transition to complete
      setTimeout(() => {
        inputRefs.current[currentStep - 1].focus();
      }, 300); // Adjust delay to match the transition duration
    }
  }, [currentStep]);

  const validateForm = () => {
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
      const response = await axios.post("http://localhost:8000/users/login/", formData);

      if (response.data.success) {
        setErrorMessage("Login successful");
        login(response.data.user); // ✅ context handles localStorage
        window.location.href = "/sheet/3"; // ✅ redirect
      } else {
        setErrorMessage(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Login failed. Try again later.");
      }
    } finally {
      setSending(false);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  return (
    <div className="login-holder">
      <div className="login-title">Login</div>
      <div className="login-page">
        <Stepper
          initialStep={1}
          onFinalStepCompleted={handleSubmit}
          backButtonText="Previous"
          nextButtonText="Next"
          sending={sending}
          page="login"
          onStepChange={setCurrentStep} // Pass the step change handler
        >
          <Step>
            <h2>Enter your Email</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              ref={(el) => (inputRefs.current[0] = el)} // Assign ref for the first input
            />
          </Step>
          <Step>
            <h2>Enter your Password</h2>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              ref={(el) => (inputRefs.current[1] = el)} // Assign ref for the second input
            />
          </Step>
        </Stepper>

        {showPopup && (
          <AlertPopup
            message={sending ? "Logging in..." : errorMessage}
            type={sending ? "info" : errorMessage.includes("success") ? "success" : "error"}
          />
        )}

        <p className="register-redirect">
          Don't have an Account? <a href="/register">Register Here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;