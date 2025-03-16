// src/components/Question/Question.jsx
import React, { useState } from "react";
import "./Question.css";
import { NotebookPen, Bookmark } from "lucide-react";

const Question = ({ question }) => {
  const [isSolved, setIsSolved] = useState(question.is_solved);
  const [isSaved, setIsSaved] = useState(question.is_saved);

  const handleCheckboxToggle = () => setIsSolved(!isSolved);
  const handleBookmarkToggle = () => setIsSaved(!isSaved);

  const getTextColorClass = () => {
    if (isSaved) return "question-text saved";
    if (isSolved) return "question-text solved";
    return "question-text";
  };

  const getIconColorClass = () => {
    if (isSaved) return "icon saved";
    if (isSolved) return "icon solved";
    return "icon";
  };

  return (
    <div className="question-container">
      <div className="checkbox leftmost">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={isSolved}
          onChange={handleCheckboxToggle}
        />
      </div>
      <div className="q-name">
        <a
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
          className={getTextColorClass()}
        >
          {question.question}
        </a>
      </div>

      <div className="checkbox">
        {question.solution ? (
          <a
            href={question.solution}
            target="_blank"
            rel="noopener noreferrer"
            className={getIconColorClass()}
          >
            <NotebookPen size={28} />
          </a>
        ) : (
          <span className={getTextColorClass()}>-</span>
        )}
      </div>
      <div className="checkbox">
        <a
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
          className="platform-icon"
        >
          <img
            src={`/platforms/${question.platform}.png`}
            alt={question.platform}
          />
        </a>
        </div>

        <div className="checkbox">
        <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </span>
        </div>

        <div className="checkbox rightmost">
        <button className="bookmark-btn" onClick={handleBookmarkToggle}>
          <Bookmark
            size={28}
            className={`bookmark-icon ${isSaved ? "active" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default Question;
