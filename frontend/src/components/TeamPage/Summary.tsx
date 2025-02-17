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
          driveSta.forEach((driveStaValue) => {
            const filteredData = teamDataEndMatch.filter((row: any) => row['DriveSta'] === driveStaValue);
            const avg = filteredData.reduce((acc: number, row: any) => acc + parseFloat(row['PointScored']), 0) / filteredData.length;
            driveStaAvg[driveStaValue] = avg;
          });
          setDriveStaAverages(driveStaAvg);

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

  const columns = ['Matches:', ...Array.from({ length: matchCount }, (_, i) => `Match ${i + 1}`), 'Average'];

  const getBackgroundColor = (value: number, max: number, min: number) => {
    const ratio = (value - min) / (max - min);
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
  };

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
            <TableRow>
              <TableCell className="fixed-width">Points Scored</TableCell>
              {pointScoredData.map((point, index) => (
                <TableCell
                  key={index}
                  style={{
                    backgroundColor: minMaxValues['PointScored']
                      ? getBackgroundColor(point, minMaxValues['PointScored'].max, minMaxValues['PointScored'].min)
                      : 'transparent'
                  }}
                >
                  {isNaN(point) ? 'NaN' : point}
                </TableCell>
              ))}
              <TableCell
                style={{
                  backgroundColor: minMaxValues['PointScored']
                    ? getBackgroundColor(calculateAverage(pointScoredData), minMaxAverages.max, minMaxAverages.min)
                    : 'transparent'
                }}
              >
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
            <TableRow>
              <TableCell className="fixed-width">Average Points Scored</TableCell>
              {driveStaValues.map((value, index) => (
                <TableCell
                  key={index}
                  style={{
                    backgroundColor: minMaxValues['PointScored']
                      ? getBackgroundColor(driveStaAverages[value], minMaxValues['PointScored'].max, minMaxValues['PointScored'].min)
                      : 'transparent'
                  }}
                >
                  {isNaN(driveStaAverages[value]) ? 'NaN' : driveStaAverages[value]?.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Summary;