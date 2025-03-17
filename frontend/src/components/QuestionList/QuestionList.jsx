import React, { useState, useEffect } from 'react';
import './QuestionList.css';
import Question from '../Question/Question';
import { ChevronRight, ChevronDown } from 'lucide-react';

const QuestionList = ({ topic, keep_open = false }) => {
  const [isOpen, setIsOpen] = useState(keep_open);
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    const count = topic.questions.filter(q => q.is_solved).length;
    setSolvedCount(count);
  }, [topic.questions]);

  const allSolved = solvedCount === topic.questions.length;
  const highlight = allSolved || isOpen;

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
              ({solvedCount}/{topic.questions.length})
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="questionlist-body">
          {topic.questions.map((q) => (
            <div key={q.id} className="questionlist-question-row">
              <Question question={q} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
