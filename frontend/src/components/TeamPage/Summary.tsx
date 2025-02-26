import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CSS/Summary.css';
import { readCSVFile } from '../../utils/readCSV';

interface SummaryProps {
  selectedTeam: string;
}

const Summary: React.FC<SummaryProps> = ({ selectedTeam }) => {
  const [matchCount, setMatchCount] = useState<number>(0);
  const [minMaxValues, setMinMaxValues] = useState<any>({});
  const [pointScoredData, setPointScoredData] = useState<number[]>([]);
  const [driveStaValues, setDriveStaValues] = useState<string[]>([]);
  const [driveStaAverages, setDriveStaAverages] = useState<{ [key: string]: number }>({});
  const [teamAverages, setTeamAverages] = useState<number[]>([]);
  const [minMaxAverages, setMinMaxAverages] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
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

        setMinMaxValues(minMax);
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

          const teamDataEndAuto = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndAuto');
          const teamDataEndMatch = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndMatch');

          const uniqueMatches = Array.from(new Set(teamDataEndAuto.map((row: any) => row['Match'])));
          setMatchCount(uniqueMatches.length);

          const pointScored = teamDataEndMatch.map((row: any) => parseFloat(row['PointScored'])).filter((value: number) => !isNaN(value));
          setPointScoredData(pointScored);

          const minPointScored = Math.min(...pointScored);
          const maxPointScored = Math.max(...pointScored);
          setMinMaxValues((prevValues: any) => ({
            ...prevValues,
            PointScored: { min: minPointScored, max: maxPointScored }
          }));

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

          const teamAverages = parsedData
            .filter((row: any) => row['RecordType'] === 'EndMatch')
            .reduce((acc: { [key: string]: number[] }, row: any) => {
              const team = row['Team'];
              const points = parseFloat(row['PointScored']);
              if (!isNaN(points)) {
                if (!acc[team]) {
                  acc[team] = [];
                }
                acc[team].push(points);
              }
              return acc;
            }, {});

          const teamAverageValues = Object.values(teamAverages).map((points: number[]) => {
            const sum = points.reduce((acc, value) => acc + value, 0);
            return sum / points.length;
          });

          setTeamAverages(teamAverageValues);

          const minAverage = Math.min(...teamAverageValues);
          const maxAverage = Math.max(...teamAverageValues);
          setMinMaxAverages({ min: minAverage, max: maxAverage });

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

          const teamMatchEvents = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'MatchEvent');
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

  const columns = ['Matches:', ...Array.from({ length: matchCount }, (_, i) => `Match ${i + 1}`), 'Average'];

  const calculateAverage = (data: any[]): number => {
    const numericData = data.map(value => parseFloat(value)).filter(value => !isNaN(value));
    const sum = numericData.reduce((acc, value) => acc + value, 0);
    const average = sum / numericData.length;
    return isNaN(average) ? NaN : average;
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="table-row-bordered">
              {columns.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
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
              <TableCell className="fixed-width">Match Event</TableCell>
              {Object.keys(matchEventCounts).map((event, index) => (
                <TableCell key={index}>{event}</TableCell>
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
    </div>
  );
}

export default Summary;