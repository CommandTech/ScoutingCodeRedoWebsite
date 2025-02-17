import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CSS/Teleop.css';
import { readCSVFile } from '../../utils/readCSV';

interface TeleopProps {
    selectedTeam: string;
}

const Teleop: React.FC<TeleopProps> = ({ selectedTeam }) => {
    const [matchCount, setMatchCount] = useState<number>(0);
    const [leaveData, setLeaveData] = useState<any[]>([]);
    const [startingLocData, setStartingLocData] = useState<any[]>([]);
    const [acqCoralSData, setAcqCoralSData] = useState<any[]>([]);
    const [acqCoralFData, setAcqCoralFData] = useState<any[]>([]);
    const [acqAlgaeRData, setAcqAlgaeRData] = useState<any[]>([]);
    const [acqAlgaeFData, setAcqAlgaeFData] = useState<any[]>([]);
    const [delCoralL1Data, setDelCoralL1Data] = useState<any[]>([]);
    const [delCoralL2Data, setDelCoralL2Data] = useState<any[]>([]);
    const [delCoralL3Data, setDelCoralL3Data] = useState<any[]>([]);
    const [delCoralL4Data, setDelCoralL4Data] = useState<any[]>([]);
    const [delCoralFData, setDelCoralFData] = useState<any[]>([]);
    const [delAlgaePData, setDelAlgaePData] = useState<any[]>([]);
    const [delAlgaeNData, setDelAlgaeNData] = useState<any[]>([]);
    const [delAlgaeFData, setDelAlgaeFData] = useState<any[]>([]);
    const [disAlgaeData, setDisAlgaeData] = useState<any[]>([]);

    const [minMaxValues, setMinMaxValues] = useState<any>({});

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const response = await fetch('/ExcelCSVFiles/Activities.csv');
                const csvData = await response.text();
                const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

                if (!parsedData || !Array.isArray(parsedData)) {
                    throw new Error('Parsed data is not an array or is undefined');
                }

                const columns = ['AcqCoralS', 'AcqCoralF', 'AcqAlgaeR', 'AcqAlgaeF', 'DelCoralL1', 'DelCoralL2', 'DelCoralL3', 'DelCoralL4', 'DelCoralF', 'DelAlgaeP', 'DelAlgaeN', 'DelAlgaeF', 'DisAlgae'];
                const minMax: { [key: string]: { min: number; max: number } } = {};

                columns.forEach(column => {
                    const values = parsedData
                        .filter((row: any) => row['RecordType'] === 'EndAuto')
                        .map((row: any) => parseFloat(row[column]))
                        .filter((value: number) => !isNaN(value));

                    minMax[column] = {
                        min: Math.min(...values),
                        max: Math.max(...values)
                    };
                });
                console.log('minMax:', minMax);
                setMinMaxValues(minMax);
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

                    const teamDataEndAuto = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndAuto');
                    const teamDataEndMatch = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndMatch');

                    const uniqueMatches = Array.from(new Set(teamDataEndAuto.map((row: any) => row['Match'])));
                    setMatchCount(uniqueMatches.length);

                    const calculateDifference = (column: string) => {
                        return teamDataEndMatch.map((endMatchRow: any) => {
                            const endAutoRow = teamDataEndAuto.find((endAutoRow: any) => endAutoRow['Match'] === endMatchRow['Match']);
                            if (endAutoRow) {
                                console.log('endMatchRow:', endMatchRow);
                                return parseFloat(endMatchRow[column]) - parseFloat(endAutoRow[column]);
                            }
                            return null;
                        }).filter((value: number | null) => value !== null);
                    };

                    setLeaveData(calculateDifference('Leave'));
                    setStartingLocData(calculateDifference('Starting_Loc'));
                    setAcqCoralSData(calculateDifference('AcqCoralS'));
                    setAcqCoralFData(calculateDifference('AcqCoralF'));
                    setAcqAlgaeRData(calculateDifference('AcqAlgaeR'));
                    setAcqAlgaeFData(calculateDifference('AcqAlgaeF'));
                    setDelCoralL1Data(calculateDifference('DelCoralL1'));
                    setDelCoralL2Data(calculateDifference('DelCoralL2'));
                    setDelCoralL3Data(calculateDifference('DelCoralL3'));
                    setDelCoralL4Data(calculateDifference('DelCoralL4'));
                    setDelCoralFData(calculateDifference('DelCoralF'));
                    setDelAlgaePData(calculateDifference('DelAlgaeP'));
                    setDelAlgaeNData(calculateDifference('DelAlgaeN'));
                    setDelAlgaeFData(calculateDifference('DelAlgaeF'));
                    setDisAlgaeData(calculateDifference('DisAlgae'));
                } catch (error) {
                    console.error('Error fetching team data:', error);
                }
            }
        };

        fetchTeamData();
    }, [selectedTeam]);

    const columns = ['Matches:', ...Array.from({ length: matchCount }, (_, i) => `Match ${i + 1}`), 'Average'];

    const getBackgroundColor = (value: number, max: number, min: number) => {
        const ratio = (value - min) / (max - min);
        const red = Math.round(255 * (1 - ratio));
        const green = Math.round(255 * ratio);
        return `rgb(${red}, ${green}, 0)`;
    };

    const calculateAverage = (data: any[]) => {
        const numericData = data.map(value => parseFloat(value)).filter(value => !isNaN(value));
        const sum = numericData.reduce((acc, value) => acc + value, 0);
        return sum / numericData.length;
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
                            <TableCell colSpan={columns.length} align="center">
                                Acquire
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Coral Station</TableCell>
                            {acqCoralSData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['AcqCoralS']?.max, minMaxValues['AcqCoralS']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(acqCoralSData), minMaxValues['AcqCoralS']?.max, minMaxValues['AcqCoralS']?.min) }}
                            >
                                {calculateAverage(acqCoralSData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Coral Floor</TableCell>
                            {acqCoralFData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['AcqCoralF']?.max, minMaxValues['AcqCoralF']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(acqCoralFData), minMaxValues['AcqCoralF']?.max, minMaxValues['AcqCoralF']?.min) }}
                            >
                                {calculateAverage(acqCoralFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Algae Reef</TableCell>
                            {acqAlgaeRData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['AcqAlgaeR']?.max, minMaxValues['AcqAlgaeR']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(acqAlgaeRData), minMaxValues['AcqAlgaeR']?.max, minMaxValues['AcqAlgaeR']?.min) }}
                            >
                                {calculateAverage(acqAlgaeRData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Algae Floor</TableCell>
                            {acqAlgaeFData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['AcqAlgaeF']?.max, minMaxValues['AcqAlgaeF']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(acqAlgaeFData), minMaxValues['AcqAlgaeF']?.max, minMaxValues['AcqAlgaeF']?.min) }}
                            >
                                {calculateAverage(acqAlgaeFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell colSpan={columns.length} align="center">
                                Deliver
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L1</TableCell>
                            {delCoralL1Data.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelCoralL1']?.max, minMaxValues['DelCoralL1']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delCoralL1Data), minMaxValues['DelCoralL1']?.max, minMaxValues['DelCoralL1']?.min) }}
                            >
                                {calculateAverage(delCoralL1Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L2</TableCell>
                            {delCoralL2Data.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelCoralL2']?.max, minMaxValues['DelCoralL2']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delCoralL2Data), minMaxValues['DelCoralL2']?.max, minMaxValues['DelCoralL2']?.min) }}
                            >
                                {calculateAverage(delCoralL2Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L3</TableCell>
                            {delCoralL3Data.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelCoralL3']?.max, minMaxValues['DelCoralL3']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delCoralL3Data), minMaxValues['DelCoralL3']?.max, minMaxValues['DelCoralL3']?.min) }}
                            >
                                {calculateAverage(delCoralL3Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L4</TableCell>
                            {delCoralL4Data.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelCoralL4']?.max, minMaxValues['DelCoralL4']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delCoralL4Data), minMaxValues['DelCoralL4']?.max, minMaxValues['DelCoralL4']?.min) }}
                            >
                                {calculateAverage(delCoralL4Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow style={{ borderBottom: '4px solid black' }}>
                            <TableCell>Floor/Drop</TableCell>
                            {delCoralFData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelCoralF']?.min, minMaxValues['DelCoralF']?.max) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delCoralFData), minMaxValues['DelCoralF']?.min, minMaxValues['DelCoralF']?.max) }}
                            >
                                {calculateAverage(delCoralFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Processor</TableCell>
                            {delAlgaePData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelAlgaeP']?.max, minMaxValues['DelAlgaeP']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delAlgaePData), minMaxValues['DelAlgaeP']?.max, minMaxValues['DelAlgaeP']?.min) }}
                            >
                                {calculateAverage(delAlgaePData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Net</TableCell>
                            {delAlgaeNData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelAlgaeN']?.max, minMaxValues['DelAlgaeN']?.min) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delAlgaeNData), minMaxValues['DelAlgaeN']?.max, minMaxValues['DelAlgaeN']?.min) }}
                            >
                                {calculateAverage(delAlgaeNData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Floor/Drop</TableCell>
                            {delAlgaeFData.map((data, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: getBackgroundColor(parseFloat(data), minMaxValues['DelAlgaeF']?.min, minMaxValues['DelAlgaeF']?.max) }}
                                >
                                    {data}
                                </TableCell>
                            ))}
                            <TableCell
                                style={{ backgroundColor: getBackgroundColor(calculateAverage(delAlgaeFData), minMaxValues['DelAlgaeF']?.min, minMaxValues['DelAlgaeF']?.max) }}
                            >
                                {calculateAverage(delAlgaeFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Teleop;