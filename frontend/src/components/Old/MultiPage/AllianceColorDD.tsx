import React, { useState } from 'react';
import './CSS/AllianceColorDD.css';

interface AllianceColorDDProps {
  onColorChange: (color: string) => void;
}

const AllianceColorDD: React.FC<AllianceColorDDProps> = ({ onColorChange }) => {
  const [color, setColor] = useState('red');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColor = event.target.value;
    setColor(selectedColor);
    onColorChange(selectedColor);
  };

  return (
    <div>
      <label htmlFor="alliance-color">Alliance Color: </label>
      <select
        id="alliance-color"
        value={color}
        onChange={handleChange}
        className={color === 'red' ? 'red-background' : color === 'blue' ? 'blue-background' : 'white-background'}
      >
        <option value="red" className="white-background">Red</option>
        <option value="blue" className="white-background">Blue</option>
      </select>
    </div>
  );
};

export default AllianceColorDD;