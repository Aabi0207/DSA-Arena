import React, { useEffect, useState } from "react";
import SheetHeader from "./SheetHeader";
import AlertPopup from "../AlertPopup/AlertPopup";
import Progress from "./Progress";
import QuestionList from "../QuestionList/QuestionList";
import './Sheet.css'; // Make sure this contains the required layout classes

const Sheet = ({ sheetId }) => {
  const [sheet, setSheet] = useState(null);
  const [progress, setProgress] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSheetAndProgress = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;
      if (!username) throw new Error("User not logged in");

      const sheetRes = await fetch(`http://127.0.0.1:8000/questions/sheets/${sheetId}/`);
      if (!sheetRes.ok) throw new Error("Failed to fetch sheet");
      const sheetData = await sheetRes.json();
      setSheet(sheetData);

      const progressRes = await fetch(`http://127.0.0.1:8000/questions/progress/${username}/${sheetId}/`);
      if (!progressRes.ok) throw new Error("Failed to fetch progress");
      const progressData = await progressRes.json();
      setProgress(progressData);

      const topicsRes = await fetch(`http://127.0.0.1:8000/questions/sheets/${sheetId}/topics-with-questions/`);
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

  return (
    <div className="sheet-wrapper">
      {loading && <AlertPopup type="info" message="Loading sheet and progress..." />}
      {errorMsg && <AlertPopup type="error" message={errorMsg} />}

      {sheet && <SheetHeader sheet={sheet} />}
      {sheet && <div className="sep" />}

      {progress && <Progress progressData={progress} />}
      {progress && <div className="section-separator" />}

      <div className="topics-container">
        {topics.map((topic, index) => (
          <div className="questionlist-spacing" key={topic.id}>
            <QuestionList topic={topic} keep_open={index === 0} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sheet;
