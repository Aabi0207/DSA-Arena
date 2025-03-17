// src/components/Question/Question.jsx
import React, { useState } from "react";
import "./Question.css";
import { NotebookPen, Bookmark } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Question = ({ question, onStatusChange }) => {
  const [isSolved, setIsSolved] = useState(question.is_solved);
  const [isSaved, setIsSaved] = useState(question.is_saved);

  const { user } = useAuth();

  const updateStatus = async (questionId, actionType) => {
    try {
      const response = await fetch(`http://localhost:8000/questions/update-status/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          question_id: questionId,
          action: actionType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Backend Error:", data);
        throw new Error(data?.error || "Failed to update status");
      }

      return data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  };

  const handleCheckboxToggle = async () => {
    const action = isSolved ? "unsolve" : "solve";
    const newSolved = !isSolved;

    try {
      await updateStatus(question.id, action);
      setIsSolved(newSolved);

      // 🔥 Notify parent
      if (onStatusChange) {
        onStatusChange({
          questionId: question.id,
          isSolved: newSolved,
          isSaved,
          difficulty: question.difficulty,
        });
      }
    } catch (error) {
      alert("Something went wrong while updating solved status.");
    }
  };

  const handleBookmarkToggle = async () => {
    const action = isSaved ? "unsave" : "save";
    const newSaved = !isSaved;

    try {
      await updateStatus(question.id, action);
      setIsSaved(newSaved);

      // 🔥 Notify parent
      if (onStatusChange) {
        onStatusChange({
          questionId: question.id,
          isSolved,
          isSaved: newSaved,
          difficulty: question.difficulty,
        });
      }
    } catch (error) {
      alert("Something went wrong while updating saved status.");
    }
  };

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
          style={{ accentColor: isSolved ? "#00ffff" : undefined }}
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
            className={`bookmark-icon ${
              isSaved ? "active" : isSolved ? "solved" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Question;
