import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, Paper } from '@mui/material';
import './CSS/TeamList.css';

const TeamList = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [teamAverageAutoPoints, setTeamAverageAutoPoints] = useState<{ [key: string]: number }>({});
    const [teamAverageAlgaePoints, setTeamAverageAlgaePoints] = useState<{ [key: string]: number }>({});
    const [teamAverageCoralPoints, setTeamAverageCoralPoints] = useState<{ [key: string]: number }>({});
    const [teamAverageSurfacingPoints, setTeamAverageSurfacingPoints] = useState<{ [key: string]: number }>({});
    const [teamAveragePoints, setTeamAveragePoints] = useState<{ [key: string]: number }>({});
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<'team' | 'avgAutoPoints' | 'avgAlgaePoints' | 'avgCoralPoints' | 'avgSurfacingPoints' | 'avgPoints'>('team');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/ExcelCSVFiles/Activities.csv');
                const text = await response.text();
                const rows = text.split('\n').slice(1); // Skip header row
                const teamAutoPoints: { [key: string]: number[] } = {};
                const teamAlgaePoints: { [key: string]: number[] } = {};
                const teamCoralPoints: { [key: string]: number[] } = {};
                const autoCoral: number[] = [0, 0, 0, 0];
                const teamSurfacingPoints: { [key: string]: number[] } = {};
                const teamPointsPoints: { [key: string]: number[] } = {};

                rows.forEach(row => {
                    const [id, team, match, time, recordType, mode, driveSta, defense, defenseValue, avoidance, scouterName, scouterError, matchEvent, strategy, coop, dzTime, delNearFar, acqAlgaeNearFar, acqCoralNearFar, startingLoc, leave, acqCoralS, acqCoralF, acqAlgaeR, acqAlgaeF, delCoralL1, delCoralL2, delCoralL3, delCoralL4, delCoralF, delAlgaeP, delAlgaeN, delAlgaeF, climbT, endState, cageAttempt, selectedCage, pointScored] = row.split(',');

                    if (recordType === 'EndAuto') {
                        const coralPoints = (parseInt(delCoralL1) * 3) + (parseInt(delCoralL2) * 4) + (parseInt(delCoralL3) * 6) + (parseInt(delCoralL4) * 7);
                        for (let i = 0; i < 4; i++) {
                            autoCoral[i] = parseInt(eval(`delCoralL${i + 1}`));
                        }

                        if (!teamCoralPoints[team]) {
                            teamCoralPoints[team] = [];
                        }
                        teamCoralPoints[team].push(coralPoints);

                        const autoPoints = parseInt(pointScored, 10);
                        if (!teamAutoPoints[team]) {
                            teamAutoPoints[team] = [];
                        }
                        teamAutoPoints[team].push(autoPoints);
                    }

                    if (recordType === 'EndMatch') {
                        

                        const algaePoints = (parseInt(delAlgaeP) * 6) + (parseInt(delAlgaeN) * 4);
                        if (!teamAlgaePoints[team]) {
                            teamAlgaePoints[team] = [];
                        }
                        teamAlgaePoints[team].push(algaePoints);

                        const coralPoints =
                            ((parseInt(delCoralL1) - autoCoral[0]) * 2) +
                            ((parseInt(delCoralL2) - autoCoral[1]) * 3) +
                            ((parseInt(delCoralL3) - autoCoral[2]) * 4) +
                            ((parseInt(delCoralL4) - autoCoral[3]) * 5);

                        if (!teamCoralPoints[team]) {
                            teamCoralPoints[team] = [];
                        }
                        teamCoralPoints[team].push(coralPoints);

                        let surfacingPoints = 0;
                        switch (endState) {
                            case 'Park':
                                surfacingPoints = 2;
                                break;
                            case 'Elsewhere':
                                surfacingPoints = 0;
                                break;
                            case 'Deep':
                                surfacingPoints = 12;
                                break;
                            case 'Shallow':
                                surfacingPoints = 6;
                                break;
                            default:
                                surfacingPoints = 0;
                                break;
                        }
                        if (!teamSurfacingPoints[team]) {
                            teamSurfacingPoints[team] = [];
                        }
                        teamSurfacingPoints[team].push(surfacingPoints);

                        const teamPoints = parseInt(pointScored);
                        if (!teamPointsPoints[team]) {
                            teamPointsPoints[team] = [];
                        }
                        teamPointsPoints[team].push(teamPoints);
                    }
                });

                const teamAverageAutoPoints: { [key: string]: number } = {};
                for (const team in teamAutoPoints) {
                    const totalAutoPoints = teamAutoPoints[team].reduce((sum, points) => sum + points, 0);
                    teamAverageAutoPoints[team] = totalAutoPoints / teamAutoPoints[team].length;
                }

                const teamAverageAlgaePoints: { [key: string]: number } = {};
                for (const team in teamAlgaePoints) {
                    const totalAlgaePoints = teamAlgaePoints[team].reduce((sum, points) => sum + points, 0);
                    teamAverageAlgaePoints[team] = totalAlgaePoints / teamAlgaePoints[team].length;
                }

                const teamAverageCoralPoints: { [key: string]: number } = {};
                for (const team in teamCoralPoints) {
                    const totalCoralPoints = teamCoralPoints[team].reduce((sum, points) => sum + points, 0);
                    teamAverageCoralPoints[team] = totalCoralPoints / teamCoralPoints[team].length;
                }

                const teamAverageSurfacingPoints: { [key: string]: number } = {};
                for (const team in teamSurfacingPoints) {
                    const totalSurfacingPoints = teamSurfacingPoints[team].reduce((sum, points) => sum + points, 0);
                    teamAverageSurfacingPoints[team] = totalSurfacingPoints / teamSurfacingPoints[team].length;
                }

                const teamAveragePoints: { [key: string]: number } = {};
                for (const team in teamPointsPoints) {
                    const totalPoints = teamPointsPoints[team].reduce((sum, points) => sum + points, 0);
                    teamAveragePoints[team] = totalPoints / teamPointsPoints[team].length;
                }

                setTeams(Object.keys(teamAverageAutoPoints));
                setTeamAverageAutoPoints(teamAverageAutoPoints);
                setTeamAverageAlgaePoints(teamAverageAlgaePoints);
                setTeamAverageCoralPoints(teamAverageCoralPoints);
                setTeamAverageSurfacingPoints(teamAverageSurfacingPoints);
                setTeamAveragePoints(teamAveragePoints);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

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