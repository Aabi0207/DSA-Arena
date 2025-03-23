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
import { useNavigate, useParams } from "react-router-dom";

const Sidebar = ({ activeSection = "sheet" }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
  const [alertMessage, setAlertMessage] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sheets, setSheets] = useState([]); // State to store sheets data
  const { sheetId } = useParams(); // Get sheetId from URL (if available)
  const navigate = useNavigate();

  // Fetch sheets data on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions/sheets")
      .then((res) => res.json())
      .then((data) => {
        setSheets(data);
      })
      .catch((error) => {
        console.error("Failed to fetch sheets:", error);
      });
  }, []);

  const handleComingSoon = () => {
    setAlertMessage("Coming Soon!");
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const handleDSAHeaderClick = () => {
    setIsExpanded((prev) => !prev); // Toggle expand/collapse
    setIsMobileSidebarOpen(false);
  };

  const handleSheetClick = (sheetId) => {
    navigate(`/sheet/${sheetId}`); // Navigate to the sheet URL
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
          onClick={() => {
            navigate(`/leaderboard`);
            setIsMobileSidebarOpen(false);
          }}
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
        {isExpanded && (
          <div className="sheet-list">
            {sheets.map((sheet) => (
              <div
                key={sheet.id}
                className={`sheet-item ${
                  activeSection === "sheet" && sheet.id === parseInt(sheetId) ? "active-sheet" : ""
                }`}
                onClick={() => handleSheetClick(sheet.id)} // Use handleSheetClick
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