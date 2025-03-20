import React, { useState } from "react";
import { Github, Linkedin, Globe } from "lucide-react";
import "./UserInfo.css";

const UserInfoSocial = ({ userInfo, isEditable }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    github: userInfo.github || "",
    linkedin: userInfo.linkedin || "",
    portfolio: userInfo.portfolio || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/social-links/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userInfo.username,
          ...formData,
        }),
      });

      if (response.ok) {
        setEditMode(false);
        // Optionally update parent state here
      } else {
        console.error("Failed to update social links");
      }
    } catch (error) {
      console.error("Error saving social links:", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      github: userInfo.github || "",
      linkedin: userInfo.linkedin || "",
      portfolio: userInfo.portfolio || "",
    });
  };

  return (
    <div className="user-info-social-container">
      <div className="lower-section">
        {editMode ? (
          <>
            <div className="logo-info location-input-wrapper">
              <Github size={18} className="location-icon" />
              <input
                type="text"
                value={formData.github}
                onChange={(e) => handleChange("github", e.target.value)}
                className="user-name input-field location-input"
                placeholder="GitHub Profile URL"
              />
            </div>
            <div className="logo-info location-input-wrapper">
              <Linkedin size={18} className="location-icon" />
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                className="user-name input-field location-input"
                placeholder="LinkedIn Profile URL"
              />
            </div>
            <div className="logo-info location-input-wrapper">
              <Globe size={18} className="location-icon" />
              <input
                type="text"
                value={formData.portfolio}
                onChange={(e) => handleChange("portfolio", e.target.value)}
                className="user-name input-field location-input"
                placeholder="Website/Portfolio URL"
              />
            </div>
          </>
        ) : (
          <>
            {formData.github && (
              <div className="logo-info">
                <Github size={18} className="logo" />
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  GitHub
                </a>
              </div>
            )}
            {formData.linkedin && (
              <div className="logo-info">
                <Linkedin size={18} className="logo" />
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  LinkedIn
                </a>
              </div>
            )}
            {formData.portfolio && (
              <div className="logo-info">
                <Globe size={18} className="logo" />
                <a
                  href={formData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  Website
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {isEditable && !editMode && (
        <button className="edit-btn" onClick={() => setEditMode(true)}>
          Edit
        </button>
      )}

      {editMode && (
        <div className="action-btns-social">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfoSocial;
