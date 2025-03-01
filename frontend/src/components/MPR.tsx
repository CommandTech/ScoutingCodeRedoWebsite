import React, { useEffect, useState } from 'react';
import OneTeamReport from './MPRPage/OneTeamReport';
import { readCSVFile } from '../utils/readCSV';
import { calculateDifferences, calculateClimbTimes, calculateCoralCounts } from '../utils/reportingFunctions';
import './CSS/MPR.css';
import { InputLabel, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';
import axios from 'axios';

const MPR = () => {
  const [teams, setTeams] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedColor, setSelectedColor] = useState('All');
  const [blueTeams, setBlueTeams] = useState<string[]>(['', '', '']);
  const [redTeams, setRedTeams] = useState<string[]>(['', '', '']);
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
  const [config, setConfig] = useState({ baseURL: '', apiKey: '', EventCode: '', year: '' });

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
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${config.baseURL}event/${config.year}${config.EventCode}/matches/simple?X-TBA-Auth-Key=${config.apiKey}`);
        const matches = response.data.filter((match: any) => match.comp_level === 'qm');
        const matchNumbers = matches.map((match: any) => match.match_number).sort((a: number, b: number) => a - b);
        console.log(`${config.baseURL}event/${config.year}${config.EventCode}/matches/simple?X-TBA-Auth-Key=${config.apiKey}`);
        setTeams(matchNumbers);
      } catch (error) {
        console.error('Error fetching matches:', error);
        console.log(`${config.baseURL}event/${config.year}${config.EventCode}/matches/simple?X-TBA-Auth-Key=${config.apiKey}`);
      }
    };

    if (config.baseURL && config.apiKey && config.EventCode) {
      fetchMatches();
    }
  }, [config]);

  const handleTeamChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchNumber = event.target.value;
    setSelectedMatch(matchNumber);

    try {
      const response = await axios.get(`${config.baseURL}event/${config.year}${config.EventCode}/matches/simple?X-TBA-Auth-Key=${config.apiKey}`);
      const match = response.data.find((match: any) => match.match_number === parseInt(matchNumber));
      if (match) {
        const blueTeams = match.alliances.blue.team_keys.map((team: string) => team);
        const redTeams = match.alliances.red.team_keys.map((team: string) => team.replace('frc', ''));
        console.log(blueTeams, redTeams);
        setBlueTeams(blueTeams);
        setRedTeams(redTeams);
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
              <OneTeamReport color="Blue" robotNumber={blueTeams[0]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Blue" robotNumber={blueTeams[1]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Blue" robotNumber={blueTeams[2]} chart={Chart1} graphStatus={showGraphs} />
            </div>
            <div className="report-column">
              <OneTeamReport color="Red" robotNumber={redTeams[0]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Red" robotNumber={redTeams[1]} chart={Chart1} graphStatus={showGraphs} />
              <OneTeamReport color="Red" robotNumber={redTeams[2]} chart={Chart1} graphStatus={showGraphs} />
            </div>
          </div>
        ) : (
          <div className="report-container">
            {selectedColor === 'Blue' ? (
              <div className="report-column">
                <OneTeamReport color="Blue" robotNumber={blueTeams[0]} chart={Chart1} graphStatus={showGraphs} />
                <OneTeamReport color="Blue" robotNumber={blueTeams[1]} chart={Chart1} graphStatus={showGraphs} />
                <OneTeamReport color="Blue" robotNumber={blueTeams[2]} chart={Chart1} graphStatus={showGraphs} />
              </div>
            ) : (
              <div className="report-column">
                <OneTeamReport color="Red" robotNumber={redTeams[0]} chart={Chart1} graphStatus={showGraphs} />
                <OneTeamReport color="Red" robotNumber={redTeams[1]} chart={Chart1} graphStatus={showGraphs} />
                <OneTeamReport color="Red" robotNumber={redTeams[2]} chart={Chart1} graphStatus={showGraphs} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MPR;