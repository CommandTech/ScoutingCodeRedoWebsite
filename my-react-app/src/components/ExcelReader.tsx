// src/components/ExcelReader.tsx
import React, { useState } from 'react';
import { readExcelFile } from '../utils/readExcel';

const ExcelReader: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const sheetsData = await readExcelFile(file);
        setData(sheetsData);
        setSelectedSheet(Object.keys(sheetsData)[0]); // Select the first sheet by default
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    }
  };

  const handleSheetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSheet(event.target.value);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {Object.keys(data).length > 0 && (
        <div>
          <select onChange={handleSheetChange} value={selectedSheet || ''}>
            {Object.keys(data).map((sheetName) => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
          {selectedSheet && data[selectedSheet] && (
            <table>
              <thead>
                <tr>
                  {Object.keys(data[selectedSheet][0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data[selectedSheet].map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx}>{value as React.ReactNode}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelReader;