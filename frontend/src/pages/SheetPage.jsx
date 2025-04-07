import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Sheet from "../components/Sheet/Sheet";

const SheetPage = () => {
  const { sheetId } = useParams();

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        <Sidebar activeSection="sheet" />

        <div
          className="separator"
          style={{ width: "1px", backgroundColor: "#2d2d2d" }}
        />

        <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
          {sheetId && <Sheet sheetId={parseInt(sheetId)} />}
        </div>
      </div>
    </>
  );
};

export default SheetPage;
