// src/components/QuestionList/QuestionList.jsx
import React, { useState, useEffect } from "react";
import "./QuestionList.css";
import Question from "../Question/Question";
import { ChevronRight, ChevronDown } from "lucide-react";

const QuestionList = ({
  topic,
  keep_open = false,
  onStatusChange,
  onNotesClick,
  isSavedView = false,
}) => {
  const [isOpen, setIsOpen] = useState(keep_open);
  const [questionsState, setQuestionsState] = useState(topic.questions);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    setQuestionsState(topic.questions);
    const count = topic.questions.filter((q) => q.is_solved).length;
    setSolvedCount(count);
  }, [topic.questions]);

  const allSolved = solvedCount === questionsState.length;
  const highlight = allSolved || isOpen;

  const handleQuestionStatusChange = ({
    questionId,
    isSolved,
    isSaved,
    difficulty,
  }) => {
    const updatedQuestions = questionsState.map((q) =>
      q.id === questionId ? { ...q, is_solved: isSolved, is_saved: isSaved } : q
    );
    setQuestionsState(updatedQuestions);
    const newSolvedCount = updatedQuestions.filter((q) => q.is_solved).length;
    setSolvedCount(newSolvedCount);

    if (onStatusChange) {
      if (isSavedView) {
        onStatusChange({ questionId, isSaved });
      } else {
        onStatusChange({ questionId, isSolved, difficulty });
      }
    }
  };

  return (
    <div className="questionlist-wrapper">
      <div className="questionlist-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="questionlist-left">
          {isOpen ? (
            <ChevronDown size={20} color={highlight ? "#00ffff" : "#ffffff"} />
          ) : (
            <ChevronRight size={20} color={highlight ? "#00ffff" : "#ffffff"} />
          )}
          <div className={`topic-title ${highlight ? "highlight" : ""}`}>
            {topic.name}{" "}
            {!isSavedView && (
              <span className={`solved-count ${highlight ? "highlight" : ""}`}>
                ({solvedCount}/{questionsState.length})
              </span>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="questionlist-body">
          {questionsState.map((q) => (
            <div key={q.id} className="questionlist-question-row">
              <Question
                key={q.id}
                question={q}
                onStatusChange={handleQuestionStatusChange}
                onNotesClick={onNotesClick}
                isSavedView={isSavedView}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
