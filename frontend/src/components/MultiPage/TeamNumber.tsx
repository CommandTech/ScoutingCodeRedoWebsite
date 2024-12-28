import React from 'react';
import './CSS/TeamNumber.css';

interface TeamNumberProps {
  teams: string[];
  color: string;
  scoutCounts: { [team: string]: number };
}

const TeamNumber: React.FC<TeamNumberProps> = ({ teams, color, scoutCounts }) => {
  const uniqueTeams = Array.from(new Set(teams));
  const labels = ["Amp Sta.", "Center Sta.", "Source Sta."];

  return (
    <div className={`team-number ${color}`}>
      {uniqueTeams.map((team, index) => (
        <div key={index} className="team-container">
          <div className="label-scout">
            <span className="team-label">{labels[index]}</span>
            <span className="scouted-label">Scouted:</span>
          </div>
          <div className="scout-count">
            <span className="team-name">{team}</span>
            <span className="scout-number">{scoutCounts[team] || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamNumber;