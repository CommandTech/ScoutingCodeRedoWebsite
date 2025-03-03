import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AptsTDisplay = ({ selectedTeams }: { selectedTeams: any[] }) => {
  const [averageAptsT, setAverageAptsT] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchAptsT = async () => {
      try {
        const response = await fetch('/TBA_Matches-All.csv');
        const text = await response.text();
        const rows = text.split('\n');
        const newAverageAptsT: { [key: string]: number } = {};
        rows.forEach(row => {
          const [team, value] = row.split(',');
          if (team && value) {
            newAverageAptsT[team] = parseFloat(value);
          }
        });
        setAverageAptsT(newAverageAptsT);
      } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
      }
    };

    if (selectedTeams.length > 0) {
      fetchAptsT();
    }
  }, [selectedTeams]);

  // Extract team names from selectedTeams
  const teams = selectedTeams.flatMap(team => [
    team['Red0'],
    team['Red1'],
    team['Red2'],
    team['Blue0'],
    team['Blue1'],
    team['Blue2']
  ]).filter(Boolean); // Filter out any undefined or null values

  const data = {
    labels: teams,
    datasets: [
      {
        label: 'Average AptsT',
        data: teams.map(team => averageAptsT?.[team] !== null ? averageAptsT[team] : 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as 'top',
      },
      title: {
        display: true,
        text: 'Average AptsT by Team',
      },
    },
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Average AptsT</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team}>
              <td>{team}</td>
              <td>{averageAptsT?.[team] != null ? averageAptsT[team]?.toFixed(2) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AptsTDisplay;