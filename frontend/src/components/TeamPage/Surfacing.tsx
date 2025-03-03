import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CSS/Surfacing.css';
import { readCSVFile } from '../../utils/readCSV';
import GraphsInterface from '../Graphs/GraphsInterface';

interface SurfacingProps {
    selectedTeam: string;
}

const Surfacing: React.FC<SurfacingProps> = ({ selectedTeam }) => {
    const [climbStates, setClimbStates] = useState<string[]>([]);
    const [climbTimes, setClimbTimes] = useState<string[]>([]);
    const [selectedCages, setSelectedCages] = useState<string[]>([]);
    const [matchCount, setMatchCount] = useState<number>(0);
    const [defenseCounts, setDefenseCounts] = useState<number[]>([]);
    const [averageDZTimes, setAverageDZTimes] = useState<number[]>([]);
    const [teamData, setTeamData] = useState<any[]>([]);
    const [strategyCounts, setStrategyCounts] = useState<{ [key: string]: number }>({});
    const [commentsData, setCommentsData] = useState<string[]>([]);

    const [Chart1, setSelectedChart1] = useState<string>('PointsPerMatch');
    const [Chart2, setSelectedChart2] = useState<string>('PointsPerMatch');
    const [Chart3, setSelectedChart3] = useState<string>('PointsPerMatch');

    const chartOptions = [
        { value: 'PointsPerMatch', label: 'Points Per Match' },
        { value: 'SurfacingPointsPerMatch', label: 'Surfacing Points Per Match' },
        { value: 'CageAttempt', label: 'Cage Attempt' },
        { value: 'EndState', label: 'End State' },
        { value: 'ClimbSuccess', label: 'Climb Success' }
    ];

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const response = await fetch('/ExcelCSVFiles/Activities.csv');
                const csvData = await response.text();
                const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

                if (!parsedData || !Array.isArray(parsedData)) {
                    throw new Error('Parsed data is not an array or is undefined');
                }
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

                    const teamData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndMatch');

                    const commentsData = teamData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => row.Comments);
                    setCommentsData(commentsData);

                    const states = teamData.map((row: any) => row['EndState']);
                    const times = teamData.map((row: any) => parseFloat(row['ClimbT']).toFixed(2));
                    const cages = teamData.map((row: any) => row['SelectedCage']);
                    const uniqueMatches = Array.from(new Set(teamData.map((row: any) => row['Match'])));
                    const defenseCounts = uniqueMatches.map(match =>
                        parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'Defense' && row['Match'] === match).length
                    );

                    const averageDZTimes = uniqueMatches.map(match => {
                        const matchData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['Match'] === match);
                        const dzTimeSum = matchData.reduce((sum: number, row: any) => {
                            const dzTime = parseFloat(row['DZTime']);
                            return sum + (isNaN(dzTime) ? 0 : dzTime);
                        }, 0);
                        const defenseCount = defenseCounts[uniqueMatches.indexOf(match)];
                        return defenseCount > 0 ? (dzTimeSum / defenseCount).toFixed(2) : '0';
                    });

                    const strategyCounts = teamData.reduce((acc: { [key: string]: number }, row: any) => {
                        const strategy = row['Strategy'];
                        if (strategy) {
                            acc[strategy] = (acc[strategy] || 0) + 1;
                        }
                        return acc;
                    }, {});

                    setClimbStates(states);
                    setClimbTimes(times);
                    setSelectedCages(cages);
                    setMatchCount(uniqueMatches.length);
                    setDefenseCounts(defenseCounts);
                    setAverageDZTimes(averageDZTimes.map(time => parseFloat(time)));
                    setTeamData(teamData);
                    setStrategyCounts(strategyCounts);
                } catch (error) {
                    console.error('Error fetching team data:', error);
                }
            }
        };

        fetchTeamData();
    }, [selectedTeam]);

    const columns = ['Matches:', ...Array.from({ length: matchCount }, (_, i) => `Match ${i + 1}`)];

    const handleChange1 = (event: SelectChangeEvent<string>) => {
        setSelectedChart1(event.target.value as string);
    };

    const handleChange2 = (event: SelectChangeEvent<string>) => {
        setSelectedChart2(event.target.value as string);
    };

    const handleChange3 = (event: SelectChangeEvent<string>) => {
        setSelectedChart3(event.target.value as string);
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow className="table-row-bordered">
                            {columns.map((column, index) => (
                                <TableCell key={index} className={commentsData[index-1] !== 'ControllerScouting' && index > 0 ? 'orange-cell' : ''}>
                                    {column}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow className="table-row-bordered">
                            <TableCell>Selected Cage</TableCell>
                            {selectedCages.map((cage, index) => (
                                <TableCell key={index}>{cage}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Climb State</TableCell>
                            {climbStates.map((state, index) => {
                                let cellClass = '';
                                if (state == 'Elsewhere') {
                                    cellClass = 'mpr black';
                                } else if (state == '') {
                                    cellClass = 'mpr red';
                                } else if (state == 'Park') {
                                    cellClass = 'mpr yellow';
                                } else if (state == 'Shallow') {
                                    cellClass = 'mpr green';
                                } else if (state == 'Deep') {
                                    cellClass = 'mpr blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {state}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        <TableRow className="table-row-bordered" style={{ borderBottom: '4px solid black' }}>
                            <TableCell>Climb Time</TableCell>
                            {climbTimes.map((time, index) => {
                                return (
                                    <TableCell key={index}>
                                        {time}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Defense Count</TableCell>
                            {defenseCounts.map((count, index) => (
                                <TableCell key={index}>{count}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered" style={{ borderBottom: '4px solid black' }}>
                            <TableCell>Average Defense/Cross</TableCell>
                            {averageDZTimes.map((avgTime, index) => (
                                <TableCell key={index}>{avgTime}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Defense</TableCell>
                            {teamData.map((row, index) => (
                                <TableCell key={index}>{row['Defense']}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Defense Value</TableCell>
                            {teamData.map((row, index) => (
                                <TableCell key={index}>{row['DefenseValue']}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Avoidance</TableCell>
                            {teamData.map((row, index) => (
                                <TableCell key={index}>{row['Avoidance']}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Strategy Count</TableCell>
                            {Object.entries(strategyCounts).map(([strategy, count], index) => (
                                <TableCell key={index} colSpan={Math.ceil(columns.length / Object.entries(strategyCounts).length - 1)}>
                                    {`${strategy}: ${count}`}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div>&nbsp;</div>
            <FormControl variant="outlined" style={{ marginBottom: '20px', minWidth: 120 }}>
                <InputLabel id="demo-simple-select-outlined-label">Selected Chart</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={Chart1}
                    onChange={handleChange1}
                    label="Select Value"
                >
                    {chartOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                <GraphsInterface chart={Chart1} selectedTeam={selectedTeam} />
            </FormControl>
            <FormControl variant="outlined" style={{ marginBottom: '20px', minWidth: 120 }}>
                <InputLabel id="demo-simple-select-outlined-label">Selected Chart</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={Chart2}
                    onChange={handleChange2}
                    label="Select Value"
                >
                    {chartOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}                </Select>
                <GraphsInterface chart={Chart2} selectedTeam={selectedTeam} />
            </FormControl>
            <FormControl variant="outlined" style={{ marginBottom: '20px', minWidth: 120 }}>
                <InputLabel id="demo-simple-select-outlined-label">Selected Chart</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={Chart3}
                    onChange={handleChange3}
                    label="Select Value"
                >
                    {chartOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}                </Select>
                <GraphsInterface chart={Chart3} selectedTeam={selectedTeam} />
            </FormControl>
        </div>
    );
}

export default Surfacing;