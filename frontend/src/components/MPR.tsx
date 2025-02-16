import React, { useEffect, useState } from 'react';
import OneTeamReport from './MPRPage/OneTeamReport';
import { readCSVFile } from '../utils/readCSV';
import { calculateDifferences, calculateClimbTimes, calculateCoralCounts } from '../utils/reportingFunctions';
import './CSS/MPR.css';

const MPR = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedColor, setSelectedColor] = useState('All');
  const [teamNumbers, setTeamNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [coralStats, setCoralStats] = useState({
    minCoralCount: 0,
    maxCoralCount: 0,
    minCoralL4Difference: 0,
    maxCoralL4Difference: 0,
    maxCoralL3Difference: 0,
    minCoralL3Difference: 0,
    maxCoralL2Difference: 0,
    minCoralL2Difference: 0,
    maxCoralL1Difference: 0,
    minCoralL1Difference: 0,
    maxCoralFDifference: 0,
    minCoralFDifference: 0,
    maxAlgaeNDifference: 0,
    minAlgaeNDifference: 0,
    maxAlgaePDifference: 0,
    minAlgaePDifference: 0,
    maxAlgaeFDifference: 0,
    minAlgaeFDifference: 0,
  });
  const [climbTimes, setClimbTimes] = useState<{ [key: string]: { min: number, max: number } }>({});
  const [colorArray, setColorArray] = useState<number[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/ExcelCSVFiles/Activities.csv');
        const csvData = await response.text();
        const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

        if (!parsedData || !Array.isArray(parsedData)) {
          throw new Error('Parsed data is not an array or is undefined');
        }

        const matchNumbers = Array.from(new Set(parsedData.map((row: any) => row['Match']).filter(Boolean)));
        setTeams(matchNumbers);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    setSelectedColor('All');
  }, []);

  const handleTeamChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchNumber = event.target.value;
    setSelectedMatch(matchNumber);

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

        const coralL4Differences = calculateDifferences(teamNumbers, parsedData, 'DelCoralL4');
        const maxCoralL4Difference = Math.max(...coralL4Differences.map(diff => diff[0]));
        const minCoralL4Difference = Math.min(...coralL4Differences.map(diff => diff[1]));

        const coralL3Differences = calculateDifferences(teamNumbers, parsedData, 'DelCoralL3');
        const maxCoralL3Difference = Math.max(...coralL3Differences.map(diff => diff[0]));
        const minCoralL3Difference = Math.min(...coralL3Differences.map(diff => diff[1]));

        const coralL2Differences = calculateDifferences(teamNumbers, parsedData, 'DelCoralL2');
        const maxCoralL2Difference = Math.max(...coralL2Differences.map(diff => diff[0]));
        const minCoralL2Difference = Math.min(...coralL2Differences.map(diff => diff[1]));

        const coralL1Differences = calculateDifferences(teamNumbers, parsedData, 'DelCoralL1');
        const maxCoralL1Difference = Math.max(...coralL1Differences.map(diff => diff[0]));
        const minCoralL1Difference = Math.min(...coralL1Differences.map(diff => diff[1]));

        const coralFDifferences = calculateDifferences(teamNumbers, parsedData, 'DelCoralF');
        const maxCoralFDifference = Math.max(...coralFDifferences.map(diff => diff[0]));
        const minCoralFDifference = Math.min(...coralFDifferences.map(diff => diff[1]));

        const algaeNDifferences = calculateDifferences(teamNumbers, parsedData, 'DelAlgaeN');
        const maxAlgaeNDifference = Math.max(...algaeNDifferences.map(diff => diff[0]));
        const minAlgaeNDifference = Math.min(...algaeNDifferences.map(diff => diff[1]));

        const algaePDifferences = calculateDifferences(teamNumbers, parsedData, 'DelAlgaeP');
        const maxAlgaePDifference = Math.max(...algaePDifferences.map(diff => diff[0]));
        const minAlgaePDifference = Math.min(...algaePDifferences.map(diff => diff[1]));

        const algaeFDifferences = calculateDifferences(teamNumbers, parsedData, 'DelAlgaeF');
        const maxAlgaeFDifference = Math.max(...algaeFDifferences.map(diff => diff[0]));
        const minAlgaeFDifference = Math.min(...algaeFDifferences.map(diff => diff[1]));

        const { maxCoralCount, minCoralCount } = calculateCoralCounts(teamNumbers, parsedData);

        setCoralStats({
          maxCoralCount,
          minCoralCount,
          maxCoralL4Difference,
          minCoralL4Difference,
          maxCoralL3Difference,
          minCoralL3Difference,
          maxCoralL2Difference,
          minCoralL2Difference,
          maxCoralL1Difference,
          minCoralL1Difference,
          maxCoralFDifference,
          minCoralFDifference,
          maxAlgaeNDifference,
          minAlgaeNDifference,
          maxAlgaePDifference,
          minAlgaePDifference,
          maxAlgaeFDifference,
          minAlgaeFDifference,
        });

        const climbTimes = calculateClimbTimes(teamNumbers, parsedData);
        setClimbTimes(climbTimes);

        setColorArray([maxCoralCount, minCoralCount, maxCoralL4Difference, minCoralL4Difference, maxCoralL3Difference, minCoralL3Difference,
          maxCoralL2Difference, minCoralL2Difference, maxCoralL1Difference, minCoralL1Difference, maxCoralFDifference, minCoralFDifference, maxAlgaeNDifference, minAlgaeNDifference,
          maxAlgaePDifference, minAlgaePDifference, maxAlgaeFDifference, minAlgaeFDifference, climbTimes['Deep']['max'], climbTimes['Deep']['min'],
          climbTimes['Shallow']['max'], climbTimes['Shallow']['min'], climbTimes['Park']['max'], climbTimes['Park']['min'], climbTimes['Elsewhere']['max'], climbTimes['Elsewhere']['min']]);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(event.target.value);
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
              <OneTeamReport color="Blue" robotNumber={teamNumbers[0]} colorValues={colorArray} />
              <OneTeamReport color="Blue" robotNumber={teamNumbers[1]} colorValues={colorArray} />
              <OneTeamReport color="Blue" robotNumber={teamNumbers[2]} colorValues={colorArray} />
            </div>
            <div className="report-column">
              <OneTeamReport color="Red" robotNumber={teamNumbers[3]} colorValues={colorArray} />
              <OneTeamReport color="Red" robotNumber={teamNumbers[4]} colorValues={colorArray} />
              <OneTeamReport color="Red" robotNumber={teamNumbers[5]} colorValues={colorArray} />
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