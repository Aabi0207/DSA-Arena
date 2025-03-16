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
    setActiveSheetId(id); // Only update internal state, no navigation
  };

  return (
    <>
      <Navbar />
      <div
        className="seperator"
        style={{ width: "100%", height: "1px", backgroundColor: "#27272a" }}
      ></div>
      <div
        className="group-together"
        style={{
          display: "flex",
          height: "calc(100vh - 85px)",
        }}
      >
        <Sidebar
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSheetSelect={handleSheetSelect}
        />
        <div
          className="seperator"
          style={{
            width: "1px",
            height: "100%",
            backgroundColor: "#27272a",
          }}
        ></div>
        {activeSheetId && <Sheet sheetId={activeSheetId} />}
      </div>
    </>
  );
};

export default SheetPage;
