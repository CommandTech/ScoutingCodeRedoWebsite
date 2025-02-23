import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface CoralSuccessRateProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32', '#FFD700', '#8A2BE2', '#DC143C', '#00CED1', '#FF1493'];

const CoralSuccessRate: React.FC<CoralSuccessRateProps> = ({ chart, selectedTeam }) => {
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

          const endAutoData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndAuto');
          const endMatchData = parsedData.filter((row: any) => row['Team'] === selectedTeam && row['RecordType'] === 'EndMatch');

          const matchCount = endMatchData.length;

          const aggregatedEndAutoData = endAutoData.reduce((acc: any, row: any) => {
            acc['DelCoralL1'] = (acc['DelCoralL1'] || 0) + parseInt(row['DelCoralL1'], 10);
            acc['DelCoralL2'] = (acc['DelCoralL2'] || 0) + parseInt(row['DelCoralL2'], 10);
            acc['DelCoralL3'] = (acc['DelCoralL3'] || 0) + parseInt(row['DelCoralL3'], 10);
            acc['DelCoralL4'] = (acc['DelCoralL4'] || 0) + parseInt(row['DelCoralL4'], 10);
            acc['DelCoralF'] = (acc['DelCoralF'] || 0) + parseInt(row['DelCoralF'], 10);
            return acc;
          }, {});

          const aggregatedEndMatchData = endMatchData.reduce((acc: any, row: any) => {
            acc['DelCoralL1'] = (acc['DelCoralL1'] || 0) + parseInt(row['DelCoralL1'], 10);
            acc['DelCoralL2'] = (acc['DelCoralL2'] || 0) + parseInt(row['DelCoralL2'], 10);
            acc['DelCoralL3'] = (acc['DelCoralL3'] || 0) + parseInt(row['DelCoralL3'], 10);
            acc['DelCoralL4'] = (acc['DelCoralL4'] || 0) + parseInt(row['DelCoralL4'], 10);
            acc['DelCoralF'] = (acc['DelCoralF'] || 0) + parseInt(row['DelCoralF'], 10);
            return acc;
          }, {});

          const pointsColumnData = [
            { name: 'Acquire Algae', value: parseFloat(((aggregatedEndMatchData['DelCoralL1'] + aggregatedEndMatchData['DelCoralL2'] + aggregatedEndMatchData['DelCoralL3'] + aggregatedEndMatchData['DelCoralL4'] 
              - aggregatedEndAutoData['DelCoralL1'] - aggregatedEndAutoData['DelCoralL2'] - aggregatedEndAutoData['DelCoralL3'] - aggregatedEndAutoData['DelCoralL4']) / matchCount).toFixed(2)) },
            { name: 'Drop', value: parseFloat(((aggregatedEndMatchData['DelCoralF'] - aggregatedEndAutoData['DelCoralF']) / matchCount).toFixed(2)) }
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

export default CoralSuccessRate;