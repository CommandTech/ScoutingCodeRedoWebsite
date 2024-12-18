import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DelOrigCountsTableProps {
    delOrigCounts: { [matchNumber: string]: { [key: string]: number } };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

const DelOrigCountsTable: React.FC<DelOrigCountsTableProps> = ({ delOrigCounts }) => {
    // Get all unique DelOrig values
    const delOrigValues = Array.from(
        new Set(Object.values(delOrigCounts).flatMap(counts => Object.keys(counts).filter(key => key !== '-')))
    );

    // Get all match numbers
    const matchNumbers = Object.keys(delOrigCounts);

    // Calculate the average data for the pie chart
    const averageData = delOrigValues.map(delOrig => {
        const total = matchNumbers.reduce((sum, matchNumber) => {
            return sum + (delOrigCounts[matchNumber][delOrig] || 0);
        }, 0);
        const average = total / matchNumbers.length;
        return { name: delOrig, value: average };
    });

    return (
        <div>
            <h3>DelOrig Counts by Match</h3>
            <table>
                <thead>
                    <tr>
                        <th>Match</th>
                        {delOrigValues.map(delOrig => (
                            <th key={delOrig}>{delOrig}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matchNumbers.map(matchNumber => (
                        <tr key={matchNumber}>
                            <td>{matchNumber}</td>
                            {delOrigValues.map(delOrig => (
                                <td key={delOrig}>
                                    {delOrigCounts[matchNumber][delOrig] || 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Average DelOrig Counts</h3>
            <PieChart width={500} height={400}>
                <Pie
                    data={averageData}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {averageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default DelOrigCountsTable;