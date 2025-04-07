import React, { useEffect, useState } from "react";
import SheetHeader from "./SheetHeader";
import AlertPopup from "../AlertPopup/AlertPopup";
import Progress from "./Progress";
import QuestionList from "../QuestionList/QuestionList";
import "./Sheet.css";
import Notes from "../Notes/Notes";
import Header from "../Header/Header";

const Sheet = ({ sheetId }) => {
  const [sheet, setSheet] = useState(null);
  const [progress, setProgress] = useState(null);
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

  const fetchSheetAndProgress = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;
      if (!username) throw new Error("User not logged in");

      const sheetRes = await fetch(
        `http://127.0.0.1:8000/questions/sheets/${sheetId}/`
      );
      if (!sheetRes.ok) throw new Error("Failed to fetch sheet");
      const sheetData = await sheetRes.json();
      setSheet(sheetData);

      const progressRes = await fetch(
        `http://127.0.0.1:8000/questions/progress/${username}/${sheetId}/`
      );
      if (!progressRes.ok) throw new Error("Failed to fetch progress");
      const progressData = await progressRes.json();
      setProgress(progressData);

      const topicsRes = await fetch(
        `http://127.0.0.1:8000/questions/sheets/${sheetId}/topics-with-questions/?email=${user.email}`
      );
      if (!topicsRes.ok) throw new Error("Failed to fetch topics");
      const topicsData = await topicsRes.json();
      setTopics(topicsData);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetAndProgress();
  }, [sheetId]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleStatusChange = ({ isSolved, difficulty }) => {
    if (!progress) return;
    const diffKey = difficulty.toLowerCase();

    setProgress((prev) => ({
      ...prev,
      solved_count: prev.solved_count + (isSolved ? 1 : -1),
      [`solved_${diffKey}`]: prev[`solved_${diffKey}`] + (isSolved ? 1 : -1),
    }));
  };

  return (
    <><Header titleText={sheet?.name}></Header>
    <div className="sheet-wrapper">
      {loading && (
        <AlertPopup type="info" message="Loading sheet and progress..." />
      )}
      {errorMsg && <AlertPopup type="error" message={errorMsg} />}

      {sheet && <SheetHeader sheet={sheet} />}
      {sheet && <div className="sep" />}

      {progress && <Progress progressData={progress} />}
      {progress && <div className="section-separator" />}

      <div className="topics-title">Topics</div>

      <div className="topics-container">
        {topics.map((topic, index) => (
          <div className="questionlist-spacing" key={topic.id}>
            <QuestionList
              topic={topic}
              onStatusChange={handleStatusChange}
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

export default Sheet;
