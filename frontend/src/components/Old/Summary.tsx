import React, { useState, useEffect } from 'react';
// import MatchNumberDD from '../MultiPage/MatchNumberDD';
// import AllianceColorDD from '../MultiPage/AllianceColorDD';
// import TeamNumber from '../MultiPage/Team-Number';
// import NumberScouted from '../MultiPage/NumberScouted';
// import ScoutedLabel from '../MultiPage/ScoutedLabel';
// import AllianceStation, { labels } from '../MultiPage/AllianceStation';
// import RankLabel from '../MultiPage/RankLabel';
// import Rank from '../MultiPage/Rank';
import axios from 'axios';
import './CSS/Summary.css';

const Summary: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('red');
  const [teams, setTeams] = useState<string[]>([]);
  const [scoutCounts, setScoutCounts] = useState<{ [team: string]: number }>({});
  const [config, setConfig] = useState({ baseURL: '', apiKey: '', year: '', EventCode: '' });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/config');
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!config.baseURL || !config.apiKey || !selectedMatch) return;

      try {
        const response = await axios.get(`${config.baseURL}event/${config.year}${config.EventCode}/matches?X-TBA-Auth-Key=${config.apiKey}`);
        const matches = response.data;
        const filteredTeams = matches
          .filter((match: any) => match.match_number.toString() === selectedMatch && match.comp_level === 'qm')
          .flatMap((match: any) => selectedColor === 'red' ? match.alliances.red.team_keys : match.alliances.blue.team_keys)
          .map((teamKey: string) => teamKey.replace('frc', ''));
        setTeams(filteredTeams);

        // Fetch scout counts for each team
        const counts: { [team: string]: number } = {};
        for (const team of filteredTeams) {
          const response = await axios.get('/ExcelCSVFiles/Activities.csv');
          const csvData = response.data;
          const rows = csvData.split('\n').slice(1); // Skip header row
          const filteredRows = rows.filter((row: string) => {
            const columns = row.split(',');
            return columns[1] === 'frc' + team && columns[4] === 'EndMatch';
          });
          counts[team] = filteredRows.length;
        }
        setScoutCounts(counts);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [selectedMatch, selectedColor, config]);

  return (
    <div>
      {/* <MatchNumberDD onMatchChange={setSelectedMatch} />
      <div className="alliance-team-row">
        <AllianceColorDD onColorChange={setSelectedColor} />
      </div>
      <br />
      {teams.map((team, index) => (
        <table key={team} className="team-info-table">
          <tbody className={selectedColor}>
            <tr>
              <td><AllianceStation alliance_station={labels[index % labels.length]} /></td>
              <td><ScoutedLabel /></td>
              <td><RankLabel /></td>
            </tr>
            <tr>
              <td><TeamNumber teams={[team]} scoutCounts={scoutCounts} /></td>
              <td><NumberScouted teamNumber={team} /></td>
              <td><Rank teamNumber={team} /></td>
            </tr>
          </tbody>
        </table>
      ))} */}
    </div>
  );
};

export default Summary;