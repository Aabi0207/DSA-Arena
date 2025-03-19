// Sidebar.jsx
import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import {
  User,
  Bookmark,
  Trophy,
  ChevronDown,
  NotepadText,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import AlertPopup from "../AlertPopup/AlertPopup";

const Sidebar = ({ sheets, activeSheetId, onSheetSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleComingSoon = () => {
    setAlertMessage("Coming Soon!");
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Mobile Hamburger Icon */}
      <div className="hamburger-icon" onClick={toggleMobileSidebar}>
        <Menu size={28} />
      </div>

      {/* Overlay Sidebar on Mobile */}
      <div className={`sidebar ${isMobileSidebarOpen ? "open-mobile" : ""}`}>

        {/* Desktop Logo */}
        <img
          src="/logo.png"
          alt="DSA Arena Logo"
          className="sidebar-logo"
        />

        {/* Static Sections */}
        <div className="sidebar-section" onClick={handleComingSoon}>
          <User className="icon" />
          <span className="sidebar-text">Profile</span>
        </div>
        <div className="sidebar-section" onClick={handleComingSoon}>
          <Trophy className="icon" />
          <span className="sidebar-text">Leaderboard</span>
        </div>
        <div className="sidebar-section" onClick={handleComingSoon}>
          <Bookmark className="icon" />
          <span className="sidebar-text">Saved</span>
        </div>

        <div className="divider" />

        <div
          className={`sidebar-section dsa-header ${
            isExpanded ? "selected-dsa" : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <NotepadText className="icon dsa-icon" />
          <span className="sidebar-text dsa-title">DSA Sheets</span>
          {isExpanded ? (
            <ChevronUp className="chevron-icon" />
          ) : (
            <ChevronDown className="chevron-icon" />
          )}
        </div>

        {isExpanded && (
          <div className="sheet-list">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className={`sheet-item ${
                  sheet.id === activeSheetId ? "active-sheet" : ""
                }`}
                onClick={() => {
                  onSheetSelect(sheet.id);
                  setIsMobileSidebarOpen(false); // Auto-close on mobile after selection
                }}
              >
                <img
                  src={sheet.image}
                  alt="sheet logo"
                  className="sheet-logo"
                />
                <span>{sheet.name}</span>
              </div>
            ))}
          </div>
        )}

        {alertMessage && (
          <AlertPopup
            message={alertMessage}
            type="info"
            duration={2000}
            onClose={() => setAlertMessage("")}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
