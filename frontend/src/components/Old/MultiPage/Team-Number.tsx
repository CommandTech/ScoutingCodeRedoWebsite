import React from 'react';

interface TeamNumberProps {
  teams: string[];
  scoutCounts: { [team: string]: number };
}

const TeamNumber: React.FC<TeamNumberProps> = ({ teams, scoutCounts }) => {
  const uniqueTeams = Array.from(new Set(teams));

  return (
    <div>
      {uniqueTeams.map((team, index) => (
        <div key={index}>
          <span>{team}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamNumber;