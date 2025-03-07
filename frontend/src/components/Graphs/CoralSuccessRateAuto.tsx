import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface CoralSuccessRateAutoProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32', '#FFD700', '#8A2BE2', '#DC143C', '#00CED1', '#FF1493'];

const CoralSuccessRateAuto: React.FC<CoralSuccessRateAutoProps> = ({ chart, selectedTeam }) => {
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

          const teamData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndAuto');

          const matchCount = teamData.length;

          const aggregatedData = teamData.reduce((acc: any, row: any) => {
            acc['DelCoralL1'] = (acc['DelCoralL1'] || 0) + parseInt(row['DelCoralL1'], 10);
            acc['DelCoralL2'] = (acc['DelCoralL2'] || 0) + parseInt(row['DelCoralL2'], 10);
            acc['DelCoralL3'] = (acc['DelCoralL3'] || 0) + parseInt(row['DelCoralL3'], 10);
            acc['DelCoralL4'] = (acc['DelCoralL4'] || 0) + parseInt(row['DelCoralL4'], 10);
            acc['AcqAlgaeF'] = (acc['AcqAlgaeF'] || 0) + parseInt(row['AcqAlgaeF'], 10);
            return acc;
          }, {});

          const pointsColumnData = [
            { name: 'Acquire Algae', value: parseFloat(((aggregatedData['DelCoralL1'] + aggregatedData['DelCoralL2'] + aggregatedData['DelCoralL3'] + aggregatedData['DelCoralL4']) / matchCount).toFixed(2)) },
            { name: 'Drop', value: parseFloat((aggregatedData['AcqAlgaeF'] / matchCount).toFixed(2)) }
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

export default CoralSuccessRateAuto;