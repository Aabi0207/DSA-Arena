import React, { useEffect, useState } from "react";
import AlertPopup from "../AlertPopup/AlertPopup";
import QuestionList from "../QuestionList/QuestionList";
import Notes from "../Notes/Notes";
import Header from "../Header/Header";
import "./SavedSheet.css"; // Reusing same styles for layout consistency

const SavedSheet = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showNotes, setShowNotes] = useState(false);
  const [noteQuestionId, setNoteQuestionId] = useState(null);
  const [noteEmail, setNoteEmail] = useState(null);

  const handleNotesOpen = (questionId, email) => {
    setNoteQuestionId(questionId);
    setNoteEmail(email);
    setShowNotes(true);
  };

  const handleNotesClose = () => {
    setShowNotes(false);
    setNoteQuestionId(null);
    setNoteEmail(null);
  };

  const fetchSavedQuestions = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
      if (!email) throw new Error("User not logged in");

      const res = await fetch(`http://127.0.0.1:8000/questions/saved/?email=${email}`);
      if (!res.ok) throw new Error("Failed to fetch saved questions");

      const data = await res.json();
      setTopics(data);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedQuestions();
  }, []);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <>
      <Header titleText={`${JSON.parse(localStorage.getItem("user"))?.username}'s Saved Questions`} />
      <div className="sheet-wrapper">
        {loading && <AlertPopup type="info" message="Loading saved questions..." />}
        {errorMsg && <AlertPopup type="error" message={errorMsg} />}

        <div className="topics-container">
          {topics.map((topic) => (
            <div className="questionlist-spacing" key={topic.name}>
              <QuestionList
                topic={topic}
                isSavedView={true}
                onNotesClick={handleNotesOpen}
              />
            </div>
          ))}
        </div>

        {showNotes && (
          <Notes
            questionId={noteQuestionId}
            email={noteEmail}
            onClose={handleNotesClose}
          />
        )}
      </div>
    </>
  );
};

export default SavedSheet;
