import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const getRingClass = (rank) => {
  if (rank === "Surya Bhai") return 'gold';
  if (rank === "Rocky Bhai") return 'silver';
  if (rank === "Bahubali") return 'bronze';
  return '';
};

const Header = ( { titleText = "DSA Arena" }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const profilePic = `http://localhost:8000/${user?.profile_photo || '/profile-pics/trial.jpg'}`;
  const ringClass = getRingClass(user?.rank);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-title">{titleText}</div>
      <div className={`profile-wrapper ${ringClass}`} onClick={() => {
        navigate(`/profile/${user.username}`)
      }}>
        <img src={profilePic} alt="Profile" className="profile-pic" />
      </div>
    </header>
  );
};

export default Header;
