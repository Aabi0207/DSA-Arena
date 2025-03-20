import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Profile from "../components/Profile/Profile";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && username === user.username) {
      setUserProfile(true);
    } else {
      setUserProfile(false);
    }
  }, [username]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar activeSection="profile" />
      <div
        className="separator"
        style={{ width: "1px", backgroundColor: "#2d2d2d" }}
      />
      <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
        <Profile userProfile={userProfile} username={username} />
      </div>
    </div>
  );
};

export default ProfilePage;
