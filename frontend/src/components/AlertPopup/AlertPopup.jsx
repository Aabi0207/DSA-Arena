import React, { useEffect } from "react";
import "./AlertPopup.css";

const ICONS = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const AlertPopup = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`alert-popup alert-${type}`}>
      <span className="alert-icon">{ICONS[type] || "ℹ️"}</span>
      <span className="alert-message">{message}</span>
    </div>
  );
};

export default AlertPopup;
