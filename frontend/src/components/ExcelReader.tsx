import React, { useState, useEffect } from 'react';
import { readExcelFile } from '../utils/readExcel';

const ExcelReader: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ServerIP, setServerIP] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureNumber, setPictureNumber] = useState<string>(''); 

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
      setSuccessMessage(null); // Clear previous success message

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
          const successText = await response.text();
          setSuccessMessage(successText); // Set success message from server response
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

  const handlePictureUpload = async () => {
    if (pictureFile) {
      const formData = new FormData();
      formData.append('file', pictureFile);
      formData.append('number', pictureNumber);

      try {
        const response = await fetch(`${ServerIP}/uploadPicture`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const successText = await response.text();
          setSuccessMessage(successText); // Set success message from server response
        } else {
          console.error('Error uploading picture');
        }
      } catch (error) {
        console.error('Error uploading picture:', error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {loading && <p>Loading...</p>}
      {successMessage && <p>{successMessage}</p>}
      <div>&nbsp;</div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPictureFile(e.target.files?.[0] || null)}
        />
        <input
          type="text"
          placeholder="Enter picture number"
          value={pictureNumber}
          onChange={(e) => setPictureNumber(e.target.value)}
        />
        <button onClick={handlePictureUpload}>Upload Robot Pictures</button>
      </div>
    </div>
  );
};

export default ExcelReader;