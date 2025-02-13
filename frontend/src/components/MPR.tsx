import React, { useEffect, useState } from 'react';
import OneTeamReport from './MPRPage/OneTeamReport';
import { readCSVFile } from '../utils/readCSV';
import './CSS/MPR.css';

const MPR = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedColor, setSelectedColor] = useState('All');
  const [tabIndex, setTabIndex] = useState(0);
  const [teamNumbers, setTeamNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [coralCounts, setCoralCounts] = useState<number[][]>([[], [], [], [], [], []]);
  const [minCoralCount, setMinCoralCount] = useState<number>(0);
  const [maxCoralCount, setMaxCoralCount] = useState<number>(0);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/ExcelCSVFiles/Activities.csv');
        const csvData = await response.text();
        const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

        if (!parsedData || !Array.isArray(parsedData)) {
          throw new Error('Parsed data is not an array or is undefined');
        }

        const matchNumbers = parsedData.map((row: any) => row['Match']).filter(Boolean);

        // Remove duplicates using a Set
        const uniqueMatchNumbers = Array.from(new Set(matchNumbers));

        setTeams(uniqueMatchNumbers);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    // Set the initial selected color
    setSelectedColor('All');
  }, []);

  const handleTeamChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchNumber = event.target.value;
    setSelectedMatch(matchNumber);

    if (matchNumber) {
      try {
        const response = await fetch('/ExcelCSVFiles/Activities.csv');
        const csvData = await response.text();
        const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

        if (!parsedData || !Array.isArray(parsedData)) {
          throw new Error('Parsed data is not an array or is undefined');
        }

        const matchData = parsedData.filter((row: any) => row['Match'] === matchNumber);
        if (matchData.length > 0) {
          const teamNumbers = [
            'blue0',
            'blue1',
            'blue2',
            'red0',
            'red1',
            'red2',
          ].map((driveSta: string) => {
            const teamData = matchData.find((row: any) => row['DriveSta'] === driveSta);
            return teamData ? teamData['Team'] : '';
          });
          console.log('teamNumbers:', teamNumbers);
          setTeamNumbers(teamNumbers);

          const coralCounts = teamNumbers.map((teamNumber) => {
            const teamData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
            console.log(teamData);
            return teamData.map((row: any) =>
              parseInt(row.DelCoralL1) + parseInt(row.DelCoralL2) + parseInt(row.DelCoralL3) + parseInt(row.DelCoralL4)
            );
          });

          const allCoralCounts = coralCounts.flat();
          setMinCoralCount(Math.min(...allCoralCounts));
          setMaxCoralCount(Math.max(...allCoralCounts));
          setCoralCounts(coralCounts);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <select className="select-spacing" onChange={handleTeamChange} value={selectedMatch}>
        <option value="">Match Number</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>
            {team}
          </option>
        ))}
      </select>

      <select className="select-spacing" onChange={handleColorChange} value={selectedColor}>
        <option value="All">All</option>
        <option value="Red">Red</option>
        <option value="Blue">Blue</option>
      </select>
      <div>
        {selectedColor === 'All' ? (
          <div className="report-container">
            <div className="report-column">
              <OneTeamReport color="Blue" robotNumber={teamNumbers[0]} coralCounts={coralCounts[0]} minCoralCount={minCoralCount} maxCoralCount={maxCoralCount} />
              <OneTeamReport color="Blue" robotNumber={teamNumbers[1]} coralCounts={coralCounts[1]} minCoralCount={minCoralCount} maxCoralCount={maxCoralCount} />
              <OneTeamReport color="Blue" robotNumber={teamNumbers[2]} coralCounts={coralCounts[2]} minCoralCount={minCoralCount} maxCoralCount={maxCoralCount} />
            </div>
            <div className="report-column">
              <OneTeamReport color="Red" robotNumber={teamNumbers[3]} coralCounts={coralCounts[3]} minCoralCount={minCoralCount} maxCoralCount={maxCoralCount} />
              <OneTeamReport color="Red" robotNumber={teamNumbers[4]} coralCounts={coralCounts[4]} minCoralCount={minCoralCount} maxCoralCount={maxCoralCount} />
              <OneTeamReport color="Red" robotNumber={teamNumbers[5]} coralCounts={coralCounts[5]} minCoralCount={minCoralCount} maxCoralCount={maxCoralCount} />
            </div>
          </div>
        ) : (
          <>
            hi
          </>
        )}
      </div>
    </div>
  );
};

export default MPR;