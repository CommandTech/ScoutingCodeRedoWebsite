import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface DeliveriesNearVsFarProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32'];

const DeliveriesNearVsFar: React.FC<DeliveriesNearVsFarProps> = ({ chart, selectedTeam }) => {
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
            row['Mode'] === 'Auto'
          );

          const matchCount = teamData.length;
          const nearDeliveries = teamData.filter((row: any) => row['Del_Near_Far'] === 'Near').length;
          const farDeliveries = teamData.filter((row: any) => row['Del_Near_Far'] === 'Far').length;

          const averageNearDeliveries = matchCount > 0 ? (nearDeliveries / matchCount).toFixed(2) : '0';
          const averageFarDeliveries = matchCount > 0 ? (farDeliveries / matchCount).toFixed(2) : '0';

          const pointsColumnData = [
            { name: 'Average Near Deliveries', value: parseFloat(averageNearDeliveries) },
            { name: 'Average Far Deliveries', value: parseFloat(averageFarDeliveries) }
          ];

          setPointsData(pointsColumnData);
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

export default DeliveriesNearVsFar;