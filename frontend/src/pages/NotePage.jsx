import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import MDNotes from "../components/MDNotes/MDNotes";
import { useParams } from "react-router-dom";

const NotePage = () => {
    const { topic_id } = useParams();

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        <Sidebar />

        <div
          className="separator"
          style={{ width: "1px", backgroundColor: "#2d2d2d" }}
        />

        <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
          <MDNotes topic_id={parseInt(topic_id)} />
        </div>
      </div>
    </>
  );
};

export default NotePage;
