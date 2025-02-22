import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface AcquireCoralNearVsFarProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32'];

const AcquireCoralNearVsFar: React.FC<AcquireCoralNearVsFarProps> = ({ chart, selectedTeam }) => {
  const [pointsData, setPointsData] = useState<any[]>([]);

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

          const teamData = parsedData.filter((row: any) =>
            row['Team'] === selectedTeam &&
            row['RecordType'] === 'Activities' &&
            row['Mode'] === 'Teleop'
          );

          const nearData = teamData.filter((row: any) => row['AcqCoral_Near_Far'] === 'Near').length;
          const farData = teamData.filter((row: any) => row['AcqCoral_Near_Far'] === 'Far').length;

          const uniqueMatches = new Set(parsedData.map((row: any) => row['Team'] === selectedTeam && row['Match']));
          const matchCount = uniqueMatches.size - 1;

          const averageNear = (nearData / matchCount).toFixed(2);
          const averageFar = (farData / matchCount).toFixed(2);

          setPointsData([
            { name: 'Near', value: parseFloat(averageNear) },
            { name: 'Far', value: parseFloat(averageFar) }
          ]);

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
          data={pointsData}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {pointsData.map((_entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default AcquireCoralNearVsFar;