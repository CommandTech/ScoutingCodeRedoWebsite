import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { readCSVFile } from '../utils/readCSV';
import Summary from './TeamPage/Summary';

const Team = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [tabIndex, setTabIndex] = useState(0);

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

                setTeams(uniqueTeamNames);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

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
                    <option key={index} value={team}>
                        {team}
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
                {/* {tabIndex === 0 && <Summary />} */}
                {tabIndex === 1 && <div>Auto Content</div>}
                {tabIndex === 2 && <div>Teleop Content</div>}
                {tabIndex === 3 && <div>Surfacing Content</div>}
            </Box>
        </div>
    );
};

export default Team;