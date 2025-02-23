import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface AlgaeSuccessRateProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32', '#FFD700', '#8A2BE2', '#DC143C', '#00CED1', '#FF1493'];

const AlgaeSuccessRate: React.FC<AlgaeSuccessRateProps> = ({ chart, selectedTeam }) => {
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
            acc['DelAlgaeP'] = (acc['DelAlgaeP'] || 0) + parseInt(row['DelAlgaeP'], 10);
            acc['DelAlgaeN'] = (acc['DelAlgaeN'] || 0) + parseInt(row['DelAlgaeN'], 10);
            acc['DelAlgaeF'] = (acc['DelAlgaeF'] || 0) + parseInt(row['DelAlgaeF'], 10);
            return acc;
          }, {});

          const aggregatedEndMatchData = endMatchData.reduce((acc: any, row: any) => {
            acc['DelAlgaeP'] = (acc['DelAlgaeP'] || 0) + parseInt(row['DelAlgaeP'], 10);
            acc['DelAlgaeN'] = (acc['DelAlgaeN'] || 0) + parseInt(row['DelAlgaeN'], 10);
            acc['DelAlgaeF'] = (acc['DelAlgaeF'] || 0) + parseInt(row['DelAlgaeF'], 10);
            return acc;
          }, {});

          const pointsColumnData = [
            { name: 'Acquire Algae', value: parseFloat(((aggregatedEndMatchData['DelAlgaeP'] + aggregatedEndMatchData['DelAlgaeN'] - aggregatedEndAutoData['DelAlgaeP'] - aggregatedEndAutoData['DelAlgaeN']) / matchCount).toFixed(2)) },
            { name: 'Drop', value: parseFloat(((aggregatedEndMatchData['DelAlgaeF'] - aggregatedEndAutoData['DelAlgaeF']) / matchCount).toFixed(2)) }
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

export default AlgaeSuccessRate;