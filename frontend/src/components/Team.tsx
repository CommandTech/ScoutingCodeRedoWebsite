import React, { useState, useEffect } from 'react';
import { readCSVFile } from '../utils/readCSV';

const Team = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [teamData, setTeamData] = useState<{ [key: string]: string | number }>({});

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/ExcelCSVFiles/Dyno_Data.csv');
                console.log('Response URL:', response.url); // Log response URL
                console.log('Response Status:', response.status); // Log response status
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvData = await response.text();
                console.log('CSV Data:', csvData); // Log raw CSV data
                const parsedData = await readCSVFile(new File([csvData], 'Dyno_Data.csv', { type: 'text/csv' }));
                console.log('Parsed Data:', parsedData); // Log parsed data

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

                console.log('Sorted Team Names:', uniqueTeamNames); // Log sorted team names
                setTeams(uniqueTeamNames);
            } catch (error) {
                console.error('Error fetching or parsing CSV:', error);
            }
        };

        fetchTeams();
    }, []);

    const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const teamName = event.target.value;
        setSelectedTeam(teamName);

        // Fetch and set the selected team's data
        const fetchTeamData = async () => {
            try {
                const response = await fetch('/Dyno_Data.csv');
                console.log('Response URL:', response.url); // Log response URL
                console.log('Response Status:', response.status); // Log response status
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvData = await response.text();
                console.log('CSV Data:', csvData); // Log raw CSV data
                const parsedData = await readCSVFile(new File([csvData], 'Dyno_Data.csv', { type: 'text/csv' }));
                console.log('Parsed Data:', parsedData); // Log parsed data
                const team = parsedData.find((row: any) => row['Team'] === teamName);
                setTeamData(team as { [key: string]: string | number });
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };

        fetchTeamData();
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
            {selectedTeam && teamData && (
                <table>
                    <thead>
                        <tr>
                            {Object.keys(teamData).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {Object.values(teamData).map((value, index) => (
                                <td key={index}>{value}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Team;