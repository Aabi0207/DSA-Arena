import React, { useEffect, useState } from "react";
import SheetHeader from "./SheetHeader";
import AlertPopup from "../AlertPopup/AlertPopup";

const Sheet = ({ sheetId }) => {
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/questions/sheets/${sheetId}/`);
        if (!res.ok) throw new Error("Failed to fetch sheet");
        const data = await res.json();
        setSheet(data);
      } catch (err) {
        setErrorMsg(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchSheet();
  }, [sheetId]);

  // Auto-dismiss error popup
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <>
      {loading && <AlertPopup type="info" message="Loading sheet..." />}
      {errorMsg && <AlertPopup type="error" message={errorMsg} />}
      {sheet && <SheetHeader sheet={sheet} />}
    </>
  );
};

export default Sheet;
