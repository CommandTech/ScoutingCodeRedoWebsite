import React from 'react';
import './CSS/Team-Number.css';

interface TeamNumberProps {
  teams: string[];
  color: string;
  scoutCounts: { [team: string]: number };
}

const TeamNumber: React.FC<TeamNumberProps> = ({ teams, color, scoutCounts }) => {
  const uniqueTeams = Array.from(new Set(teams));

  return (
    <div className={`team-number ${color}`}>
      {uniqueTeams.map((team, index) => (
        <div key={index} className="team-container">
          <span className="team-name">{team}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamNumber;