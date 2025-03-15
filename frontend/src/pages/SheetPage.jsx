import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const SheetPage = () => {
  const [activeSheetId, setActiveSheetId] = useState(null);
  const [activeSection, setActiveSection] = useState("sheets");

  const sheets = [
    { id: 1, name: "Striver's A2Z Sheet", image: "/sheet_images/1.jpg" },
    { id: 2, name: "Striver's SDE Sheet", image: "/sheet_images/2.jpg" },
    { id: 3, name: "Striver's 79 Sheet", image: "/sheet_images/3.jpg" },
    { id: 4, name: "Blind 75 Sheet", image: "/sheet_images/4.jpg" },
  ];

  const handleSheetSelect = (id, section) => {
    setActiveSheetId(id);
    setActiveSection(section);
    // You can also handle page content change based on section here
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
          display: "flex", // Make it horizontal flex
          height: "calc(100vh - 85px)", // Adjust for Navbar + top horizontal separator if needed
        }}
      >
        <Sidebar
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSheetSelect={handleSheetSelect}
          activeSection={activeSection}
        />
        <div
          className="seperator"
          style={{
            width: "1px",
            height: "100%",
            backgroundColor: "#27272a",
          }}
        ></div>
        {/* Add your right side content section here later */}
      </div>
    </>
  );
};

export default SheetPage;
