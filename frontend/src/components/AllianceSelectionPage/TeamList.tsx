import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, Paper } from '@mui/material';
import { fetchTeams } from '../../utils/fetchTeams';
import './CSS/TeamList.css';

interface TeamListProps {
  selectedTeams: string[];
}

const TeamList: React.FC<TeamListProps> = ({ selectedTeams }) => {
  const [teams, setTeams] = useState<string[]>([]);
  const [teamAverageAutoPoints, setTeamAverageAutoPoints] = useState<{ [key: string]: number }>({});
  const [teamAverageAlgaePoints, setTeamAverageAlgaePoints] = useState<{ [key: string]: number }>({});
  const [teamAverageCoralPoints, setTeamAverageCoralPoints] = useState<{ [key: string]: number }>({});
  const [teamAverageSurfacingPoints, setTeamAverageSurfacingPoints] = useState<{ [key: string]: number }>({});
  const [teamAveragePoints, setTeamAveragePoints] = useState<{ [key: string]: number }>({});
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<'team' | 'avgAutoPoints' | 'avgAlgaePoints' | 'avgCoralPoints' | 'avgSurfacingPoints' | 'avgPoints'>('team');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams(selectedTeams);
        setTeams(data.teams);
        setTeamAverageAutoPoints(data.teamAverageAutoPoints);
        setTeamAverageAlgaePoints(data.teamAverageAlgaePoints);
        setTeamAverageCoralPoints(data.teamAverageCoralPoints);
        setTeamAverageSurfacingPoints(data.teamAverageSurfacingPoints);
        setTeamAveragePoints(data.teamAveragePoints);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();
  }, [selectedTeams]);

  const handleSort = (property: 'team' | 'avgAutoPoints' | 'avgAlgaePoints' | 'avgCoralPoints' | 'avgSurfacingPoints' | 'avgPoints') => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedTeams = [...teams].sort((a, b) => {
      if (property === 'team') {
        const teamA = parseInt(a.replace('frc', ''), 10);
        const teamB = parseInt(b.replace('frc', ''), 10);
        return isAsc ? teamA - teamB : teamB - teamA;
      } else {
        let avgA, avgB;
        switch (property) {
          case 'avgAutoPoints':
            avgA = teamAverageAutoPoints[a] || 0;
            avgB = teamAverageAutoPoints[b] || 0;
            break;
          case 'avgAlgaePoints':
            avgA = teamAverageAlgaePoints[a] || 0;
            avgB = teamAverageAlgaePoints[b] || 0;
            break;
          case 'avgCoralPoints':
            avgA = teamAverageCoralPoints[a] || 0;
            avgB = teamAverageCoralPoints[b] || 0;
            break;
          case 'avgSurfacingPoints':
            avgA = teamAverageSurfacingPoints[a] || 0;
            avgB = teamAverageSurfacingPoints[b] || 0;
            break;
          case 'avgPoints':
            avgA = teamAveragePoints[a] || 0;
            avgB = teamAveragePoints[b] || 0;
            break;
          default:
            avgA = 0;
            avgB = 0;
        }
        return isAsc ? avgA - avgB : avgB - avgA;
      }
    });

    setTeams(sortedTeams);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === 'team' ? order : false}>
              <TableSortLabel
                active={orderBy === 'team'}
                direction={orderBy === 'team' ? order : 'asc'}
                onClick={() => handleSort('team')}
              >
                Team
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'avgPoints' ? order : false}>
              <TableSortLabel
                active={orderBy === 'avgPoints'}
                direction={orderBy === 'avgPoints' ? order : 'asc'}
                onClick={() => handleSort('avgPoints')}
              >
                Avg: Auto Points
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'avgAlgaePoints' ? order : false}>
              <TableSortLabel
                active={orderBy === 'avgAlgaePoints'}
                direction={orderBy === 'avgAlgaePoints' ? order : 'asc'}
                onClick={() => handleSort('avgAlgaePoints')}
              >
                Avg: Algae Points
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'avgCoralPoints' ? order : false}>
              <TableSortLabel
                active={orderBy === 'avgCoralPoints'}
                direction={orderBy === 'avgCoralPoints' ? order : 'asc'}
                onClick={() => handleSort('avgCoralPoints')}
              >
                Avg: Coral Points
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'avgSurfacingPoints' ? order : false}>
              <TableSortLabel
                active={orderBy === 'avgSurfacingPoints'}
                direction={orderBy === 'avgSurfacingPoints' ? order : 'asc'}
                onClick={() => handleSort('avgSurfacingPoints')}
              >
                Avg: Surfacing Points
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'avgPoints' ? order : false}>
              <TableSortLabel
                active={orderBy === 'avgPoints'}
                direction={orderBy === 'avgPoints' ? order : 'asc'}
                onClick={() => handleSort('avgPoints')}
              >
                Avg: Overall
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell>{team}</TableCell>
              <TableCell>{teamAverageAutoPoints[team]?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell>{teamAverageAlgaePoints[team]?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell>{teamAverageCoralPoints[team]?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell>{teamAverageSurfacingPoints[team]?.toFixed(2) || 'N/A'}</TableCell>
              <TableCell>{teamAveragePoints[team]?.toFixed(2) || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamList;