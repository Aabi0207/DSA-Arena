import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Sheet from "../components/Sheet/Sheet";

const SheetPage = () => {
  const [sheets, setSheets] = useState([]);
  const [activeSheetId, setActiveSheetId] = useState(null);

  useEffect(() => {
    // Fetch sheets first
    fetch("http://127.0.0.1:8000/questions/sheets")
      .then((res) => res.json())
      .then((data) => {
        setSheets(data);
        // Set default to id 3 if available
        const defaultSheet = data.find((sheet) => sheet.id === 3);
        setActiveSheetId(defaultSheet ? defaultSheet.id : data[0]?.id || null);
      });
  }, []);

  const handleSheetSelect = (id) => {
    setActiveSheetId(id);
  };

  return (
    <>
      <Navbar />

      {/* Top separator under navbar */}
      <div
        className="separator"
        style={{ width: "100%", height: "1px", backgroundColor: "#2d2d2d" }}
      />

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 85px)", // assuming Navbar height is 85px
        }}
      >
        {/* Sidebar - fixed width */}
        <Sidebar
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSheetSelect={handleSheetSelect}
        />

        {/* Vertical separator */}
        <div
          className="separator"
          style={{ width: "1px", backgroundColor: "#2d2d2d" }}
        />

        {/* Scrollable Sheet area */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: 'auto' }}>
          {activeSheetId && <Sheet sheetId={activeSheetId} />}
        </div>
      </div>
    </>
  );
};

export default SheetPage;
