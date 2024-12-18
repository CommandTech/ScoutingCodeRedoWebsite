import { readCSVFile } from '../utils/readCSV';
import React, { useState, useEffect } from 'react';
import TeamActivitiesTable from './TeamData/TeamActivitiesTable';
import DelOrigCountsTable from './TeamData/DelOrigCountsTable';

const Team = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [teamData, setTeamData] = useState<{ [key: string]: string | number }>({});
    const [filteredData, setFilteredData] = useState<{ [key: string]: string | number }[]>([]);
    const [showTeamTable, setShowTeamTable] = useState(false);
    const [showDelOrigTable, setShowDelOrigTable] = useState(false);
    const [delOrigCounts, setDelOrigCounts] = useState<{ [matchNumber: string]: { [key: string]: number } }>({});

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch('/ExcelCSVFiles/Dyno_Data.csv');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvData = await response.text();
                const parsedData = await readCSVFile(new File([csvData], 'Dyno_Data.csv', { type: 'text/csv' }));

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
                const response = await fetch('/ExcelCSVFiles/Dyno_Data.csv');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvData = await response.text();
                const parsedData = await readCSVFile(new File([csvData], 'Dyno_Data.csv', { type: 'text/csv' }));

                const team = parsedData.find((row: any) => row['Team'] === teamName);
                setTeamData(team as { [key: string]: string | number });
                const filtered = parsedData.filter((row: any) => row['Team'] === teamName);
                setFilteredData(filtered);

                // Count occurrences of DelOrig values by match number
                const counts: { [matchNumber: string]: { [key: string]: number } } = {};
                filtered.forEach(d => {
                    const matchNumber = d.Match;
                    if (!counts[matchNumber]) {
                        counts[matchNumber] = {};
                    }
                    counts[matchNumber][d.DelOrig] = (counts[matchNumber][d.DelOrig] || 0) + 1;
                });
                setDelOrigCounts(counts);

                setShowTeamTable(true);
                setShowDelOrigTable(true);
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        } else {
            setTeamData({});
            setFilteredData([]);
            setDelOrigCounts({});
            setShowTeamTable(false);
            setShowDelOrigTable(false);
        }
    };

    const toggleTeamTable = () => {
        setShowTeamTable(!showTeamTable);
    };

    const toggleDelOrigTable = () => {
        setShowDelOrigTable(!showDelOrigTable);
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
            {selectedTeam && (
                <div>
                    <button onClick={toggleTeamTable}>
                        {showTeamTable ? 'Hide Team Activities' : 'Show Team Activities'}
                    </button>
                    <button onClick={toggleDelOrigTable}>
                        {showDelOrigTable ? 'Hide DelOrig Counts' : 'Show DelOrig Counts'}
                    </button>
                </div>
            )}
            {showTeamTable && filteredData.length > 0 && (
                <TeamActivitiesTable filteredData={filteredData} />
            )}
            {showDelOrigTable && Object.keys(delOrigCounts).length > 0 && (
                <DelOrigCountsTable delOrigCounts={delOrigCounts} />
            )}
        </div>
    );
};

export default Team;