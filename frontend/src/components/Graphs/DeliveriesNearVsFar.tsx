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
  const [previousDelCoralF, setPreviousDelCoralF] = useState<number | null>(null);

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

          const uniqueMatches = new Set(parsedData.map((row: any) => row['Team'] === selectedTeam && row['Match']));
          const matchCount = uniqueMatches.size - 1;

          const nearFarData: any = {};
          let lastDelCoralF = previousDelCoralF;

          teamData.forEach((row: any) => {
            const deliveryType = row['Del_Near_Far'];
            const currentDelCoralF = row['DelCoralF'];

            if (!nearFarData[deliveryType]) {
              nearFarData[deliveryType] = 0;
            }
            nearFarData[deliveryType] += 1;

            if (lastDelCoralF !== null && currentDelCoralF > lastDelCoralF) {
              if (deliveryType === 'Near' || deliveryType === 'Far') {
                nearFarData[deliveryType] -= 1;
              }
            }
            lastDelCoralF = currentDelCoralF;
          });

          setPreviousDelCoralF(lastDelCoralF);
          const formattedData = Object.keys(nearFarData).map(key => ({
            name: key,
            value: parseFloat(((nearFarData[key] - 1) / matchCount).toFixed(2))
          }));

          setPointsData(formattedData);
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