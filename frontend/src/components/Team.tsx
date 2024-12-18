import { readCSVFile } from '../utils/readCSV';
import React, { useState, useEffect } from 'react';

const Team = () => {
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [teamData, setTeamData] = useState<{ [key: string]: string | number }>({});
    const [filteredData, setFilteredData] = useState<{ [key: string]: string | number }[]>([]);
    const [showTable, setShowTable] = useState(false);
    const [delOrigCounts, setDelOrigCounts] = useState<{ [key: string]: number }>({});

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

                // Count occurrences of DelOrig values
                const counts: { [key: string]: number } = {};
                filtered.forEach(d => {
                    counts[d.DelOrig] = (counts[d.DelOrig] || 0) + 1;
                });
                setDelOrigCounts(counts);

                setShowTable(true);
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        } else {
            setTeamData({});
            setFilteredData([]);
            setDelOrigCounts({});
            setShowTable(false);
        }
    };

    const toggleTable = () => {
        setShowTable(!showTable);
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
                <button onClick={toggleTable}>
                    {showTable ? 'Hide Team Activities' : 'Show Team Activities'}
                </button>
            )}
            {showTable && filteredData.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(filteredData[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(data).map((value, colIndex) => (
                                        <td key={colIndex}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>DelOrig Counts</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>DelOrig</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(delOrigCounts).map(([key, count], index) => (
                                <tr key={index}>
                                    <td>{key}</td>
                                    <td>{count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Team;