import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface StartingLocationProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32'];

const StartingLocation: React.FC<StartingLocationProps> = ({ chart, selectedTeam }) => {
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

          const startingLocColumnData = teamData.map((row: any) => row['Starting_Loc']);
          setStartingLocData(startingLocColumnData);
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
          data={startingLocData.toString().split(',').reduce((acc: any, curr: string) => {
            const existing = acc.find((item: any) => item.name === curr);
            if (existing) {
              existing.value += 1;
            } else {
              acc.push({ name: curr, value: 1 });
            }
            return acc;
          }, [])}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {startingLocData.toString().split(',').reduce((acc: any, curr: string) => {
            const existing = acc.find((item: any) => item.name === curr);
            if (existing) {
              existing.value += 1;
            } else {
              acc.push({ name: curr, value: 1 });
            }
            return acc;
          }, []).map((_entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default StartingLocation;