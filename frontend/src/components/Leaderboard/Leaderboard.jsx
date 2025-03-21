import React from "react";
import Header from "../Header/Header";
import "./Leaderboard.css"
import LeaderboardRow from "../LeaderboardRow/LeaderboardRow";

const Leaderboard = ({userSummary}) => {
    userSummary.sort((a, b) => b.score - a.score);
    return (
        <>
            <Header titleText="Leaderboard" />
            <div className="first">
                <span className="others">#</span>
                <span className="others username">username</span>
                <span className="name">Name</span>
                <span className="others">Profile</span>
                <span className="others">Score</span>
                <span className="others">Rank</span>
            </div>
            {userSummary.map((user, index) => (
                <LeaderboardRow key={index} pos={index+1} userSummary={user} />
            ))}
        </>
    )
}

export default Leaderboard;