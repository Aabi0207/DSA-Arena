import React from "react";
import { Pencil } from "lucide-react";
import "./EditIconButton.css";

const EditIconButton = ({ onClick }) => {
  return (
    <button className="edit-icon-button" onClick={onClick}>
      <Pencil size={18} strokeWidth={2.5} className="edit-icon" />
    </button>
  );
};

export default EditIconButton;
