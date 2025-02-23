import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface DeliveriesPerDriverStationProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32', '#FFD700', '#8A2BE2', '#DC143C', '#00CED1', '#FF1493'];

const DeliveriesPerDriverStation: React.FC<DeliveriesPerDriverStationProps> = ({ chart, selectedTeam }) => {
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
            (row['RecordType'] === 'EndMatch' || row['RecordType'] === 'EndAuto')
          );

          const summedData = teamData.reduce((acc: any, row: any) => {
            const driveSta = row.DriveSta;
            const sum = ['DelCoralL1', 'DelCoralL2', 'DelCoralL3', 'DelCoralL4', 'DelAlgaeP', 'DelAlgaeN']
              .reduce((total, key) => total + (parseFloat(row[key]) || 0), 0);

            if (!acc[driveSta]) {
              acc[driveSta] = { name: driveSta, value: 0, count: 0 };
            }

            if (row['RecordType'] === 'EndMatch') {
              acc[driveSta].value += sum;
              acc[driveSta].count += 1;
            } else if (row['RecordType'] === 'EndAuto') {
              acc[driveSta].value -= sum;
            }

            return acc;
          }, {});

          const averagedData = Object.values(summedData).map((item: any) => ({
            name: item.name,
            value: item.value / item.count
          }));

          setPointsData(averagedData);

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

export default DeliveriesPerDriverStation;