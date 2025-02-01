import React, { useEffect, useState } from 'react';
import { readCSVFile } from '../../utils/readCSV';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import './CSS/TeamList.css';

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [teamAveragePoints, setTeamAveragePoints] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/ExcelCSVFiles/Activities.csv');
        const csvData = await response.text();
        const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

        if (!parsedData || !Array.isArray(parsedData)) {
          throw new Error('Parsed data is not an array or is undefined');
        }

        const teamNames = [...new Set(parsedData.map((row: any) => row['Team']).filter(Boolean))];
        setTeams(teamNames);

        const endAutoRows = parsedData.filter((row: any) => row['RecordType'] === 'EndAuto');
        const teamPoints: { [key: string]: number[] } = {};

        endAutoRows.forEach((row: any) => {
          const team = row['Team'];
          const points = parseFloat(row['PointScored']);
          if (!teamPoints[team]) {
            teamPoints[team] = [];
          }
          teamPoints[team].push(points);
        });

        const teamAveragePoints: { [key: string]: number } = {};
        for (const team in teamPoints) {
          const totalPoints = teamPoints[team].reduce((sum, points) => sum + points, 0);
          teamAveragePoints[team] = totalPoints / teamPoints[team].length;
        }

        setTeamAveragePoints(teamAveragePoints);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleSort = () => {
    const isAsc = order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    const sortedTeams = [...teams]
      .map(team => parseInt(team.replace('frc', ''), 10)) // Remove 'frc' and convert to number
      .sort((a, b) => isAsc ? a - b : b - a) // Sort numbers
      .map(num => `frc${num}`); // Add 'frc' back
    setTeams(sortedTeams);
  };
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={order}>
              <TableSortLabel
                active={true}
                direction={order}
                onClick={handleSort}
              >
                Team
              </TableSortLabel>
            </TableCell>
            <TableCell>
              Avg: Auto Points
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell>{team}</TableCell>
              <TableCell>{teamAveragePoints[team]?.toFixed(2) || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamList;