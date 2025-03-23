import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import SavedSheet from "../components/SavedSheet/SavedSheet";

const SavedPage = () => {

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Sidebar with activeSection set to 'saved' */}
        <Sidebar activeSection="saved" />

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
