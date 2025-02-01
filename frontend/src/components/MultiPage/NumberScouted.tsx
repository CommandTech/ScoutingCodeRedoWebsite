import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface NumberScoutedProps {
  teamNumber: string;
}

const NumberScouted: React.FC<NumberScoutedProps> = ({ teamNumber }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get('/ExcelCSVFiles/Activities.csv');
        const csvData = response.data;
        const rows = csvData.split('\n').slice(1); // Skip header row
        const filteredRows = rows.filter((row: string) => {
          const columns = row.split(',');
          return columns[1] === 'frc'+ teamNumber && columns[4] === 'EndMatch';
        });
        setCount(filteredRows.length);
        console.log(`Number of times team ${teamNumber} was scouted: ${filteredRows.length}`);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchCount();
  }, [teamNumber]);

  return (
    <div>
      {count}
    </div>
  );
};

export default NumberScouted;