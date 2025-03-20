import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Pencil } from "lucide-react";
import './ProfileHeader.css';
import { useAuth } from '../../contexts/AuthContext';

const ProfileHeader = ({onEditToggle, isEditable}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();            // Clears localStorage and context
    navigate("/login");  // Redirects to login page
  };

  return (
    <div className="profile-header-container">
      <button className="edit-profile-button" onClick={onEditToggle}>
        <Pencil size={18} className="icon" />
        <span>{isEditable?"View": "Edit"}</span>
      </button>

      <div className="edit-profile-button profile-header-right">
        <button className="icon-button" onClick={handleLogout}>
          <LogOut size={18} className="icon" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
