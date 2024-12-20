import React, { useState, useEffect } from 'react';
import { readExcelFile } from '../utils/readExcel';

const ExcelReader: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [serverIp, setServerIp] = useState<string>('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:3001/config');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const config = await response.json();
          setServerIp(config.server_ip);
        } else {
          const text = await response.text();
          console.error('Unexpected response format:', text);
          console.error('Response URL:', response.url);
          console.error('Response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${serverIp}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const sheetsData = await readExcelFile(file);
          setData(sheetsData);
          setSelectedSheet(Object.keys(sheetsData)[0]);
        } else {
          console.error('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleSheetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSheet(event.target.value);
  };

  const handleFileDownload = () => {
    if (uploadedFile) {
      const link = document.createElement('a');
      link.href = `${serverIp}/${uploadedFile.name}`;
      link.download = uploadedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {data && Object.keys(data).length > 0 && (
        <div>
          <select onChange={handleSheetChange} value={selectedSheet || ''}>
            {data && Object.keys(data).map((sheetName) => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
          <button onClick={handleFileDownload}>Download Data</button>
          {selectedSheet && data[selectedSheet] && (
            <table>
              <thead>
                <tr>
                  {data[selectedSheet] && data[selectedSheet][0] && Object.keys(data[selectedSheet][0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data[selectedSheet] && data[selectedSheet].map((row, index) => (
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