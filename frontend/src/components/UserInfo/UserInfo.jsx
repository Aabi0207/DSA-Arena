import React, { useState } from "react";
import { MapPinned, CalendarDays, Award } from "lucide-react";
import "./UserInfo.css";

const UserInfo = ({ userInfo, isEditable }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    display_name: userInfo.display_name || "",
    tagline: userInfo.tagline || "",
    pronouns: userInfo.pronouns || "",
    location: userInfo.location || "",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${suffix} ${month}, ${year}`;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/profile-info/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userInfo.username,
            ...formData,
          }),
        }
      );

      if (response.ok) {
        setEditMode(false);
        // Optionally update parent state here
      } else {
        console.error("Failed to update profile info");
      }
    } catch (error) {
      console.error("Error saving profile info:", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      display_name: userInfo.display_name || "",
      tagline: userInfo.tagline || "",
      pronouns: userInfo.pronouns || "",
      location: userInfo.location || "",
    });
  };

  return (
    <div className="user-info-container">
      <div className="upper-section">
        <div className="user-name">{userInfo.username}</div>

        {editMode ? (
          <>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => handleChange("display_name", e.target.value)}
              className="display-name input-field"
              placeholder="Display name"
            />
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="user-name tagline input-field"
              placeholder="Add a tagline"
            />
            {/* <input
              type="text"
              value={formData.pronouns}
              onChange={(e) => handleChange("pronouns", e.target.value)}
              className="user-name input-field"
              placeholder="Add pronouns"
            /> */}
          </>
        ) : (
          <>
            <div className="display-name">{formData.display_name}</div>
            {formData.tagline && (
              <div className="user-name tagline">{formData.tagline}</div>
            )}
            {/* {formData.pronouns && <div className="user-name">{formData.pronouns}</div>} */}
          </>
        )}
      </div>

      <div className="lower-section">
        {editMode ? (
          <>
            <div className="logo-info location-input-wrapper">
              <MapPinned size={18} className="location-icon" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="user-name input-field location-input"
                placeholder="Add location"
              />
            </div>
            <div className="logo-info">
              <CalendarDays size={18} className="logo" />
              <span>Date Joined: {formatDate(userInfo.date_joined)}</span>
            </div>
          </>
        ) : (
          <>
            {formData.location && (
              <div className="logo-info">
                <MapPinned size={18} className="logo" />
                <span>Location: {formData.location}</span>
              </div>
            )}
            <div className="logo-info">
              <CalendarDays size={18} className="logo" />
              <span>Date Joined: {formatDate(userInfo.date_joined)}</span>
            </div>
            <div className="logo-info">
              <Award size={18} className="logo" />
              <span>Rank: {userInfo.rank || "Unranked"}</span>
            </div>
          </>
        )}
      </div>

      {isEditable && !editMode && (
        <button className="edit-btn" onClick={() => setEditMode(true)}>
          Edit
        </button>
      )}

      {editMode && (
        <div className="action-btns">
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

export default UserInfo;
