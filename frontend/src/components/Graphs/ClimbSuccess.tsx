import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface ClimbSuccessProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32', '#FFD700', '#8A2BE2', '#DC143C', '#00CED1', '#FF1493'];

const ClimbSuccess: React.FC<ClimbSuccessProps> = ({ chart, selectedTeam }) => {
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

          const teamData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndMatch');

          let successCount = 0;
          let failCount = 0;

          teamData.forEach((row: any) => {
            if (row['CageAttept'] === 'Y') {
              if (row['EndState'] === 'Deep' || row['EndState'] === 'Shallow') {
                successCount++;
              } else {
                failCount++;
              }
            }
          });

          const totalAttempts = successCount + failCount;
          const successPercentage = totalAttempts > 0 ? parseFloat(((successCount / totalAttempts) * 100).toFixed(2)) : 0;
          const failPercentage = totalAttempts > 0 ? parseFloat(((failCount / totalAttempts) * 100).toFixed(2)) : 0;

          setPointsData([
            { name: 'Success', value: successPercentage },
            { name: 'Fail', value: failPercentage }
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

export default ClimbSuccess;