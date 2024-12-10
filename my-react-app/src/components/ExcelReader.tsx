// src/components/ExcelReader.tsx
import React, { useState } from 'react';

const BASE_URL = 'http://localhost:3001';
//const BASE_URL = 'http://https://96.236.24.79/:3001';

const ExcelReader: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSheetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSheet(event.target.value);
  };

  const handleFileDownload = () => {
    if (uploadedFile) {
      const link = document.createElement('a');
      // Add your file download logic here
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <select onChange={handleSheetChange}>
        {/* Add your options here */}
      </select>
      <button onClick={handleFileDownload}>Download File</button>
    </div>
  );
};

export default ExcelReader;