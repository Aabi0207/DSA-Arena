import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png'; // Replace with your logo path

const getRingClass = (rank) => {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return '';
};

const Navbar = ({ user }) => {
  const profilePic = `/profile_pics/${user?.profile_photo || '1.jpg'}`;
  const ringClass = getRingClass(user?.rank_position);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="DSA Arena" className="logo" />
      </div>
      <div className="navbar-right">
        <div className={`profile-wrapper ${ringClass}`}>
          <img src={"/profile-pics/trial.jpg"} alt="Profile" className="profile-pic" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
