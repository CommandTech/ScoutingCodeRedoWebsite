import React, { useEffect, useState } from 'react';
import './CSS/OneTeamReport.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl } from '@mui/material';
import { readCSVFile } from '../../utils/readCSV';
import GraphsInterface from '../Graphs/GraphsInterface';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface OneTeamReportProps {
    color: string;
    robotNumber: string;
    chart: string;
    graphStatus: boolean;
}

const OneTeamReport: React.FC<OneTeamReportProps> = ({ color, robotNumber, chart, graphStatus }) => {
    const [startingLocations, setStartingLocations] = useState<string[]>([]);
    const [leaveLocations, setLeaveLocations] = useState<string[]>([]);
    const [filteredCoralCounts, setFilteredCoralCounts] = useState<number[]>([]);
    const [delCoralL4Diffs, setDelCoralL4Diffs] = useState<number[]>([]);
    const [delCoralL3Diffs, setDelCoralL3Diffs] = useState<number[]>([]);
    const [delCoralL2Diffs, setDelCoralL2Diffs] = useState<number[]>([]);
    const [delCoralL1Diffs, setDelCoralL1Diffs] = useState<number[]>([]);
    const [delCoralFDiffs, setDelCoralFDiffs] = useState<number[]>([]);
    const [delAlgaeNDiffs, setDelAlgaeNDiffs] = useState<number[]>([]);
    const [delAlgaePDiffs, setDelAlgaePDiffs] = useState<number[]>([]);
    const [climbStates, setClimbStates] = useState<string[]>([]);
    const [climbTimes, setClimbTimes] = useState<number[]>([]);
    const [recordTypes, setRecordTypes] = useState<string[]>([]);
    const [comments, setComments] = useState<string[]>([]);
    const [config, setConfig] = useState({ baseURL: '', apiKey: ''});
    const [nickname, setNickname] = useState<string>('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('/config');
                setConfig(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchConfig();
    }, []);

    useEffect(() => {
        const fetchNickname = async () => {
            try {
                const response = await axios.get(`${config.baseURL}team/${robotNumber}/simple?X-TBA-Auth-Key=${config.apiKey}`);
                setNickname(response.data.nickname);
            } catch (error) {
                console.error('Error fetching team nickname', error);
            }
        };

        if (config.baseURL && config.apiKey) {
            fetchNickname();
        }
    }, [config, robotNumber]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/ExcelCSVFiles/Activities.csv');
            const csvData = await response.text();
            const file = new File([csvData], 'Activities.csv', { type: 'text/csv' });
            const data = await readCSVFile(file);
            const filteredData = data.filter((row: any) => row.Team === robotNumber);

            const startingLocs = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => row.Starting_Loc);
            const leaveLocs = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => row.Leave);
            setStartingLocations(startingLocs);
            setLeaveLocations(leaveLocs);

            const filteredCoral = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) =>
                parseInt(row.DelCoralL1) + parseInt(row.DelCoralL2) + parseInt(row.DelCoralL3) + parseInt(row.DelCoralL4)
            );
            setFilteredCoralCounts(filteredCoral);

            const delCoralL4Auto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelCoralL4));
            const delCoralL4Match = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelCoralL4));
            const delCoralL4Diff = delCoralL4Match.map((value, index) => value - delCoralL4Auto[index]);
            setDelCoralL4Diffs(delCoralL4Diff);

            const delCoralL3Auto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelCoralL3));
            const delCoralL3Match = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelCoralL3));
            const delCoralL3Diff = delCoralL3Match.map((value, index) => value - delCoralL3Auto[index]);
            setDelCoralL3Diffs(delCoralL3Diff);

            const delCoralL2Auto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelCoralL2));
            const delCoralL2Match = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelCoralL2));
            const delCoralL2Diff = delCoralL2Match.map((value, index) => value - delCoralL2Auto[index]);
            setDelCoralL2Diffs(delCoralL2Diff);

            const delCoralL1Auto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelCoralL1));
            const delCoralL1Match = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelCoralL1));
            const delCoralL1Diff = delCoralL1Match.map((value, index) => value - delCoralL1Auto[index]);
            setDelCoralL1Diffs(delCoralL1Diff);

            const delCoralFAuto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelCoralF));
            const delCoralFMatch = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelCoralF));
            const delCoralFDiff = delCoralFMatch.map((value, index) => value - delCoralFAuto[index]);
            setDelCoralFDiffs(delCoralFDiff);

            const delAlgaeNAuto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelAlgaeN));
            const delAlgaeNMatch = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelAlgaeN));
            const delAlgaeNDiff = delAlgaeNMatch.map((value, index) => value - delAlgaeNAuto[index]);
            setDelAlgaeNDiffs(delAlgaeNDiff);

            const delAlgaePAuto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelAlgaeP));
            const delAlgaePMatch = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelAlgaeP));
            const delAlgaePDiff = delAlgaePMatch.map((value, index) => value - delAlgaePAuto[index]);
            setDelAlgaePDiffs(delAlgaePDiff);

            const climbStatesData = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => row.EndState);
            setClimbStates(climbStatesData);

            const climbTimesData = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseFloat(row.ClimbT));
            setClimbTimes(climbTimesData.map(time => parseFloat(time.toFixed(2))));

            const recordTypesData = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => row.RecordType);
            setRecordTypes(recordTypesData);

            const commentsData = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => row.comments);
            setComments(commentsData);
        };

        fetchData();
    }, [robotNumber]);

    const calculateAverage = (arr: number[]) => {
        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        return isNaN(avg) ? 'N/A' : avg.toFixed(2);
    };

    const calculateMedian = (arr: number[]) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        return isNaN(median) ? 'N/A' : median.toFixed(2);
    };

    const maxMatches = Math.max(
        startingLocations.length,
        leaveLocations.length,
        filteredCoralCounts.length,
        delCoralL4Diffs.length,
        delCoralL3Diffs.length,
        delCoralL2Diffs.length,
        delCoralL1Diffs.length,
        delCoralFDiffs.length,
        delAlgaeNDiffs.length,
        delAlgaePDiffs.length,
        climbStates.length,
        climbTimes.length,
        recordTypes.length,
        comments.length
    );

    const columns = ['Matches', ...Array.from({ length: maxMatches }, (_, i) => `${i + 1}`), 'Avg', 'Med'];

    const cellClass = color === 'Red' ? 'robot-number-cell red' : 'robot-number-cell blue';

    return (
        <div className="one-team-report">
            <div className="flex-container">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className="table-row-bordered2">
                                <TableCell colSpan={columns.length} align="center" className={cellClass} style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                    {robotNumber}: {nickname}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow className="table-row-bordered2">
                                {columns.map((column, index) => (
                                    <TableCell key={index} className={comments[index] !== 'ControllerScouting' && index > 0 && index < columns.length - 2 ? 'orange-cell' : ''}>
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell colSpan={columns.length} align="center" style={{ backgroundColor: '#ff00ff' }}>
                                    Auto
                                </TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>Start Loc</TableCell>
                                {startingLocations.map((loc, index) => (
                                    <TableCell key={index}>{loc === "Center" ? "Ce" : loc}</TableCell>
                                ))}
                                <TableCell>{calculateAverage(startingLocations.map(loc => parseInt(loc)))}</TableCell>
                                <TableCell>{calculateMedian(startingLocations.map(loc => parseInt(loc)))}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>Leave Loc</TableCell>
                                {leaveLocations.map((loc, index) => (
                                    <TableCell key={index} className={`leave-location-cell ${loc === 'Y' ? 'yes' : 'no'}`}>
                                        {loc}
                                    </TableCell>
                                ))}
                                <TableCell>{calculateAverage(leaveLocations.map(loc => parseInt(loc)))}</TableCell>
                                <TableCell>{calculateMedian(leaveLocations.map(loc => parseInt(loc)))}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell># of Coral</TableCell>
                                {filteredCoralCounts.map((count, index) => {
                                    let cellClass = '';
                                    if (count == 0) {
                                        cellClass = 'mpr black';
                                    } else if (count == 1) {
                                        cellClass = 'mpr red';
                                    } else if (count == 2) {
                                        cellClass = 'mpr yellow';
                                    } else if (count == 3) {
                                        cellClass = 'mpr green';
                                    } else if (count >= 4) {
                                        cellClass = 'mpr blue';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {count}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(filteredCoralCounts)}</TableCell>
                                <TableCell>{calculateMedian(filteredCoralCounts)}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2" style={{ backgroundColor: '#ff00ff' }}>
                                <TableCell colSpan={columns.length} align="center">
                                    TELEOP
                                </TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>L4</TableCell>
                                {delCoralL4Diffs.map((diff, index) => {
                                    let cellClass = '';
                                    if (diff == 0) {
                                        cellClass = 'mpr black';
                                    } else if (diff >= 1 && diff <= 2) {
                                        cellClass = 'mpr red';
                                    } else if (diff >= 3 && diff <= 5) {
                                        cellClass = 'mpr yellow';
                                    } else if (diff >= 6 && diff <= 9) {
                                        cellClass = 'mpr green';
                                    } else if (diff >= 10) {
                                        cellClass = 'mpr blue';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {diff}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(delCoralL4Diffs)}</TableCell>
                                <TableCell>{calculateMedian(delCoralL4Diffs)}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>L3</TableCell>
                                {delCoralL3Diffs.map((diff, index) => {
                                    let cellClass = '';
                                    if (diff == 0) {
                                        cellClass = 'mpr black';
                                    } else if (diff >= 1 && diff <= 2) {
                                        cellClass = 'mpr red';
                                    } else if (diff >= 3 && diff <= 5) {
                                        cellClass = 'mpr yellow';
                                    } else if (diff >= 6 && diff <= 9) {
                                        cellClass = 'mpr green';
                                    } else if (diff >= 10) {
                                        cellClass = 'mpr blue';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {diff}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(delCoralL3Diffs)}</TableCell>
                                <TableCell>{calculateMedian(delCoralL3Diffs)}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>L2</TableCell>
                                {delCoralL2Diffs.map((diff, index) => {
                                    let cellClass = '';
                                    if (diff == 0) {
                                        cellClass = 'mpr black';
                                    } else if (diff >= 1 && diff <= 2) {
                                        cellClass = 'mpr red';
                                    } else if (diff >= 3 && diff <= 5) {
                                        cellClass = 'mpr yellow';
                                    } else if (diff >= 6 && diff <= 9) {
                                        cellClass = 'mpr green';
                                    } else if (diff >= 10) {
                                        cellClass = 'mpr blue';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {diff}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(delCoralL2Diffs)}</TableCell>
                                <TableCell>{calculateMedian(delCoralL2Diffs)}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>L1</TableCell>
                                {delCoralL1Diffs.map((diff, index) => {
                                    let cellClass = '';
                                    if (diff == 0) {
                                        cellClass = 'mpr black';
                                    } else if (diff >= 1 && diff <= 2) {
                                        cellClass = 'mpr red';
                                    } else if (diff >= 3 && diff <= 5) {
                                        cellClass = 'mpr yellow';
                                    } else if (diff >= 6 && diff <= 9) {
                                        cellClass = 'mpr green';
                                    } else if (diff >= 10) {
                                        cellClass = 'mpr blue';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {diff}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(delCoralL1Diffs)}</TableCell>
                                <TableCell>{calculateMedian(delCoralL1Diffs)}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>Net</TableCell>
                                {delAlgaeNDiffs.map((diff, index) => {
                                    let cellClass = '';
                                    if (diff == 0) {
                                        cellClass = 'mpr black';
                                    } else if (diff >= 1 && diff <= 2) {
                                        cellClass = 'mpr red';
                                    } else if (diff >= 3 && diff <= 4) {
                                        cellClass = 'mpr yellow';
                                    } else if (diff >= 5 && diff <= 6) {
                                        cellClass = 'mpr green';
                                    } else if (diff >= 7) {
                                        cellClass = 'mpr blue';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {diff}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(delAlgaeNDiffs)}</TableCell>
                                <TableCell>{calculateMedian(delAlgaeNDiffs)}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>Processor</TableCell>
                                {delAlgaePDiffs.map((diff, index) => {
                                    let cellClass = '';
                                    if (diff == 0) {
                                        cellClass = 'mpr black';
                                    } else if (diff >= 1 && diff <= 2) {
                                        cellClass = 'mpr red';
                                    } else if (diff >= 3 && diff <= 4) {
                                        cellClass = 'mpr yellow';
                                    } else if (diff >= 5 && diff <= 6) {
                                        cellClass = 'mpr green';
                                    } else if (diff >= 7) {
                                        cellClass = 'mpr blue';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {diff}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(delAlgaePDiffs)}</TableCell>
                                <TableCell>{calculateMedian(delAlgaePDiffs)}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell colSpan={columns.length} align="center" style={{ backgroundColor: '#ff00ff' }}>
                                    SURFACING
                                </TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>Climb State</TableCell>
                                {climbStates.map((state, index) => {
                                    let cellClass = '';
                                    let displayState = state;
                                    if (state === 'Elsewhere') {
                                        cellClass = 'mpr black';
                                        displayState = 'E';
                                    } else if (state === '') {
                                        cellClass = 'mpr red';
                                    } else if (state === 'Park') {
                                        cellClass = 'mpr yellow';
                                        displayState = 'P';
                                    } else if (state === 'Shallow') {
                                        cellClass = 'mpr green';
                                        displayState = 'S';
                                    } else if (state === 'Deep') {
                                        cellClass = 'mpr blue';
                                        displayState = 'D';
                                    }
                                    return (
                                        <TableCell key={index} className={cellClass}>
                                            {displayState}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{calculateAverage(climbStates.map(state => parseFloat(state)))}</TableCell>
                                <TableCell>{calculateMedian(climbStates.map(state => parseFloat(state)))}</TableCell>
                            </TableRow>
                            <TableRow className="table-row-bordered2">
                                <TableCell>Climb Time</TableCell>
                                {climbTimes.map((time, index) => {
                                    return <TableCell key={index}>{time}</TableCell>;
                                })}
                                <TableCell>{calculateAverage([])}</TableCell>
                                <TableCell>{calculateMedian([])}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {graphStatus && (
                    <div className="chart-container">
                        <FormControl variant="outlined">
                            <GraphsInterface chart={chart} selectedTeam={robotNumber} />
                        </FormControl>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OneTeamReport;
