import React from "react";
import { useParams } from "react-router-dom"; // Add useParams
import Sidebar from "../components/Sidebar/Sidebar";
import Sheet from "../components/Sheet/Sheet";

const SheetPage = () => {
  const { sheetId } = useParams(); // Get sheetId from URL

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh", // assuming Navbar height is 85px
        }}
      >
        {/* Sidebar - fixed width */}
        <Sidebar
          activeSheetId={sheetId ? parseInt(sheetId) : null} // Pass sheetId from URL
          activeSection="sheet"
        />

        {/* Vertical separator */}
        <div
          className="separator"
          style={{ width: "1px", backgroundColor: "#2d2d2d" }}
        />

        {/* Scrollable Sheet area */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
          {sheetId && <Sheet sheetId={parseInt(sheetId)} />} {/* Render sheet if sheetId exists */}
        </div>
      </div>
    </>
  );
};

export default SheetPage;