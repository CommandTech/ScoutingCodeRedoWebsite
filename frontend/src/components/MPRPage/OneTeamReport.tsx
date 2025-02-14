import React, { useEffect, useState } from 'react';
import './CSS/OneTeamReport.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { readCSVFile } from '../../utils/readCSV';

interface OneTeamReportProps {
    color: string;
    robotNumber: string;
    coralCounts: number[];
    minCoralCount: number;
    maxCoralCount: number;
}

const OneTeamReport: React.FC<OneTeamReportProps> = ({ color, robotNumber, coralCounts, minCoralCount, maxCoralCount }) => {
    const [startingLocations, setStartingLocations] = useState<string[]>([]);
    const [leaveLocations, setLeaveLocations] = useState<string[]>([]);
    const [filteredCoralCounts, setFilteredCoralCounts] = useState<number[]>([]);
    const [delCoralL4Diffs, setDelCoralL4Diffs] = useState<number[]>([]);
    const [delCoralL3Diffs, setDelCoralL3Diffs] = useState<number[]>([]);
    const [delCoralL2Diffs, setDelCoralL2Diffs] = useState<number[]>([]);
    const [delCoralL1Diffs, setDelCoralL1Diffs] = useState<number[]>([]);
    const [delCoralFDiffs, setDelCoralFDiffs] = useState<number[]>([]);
    const [hasAcqCoralF, setHasAcqCoralF] = useState<boolean>(false);

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

            const hasNonZeroAcqCoralF = filteredData.some((row: any) => parseInt(row.AcqCoralF) !== 0);
            setHasAcqCoralF(hasNonZeroAcqCoralF);
        };

        fetchData();
    }, [robotNumber, coralCounts]);

    const maxMatches = Math.max(
        startingLocations.length,
        leaveLocations.length,
        filteredCoralCounts.length,
        delCoralL4Diffs.length,
        delCoralL3Diffs.length,
        delCoralL2Diffs.length,
        delCoralL1Diffs.length,
        delCoralFDiffs.length
    );

    const columns = ['Matches:', ...Array.from({ length: maxMatches }, (_, i) => `Match ${i + 1}`)];

    const cellClass = color === 'Red' ? 'robot-number-cell red' : 'robot-number-cell blue';

    const getBackgroundColor = (value: number, max: number, min: number) => {
        const ratio = (value - min) / (max - min);
        const red = Math.round(255 * (1 - ratio));
        const green = Math.round(255 * ratio);
        return `rgb(${red}, ${green}, 0)`;
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
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(count, maxCoralCount, minCoralCount) }}>
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
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, maxCoralCount, minCoralCount) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>L3</TableCell>
                            {delCoralL3Diffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, maxCoralCount, minCoralCount) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>L2</TableCell>
                            {delCoralL2Diffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, maxCoralCount, minCoralCount) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>L1</TableCell>
                            {delCoralL1Diffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, maxCoralCount, minCoralCount) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Floor/Drop</TableCell>
                            {delCoralFDiffs.map((diff, index) => (
                                <TableCell key={index} style={{ backgroundColor: getBackgroundColor(diff, maxCoralCount, minCoralCount) }}>
                                    {diff}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default OneTeamReport;