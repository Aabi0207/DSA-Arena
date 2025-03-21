import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Leaderboard from "../components/Leaderboard/Leaderboard";

const LeaderboardPage = () => {
  const [userSummary, setUserSummary] = useState([]);

  useEffect(() => {
    // Fetch sheets first
    fetch("http://127.0.0.1:8000/users/summary")
      .then((res) => res.json())
      .then((data) => {
        setUserSummary(data.users);
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
        <Sidebar
          activeSection="leaderboard"
        />

        <div
          className="separator"
          style={{ width: "1px", backgroundColor: "#2d2d2d" }}
        />

        <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
          {userSummary && <Leaderboard userSummary={userSummary} />}
        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;
