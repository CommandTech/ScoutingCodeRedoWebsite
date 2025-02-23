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
    const [globalMaxShallowTime, setGlobalMaxShallowTime] = useState<number>(0);
    const [globalMinShallowTime, setGlobalMinShallowTime] = useState<number>(0);
    const [globalMaxDeepTime, setGlobalMaxDeepTime] = useState<number>(0);
    const [globalMinDeepTime, setGlobalMinDeepTime] = useState<number>(0);
    const [averageDZTimes, setAverageDZTimes] = useState<number[]>([]);
    const [teamData, setTeamData] = useState<any[]>([]);
    const [strategyCounts, setStrategyCounts] = useState<{ [key: string]: number }>({});

    const [Chart1, setSelectedChart1] = useState<string>('PointsPerMatch');
    const [Chart2, setSelectedChart2] = useState<string>('PointsPerMatch');
    const [Chart3, setSelectedChart3] = useState<string>('PointsPerMatch');

    const chartOptions = [
        { value: 'PointsPerMatch', label: 'Points Per Match' },
        { value: 'SurfacingPointsPerMatch', label: 'Surfacing Points Per Match' },
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

                const shallowTimes = parsedData
                    .filter((row: any) => row['EndState'] === 'Shallow')
                    .map((row: any) => parseFloat(row['ClimbT']));

                const deepTimes = parsedData
                    .filter((row: any) => row['EndState'] === 'Deep')
                    .map((row: any) => parseFloat(row['ClimbT']));

                setGlobalMaxShallowTime(Math.max(...shallowTimes));
                setGlobalMinShallowTime(Math.min(...shallowTimes));
                setGlobalMaxDeepTime(Math.max(...deepTimes));
                setGlobalMinDeepTime(Math.min(...deepTimes));
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
                    const states = teamData.map((row: any) => row['EndState']);
                    const times = teamData.map((row: any) => parseFloat(row['ClimbT']).toFixed(2));
                    const cages = teamData.map((row: any) => row['SelectedCage']);
                    const uniqueMatches = Array.from(new Set(teamData.map((row: any) => row['Match'])));
                    const defenseCounts = uniqueMatches.map(match =>
                        parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'Defense' && row['Match'] === match).length
                    );

                    const averageDZTimes = uniqueMatches.map(match => {
                        const matchData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['Match'] === match);
                        const dzTimeSum = matchData.reduce((sum: number, row: any) => sum + parseFloat(row['DZTime']), 0);
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

    const getBackgroundColor = (value: number, max: number, min: number) => {
        const ratio = (value - min) / (max - min);
        const red = Math.round(255 * (1 - ratio));
        const green = Math.round(255 * ratio);
        return `rgb(${red}, ${green}, 0)`;
    };

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
                                <TableCell key={index}>{column}</TableCell>
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
                            {climbStates.map((state, index) => (
                                <TableCell key={index}>{state}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered" style={{ borderBottom: '4px solid black' }}>
                            <TableCell>Climb Time</TableCell>
                            {climbTimes.map((time, index) => {
                                const state = climbStates[index];
                                const timeValue = parseFloat(time);
                                let backgroundColor = 'transparent';

                                if (state === 'Park' || state === 'Elsewhere') {
                                    backgroundColor = timeValue > 0 ? 'red' : '#00ff00';
                                } else if (state === 'Shallow') {
                                    backgroundColor = getBackgroundColor(timeValue, globalMinShallowTime, globalMaxShallowTime);
                                } else if (state === 'Deep') {
                                    backgroundColor = getBackgroundColor(timeValue, globalMinDeepTime, globalMaxDeepTime);
                                }

                                return (
                                    <TableCell key={index} style={{ backgroundColor }}>
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