import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface PointsPerStartLocationProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32', '#FFD700', '#8A2BE2', '#DC143C', '#00CED1', '#FF1493'];

const PointsPerStartLocation: React.FC<PointsPerStartLocationProps> = ({ chart, selectedTeam }) => {
  const [startingLocData, setStartingLocData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (selectedTeam) {
        try {
          const response = await fetch('/ExcelCSVFiles/Activities.csv');
          const csvData = await response.text();
          const parsedData = await readCSVFile(new File([csvData], 'Activities.csv', { type: 'text/csv' }));

          if (!parsedData || !Array.isArray(parsedData)) {
            throw new Error('Parsed data is not an array or is undefined');
          }

          const teamData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndAuto');

          const startingLocPointsData = teamData.reduce((acc: any, row: any) => {
            const startingLoc = row['Starting_Loc'];
            const points = parseFloat(row['PointScored']);
            if (!acc[startingLoc]) {
              acc[startingLoc] = { totalPoints: 0, count: 0 };
            }
            acc[startingLoc].totalPoints += points;
            acc[startingLoc].count += 1;
            return acc;
          }, {});

          const averagePointsData = Object.keys(startingLocPointsData).map((loc) => ({
            name: loc,
            value: parseFloat((startingLocPointsData[loc].totalPoints / startingLocPointsData[loc].count).toFixed(2)),
          }));

          setStartingLocData(averagePointsData);
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      }
    };

    fetchTeamData();
  }, [selectedTeam]);

  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={startingLocData}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {startingLocData.map((_entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PointsPerStartLocation;