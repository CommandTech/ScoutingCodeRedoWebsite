import React, { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, Paper } from '@mui/material';

const TeamList = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [teamAveragePoints, setTeamAveragePoints] = useState<{ [key: string]: number }>({});
    const [teamAverageAlgaePoints, setTeamAverageAlgaePoints] = useState<{ [key: string]: number }>({});
    const [teamAverageCoralPoints, setTeamAverageCoralPoints] = useState<{ [key: string]: number }>({});
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<'team' | 'avgPoints' | 'avgAlgaePoints' | 'avgCoralPoints'>('team');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/ExcelCSVFiles/Activities.csv');
                const text = await response.text();
                const rows = text.split('\n').slice(1); // Skip header row
                const teamPoints: { [key: string]: number[] } = {};
                const teamAlgaePoints: { [key: string]: number[] } = {};
                const teamCoralPoints: { [key: string]: number[] } = {};
                const autoCoral: number[] = [0, 0, 0, 0];

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
                    }

                    if (recordType === 'EndMatch') {
                        const autoPoints = parseInt(pointScored, 10);
                        if (!teamPoints[team]) {
                            teamPoints[team] = [];
                        }
                        teamPoints[team].push(autoPoints);

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
                    }
                });

                const teamAveragePoints: { [key: string]: number } = {};
                for (const team in teamPoints) {
                    const totalPoints = teamPoints[team].reduce((sum, points) => sum + points, 0);
                    teamAveragePoints[team] = totalPoints / teamPoints[team].length;
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

                setTeams(Object.keys(teamAveragePoints));
                setTeamAveragePoints(teamAveragePoints);
                setTeamAverageAlgaePoints(teamAverageAlgaePoints);
                setTeamAverageCoralPoints(teamAverageCoralPoints);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    const handleSort = (property: 'team' | 'avgPoints' | 'avgAlgaePoints'| 'avgCoralPoints') => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        const sortedTeams = [...teams].sort((a, b) => {
            if (property === 'team') {
                const teamA = parseInt(a.replace('frc', ''), 10);
                const teamB = parseInt(b.replace('frc', ''), 10);
                return isAsc ? teamA - teamB : teamB - teamA;
            } else {
                const avgA = property === 'avgPoints' ? teamAveragePoints[a] || 0 : teamAverageAlgaePoints[a] || 0;
                const avgB = property === 'avgPoints' ? teamAveragePoints[b] || 0 : teamAverageAlgaePoints[b] || 0;
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teams.map((team, index) => (
                        <TableRow key={index}>
                            <TableCell>{team}</TableCell>
                            <TableCell>{teamAveragePoints[team]?.toFixed(2) || 'N/A'}</TableCell>
                            <TableCell>{teamAverageAlgaePoints[team]?.toFixed(2) || 'N/A'}</TableCell>
                            <TableCell>{teamAverageCoralPoints[team]?.toFixed(2) || 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TeamList;