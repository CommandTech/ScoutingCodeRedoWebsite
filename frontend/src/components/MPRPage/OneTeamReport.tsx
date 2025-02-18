import React, { useEffect, useState } from 'react';
import './CSS/OneTeamReport.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { readCSVFile } from '../../utils/readCSV';

interface OneTeamReportProps {
    color: string;
    robotNumber: string;
    colorValues: Array<number>;
}

const OneTeamReport: React.FC<OneTeamReportProps> = ({ color, robotNumber, colorValues }) => {
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
    const [delAlgaeFDiffs, setDelAlgaeFDiffs] = useState<number[]>([]);
    const [climbStates, setClimbStates] = useState<string[]>([]);
    const [climbTimes, setClimbTimes] = useState<number[]>([]);

    const [hasAcqCoralF, setHasAcqCoralF] = useState<boolean>(false);

    useEffect(() => {
        console.log(colorValues);
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

            const delAlgaeFAuto = filteredData.filter((row: any) => row.RecordType === 'EndAuto').map((row: any) => parseInt(row.DelAlgaeF));
            const delAlgaeFMatch = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseInt(row.DelAlgaeF));
            const delAlgaeFDiff = delAlgaeFMatch.map((value, index) => value - delAlgaeFAuto[index]);
            setDelAlgaeFDiffs(delAlgaeFDiff);

            const hasNonZeroAcqCoralF = filteredData.some((row: any) => parseInt(row.AcqCoralF) !== 0);
            setHasAcqCoralF(hasNonZeroAcqCoralF);

            const climbStatesData = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => row.EndState);
            setClimbStates(climbStatesData);

            const climbTimesData = filteredData.filter((row: any) => row.RecordType === 'EndMatch').map((row: any) => parseFloat(row.ClimbT));
            setClimbTimes(climbTimesData.map(time => parseFloat(time.toFixed(2))));
        };

        fetchData();
    }, [robotNumber]);

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
        climbTimes.length
    );

    const columns = ['Matches:', ...Array.from({ length: maxMatches }, (_, i) => `Match ${i + 1}`)];

    const cellClass = color === 'Red' ? 'robot-number-cell red' : 'robot-number-cell blue';

    const getBackgroundColor = (value: number, max: number, min: number) => {
        const ratio = (value - min) / (max - min);
        const red = Math.round(255 * (1 - ratio));
        const green = Math.round(255 * ratio);
        return `rgb(${red}, ${green}, 0)`;
    };

    const climbStateColors: { [key: string]: [number, number] } = {
        'Deep': [colorValues[18], colorValues[19]],
        'Shallow': [colorValues[20], colorValues[21]],
        'Park': [colorValues[22], colorValues[23]],
        'Elsewhere': [colorValues[24], colorValues[25]],
    };

    return (
        <div className="one-team-report">
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
                            <TableCell colSpan={columns.length} align="left" className={cellClass}>
                                {robotNumber}
                            </TableCell>
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell colSpan={columns.length} align="center">
                                Auto
                            </TableCell>
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Starting Location</TableCell>
                            {startingLocations.map((loc, index) => (
                                <TableCell key={index}>{loc}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Leave Location</TableCell>
                            {leaveLocations.map((loc, index) => (
                                <TableCell key={index} className={`leave-location-cell ${loc === 'Y' ? 'yes' : 'no'}`}>
                                    {loc}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Number of Coral</TableCell>
                            {filteredCoralCounts.map((count, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(count, colorValues[0], colorValues[1]) }}>
                                    {count}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered" style={{ backgroundColor: hasAcqCoralF ? 'yellow' : 'inherit' }}>
                            <TableCell colSpan={columns.length} align="center">
                                TELEOP
                            </TableCell>
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>L4</TableCell>
                            {delCoralL4Diffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[2], colorValues[3]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>L3</TableCell>
                            {delCoralL3Diffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[4], colorValues[5]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>L2</TableCell>
                            {delCoralL2Diffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[6], colorValues[7]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>L1</TableCell>
                            {delCoralL1Diffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[8], colorValues[9]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered" style={{ borderBottom: '4px solid black' }}>
                            <TableCell>Floor/Drop</TableCell>
                            {delCoralFDiffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[11], colorValues[10]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Net</TableCell>
                            {delAlgaeNDiffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[12], colorValues[13]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Processor</TableCell>
                            {delAlgaePDiffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[14], colorValues[15]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Floor/Drop</TableCell>
                            {delAlgaeFDiffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, colorValues[17], colorValues[16]) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell colSpan={columns.length} align="center">
                                SURFACING
                            </TableCell>
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Climb State</TableCell>
                            {climbStates.map((state, index) => (
                                <TableCell key={index}>{state}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Climb Time</TableCell>
                            {climbTimes.map((time, index) => {
                                const state = climbStates[index];
                                if (state === 'Deep') {
                                    return (
                                        <TableCell key={index} style={{ backgroundColor: getBackgroundColor(time, colorValues[19], colorValues[18]) }}>
                                            {time}
                                        </TableCell>
                                    );
                                }
                                if (state === 'Shallow') {
                                    return (
                                        <TableCell key={index} style={{ backgroundColor: getBackgroundColor(time, colorValues[21], colorValues[20]) }}>
                                            {time}
                                        </TableCell>
                                    );
                                }
                                if (state === 'Park') {
                                    const backgroundColor = time > 0 ? 'red' : getBackgroundColor(time, colorValues[23], colorValues[22]);
                                    return (
                                        <TableCell key={index} style={{ backgroundColor }}>
                                            {time}
                                        </TableCell>
                                    );
                                }
                                if (state === 'Elsewhere') {
                                    const backgroundColor = time > 0 ? 'red' : getBackgroundColor(time, colorValues[25], colorValues[24]);
                                    return (
                                        <TableCell key={index} style={{ backgroundColor }}>
                                            {time}
                                        </TableCell>
                                    );
                                }
                                return <TableCell key={index}>{time}</TableCell>;
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default OneTeamReport;