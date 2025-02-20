import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface StartingLocationProps {
  data: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StartingLocation: React.FC<StartingLocationProps> = ({ data }) => {
  const locationsArray = data.split(',');
  const processedData = locationsArray.reduce((acc: any, loc: string) => {
    const trimmedLoc = loc.trim();
    const existing = acc.find((item: any) => item.name === trimmedLoc);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: trimmedLoc, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div>
      <PieChart width={400} height={400}>
        <text x={200} y={20} textAnchor="middle" dominantBaseline="middle">
          Starting Location
        </text>
        <Pie
          data={processedData}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {processedData.map((_entry: any, index: number) => (
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