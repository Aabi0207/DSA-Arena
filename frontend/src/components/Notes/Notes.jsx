// src/components/Notes/Notes.jsx
import React, { useState, useEffect, useRef } from "react";
import AlertPopup from "../AlertPopup/AlertPopup";
import "./Notes.css";
import { Trash2 } from "lucide-react";

const Notes = ({ email, questionId, onClose }) => {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const popupRef = useRef();
  const inputRef = useRef();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:8000/questions/notes/?email=${email}&question_id=${questionId}`
      );
      const data = await res.json();
      setNotes(data.reverse() || []);
    } catch (err) {
      setAlertMessage("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/questions/notes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          question_id: questionId,
          content: noteText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes((prev) => [...prev, data]);
        setNoteText("");
        setAlertMessage("Note added");
      } else {
        setAlertMessage("Failed to add note");
      }
    } catch (err) {
      setAlertMessage("Error while adding note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/questions/notes/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, note_id: noteId }),
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
        setAlertMessage("Note deleted");
      } else {
        setAlertMessage("Failed to delete note");
      }
    } catch (err) {
      setAlertMessage("Error while deleting note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  // Autofocus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddNote();
  };

  return (
    <div className="notes-popup-overlay">
      {loading && (
        <AlertPopup
          message="Loading notes..."
          type="info"
          onClose={() => setAlertMessage("")}
        />
      )}
      {alertMessage && (
        <AlertPopup
          message={alertMessage}
          type="info"
          onClose={() => setAlertMessage("")}
        />
      )}
      <div className="notes-popup-box" ref={popupRef}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="notes-title">Notes</h2>
        <div className="note-input-section">
          <input
            ref={inputRef}
            type="text"
            value={noteText}
            placeholder="Write your note..."
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAddNote}>Add</button>
        </div>
        <ul className="notes-list">
          {notes.length > 0 ? (
            notes.map((note) => (
              <li key={note.id} className="note-item">
                <span className="note-content">• {note.content}</span>
                <Trash2
                  className="trash-icon"
                  size={16}
                  onClick={() => handleDeleteNote(note.id)}
                />
              </li>
            ))
          ) : (
            <p className="no-notes-text">No notes yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notes;
