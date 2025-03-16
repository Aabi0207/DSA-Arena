import React, { useEffect, useState } from "react";
import SheetHeader from "./SheetHeader";
import AlertPopup from "../AlertPopup/AlertPopup";
import Progress from "./Progress";

const Sheet = ({ sheetId }) => {
  const [sheet, setSheet] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSheetAndProgress = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;
      if (!username) throw new Error("User not logged in");

      // Fetch Sheet
      const sheetRes = await fetch(`http://127.0.0.1:8000/questions/sheets/${sheetId}/`);
      if (!sheetRes.ok) throw new Error("Failed to fetch sheet");
      const sheetData = await sheetRes.json();
      setSheet(sheetData);

      // Fetch Progress
      const progressRes = await fetch(`http://127.0.0.1:8000/questions/progress/${username}/${sheetId}/`);
      if (!progressRes.ok) throw new Error("Failed to fetch progress");
      const progressData = await progressRes.json();
      setProgress(progressData);

    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetAndProgress();
  }, [sheetId]);

  // Auto-dismiss error popup
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <div style={{display: "flex", flexDirection: 'column'}}>
      {loading && <AlertPopup type="info" message="Loading sheet and progress..." />}
      {errorMsg && <AlertPopup type="error" message={errorMsg} />}
      {sheet && <SheetHeader sheet={sheet} />}
      {progress && <Progress progressData={progress} />}
    </div>
  );
};

export default Sheet;
