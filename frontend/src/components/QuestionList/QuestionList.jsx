// src/components/QuestionList/QuestionList.jsx
import React, { useState, useEffect } from 'react';
import './QuestionList.css';
import Question from '../Question/Question';
import { ChevronRight, ChevronDown } from 'lucide-react';

const QuestionList = ({ topic, keep_open = false, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(keep_open);
  const [questionsState, setQuestionsState] = useState(topic.questions);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    setQuestionsState(topic.questions);
    const count = topic.questions.filter(q => q.is_solved).length;
    setSolvedCount(count);
  }, [topic.questions]);

  const allSolved = solvedCount === questionsState.length;
  const highlight = allSolved || isOpen;

  const handleQuestionStatusChange = ({ questionId, isSolved, isSaved, difficulty }) => {
    // ✅ Update local state for topic.questions
    const updatedQuestions = questionsState.map((q) =>
      q.id === questionId ? { ...q, is_solved: isSolved, is_saved: isSaved } : q
    );
    setQuestionsState(updatedQuestions);

    // ✅ Update solvedCount
    const newSolvedCount = updatedQuestions.filter(q => q.is_solved).length;
    setSolvedCount(newSolvedCount);

    // ✅ Pass difficulty upward if solved/unsolved
    if (onStatusChange) {
      onStatusChange({ questionId, isSolved, difficulty });
    }
  };

  return (
    <div className="questionlist-wrapper">
      <div className="questionlist-header">
        <div className="questionlist-left" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronDown size={20} color={highlight ? '#00ffff' : '#ffffff'} />
          ) : (
            <ChevronRight size={20} color={highlight ? '#00ffff' : '#ffffff'} />
          )}
          <div className={`topic-title ${highlight ? 'highlight' : ''}`}>
            {topic.name}{' '}
            <span className={`solved-count ${highlight ? 'highlight' : ''}`}>
              ({solvedCount}/{questionsState.length})
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="questionlist-body">
          {questionsState.map((q) => (
            <div key={q.id} className="questionlist-question-row">
              <Question
                question={q}
                onStatusChange={handleQuestionStatusChange}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
