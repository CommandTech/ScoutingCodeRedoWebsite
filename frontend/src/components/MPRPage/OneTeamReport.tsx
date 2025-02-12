import React, { useEffect, useState } from 'react';
import './CSS/OneTeamReport.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { readCSVFile } from '../../utils/readCSV';

interface OneTeamReportProps {
    color: string;
    robotNumber: string;
}

const OneTeamReport: React.FC<OneTeamReportProps> = ({ color, robotNumber }) => {
    const [startingLocations, setStartingLocations] = useState<string[]>([]);
    const [leaveLocations, setLeaveLocations] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/ExcelCSVFiles/Activities.csv');
            const csvData = await response.text();
            const file = new File([csvData], 'Activities.csv', { type: 'text/csv' });
            const data = await readCSVFile(file);
            const filteredData = data.filter((row: any) => row.RecordType === 'EndAuto' && row.Team === robotNumber);
            const startingLocs = filteredData.map((row: any) => row.Starting_Loc);
            const leaveLocs = filteredData.map((row: any) => row.Leave);
            setStartingLocations(startingLocs);
            setLeaveLocations(leaveLocs);
        };

        fetchData();
    }, [robotNumber]);

    const columns = [
        'Matches:', 'Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Match 6', 'Match 7', 'Match 8', 'Match 9', 'Match 10', 'Match 11', 'Match 12', 'Match 13'
    ];

    const cellClass = color === 'Red' ? 'robot-number-cell red' : 'robot-number-cell blue';

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
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default OneTeamReport;