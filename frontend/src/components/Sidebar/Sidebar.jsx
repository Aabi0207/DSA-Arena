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
} from "lucide-react";

import AlertPopup from "../AlertPopup/AlertPopup";

const Sidebar = () => {
  const [sheets, setSheets] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSheetId, setSelectedSheetId] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions/sheets")
      .then((res) => res.json())
      .then((data) => setSheets(data));
  }, []);

  const handleSheetClick = (id) => {
    setSelectedSheetId(id);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <User className="icon" />
        <span className="sidebar-text">Profile</span>
      </div>
      <div className="sidebar-section">
        <Trophy className="icon" />
        <span className="sidebar-text">Leaderboard</span>
      </div>
      <div className="sidebar-section">
        <Bookmark className="icon" />
        <span className="sidebar-text">Saved</span>
      </div>

      <div className="divider" />

      <div
        className={`sidebar-section dsa-header ${
          selectedSheetId ? "selected-dsa" : ""
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
                selectedSheetId === sheet.id ? "selected-sheet" : ""
              }`}
              onClick={() => handleSheetClick(sheet.id)}
            >
              <img src={sheet.image} alt="sheet logo" className="sheet-logo" />
              <span>{sheet.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
