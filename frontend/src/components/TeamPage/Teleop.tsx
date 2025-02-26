import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CSS/Teleop.css';
import { readCSVFile } from '../../utils/readCSV';
import GraphsInterface from '../Graphs/GraphsInterface';

interface TeleopProps {
    selectedTeam: string;
}

const Teleop: React.FC<TeleopProps> = ({ selectedTeam }) => {
    const [matchCount, setMatchCount] = useState<number>(0);
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

    const [Chart1, setSelectedChart1] = useState<string>('PointsPerDriverStation');
    const [Chart2, setSelectedChart2] = useState<string>('PointsPerDriverStation');
    const [Chart3, setSelectedChart3] = useState<string>('PointsPerDriverStation');

    const chartOptions = [
        { value: 'PointsPerDriverStation', label: 'Points Per Driver Station Average' },
        { value: 'DeliveriesPerDriverStation', label: 'Deliveries Per Driver Station Average' },
        { value: 'AlgaeSuccessRate', label: 'Algae Success Rate Average' },
        { value: 'CoralSuccessRate', label: 'Coral Success Rate Average' },
        { value: 'AcquireAlgaeNearVsFar', label: 'Acquire Algae Near Vs Far Average' },
        { value: 'AcquireCoralNearVsFar', label: 'Acquire Coral Near Vs Far Average' },
        { value: 'DeliveriesNearVsFar', label: 'Deliveries Near Vs Far Average' },
        { value: 'AcquireAlgaePerLocation', label: 'Acquire Algae Per Location Average' },
        { value: 'AcquireCoralPerLocation', label: 'Acquire Coral Per Location Average' },
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
                                const endMatchValue = parseFloat(endMatchRow[column]);
                                const endAutoValue = parseFloat(endAutoRow[column]);
                                return endMatchValue - endAutoValue;
                            }
                            return null;
                        }).filter((value: number | null) => value !== null);
                    };

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

    const calculateAverage = (data: any[]) => {
        const numericData = data.map(value => parseFloat(value)).filter(value => !isNaN(value));
        const sum = numericData.reduce((acc, value) => acc + value, 0);
        return sum / numericData.length;
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
            <TableContainer component={Paper} className='center'>
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
                            {acqCoralSData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data == 1) {
                                    cellClass = 'teleop red';
                                } else if (data == 2) {
                                    cellClass = 'teleop yellow';
                                } else if (data == 3) {
                                    cellClass = 'teleop green';
                                } else if (data >= 4) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(acqCoralSData) < 1 ? 'teleop black' :
                                    calculateAverage(acqCoralSData) < 2 ? 'teleop red' :
                                        calculateAverage(acqCoralSData) < 3 ? 'teleop yellow' :
                                            calculateAverage(acqCoralSData) < 4 ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(acqCoralSData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Coral Floor</TableCell>
                            {acqCoralFData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data == 1) {
                                    cellClass = 'teleop red';
                                } else if (data == 2) {
                                    cellClass = 'teleop yellow';
                                } else if (data == 3) {
                                    cellClass = 'teleop green';
                                } else if (data >= 4) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(acqCoralFData) < 1 ? 'teleop black' :
                                    calculateAverage(acqCoralFData) < 2 ? 'teleop red' :
                                        calculateAverage(acqCoralFData) < 3 ? 'teleop yellow' :
                                            calculateAverage(acqCoralFData) < 4 ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(acqCoralFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Algae Reef</TableCell>
                            {acqAlgaeRData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'auto black';
                                } else if (data >= 1 && data <= 2) {
                                    cellClass = 'auto red';
                                } else if (data >= 3 && data <= 4) {
                                    cellClass = 'auto yellow';
                                } else if (data >= 5 && data <= 6) {
                                    cellClass = 'auto green';
                                } else if (data >= 7) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(acqAlgaeRData) < 1 ? 'auto black' :
                                    (calculateAverage(acqAlgaeRData) >= 1 && calculateAverage(acqAlgaeRData) <= 2) ? 'auto red' :
                                        (calculateAverage(acqAlgaeRData) >= 3 && calculateAverage(acqAlgaeRData) <= 4) ? 'auto yellow' :
                                            (calculateAverage(acqAlgaeRData) >= 5 && calculateAverage(acqAlgaeRData) <= 6) ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(acqAlgaeRData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Algae Floor</TableCell>
                            {acqAlgaeFData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data >= 1 && data <= 2) {
                                    cellClass = 'teleop red';
                                } else if (data >= 3 && data <= 4) {
                                    cellClass = 'teleop yellow';
                                } else if (data >= 5 && data <= 6) {
                                    cellClass = 'teleop green';
                                } else if (data >= 7) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(acqAlgaeFData) < 1 ? 'teleop black' :
                                    (calculateAverage(acqAlgaeFData) >= 1 && calculateAverage(acqAlgaeFData) <= 2) ? 'teleop red' :
                                        (calculateAverage(acqAlgaeFData) >= 3 && calculateAverage(acqAlgaeFData) <= 4) ? 'teleop yellow' :
                                            (calculateAverage(acqAlgaeFData) >= 5 && calculateAverage(acqAlgaeFData) <= 6) ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(acqAlgaeFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell>Algae Disrupted</TableCell>
                            {disAlgaeData.map((data, index) => {
                                return (
                                    <TableCell key={index}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell>
                                {calculateAverage(disAlgaeData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow className="table-row-bordered">
                            <TableCell colSpan={columns.length} align="center">
                                Deliver
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L1</TableCell>
                            {delCoralL1Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data == 1) {
                                    cellClass = 'teleop red';
                                } else if (data == 2) {
                                    cellClass = 'teleop yellow';
                                } else if (data == 3) {
                                    cellClass = 'teleop green';
                                } else if (data >= 4) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL1Data) < 1 ? 'teleop black' :
                                    calculateAverage(delCoralL1Data) < 2 ? 'teleop red' :
                                        calculateAverage(delCoralL1Data) < 3 ? 'teleop yellow' :
                                            calculateAverage(delCoralL1Data) < 4 ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delCoralL1Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L2</TableCell>
                            {delCoralL2Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data == 1) {
                                    cellClass = 'teleop red';
                                } else if (data == 2) {
                                    cellClass = 'teleop yellow';
                                } else if (data == 3) {
                                    cellClass = 'teleop green';
                                } else if (data >= 4) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL2Data) < 1 ? 'teleop black' :
                                    calculateAverage(delCoralL2Data) < 2 ? 'teleop red' :
                                        calculateAverage(delCoralL2Data) < 3 ? 'teleop yellow' :
                                            calculateAverage(delCoralL2Data) < 4 ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delCoralL2Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L3</TableCell>
                            {delCoralL3Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data == 1) {
                                    cellClass = 'teleop red';
                                } else if (data == 2) {
                                    cellClass = 'teleop yellow';
                                } else if (data == 3) {
                                    cellClass = 'teleop green';
                                } else if (data >= 4) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL3Data) < 1 ? 'teleop black' :
                                    calculateAverage(delCoralL3Data) < 2 ? 'teleop red' :
                                        calculateAverage(delCoralL3Data) < 3 ? 'teleop yellow' :
                                            calculateAverage(delCoralL3Data) < 4 ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delCoralL3Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L4</TableCell>
                            {delCoralL4Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data == 1) {
                                    cellClass = 'teleop red';
                                } else if (data == 2) {
                                    cellClass = 'teleop yellow';
                                } else if (data == 3) {
                                    cellClass = 'teleop green';
                                } else if (data >= 4) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL4Data) < 1 ? 'teleop black' :
                                    calculateAverage(delCoralL4Data) < 2 ? 'teleop red' :
                                        calculateAverage(delCoralL4Data) < 3 ? 'teleop yellow' :
                                            calculateAverage(delCoralL4Data) < 4 ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delCoralL4Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow style={{ borderBottom: '4px solid black' }}>
                            <TableCell>Floor/Drop</TableCell>
                            {delCoralFData.map((data, index) => {
                                let cellClass = '';
                                if (data > 4) {
                                    cellClass = 'teleop black';
                                } else if (data == 3) {
                                    cellClass = 'teleop red';
                                } else if (data == 2) {
                                    cellClass = 'teleop yellow';
                                } else if (data == 1) {
                                    cellClass = 'teleop green';
                                } else if (data == 0) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralFData) > 1 ? 'teleop black' :
                                    calculateAverage(delCoralFData) > 2 ? 'teleop red' :
                                        calculateAverage(delCoralFData) > 3 ? 'teleop yellow' :
                                            calculateAverage(delCoralFData) > 4 ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delCoralFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Processor</TableCell>
                            {delAlgaePData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data >= 1 && data <= 2) {
                                    cellClass = 'teleop red';
                                } else if (data >= 3 && data <= 4) {
                                    cellClass = 'teleop yellow';
                                } else if (data >= 5 && data <= 6) {
                                    cellClass = 'teleop green';
                                } else if (data >= 7) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delAlgaePData) < 1 ? 'teleop black' :
                                    (calculateAverage(delAlgaePData) >= 1 && calculateAverage(delAlgaePData) <= 2) ? 'teleop red' :
                                        (calculateAverage(delAlgaePData) >= 3 && calculateAverage(delAlgaePData) <= 4) ? 'teleop yellow' :
                                            (calculateAverage(delAlgaePData) >= 5 && calculateAverage(delAlgaePData) <= 6) ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delAlgaePData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Net</TableCell>
                            {delAlgaeNData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data >= 1 && data <= 2) {
                                    cellClass = 'teleop red';
                                } else if (data >= 3 && data <= 4) {
                                    cellClass = 'teleop yellow';
                                } else if (data >= 5 && data <= 6) {
                                    cellClass = 'teleop green';
                                } else if (data >= 7) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delAlgaeNData) < 1 ? 'teleop black' :
                                    (calculateAverage(delAlgaeNData) >= 1 && calculateAverage(delAlgaeNData) <= 2) ? 'teleop red' :
                                        (calculateAverage(delAlgaeNData) >= 3 && calculateAverage(delAlgaeNData) <= 4) ? 'teleop yellow' :
                                            (calculateAverage(delAlgaeNData) >= 5 && calculateAverage(delAlgaeNData) <= 6) ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delAlgaeNData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Floor/Drop</TableCell>
                            {delAlgaeFData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'teleop black';
                                } else if (data >= 1 && data <= 2) {
                                    cellClass = 'teleop red';
                                } else if (data >= 3 && data <= 4) {
                                    cellClass = 'teleop yellow';
                                } else if (data >= 5 && data <= 6) {
                                    cellClass = 'teleop green';
                                } else if (data >= 7) {
                                    cellClass = 'teleop blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delAlgaeFData) < 1 ? 'teleop black' :
                                    (calculateAverage(delAlgaeFData) >= 1 && calculateAverage(delAlgaeFData) <= 2) ? 'teleop red' :
                                        (calculateAverage(delAlgaeFData) >= 3 && calculateAverage(delAlgaeFData) <= 4) ? 'teleop yellow' :
                                            (calculateAverage(delAlgaeFData) >= 5 && calculateAverage(delAlgaeFData) <= 6) ? 'teleop green' :
                                                'teleop blue'
                            }>
                                {calculateAverage(delAlgaeFData).toFixed(2)}
                            </TableCell>
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

export default Teleop;