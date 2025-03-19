import React, { useState } from "react";
import "./HoverMessage.css";

const HoverMessage = ({ children, message }) => {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div
      className="hover-message-wrapper"
      onMouseEnter={() => setShowMessage(true)}
      onMouseLeave={() => setShowMessage(false)}
    >
      {children}
      <div className={`hover-tooltip ${showMessage ? "show" : ""}`}>
        {message}
      </div>
    </div>
  );
};

export default HoverMessage;
