import React, { useEffect, useState } from 'react';
import OneTeamReport from './MPRPage/OneTeamReport';
import { readCSVFile } from '../utils/readCSV';
import { calculateDifferences, calculateClimbTimes, calculateCoralCounts } from '../utils/reportingFunctions';
import './CSS/MPR.css';
import { InputLabel, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';

const MPR = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedColor, setSelectedColor] = useState('All');
  const [teamNumbers, setTeamNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [Chart1, setSelectedChart1] = useState<string>('StartingLocation');
  const chartOptions = [
    { value: 'StartingLocation', label: 'Starting Location (Auto)' },
    { value: 'PointsPerStartLocation', label: 'Points Per Start Location (Auto)' },
    { value: 'PointsPerMatchAuto', label: 'Points Per Match (Auto)' },
    { value: 'AcquireAlgaePerLocationAuto', label: 'Acquire Algae Per Location Average (Auto)' },
    { value: 'AcquireCoralPerLocationAuto', label: 'Acquire Coral Per Location Average (Auto)' },
    { value: 'AlgaeSuccessRateAuto', label: 'Algae Success Rate Average (Auto)' },
    { value: 'CoralSuccessRateAuto', label: 'Coral Success Rate Average (Auto)' },
    { value: 'DeliveriesNearVsFarAuto', label: 'Deliveries Near Vs Far (Auto)' },
    { value: 'PointsPerDriverStation', label: 'Points Per Driver Station Average (Teleop)' },
    { value: 'DeliveriesPerDriverStation', label: 'Deliveries Per Driver Station Average (Teleop)' },
    { value: 'AlgaeSuccessRate', label: 'Algae Success Rate Average (Teleop)' },
    { value: 'CoralSuccessRate', label: 'Coral Success Rate Average (Teleop)' },
    { value: 'AcquireAlgaeNearVsFar', label: 'Acquire Algae Near Vs Far Average (Teleop)' },
    { value: 'AcquireCoralNearVsFar', label: 'Acquire Coral Near Vs Far Average (Teleop)' },
    { value: 'DeliveriesNearVsFar', label: 'Deliveries Near Vs Far Average (Teleop)' },
    { value: 'AcquireAlgaePerLocation', label: 'Acquire Algae Per Location Average (Teleop)' },
    { value: 'AcquireCoralPerLocation', label: 'Acquire Coral Per Location Average (Teleop)' },
    { value: 'PointsPerMatch', label: 'Points Per Match (Surfacing)' },
    { value: 'SurfacingPointsPerMatch', label: 'Surfacing Points Per Match (Surfacing)' },
    { value: 'CageAttempt', label: 'Cage Attempt (Surfacing)' },
    { value: 'EndState', label: 'End State (Surfacing)' },
    { value: 'ClimbSuccess', label: 'Climb Success (Surfacing)' },
    { value: 'RobotPictures', label: 'Robot Pictures (Summary)' },
  ];
  const [showGraphs, setShowGraphs] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/ExcelCSVFiles/Activities.csv');
        const csvData = await response.text();
        const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

        if (!parsedData || !Array.isArray(parsedData)) {
          throw new Error('Parsed data is not an array or is undefined');
        }

        const matchNumbers = Array.from(new Set(parsedData.map((row: any) => row['Match']).filter(Boolean)));
        setTeams(matchNumbers);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    setSelectedColor('All');
  }, []);

  const handleTeamChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchNumber = event.target.value;
    setSelectedMatch(matchNumber);

    try {
      const response = await fetch('/ExcelCSVFiles/Activities.csv');
      const csvData = await response.text();
      const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

      if (!parsedData || !Array.isArray(parsedData)) {
        throw new Error('Parsed data is not an array or is undefined');
      }

      const matchData = parsedData.filter((row: any) => row['Match'] === matchNumber);
      if (matchData.length > 0) {
        const teamNumbers = [
          'blue0',
          'blue1',
          'blue2',
          'red0',
          'red1',
          'red2',
        ].map((driveSta: string) => {
          const teamData = matchData.find((row: any) => row['DriveSta'] === driveSta);
          return teamData ? teamData['Team'] : '';
        });
        console.log('teamNumbers:', teamNumbers);
        setTeamNumbers(teamNumbers);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleChange1 = (event: SelectChangeEvent<string>) => {
    setSelectedChart1(event.target.value as string);
  };

  return (
    <div>
      <select className="select-spacing" onChange={handleTeamChange} value={selectedMatch}>
        <option value="">Match Number</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>
            {team}
          </option>
        ))}
      </select>

      <select className="select-spacing" onChange={handleColorChange} value={selectedColor}>
        <option value="All">All</option>
        <option value="Red">Red</option>
        <option value="Blue">Blue</option>
      </select>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => setShowGraphs(!showGraphs)}>
            {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
          </Button>
        </div>
        {selectedColor === 'All' ? (
          <div className="report-container">
            <div className="report-column">
              <OneTeamReport color="Blue" robotNumber={teamNumbers[0]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Blue" robotNumber={teamNumbers[1]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Blue" robotNumber={teamNumbers[2]} chart={Chart1} graphStatus={showGraphs} />
            </div>
            <div className="report-column">
              <OneTeamReport color="Red" robotNumber={teamNumbers[3]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Red" robotNumber={teamNumbers[4]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Red" robotNumber={teamNumbers[5]} chart={Chart1} graphStatus={showGraphs} />
            </div>
          </div>
        ) : (
          <>
            hi
          </>
        )}
      </div>
    </div>
  );
};

export default MPR;