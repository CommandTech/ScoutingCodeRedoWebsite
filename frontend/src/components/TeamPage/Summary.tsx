import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CSS/Summary.css';
import { readCSVFile } from '../../utils/readCSV';

interface SummaryProps {
  selectedTeam: string;
}

const Summary: React.FC<SummaryProps> = ({ selectedTeam }) => {
  const [matchCount, setMatchCount] = useState<number>(0);
  const [pointScoredData, setPointScoredData] = useState<number[]>([]);
  const [commentsData, setCommentsData] = useState<string[]>([]);
  const [driveStaValues, setDriveStaValues] = useState<string[]>([]);
  const [driveStaAverages, setDriveStaAverages] = useState<{ [key: string]: number }>({});
  const [driveStaCoralAverages, setDriveStaCoralAverages] = useState<{ [key: string]: number }>({});
  const [driveStaAlgaeAverages, setDriveStaAlgaeAverages] = useState<{ [key: string]: number }>({});
  const [matchEventCounts, setMatchEventCounts] = useState<{ [key: string]: number }>({});


  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const response = await fetch('/ExcelCSVFiles/Activities.csv');
        const csvData = await response.text();
        const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

        if (!parsedData || !Array.isArray(parsedData)) {
          throw new Error('Parsed data is not an array or is undefined');
        }

        const columns = ['AcqCoralS', 'AcqCoralF', 'AcqAlgaeR', 'AcqAlgaeF', 'DelCoralL1', 'DelCoralL2', 'DelCoralL3', 'DelCoralL4', 'DelCoralF', 'DelAlgaeP', 'DelAlgaeN', 'DelAlgaeF', 'DisAlgae'];
        const minMax: { [key: string]: { min: number; max: number } } = {};

        columns.forEach(column => {
          const values = parsedData
            .filter((row: any) => row['RecordType'] === 'EndAuto')
            .map((row: any) => parseFloat(row[column]))
            .filter((value: number) => !isNaN(value));

          minMax[column] = {
            min: Math.min(...values),
            max: Math.max(...values)
          };
        });

        // Calculate global min and max for the sum of DelCoralL1, DelCoralL2, DelCoralL3, DelCoralL4
        const coralSums = parsedData
          .filter((row: any) => row['RecordType'] === 'EndMatch')
          .map((row: any) => parseFloat(row['DelCoralL1']) + parseFloat(row['DelCoralL2']) + parseFloat(row['DelCoralL3']) + parseFloat(row['DelCoralL4']))
          .filter((value: number) => !isNaN(value));

        const algaeSums = parsedData
          .filter((row: any) => row['RecordType'] === 'EndMatch')
          .map((row: any) => parseFloat(row['DelAlgaeP']) + parseFloat(row['DelAlgaeN'])).filter((value: number) => !isNaN(value));


        minMax['CoralSum'] = {
          min: Math.min(...coralSums),
          max: Math.max(...coralSums)
        };
        minMax['AlgaeSum'] = {
          min: Math.min(...coralSums),
          max: Math.max(...coralSums)
        };

      } catch (error) {
        console.error('Error fetching global data:', error);
      }
    };

    fetchGlobalData();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (selectedTeam) {
        try {
          const response = await fetch('/ExcelCSVFiles/Activities.csv');
          const csvData = await response.text();
          const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

          if (!parsedData || !Array.isArray(parsedData)) {
            throw new Error('Parsed data is not an array or is undefined');
          }

          const teamDataEndMatch = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndMatch');

          const uniqueMatches = Array.from(new Set(teamDataEndMatch.map((row: any) => row['Match'])));
          setMatchCount(uniqueMatches.length);

          const pointScored = teamDataEndMatch.map((row: any) => parseFloat(row['PointScored'])).filter((value: number) => !isNaN(value));
          setPointScoredData(pointScored);

          const comments = teamDataEndMatch.map((row: any) => row['Comments']);
          setCommentsData(comments);

          const driveSta = Array.from(new Set(parsedData.map((row: any) => row['DriveSta'])))
            .filter(value => ['blue0', 'blue1', 'blue2', 'red0', 'red1', 'red2'].includes(value))
            .sort();
          setDriveStaValues(driveSta);

          const driveStaAvg: { [key: string]: number } = {};
          const driveStaCoralAvg: { [key: string]: number } = {};
          const driveStaAlgaeAvg: { [key: string]: number } = {};
          driveSta.forEach((driveStaValue) => {
            const filteredData = teamDataEndMatch.filter((row: any) => row['DriveSta'] === driveStaValue);
            const avg = filteredData.reduce((acc: number, row: any) => acc + parseFloat(row['PointScored']), 0) / filteredData.length;
            driveStaAvg[driveStaValue] = avg;

            const coralSum = filteredData.reduce((acc: number, row: any) => {
              const coralScore = parseFloat(row['DelCoralL1']) + parseFloat(row['DelCoralL2']) + parseFloat(row['DelCoralL3']) + parseFloat(row['DelCoralL4']);
              return acc + (isNaN(coralScore) ? 0 : coralScore);
            }, 0);
            driveStaCoralAvg[driveStaValue] = coralSum / filteredData.length;

            const algaeSum = filteredData.reduce((acc: number, row: any) => {
              const algaeScore = parseFloat(row['DelAlgaeP']) + parseFloat(row['DelAlgaeN']);
              return acc + (isNaN(algaeScore) ? 0 : algaeScore);
            }, 0);
            driveStaAlgaeAvg[driveStaValue] = algaeSum / filteredData.length;
          });
          setDriveStaAverages(driveStaAvg);
          setDriveStaCoralAverages(driveStaCoralAvg);
          setDriveStaAlgaeAverages(driveStaAlgaeAvg);
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      }
    };

    fetchTeamData();
  }, [selectedTeam]);

  useEffect(() => {
    const fetchMatchEventData = async () => {
      if (selectedTeam) {
        try {
          const response = await fetch('/ExcelCSVFiles/Activities.csv');
          const csvData = await response.text();
          const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

          if (!parsedData || !Array.isArray(parsedData)) {
            throw new Error('Parsed data is not an array or is undefined');
          }

          const teamMatchEvents = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'Match_Event');
          const eventCounts: { [key: string]: number } = {};

          teamMatchEvents.forEach((row: any) => {
            const event = row['Match_event'];
            if (event) {
              eventCounts[event] = (eventCounts[event] || 0) + 1;
            }
          });
          setMatchEventCounts(eventCounts);
        } catch (error) {
          console.error('Error fetching match event data:', error);
        }
      }
    };

    fetchMatchEventData();
  }, [selectedTeam]);

  const columns = ['Matches:', ...Array.from({ length: matchCount }, (_, i) => `Match ${i + 1}`), 'Average', 'Median'];

  const calculateAverage = (data: any[]): number => {
    const numericData = data.map(value => parseFloat(value)).filter(value => !isNaN(value));
    const sum = numericData.reduce((acc, value) => acc + value, 0);
    const average = sum / numericData.length;
    return isNaN(average) ? NaN : parseFloat(average.toFixed(2));
  };

  const calculateMedian = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    return isNaN(median) ? 'N/A' : median.toFixed(2);
  };

  const teamName = selectedTeam.replace('frc', '');
  const imagePath = `/RobotPictures/${teamName}.png`;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="table-row-bordered">
              {columns.map((column, index) => (
                <TableCell key={index} className={commentsData[index - 1] !== 'ControllerScouting' && index > 0 && index < columns.length - 2 ? 'orange-cell' : ''}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className="table-row-bordered">
              <TableCell className="fixed-width">Points Scored</TableCell>
              {pointScoredData.map((point, index) => (
                <TableCell key={index}>
                  {isNaN(point) ? 'NaN' : point}
                </TableCell>
              ))}
              <TableCell>
                {isNaN(calculateAverage(pointScoredData)) ? 'NaN' : calculateAverage(pointScoredData)}
              </TableCell>
              <TableCell>
                {isNaN(parseFloat(calculateMedian(pointScoredData))) ? 'NaN' : calculateMedian(pointScoredData)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div>&nbsp;</div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="table-row-bordered">
              <TableCell className="fixed-width">Drive Station</TableCell>
              {driveStaValues.map((value, index) => (
                <TableCell key={index}>{value}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className="table-row-bordered">
              <TableCell className="fixed-width">Average Points Scored</TableCell>
              {driveStaValues.map((value, index) => (
                <TableCell key={index}>
                  {isNaN(driveStaAverages[value]) ? 'NaN' : driveStaAverages[value]?.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="table-row-bordered">
              <TableCell className="fixed-width">Average Coral Scored</TableCell>
              {driveStaValues.map((value, index) => {
                const numericValue = parseFloat(driveStaCoralAverages[value].toFixed(2));
                let cellClass = '';
                let displayValue = numericValue.toString();
                if (isNaN(numericValue)) {
                  displayValue = 'NaN';
                } else if (numericValue == 0) {
                  cellClass = 'summary black';
                } else if (numericValue >= 1 && numericValue <= 3) {
                  cellClass = 'summary red';
                } else if (numericValue >= 4 && numericValue <= 7) {
                  cellClass = 'summary yellow';
                } else if (numericValue >= 8 && numericValue <= 12) {
                  cellClass = 'summary green';
                } else if (numericValue >= 13) {
                  cellClass = 'summary blue';
                }
                return (
                  <TableCell key={index} className={cellClass}>
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
            <TableRow className="table-row-bordered">
              <TableCell className="fixed-width">Average Algae Scored</TableCell>
              {driveStaValues.map((value, index) => {
                const numericValue = parseFloat(driveStaAlgaeAverages[value].toFixed(2));
                let cellClass = '';
                let displayValue = numericValue.toString();
                if (isNaN(numericValue)) {
                  displayValue = 'NaN';
                } else if (numericValue == 0) {
                  cellClass = 'summary black';
                } else if (numericValue >= 1 && numericValue <= 2) {
                  cellClass = 'summary red';
                } else if (numericValue >= 3 && numericValue <= 4) {
                  cellClass = 'summary yellow';
                } else if (numericValue >= 5 && numericValue <= 6) {
                  cellClass = 'summary green';
                } else if (numericValue >= 7) {
                  cellClass = 'summary blue';
                }
                return (
                  <TableCell key={index} className={cellClass}>
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div>&nbsp;</div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="table-row-bordered">
              <TableCell className="fixed-width" style={{ textAlign: 'center' }}>Match Event</TableCell>
              {Object.keys(matchEventCounts).map((event, index) => (
                <TableCell key={index} style={{ textAlign: 'center' }}>{event}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className="table-row-bordered">
              <TableCell className="fixed-width">Count</TableCell>
              {Object.values(matchEventCounts).map((count, index) => (
                <TableCell key={index}>{count}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div>&nbsp;</div>
      <div>
        <img src={imagePath} alt={`Robot of team ${teamName}`} />
      </div>
      <div>&nbsp;</div>
      {commentsData.map((comment, index) => (
        <div
          key={index}>{comment}
          <div>&nbsp;</div>
        </div>

      ))}
    </div>
  );
}

export default Summary;