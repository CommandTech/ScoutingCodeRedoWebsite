import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { readCSVFile } from '../../utils/readCSV';

interface PointsPerDriverStationProps {
  chart: string;
  selectedTeam: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61', '#6B8E23', '#FF4500', '#DA70D6', '#32CD32'];

const PointsPerDriverStation: React.FC<PointsPerDriverStationProps> = ({ chart, selectedTeam }) => {
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

          const teamData = parsedData.filter((row: any) => row['Team'] === selectedTeam);

          const driverStationPoints: { [key: string]: { totalPoints: number, matchCount: number } } = {};

          teamData.forEach((row: any) => {
            if (row['RecordType'] === 'EndMatch') {
              const endAutoRow = teamData.find((r: any) => r['Match'] === row['Match'] && r['DriveSta'] === row['DriveSta'] && r['RecordType'] === 'EndAuto');
              if (endAutoRow) {
                const pointsScored = parseInt(row['PointScored'], 10) - parseInt(endAutoRow['PointScored'], 10);
                if (!driverStationPoints[row['DriveSta']]) {
                  driverStationPoints[row['DriveSta']] = { totalPoints: 0, matchCount: 0 };
                }
                driverStationPoints[row['DriveSta']].totalPoints += pointsScored;
                driverStationPoints[row['DriveSta']].matchCount += 1;
              }
            }
            console.log(driverStationPoints);
          });

          const pointsColumnData = Object.keys(driverStationPoints).map((driveSta) => ({
            name: driveSta,
            value: parseFloat((driverStationPoints[driveSta].totalPoints / driverStationPoints[driveSta].matchCount).toFixed(2))
          }));

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

export default PointsPerDriverStation;