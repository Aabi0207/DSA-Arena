import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png'; // Replace with your logo path

const getRingClass = (rank) => {
  if (rank == "Surya Bhai") return 'gold';
  if (rank == "Rocky Bhai") return 'silver';
  if (rank == "Bahubali") return 'bronze';
  return '';
};

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const profilePic = `http://localhost:8000/${user?.profile_photo || '/profile-pics/trial.jpg'}`;
  const ringClass = getRingClass(user?.rank);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="DSA Arena" className="logo" />
      </div>
      <div className="navbar-right">
        <div className={`profile-wrapper ${ringClass}`}>
          <img src={profilePic} alt="Profile" className="profile-pic" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
