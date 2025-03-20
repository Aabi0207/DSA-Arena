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
} from "lucide-react";
import AlertPopup from "../AlertPopup/AlertPopup";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ sheets = [], activeSheetId, onSheetSelect, activeSection = "sheet" }) => {
  const [isExpanded, setIsExpanded] = useState(activeSection === "sheet");
  const [alertMessage, setAlertMessage] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-collapse if not in sheet section
    if (activeSection !== "sheet") {
      setIsExpanded(false);
    }
  }, [activeSection]);

  const handleComingSoon = () => {
    setAlertMessage("Coming Soon!");
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const handleDSAHeaderClick = () => {
    if (activeSection !== "sheet") {
      navigate("/"); // go to home route
    } else {
      setIsExpanded((prev) => !prev); // toggle expand/collapse
    }
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Hamburger Icon */}
      <div className="hamburger-icon" onClick={toggleMobileSidebar}>
        <Menu size={28} />
      </div>

      <div className={`sidebar ${isMobileSidebarOpen ? "open-mobile" : ""}`}>
        <img src="/logo.png" alt="DSA Arena Logo" className="sidebar-logo" />

        {/* Profile */}
        <div
          className={`sidebar-section ${activeSection === "profile" ? "active-section" : ""}`}
          onClick={() => {
            navigate(`/profile/${JSON.parse(localStorage.getItem('user'))['username']}`);
            setIsMobileSidebarOpen(false);
          }}
        >
          <User className="icon dsa-icon" />
          <span className="sidebar-text">Profile</span>
        </div>

        {/* Leaderboard */}
        <div
          className={`sidebar-section ${activeSection === "leaderboard" ? "active-section" : ""}`}
          onClick={handleComingSoon}
        >
          <Trophy className="icon dsa-icon" />
          <span className="sidebar-text">Leaderboard</span>
        </div>

        {/* Saved Section */}
        <div
          className={`sidebar-section ${activeSection === "saved" ? "active-section" : ""}`}
          onClick={() => {
            navigate("/saved");
            setIsMobileSidebarOpen(false);
          }}
        >
          <Bookmark className="icon dsa-icon" />
          <span className="sidebar-text">Saved</span>
        </div>

        <div className="divider" />

        {/* DSA Sheets Header */}
        <div
          className={`sidebar-section dsa-header ${
            activeSection === "sheet" ? "selected-dsa" : ""
          }`}
          onClick={handleDSAHeaderClick}
        >
          <NotepadText className="icon dsa-icon" />
          <span className="sidebar-text dsa-title">DSA Sheets</span>
          {isExpanded ? <ChevronUp className="chevron-icon" /> : <ChevronDown className="chevron-icon" />}
        </div>

        {/* Sheet List */}
        {isExpanded && activeSection === "sheet" && (
          <div className="sheet-list">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className={`sheet-item ${sheet.id === activeSheetId ? "active-sheet" : ""}`}
                onClick={() => {
                  if (onSheetSelect) {
                    onSheetSelect(sheet.id);
                  } else {
                    navigate("/");
                  }
                  setIsMobileSidebarOpen(false);
                }}
              >
                <img src={sheet.image} alt="sheet logo" className="sheet-logo" />
                <span>{sheet.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Alert Message */}
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