import React from 'react';

const GridComponent = ({ gridData, onCellClick }) => {
  return (
    <div className="grid-container">
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="grid-cell"
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridComponent;