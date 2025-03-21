import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeaderboardRow.css"

const getRingClass = (rank) => {
    if (rank === "Surya Bhai") return 'gold';
    if (rank === "Rocky Bhai") return 'silver';
    if (rank === "Bahubali") return 'bronze';
    return '';
};

const getMedal = (pos) => {
    if (pos == 1) return 'gold';
    if (pos == 2) return 'silver';
    if (pos == 3) return 'bronze';
    return null;
}

const getRankImg = (rank) => {
    if (rank == "Bahubali") return "/ranks/bahubali.png"
    if (rank == "Rocky Bhai") return "/ranks/rocky.png"
    if (rank == "Pushpa Bhau") return "/ranks/pushpa.png"
    if (rank == "Mass") return "/ranks/mass.png"
    if (rank == "Singham") return "/ranks/singham.png"
    return "/ranks/chulbul.png"
}

const LeaderboardRow = ({ pos, userSummary }) => {
    const navigate = useNavigate();
    const ringClass = getRingClass(userSummary.rank);
    const medal = getMedal(pos)

  return (
    <>
      <div className="row">
        <span className="comman">{pos}</span>
        <span className="comman username">{userSummary.username}</span>
        <span className="name">{userSummary.display_name}</span>
        <div className="comman sep-wrapper">
        <div className={`wrapper ${ringClass}`}>
          <img
            src={`http://127.0.0.1:8000${userSummary.profile_photo}`}
            alt="user-profile"
            className="pfp"
            onClick={() => {
                navigate(`/profile/${userSummary.username}/`)
            }}
          />
        </div>
        </div>

        <span className="comman">{userSummary.score}</span>
        <div className="rank-img-contain">
        <img src={getRankImg(userSummary.rank)} alt="Ranking imag" className="rank-img" />

        </div>
          {medal && (
            <img src={`/medals/${medal}.png`} alt="medal" className="medal" />
          )}
      </div>
    </>
  );
};

export default LeaderboardRow;
