import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import SavedSheet from "../components/SavedSheet/SavedSheet";

const SavedPage = () => {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    // Fetch sheets (needed for Sidebar only)
    fetch("http://127.0.0.1:8000/questions/sheets")
      .then((res) => res.json())
      .then((data) => {
        setSheets(data);
      });
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Sidebar with activeSection set to 'saved' */}
        <Sidebar sheets={sheets} activeSection="saved" />

        {/* Vertical separator */}
        <div
          className="separator"
          style={{ width: "1px", backgroundColor: "#2d2d2d" }}
        />

        {/* Scrollable SavedSheet area */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
          <SavedSheet />
        </div>
      </div>
    </>
  );
};

export default SavedPage;
