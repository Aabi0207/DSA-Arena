import React from "react";
import "./Progress.css";

const Progress = ({ progressData }) => {
  const {
    solved_count,
    solved_easy,
    solved_medium,
    solved_hard,
    total_questions,
    total_easy,
    total_medium,
    total_hard,
  } = progressData;

  const getPercentage = (solved, total) =>
    total ? ((solved / total) * 100).toFixed(1) : 0;

  const radius = 75;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - solved_count / total_questions);

  return (
    <div className="progress-container">
      <div className="progress-left">
        {[
          {
            label: "Easy",
            color: "#00ff00",
            solved: solved_easy,
            total: total_easy,
          },
          {
            label: "Medium",
            color: "#ffa500",
            solved: solved_medium,
            total: total_medium,
          },
          {
            label: "Hard",
            color: "#ff0000",
            solved: solved_hard,
            total: total_hard,
          },
        ].map((item, idx) => (
          <div className="progress-box" key={idx} style={{ borderColor: "#626262" }}>
            <div className="progress-header">
              <span className="difficulty-label" style={{ color: item.color }}>
                {item.label}
              </span>
              <span className="solved-count">
                {item.solved}/{item.total}
              </span>
            </div>
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar-fill"
                style={{
                  backgroundColor: item.color,
                  width: `${getPercentage(item.solved, item.total)}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-separator"></div>

      <div className="progress-right">
        <div className="circular-progress">
          <svg className="progress-ring" width="200" height="200">
            <circle
              className="progress-ring-bg"
              cx="100"
              cy="100"
              r={radius}
              strokeWidth={strokeWidth - 4}
            />
            <circle
              className="progress-ring-fill"
              cx="100"
              cy="100"
              r={radius}
              strokeWidth={strokeWidth}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: progressOffset,
                strokeLinecap: "butt",
              }}
            />
          </svg>
          <div className="progress-ring-text">
            <div>
              <span className="Progress-tex">Progress</span>
              <p className="percen">{getPercentage(solved_count, total_questions)}%</p>
            </div>
          </div>
        </div>
        <div className="progress-info">
          <div className="tot" style={{ color: "#fff", fontSize: "14px" }}>Total Questions Solved</div>
          <div style={{ color: "#fff", fontWeight: "400", fontSize: "18px", textAlign: "center", color: "#898989"}}>
            <span className="dope">{solved_count}</span> of {total_questions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;