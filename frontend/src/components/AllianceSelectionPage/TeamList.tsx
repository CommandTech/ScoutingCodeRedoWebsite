import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, Paper } from '@mui/material';
import Cookies from 'js-cookie'; // Import js-cookie
import { fetchTeams } from '../../utils/fetchTeams';
import './CSS/TeamList.css';

interface TeamListProps {
  allTeams: string[];
  selectedTeams: string[];
}

const TeamList: React.FC<TeamListProps> = ({ allTeams, selectedTeams }) => {
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
        saveToCookies(data); // Save data to cookies
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();
  }, [selectedTeams]);

  const saveToCookies = (data: any) => {
    Cookies.set('teamList', JSON.stringify(data), { expires: 7 });
  };

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

  const getBackgroundColor = (value: number, min: number, max: number) => {
    if (value === max) return 'green';
    if (value === min) return 'red';
    const mid = (min + max) / 2;
    if (value === mid) return 'yellow';
  
    if (value > mid) {
      const ratio = (value - mid) / (max - mid);
      const green = 255;
      const red = Math.round(255 * (1 - ratio));
      return `rgb(${red},255,0)`;
    } else {
      const ratio = (value - min) / (mid - min);
      const green = Math.round(255 * ratio);
      return `rgb(255,${green},0)`;
    }
  };
  
  const getMinMax = (points: { [key: string]: number }) => {
    const values = Object.values(points);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };
  const autoPointsMinMax = getMinMax(teamAverageAutoPoints);
  const algaePointsMinMax = getMinMax(teamAverageAlgaePoints);
  const coralPointsMinMax = getMinMax(teamAverageCoralPoints);
  const surfacingPointsMinMax = getMinMax(teamAverageSurfacingPoints);
  const overallPointsMinMax = getMinMax(teamAveragePoints);

  const filteredTeams = teams.filter(team => !selectedTeams.includes(team));

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
            <TableCell sortDirection={orderBy === 'avgAutoPoints' ? order : false}>
              <TableSortLabel
                active={orderBy === 'avgAutoPoints'}
                direction={orderBy === 'avgAutoPoints' ? order : 'asc'}
                onClick={() => handleSort('avgAutoPoints')}
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
          {filteredTeams.map((team, index) => (
            <TableRow key={index}>
              <TableCell>{team}</TableCell>
              <TableCell style={{ backgroundColor: getBackgroundColor(teamAverageAutoPoints[team], autoPointsMinMax.min, autoPointsMinMax.max) }}>
                {teamAverageAutoPoints[team]?.toFixed(2) || 'N/A'}
              </TableCell>
              <TableCell style={{ backgroundColor: getBackgroundColor(teamAverageAlgaePoints[team], algaePointsMinMax.min, algaePointsMinMax.max) }}>
                {teamAverageAlgaePoints[team]?.toFixed(2) || 'N/A'}
              </TableCell>
              <TableCell style={{ backgroundColor: getBackgroundColor(teamAverageCoralPoints[team], coralPointsMinMax.min, coralPointsMinMax.max) }}>
                {teamAverageCoralPoints[team]?.toFixed(2) || 'N/A'}
              </TableCell>
              <TableCell style={{ backgroundColor: getBackgroundColor(teamAverageSurfacingPoints[team], surfacingPointsMinMax.min, surfacingPointsMinMax.max) }}>
                {teamAverageSurfacingPoints[team]?.toFixed(2) || 'N/A'}
              </TableCell>
              <TableCell style={{ backgroundColor: getBackgroundColor(teamAveragePoints[team], overallPointsMinMax.min, overallPointsMinMax.max) }}>
                {teamAveragePoints[team]?.toFixed(2) || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeamList;