import React, { useState } from "react";
import "./Question.css";
import { ClipboardCheck, Bookmark, CirclePlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import HoverMessage from "../HoverMessage/HoverMessage";
import AISolution from "../AISolution/AISolution";

const Question = ({
  question,
  onStatusChange,
  onNotesClick,
  isSavedView = false,
}) => {
  const [isSolved, setIsSolved] = useState(question.is_solved);
  const [isSaved, setIsSaved] = useState(question.is_saved);
  const [showAISolution, setShowAISolution] = useState(false);
  const { user } = useAuth();

  const updateStatus = async (questionId, actionType) => {
    try {
      const response = await fetch(
        `http://localhost:8000/questions/update-status/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            question_id: questionId,
            action: actionType,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.error || "Failed to update status");
      return data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  };

  const handleCheckboxToggle = async () => {
    const action = isSolved ? "unsolve" : "solve";
    const newSolved = !isSolved;
    try {
      await updateStatus(question.id, action);
      setIsSolved(newSolved);
      onStatusChange?.({
        questionId: question.id,
        isSolved: newSolved,
        isSaved,
        difficulty: question.difficulty,
      });
    } catch {
      alert("Failed to update solved status.");
    }
  };

  const handleBookmarkToggle = async () => {
    const action = isSaved ? "unsave" : "save";
    const newSaved = !isSaved;
    try {
      await updateStatus(question.id, action);
      setIsSaved(newSaved);
      if (isSavedView) {
        onStatusChange?.({
          questionId: question.id,
          isSolved,
          isSaved: newSaved,
          difficulty: question.difficulty,
        });
      }
    } catch {
      alert("Failed to update saved status.");
    }
  };

  const getTextColorClass = () =>
    isSaved
      ? "question-text saved"
      : isSolved
      ? "question-text solved"
      : "question-text";

  const getIconColorClass = () =>
    isSaved ? "icon saved" : isSolved ? "icon solved" : "icon";

  const getContainerBorderClass = () =>
    isSaved
      ? "question-container saved-border"
      : isSolved
      ? "question-container solved-border"
      : "question-container";

  // Extract slug from URL for passing to AISolution
  const getSlug = () => {
    const parts = question.link.split("/");
    return parts.length >= 2 ? parts[parts.length - 2] : "";
  };

  return (
    <>
      <div className={getContainerBorderClass()}>
        <div className="checkbox leftmost">
          <HoverMessage message={"Mark as Solved"}>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={isSolved}
              onChange={handleCheckboxToggle}
              style={{ accentColor: isSolved ? "#00ffff" : undefined }}
            />
          </HoverMessage>
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

        <div className="checkbox solution-icon-box">
          {question.platform === "leetcode" ? (
            <HoverMessage message={"AI Solution"}>
              <button
                onClick={() => setShowAISolution(true)}
                className="icon-button"
              >
                <ClipboardCheck size={28} className={getIconColorClass()} />
              </button>
            </HoverMessage>
          ) : (
            <span className={getTextColorClass()}>-</span>
          )}
        </div>

        <div className="checkbox platform-icon-box">
          <HoverMessage message={"Solve"}>
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
          </HoverMessage>
        </div>

        <div className="checkbox difficulty-icon-box">
          <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
            {question.difficulty}
          </span>
        </div>

        {/* Desktop: Show Save */}
        <div className="checkbox desktop-save-btn">
          <HoverMessage message={"Save"}>
            <button className="bookmark-btn" onClick={handleBookmarkToggle}>
              <Bookmark
                size={28}
                className={`bookmark-icon ${
                  isSaved ? "active" : isSolved ? "solved" : ""
                }`}
              />
            </button>
          </HoverMessage>
        </div>

        {/* Mobile: Show AI */}
        {question.platform === "leetcode" && (
          <div className="checkbox mobile-ai-btn">
            <HoverMessage message={"AI Solution"}>
              <button
                onClick={() => setShowAISolution(true)}
                className="icon-button"
              >
                <ClipboardCheck size={28} className={getIconColorClass()} />
              </button>
            </HoverMessage>
          </div>
        )}
        {question.platform !== "leetcode" && (
          <div className="checkbox mobile-ai-btn">
            <HoverMessage message={"AI Solution not available"}>
              <p>-</p>
            </HoverMessage>
          </div>
        )}

        <div className="checkbox notes-icon-box rightmost">
          <HoverMessage message={"Add Note"}>
            <button
              className="notes-btn"
              onClick={() => onNotesClick?.(question.id, user.email)}
            >
              <CirclePlus
                size={28}
                className={`notes-icon ${
                  isSaved ? "active" : isSolved ? "solved" : ""
                }`}
              />
            </button>
          </HoverMessage>
        </div>
      </div>

      {showAISolution && (
        <AISolution
          slug={getSlug()}
          email={user.email}
          onClose={() => setShowAISolution(false)}
        />
      )}
    </>
  );
};

export default Question;
