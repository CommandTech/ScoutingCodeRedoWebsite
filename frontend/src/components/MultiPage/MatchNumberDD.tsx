import React, { useState, useEffect } from 'react';
import { readCSVFile } from '../../utils/readCSV';

interface MatchNumberDDProps {
  onMatchChange: (match: string) => void;
}

const MatchNumberDD: React.FC<MatchNumberDDProps> = ({ onMatchChange }) => {
  const [matchOptions, setMatchOptions] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/ExcelCSVFiles/Activities.csv');
      if (!response.ok) {
        console.error('Failed to fetch the CSV file');
        return;
      }
      const csvData = await response.text();
      const data = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));
      const matches = data.map((row: any) => row.Match).filter((match: string | undefined) => match && match.trim() !== '');
      const uniqueMatches = Array.from(new Set(matches)).sort((a, b) => Number(a) - Number(b));
      
      setMatchOptions(uniqueMatches);
      if (uniqueMatches.length > 0) {
        const defaultMatch = uniqueMatches[uniqueMatches.length - 1];
        setSelectedMatch(defaultMatch);
        onMatchChange(defaultMatch);
      }
    };

    fetchData();
  }, [onMatchChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const match = e.target.value;
    setSelectedMatch(match);
    onMatchChange(match);
  };

  return (
    <div>
      <label htmlFor="match-select">Match Number: </label>
      <select id="match-select" value={selectedMatch} onChange={handleChange}>
        {matchOptions.map((match, index) => (
          <option key={index} value={match}>
            {match}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MatchNumberDD;