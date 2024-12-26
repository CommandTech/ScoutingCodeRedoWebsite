import React from 'react';
import './CSS/TeamNumber.css';

interface TeamNumberProps {
  teams: string[];
  color: string;
}

const TeamNumber: React.FC<TeamNumberProps> = ({ teams, color }) => {
  const uniqueTeams = Array.from(new Set(teams));

  return (
    <div className={`team-number ${color}`}>
      {uniqueTeams.map((team, index) => (
        <span key={index}>{team}</span>
      ))}
    </div>
  );
};

export default TeamNumber;