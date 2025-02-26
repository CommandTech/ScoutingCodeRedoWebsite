import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './CSS/Auto.css';
import { readCSVFile } from '../../utils/readCSV';
import GraphsInterface from '../Graphs/GraphsInterface';

interface AutoProps {
    selectedTeam: string;
}

const Auto: React.FC<AutoProps> = ({ selectedTeam }) => {
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

    const [Chart1, setSelectedChart1] = useState<string>('StartingLocation');
    const [Chart2, setSelectedChart2] = useState<string>('StartingLocation');
    const [Chart3, setSelectedChart3] = useState<string>('StartingLocation');

    const chartOptions = [
        { value: 'StartingLocation', label: 'Starting Location' },
        { value: 'PointsPerStartLocation', label: 'Points Per Start Location' },
        { value: 'PointsPerMatchAuto', label: 'Points Per Match' },
        { value: 'AcquireAlgaePerLocationAuto', label: 'Acquire Algae Per Location Average' },
        { value: 'AcquireCoralPerLocationAuto', label: 'Acquire Coral Per Location Average' },
        { value: 'AlgaeSuccessRateAuto', label: 'Algae Success Rate Average' },
        { value: 'CoralSuccessRateAuto', label: 'Coral Success Rate Average' },
        { value: 'DeliveriesNearVsFarAuto', label: 'Deliveries Near Vs Far' },
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

                    const teamData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndAuto');
                    const uniqueMatches = Array.from(new Set(teamData.map((row: any) => row['Match'])));
                    setMatchCount(uniqueMatches.length);

                    const leaveColumnData = teamData.map((row: any) => row['Leave']);
                    setLeaveData(leaveColumnData);

                    const startingLocColumnData = teamData.map((row: any) => row['Starting_Loc']);
                    setStartingLocData(startingLocColumnData);

                    setAcqCoralSData(teamData.map((row: any) => row['AcqCoralS']));
                    setAcqCoralFData(teamData.map((row: any) => row['AcqCoralF']));
                    setAcqAlgaeRData(teamData.map((row: any) => row['AcqAlgaeR']));
                    setAcqAlgaeFData(teamData.map((row: any) => row['AcqAlgaeF']));
                    setDelCoralL1Data(teamData.map((row: any) => row['DelCoralL1']));
                    setDelCoralL2Data(teamData.map((row: any) => row['DelCoralL2']));
                    setDelCoralL3Data(teamData.map((row: any) => row['DelCoralL3']));
                    setDelCoralL4Data(teamData.map((row: any) => row['DelCoralL4']));
                    setDelCoralFData(teamData.map((row: any) => row['DelCoralF']));
                    setDelAlgaePData(teamData.map((row: any) => row['DelAlgaeP']));
                    setDelAlgaeNData(teamData.map((row: any) => row['DelAlgaeN']));
                    setDelAlgaeFData(teamData.map((row: any) => row['DelAlgaeF']));
                    setDisAlgaeData(teamData.map((row: any) => row['DisAlgae']));
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
                        <TableRow>
                            <TableCell>Starting Location</TableCell>
                            {startingLocData.map((loc, index) => (
                                <TableCell key={index}>{loc}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell>Leave</TableCell>
                            {leaveData.map((leave, index) => (
                                <TableCell
                                    key={index}
                                    style={{ backgroundColor: leave === 'Y' ? '#00ff00' : leave === 'N' ? 'red' : 'transparent' }}
                                >
                                    {leave}
                                </TableCell>
                            ))}
                        </TableRow>
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
                                    cellClass = 'auto black';
                                } else if (data == 1) {
                                    cellClass = 'auto red';
                                } else if (data == 2) {
                                    cellClass = 'auto yellow';
                                } else if (data == 3) {
                                    cellClass = 'auto green';
                                } else if (data >= 4) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(acqCoralSData) < 1 ? 'auto black' :
                                    calculateAverage(acqCoralSData) < 2 ? 'auto red' :
                                        calculateAverage(acqCoralSData) < 3 ? 'auto yellow' :
                                            calculateAverage(acqCoralSData) < 4 ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(acqCoralSData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Coral Floor</TableCell>
                            {acqCoralFData.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'auto black';
                                } else if (data == 1) {
                                    cellClass = 'auto red';
                                } else if (data == 2) {
                                    cellClass = 'auto yellow';
                                } else if (data == 3) {
                                    cellClass = 'auto green';
                                } else if (data >= 4) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(acqCoralFData) < 1 ? 'auto black' :
                                    calculateAverage(acqCoralFData) < 2 ? 'auto red' :
                                        calculateAverage(acqCoralFData) < 3 ? 'auto yellow' :
                                            calculateAverage(acqCoralFData) < 4 ? 'auto green' :
                                                'auto blue'
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
                                calculateAverage(acqAlgaeFData) < 1 ? 'auto black' :
                                    (calculateAverage(acqAlgaeFData) >= 1 && calculateAverage(acqAlgaeFData) <= 2) ? 'auto red' :
                                        (calculateAverage(acqAlgaeFData) >= 3 && calculateAverage(acqAlgaeFData) <= 4) ? 'auto yellow' :
                                            (calculateAverage(acqAlgaeFData) >= 5 && calculateAverage(acqAlgaeFData) <= 6) ? 'auto green' :
                                                'auto blue'
                            }>
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
                            {delCoralL1Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'auto black';
                                } else if (data == 1) {
                                    cellClass = 'auto red';
                                } else if (data == 2) {
                                    cellClass = 'auto yellow';
                                } else if (data == 3) {
                                    cellClass = 'auto green';
                                } else if (data >= 4) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL1Data) < 1 ? 'auto black' :
                                    calculateAverage(delCoralL1Data) < 2 ? 'auto red' :
                                        calculateAverage(delCoralL1Data) < 3 ? 'auto yellow' :
                                            calculateAverage(delCoralL1Data) < 4 ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(delCoralL1Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L2</TableCell>
                            {delCoralL2Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'auto black';
                                } else if (data == 1) {
                                    cellClass = 'auto red';
                                } else if (data == 2) {
                                    cellClass = 'auto yellow';
                                } else if (data == 3) {
                                    cellClass = 'auto green';
                                } else if (data >= 4) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL2Data) < 1 ? 'auto black' :
                                    calculateAverage(delCoralL2Data) < 2 ? 'auto red' :
                                        calculateAverage(delCoralL2Data) < 3 ? 'auto yellow' :
                                            calculateAverage(delCoralL2Data) < 4 ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(delCoralL2Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L3</TableCell>
                            {delCoralL3Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'auto black';
                                } else if (data == 1) {
                                    cellClass = 'auto red';
                                } else if (data == 2) {
                                    cellClass = 'auto yellow';
                                } else if (data == 3) {
                                    cellClass = 'auto green';
                                } else if (data >= 4) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL3Data) < 1 ? 'auto black' :
                                    calculateAverage(delCoralL3Data) < 2 ? 'auto red' :
                                        calculateAverage(delCoralL3Data) < 3 ? 'auto yellow' :
                                            calculateAverage(delCoralL3Data) < 4 ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(delCoralL3Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>L4</TableCell>
                            {delCoralL4Data.map((data, index) => {
                                let cellClass = '';
                                if (data == 0) {
                                    cellClass = 'auto black';
                                } else if (data == 1) {
                                    cellClass = 'auto red';
                                } else if (data == 2) {
                                    cellClass = 'auto yellow';
                                } else if (data == 3) {
                                    cellClass = 'auto green';
                                } else if (data >= 4) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralL4Data) < 1 ? 'auto black' :
                                    calculateAverage(delCoralL4Data) < 2 ? 'auto red' :
                                        calculateAverage(delCoralL4Data) < 3 ? 'auto yellow' :
                                            calculateAverage(delCoralL4Data) < 4 ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(delCoralL4Data).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow style={{ borderBottom: '4px solid black' }}>
                            <TableCell>Floor/Drop</TableCell>
                            {delCoralFData.map((data, index) => {
                                let cellClass = '';
                                if (data > 4) {
                                    cellClass = 'auto black';
                                } else if (data == 3) {
                                    cellClass = 'auto red';
                                } else if (data == 2) {
                                    cellClass = 'auto yellow';
                                } else if (data == 1) {
                                    cellClass = 'auto green';
                                } else if (data == 0) {
                                    cellClass = 'auto blue';
                                }
                                return (
                                    <TableCell key={index} className={cellClass}>
                                        {data}
                                    </TableCell>
                                );
                            })}
                            <TableCell className={
                                calculateAverage(delCoralFData) > 1 ? 'auto black' :
                                    calculateAverage(delCoralFData) > 2 ? 'auto red' :
                                        calculateAverage(delCoralFData) > 3 ? 'auto yellow' :
                                            calculateAverage(delCoralFData) > 4 ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(delCoralFData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Processor</TableCell>
                            {delAlgaePData.map((data, index) => {
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
                                calculateAverage(delAlgaePData) < 1 ? 'auto black' :
                                    (calculateAverage(delAlgaePData) >= 1 && calculateAverage(delAlgaePData) <= 2) ? 'auto red' :
                                        (calculateAverage(delAlgaePData) >= 3 && calculateAverage(delAlgaePData) <= 4) ? 'auto yellow' :
                                            (calculateAverage(delAlgaePData) >= 5 && calculateAverage(delAlgaePData) <= 6) ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(delAlgaePData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Net</TableCell>
                            {delAlgaeNData.map((data, index) => {
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
                                calculateAverage(delAlgaeNData) < 1 ? 'auto black' :
                                    (calculateAverage(delAlgaeNData) >= 1 && calculateAverage(delAlgaeNData) <= 2) ? 'auto red' :
                                        (calculateAverage(delAlgaeNData) >= 3 && calculateAverage(delAlgaeNData) <= 4) ? 'auto yellow' :
                                            (calculateAverage(delAlgaeNData) >= 5 && calculateAverage(delAlgaeNData) <= 6) ? 'auto green' :
                                                'auto blue'
                            }>
                                {calculateAverage(delAlgaeNData).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Floor/Drop</TableCell>
                            {delAlgaeFData.map((data, index) => {
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
                                calculateAverage(delAlgaeFData) < 1 ? 'auto black' :
                                    (calculateAverage(delAlgaeFData) >= 1 && calculateAverage(delAlgaeFData) <= 2) ? 'auto red' :
                                        (calculateAverage(delAlgaeFData) >= 3 && calculateAverage(delAlgaeFData) <= 4) ? 'auto yellow' :
                                            (calculateAverage(delAlgaeFData) >= 5 && calculateAverage(delAlgaeFData) <= 6) ? 'auto green' :
                                                'auto blue'
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

export default Auto;