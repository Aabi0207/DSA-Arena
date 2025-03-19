// SheetHeader.jsx
import React from 'react';
import './SheetHeader.css';

const SheetHeader = ({ sheet }) => {
    return (
      <div className="sheet-header-container">
        <p className="sheet-description">{sheet.description}</p>
      </div>
    );
};

export default SheetHeader;
