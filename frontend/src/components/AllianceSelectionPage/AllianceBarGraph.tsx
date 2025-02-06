import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AllianceBarGraphProps {
  teamData: {
    teamAverageAutoPoints: { [key: string]: number };
    teamAverageAlgaePoints: { [key: string]: number };
    teamAverageCoralPoints: { [key: string]: number };
    teamAverageSurfacingPoints: { [key: string]: number };
    teamAveragePoints: { [key: string]: number };
  };
  pickedTeams: string[][];
}

const AllianceBarGraph: React.FC<AllianceBarGraphProps> = ({ teamData, pickedTeams }) => {
  const labels = pickedTeams.map((_, index) => `Alliance ${index + 1}`);

  const calculateTotalPoints = (teams: string[], category: keyof typeof teamData) => {
    if (!Array.isArray(teams)) return 0;
    return teams.reduce((total, team) => total + (teamData[category as keyof typeof teamData][team] || 0), 0);
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Auto Points',
        data: pickedTeams.map((teams) => calculateTotalPoints(teams, 'teamAverageAutoPoints')),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Algae Points',
        data: pickedTeams.map((teams) => calculateTotalPoints(teams, 'teamAverageAlgaePoints')),
        backgroundColor: 'rgba(36, 188, 171, 0.5)',
      },
      {
        label: 'Coral Points',
        data: pickedTeams.map((teams) => calculateTotalPoints(teams, 'teamAverageCoralPoints')),
        backgroundColor: 'rgba(238, 255, 0, 0.5)',
      },
      {
        label: 'Surfacing Points',
        data: pickedTeams.map((teams) => calculateTotalPoints(teams, 'teamAverageSurfacingPoints')),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Alliance Points by Category',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AllianceBarGraph;