// components/Loading.jsx
import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-screen">
      <div className="loader">
        <div className="outer-ring pink-ring"></div>
        <div className="outer-ring white-ring"></div>
        <div className="wave-circle">
          <div className="wave"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
