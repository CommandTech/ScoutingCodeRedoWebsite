import React, { useEffect, useState } from 'react';
import OneTeamReport from './MPRPage/OneTeamReport';
import { readCSVFile } from '../utils/readCSV';
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
  });
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
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      }

      const teamNumbers = ['blue0', 'blue1', 'blue2', 'red0', 'red1', 'red2'].map((driveSta: string) => {
        const teamData = parsedData.find((row: any) => row['DriveSta'] === driveSta);
        return teamData ? teamData['Team'] : '';
      });
      setTeamNumbers(teamNumbers);

      const coralCounts = teamNumbers.map((teamNumber) => {
        const teamData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        return teamData.map((row: any) =>
          parseInt(row.DelCoralL1) + parseInt(row.DelCoralL2) + parseInt(row.DelCoralL3) + parseInt(row.DelCoralL4)
        );
      });

      const allCoralCounts = coralCounts.flat().filter((count) => !isNaN(count));
      const maxCoralCount = Math.max(...allCoralCounts);
      const minCoralCount = Math.min(...allCoralCounts);

      const coralL4Differences = teamNumbers.map((teamNumber) => {
        const endAutoData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        const endMatchData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndMatch');

        const endAutoDelCoralL4Values = endAutoData.map((row: any) => parseInt(row.DelCoralL4)).filter((value) => !isNaN(value));
        const endMatchDelCoralL4Values = endMatchData.map((row: any) => parseInt(row.DelCoralL4)).filter((value) => !isNaN(value));
        const maxEndMatchDelCoralL4 = endMatchDelCoralL4Values.length > 0 ? Math.max(...endMatchDelCoralL4Values) : 0;
        const minEndAutoDelCoralL4 = endAutoDelCoralL4Values.length > 0 ? Math.min(...endAutoDelCoralL4Values) : 0;

        return [maxEndMatchDelCoralL4, minEndAutoDelCoralL4];
      });

      const maxCoralL4Difference = Math.max(...coralL4Differences.map(diff => diff[0]));
      const minCoralL4Difference = Math.min(...coralL4Differences.map(diff => diff[1]));

      const coralL3Differences = teamNumbers.map((teamNumber) => {
        const endAutoData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        const endMatchData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndMatch');

        const endAutoDelCoralL3Values = endAutoData.map((row: any) => parseInt(row.DelCoralL3)).filter((value) => !isNaN(value));
        const endMatchDelCoralL3Values = endMatchData.map((row: any) => parseInt(row.DelCoralL3)).filter((value) => !isNaN(value));
        const maxEndMatchDelCoralL3 = endMatchDelCoralL3Values.length > 0 ? Math.max(...endMatchDelCoralL3Values) : 0;
        const minEndAutoDelCoralL3 = endAutoDelCoralL3Values.length > 0 ? Math.min(...endAutoDelCoralL3Values) : 0;

        return [maxEndMatchDelCoralL3, minEndAutoDelCoralL3];
      });

      const maxCoralL3Difference = Math.max(...coralL3Differences.map(diff => diff[0]));
      const minCoralL3Difference = Math.min(...coralL3Differences.map(diff => diff[1]));

      const coralL2Differences = teamNumbers.map((teamNumber) => {
        const endAutoData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        const endMatchData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndMatch');

        const endAutoDelCoralL2Values = endAutoData.map((row: any) => parseInt(row.DelCoralL2)).filter((value) => !isNaN(value));
        const endMatchDelCoralL2Values = endMatchData.map((row: any) => parseInt(row.DelCoralL2)).filter((value) => !isNaN(value));
        const maxEndMatchDelCoralL2 = endMatchDelCoralL2Values.length > 0 ? Math.max(...endMatchDelCoralL2Values) : 0;
        const minEndAutoDelCoralL2 = endAutoDelCoralL2Values.length > 0 ? Math.min(...endAutoDelCoralL2Values) : 0;

        return [maxEndMatchDelCoralL2, minEndAutoDelCoralL2];
      });

      const maxCoralL2Difference = Math.max(...coralL2Differences.map(diff => diff[0]));
      const minCoralL2Difference = Math.min(...coralL2Differences.map(diff => diff[1]));

      const coralL1Differences = teamNumbers.map((teamNumber) => {
        const endAutoData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        const endMatchData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndMatch');
      
        const endAutoDelCoralL1Values = endAutoData.map((row: any) => parseInt(row.DelCoralL1)).filter((value) => !isNaN(value));
        const endMatchDelCoralL1Values = endMatchData.map((row: any) => parseInt(row.DelCoralL1)).filter((value) => !isNaN(value));
        const maxEndMatchDelCoralL1 = endMatchDelCoralL1Values.length > 0 ? Math.max(...endMatchDelCoralL1Values) : 0;
        const minEndAutoDelCoralL1 = endAutoDelCoralL1Values.length > 0 ? Math.min(...endAutoDelCoralL1Values) : 0;
      
        return [maxEndMatchDelCoralL1, minEndAutoDelCoralL1];
      });
      
      const maxCoralL1Difference = Math.max(...coralL1Differences.map(diff => diff[0]));
      const minCoralL1Difference = Math.min(...coralL1Differences.map(diff => diff[1]));
  
      const coralFDifferences = teamNumbers.map((teamNumber) => {
        const endAutoData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        const endMatchData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndMatch');
      
        const endAutoDelCoralFValues = endAutoData.map((row: any) => parseInt(row.DelCoralF)).filter((value) => !isNaN(value));
        const endMatchDelCoralFValues = endMatchData.map((row: any) => parseInt(row.DelCoralF)).filter((value) => !isNaN(value));
        const maxEndMatchDelCoralF = endMatchDelCoralFValues.length > 0 ? Math.max(...endMatchDelCoralFValues) : 0;
        const minEndAutoDelCoralF = endAutoDelCoralFValues.length > 0 ? Math.min(...endAutoDelCoralFValues) : 0;
      
        return [maxEndMatchDelCoralF, minEndAutoDelCoralF];
      });
      
      const maxCoralFDifference = Math.max(...coralFDifferences.map(diff => diff[0]));
      const minCoralFDifference = Math.min(...coralFDifferences.map(diff => diff[1]));
  

      setCoralStats({
        maxCoralCount,
        minCoralCount,
        maxCoralL4Difference,
        minCoralL4Difference,
        maxCoralL3Difference,
        minCoralL3Difference,
        maxCoralL2Difference,
        minCoralL2Difference,
        minCoralL1Difference,
        maxCoralL1Difference,
        minCoralFDifference,
        maxCoralFDifference,
      });

      setColorArray([maxCoralCount, minCoralCount, maxCoralL4Difference, minCoralL4Difference, maxCoralL3Difference, minCoralL3Difference, maxCoralL2Difference, minCoralL2Difference, maxCoralL1Difference, minCoralL1Difference, maxCoralFDifference, minCoralFDifference]);
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