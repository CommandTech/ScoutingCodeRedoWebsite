// src/components/ExcelReader.tsx
import React, { useState } from 'react';
import { readExcelFile } from '../utils/readExcel';

const ExcelReader: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const jsonData = await readExcelFile(file);
        setData(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <div>
        {data.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
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
    </div>
  );
};

export default ExcelReader;