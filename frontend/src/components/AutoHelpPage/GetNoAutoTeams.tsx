import React, { useEffect, useState } from 'react';
import { readCSVFile } from '../../utils/readCSV';

const GetNoAutoTeams = () => {
  const [teams, setTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch('/ExcelCSVFiles/Activities.csv');
        const csvBlob = await response.blob();
        const csvFile = new File([csvBlob], 'Activities.csv');
        const results = await readCSVFile(csvFile);

        console.log('CSV Rows:', results); // Log the rows to check the structure

        const teamLeaveMap: { [key: string]: boolean } = {};

        results.forEach((row: any) => {
          const team = row.Team?.replace('frc', '');
          if (team) {
            if (!teamLeaveMap[team]) {
              teamLeaveMap[team] = row.Leave === 'Y';
            } else {
              teamLeaveMap[team] = teamLeaveMap[team] || row.Leave === 'Y';
            }
          }
        });

        const filteredTeams = Object.keys(teamLeaveMap)
          .filter((team) => !teamLeaveMap[team])
          .map((team) => `frc${team}`);

        setTeams(filteredTeams);
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchCSVData();
  }, []);

  return (
    <div>
      <h2>Teams that have never left:</h2>
      <ul>
        {teams.map((team, index) => (
          <li key={index}>{team}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetNoAutoTeams;