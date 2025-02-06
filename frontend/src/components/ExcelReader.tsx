import React, { useState, useEffect } from 'react';
import { readExcelFile } from '../utils/readExcel';

const ExcelReader: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ServerIP, setServerIP] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config');
        console.log('response:', response);
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const config = await response.json();
          setServerIP(config.ServerIP);
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
    event.preventDefault(); // Prevent default form submission behavior
    const file = event.target.files?.[0];
    if (file) {
      // Clear previous file and data
      setUploadedFile(null);
      setData({});
      setSelectedSheet(null);
  
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch(`${ServerIP}/upload`, {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const sheetsData = await readExcelFile(file);
          setData(sheetsData);
          setSelectedSheet(Object.keys(sheetsData)[0]);
          setUploadedFile(file);
        } else {
          console.error('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
};

export default ExcelReader;