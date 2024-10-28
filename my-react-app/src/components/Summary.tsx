import React, { useState, useEffect } from 'react';
import { readCSVFile } from '../utils/readCSV';
import './Summary.css';

const Summary: React.FC = () => {
  const [matchNumbers, setMatchNumbers] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [teamData, setTeamData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/TBASchedule.csv');
        const csvData = await response.text();
        const parsedData = await readCSVFile(new File([csvData], 'TBASchedule.csv', { type: 'text/csv' }));
        console.log('Parsed Data:', parsedData); // Debugging log
        const matchNumbers = parsedData.map((row: any) => row['match_number']); // Accessing by header name
        const uniqueMatchNumbers = Array.from(new Set(matchNumbers)).sort((a, b) => a - b);
        console.log('Unique Match Numbers:', uniqueMatchNumbers); // Debugging log
        setMatchNumbers(uniqueMatchNumbers);
        setTeamData(parsedData);
      } catch (error) {
        console.error('Error reading CSV file:', error);
      }
    };

    fetchData();
  }, []);

  const handleMatchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMatch(event.target.value);
  };

  const selectedTeams = teamData.filter(row => row['match_number'] === selectedMatch);

  return (
    <div>
      <h2>Summary Page</h2>
      <p>This is the summary page.</p>
      <label htmlFor="match-number">Match Number: </label>
      <select id="match-number" onChange={handleMatchChange}>
        <option value="">Select a match</option>
        {matchNumbers.map((number, index) => (
          <option key={index} value={number}>
            {number}
          </option>
        ))}
      </select>
      {selectedTeams.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Red 1</th>
              <th>Red 2</th>
              <th>Red 3</th>
              <th>Blue 1</th>
              <th>Blue 2</th>
              <th>Blue 3</th>
            </tr>
          </thead>
          <tbody>
            {selectedTeams.map((team, index) => (
              <tr key={index}>
                <td>{team['Red1']}</td>
                <td>{team['Red2']}</td>
                <td>{team['Red3']}</td>
                <td>{team['Blue1']}</td>
                <td>{team['Blue2']}</td>
                <td>{team['Blue3']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Summary;