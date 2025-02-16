import React from 'react';

interface TeamActivitiesTable {
    filteredData: { [key: string]: string | number }[];
}

const TeamActivitiesTable: React.FC<TeamActivitiesTable> = ({ filteredData }) => {
    return (
        <table>
            <thead>
                <tr>
                    {Object.keys(filteredData[0]).map((key) => (
                        <th key={key}>{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {filteredData.map((data, rowIndex) => (
                    <tr key={rowIndex}>
                        {Object.values(data).map((value, colIndex) => (
                            <td key={colIndex}>{value}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TeamActivitiesTable;