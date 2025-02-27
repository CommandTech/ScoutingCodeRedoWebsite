import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { readCSVFile } from '../utils/readCSV';
import Summary from './TeamPage/Summary';
import Surfacing from './TeamPage/Surfacing';
import Auto from './TeamPage/Auto';
import Teleop from './TeamPage/Teleop';
import axios from 'axios';

const Team = () => {
    const [teams, setTeams] = useState<{ name: string, nickname: string }[]>([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [config, setConfig] = useState({ baseURL: '', apiKey: '' });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('/config');
                setConfig(response.data);
            } catch (error) {
                setError('Error fetching configuration');
                console.error(error);
            }
        };

        fetchConfig();
    }, []);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/ExcelCSVFiles/Activities.csv');
                const csvData = await response.text();
                const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

                if (!parsedData || !Array.isArray(parsedData)) {
                    throw new Error('Parsed data is not an array or is undefined');
                }

                const teamNames = parsedData.map((row: any) => row['Team']).filter(Boolean);

                // Remove duplicates using a Set
                const uniqueTeamNames = Array.from(new Set(teamNames));

                // Sort team names numerically based on the number part
                uniqueTeamNames.sort((a: string, b: string) => {
                    const numA = parseInt(a.replace('frc', ''), 10);
                    const numB = parseInt(b.replace('frc', ''), 10);
                    return numA - numB;
                });

                const teamsWithNicknames = await Promise.all(uniqueTeamNames.map(async (teamName) => {
                    try {
                        const response = await axios.get(`${config.baseURL}team/${teamName}/simple?X-TBA-Auth-Key=${config.apiKey}`);
                        return { name: teamName, nickname: response.data.nickname };
                    } catch (error) {
                        console.error(`Error fetching nickname for team ${teamName}`, error);
                        return { name: teamName, nickname: '' };
                    }
                }));

                setTeams(teamsWithNicknames);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        if (config.baseURL && config.apiKey) {
            fetchTeams();
        }
    }, [config]);

    const handleTeamChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const teamName = event.target.value;
        setSelectedTeam(teamName);

        if (teamName) {
            try {
                // Fetch and set data related to the selected team
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <div>
            <select onChange={handleTeamChange} value={selectedTeam}>
                <option value="">Select a team</option>
                {teams.map((team, index) => (
                    <option key={index} value={team.name}>
                        {team.name}: {team.nickname}
                    </option>
                ))}
            </select>

            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Summary" />
                <Tab label="Auto" />
                <Tab label="Teleop" />
                <Tab label="Surfacing" />
            </Tabs>

            <Box>
                {tabIndex === 0 && <Summary selectedTeam={selectedTeam} />}
                {tabIndex === 1 && <Auto selectedTeam={selectedTeam} />}
                {tabIndex === 2 && <Teleop selectedTeam={selectedTeam} />}
                {tabIndex === 3 && <Surfacing selectedTeam={selectedTeam} />}
            </Box>
        </div>
    );
};

export default Team;

function setError(arg0: string) {
    throw new Error('Function not implemented.');
}