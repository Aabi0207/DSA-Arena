// SheetHeader.jsx
import React from 'react';
import './SheetHeader.css';

const SheetHeader = ({ sheet }) => {
    return (
      <div className="sheet-header-container">
        <h1 className="sheet-title">{sheet.name}</h1>
        <p className="sheet-description">{sheet.description}</p>
      </div>
    );
  };

export default SheetHeader;
