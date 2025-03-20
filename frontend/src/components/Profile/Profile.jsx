import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../Header/Header";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import UserInfo from "../UserInfo/UserInfo";
import UserInfoSocial from "../UserInfo/UserInfoSocial";
import { Pencil } from "lucide-react";
import "./Profile.css";

const Profile = ({ userProfile, username }) => {
  const [profileData, setProfileData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const bannerInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/profile/", {
        username,
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  if (!profileData) return null;

  const { profile_photo, profile_banner } = profileData;

  const profilePicUrl = profile_photo
    ? `http://127.0.0.1:8000${profile_photo}`
    : "/default-profile.jpg";
  const bannerUrl = profile_banner
    ? `http://127.0.0.1:8000${profile_banner}`
    : "/default-banner.jpg";

  const handleEditToggle = () => setIsEditable(!isEditable);

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("profile_banner", file);

    try {
      await axios.post("http://127.0.0.1:8000/users/update-banner/", formData);
      fetchProfile(); // Re-fetch instead of full reload
    } catch (err) {
      console.error("Banner upload failed:", err);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("profile_photo", file);
  
    try {
      const res = await axios.post("http://127.0.0.1:8000/users/update-photo/", formData);
      const newProfilePhotoUrl = `${res.data.profile_photo}`;
  
      // Update profileData state
      setProfileData((prev) => ({
        ...prev,
        profile_photo: res.data.profile_photo,
      }));
  
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.profile_photo = newProfilePhotoUrl;
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Profile photo upload failed:", err);
    }
  };
  return (
    <>
      <Header titleText="" />
      {userProfile && (
        <ProfileHeader
          onEditToggle={handleEditToggle}
          isEditable={isEditable}
        />
      )}
      <div
        className={`profile-banner ${isEditable ? "banner-edit-mode" : ""}`}
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        {isEditable && (
          <div
            className="edit-icon-button banner-edit"
            onClick={() => bannerInputRef.current.click()}
          >
            <Pencil size={18} />
            <input
              type="file"
              accept="image/*"
              ref={bannerInputRef}
              style={{ display: "none" }}
              onChange={handleBannerChange}
            />
          </div>
        )}
        <div className="profile-photo-wrapper">
          <img
            src={profilePicUrl}
            alt="Profile"
            className={`profile-photo ${isEditable ? "editable-photo" : ""}`}
          />
          {isEditable && (
            <div
              className="edit-icon-button profile-edit-center"
              onClick={() => photoInputRef.current.click()}
            >
              <Pencil size={20} />
              <input
                type="file"
                accept="image/*"
                ref={photoInputRef}
                style={{ display: "none" }}
                onChange={handleProfilePhotoChange}
              />
            </div>
          )}
        </div>
      </div>
      <div className="below-section" style={{display: "flex", justifyContent: "space-between"}}>
        
      <UserInfo userInfo={profileData} isEditable={isEditable} />
      <UserInfoSocial userInfo={profileData} isEditable={isEditable} />
      </div>
    </>
  );
};

export default Profile;
