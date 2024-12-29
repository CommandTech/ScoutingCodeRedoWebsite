import React from 'react';

interface AllianceStationProps {
    alliance_station: string;
}

const labels = ["Amp Sta.", "Center Sta.", "Source Sta."];

const AllianceStation: React.FC<AllianceStationProps> = ({ alliance_station }) => {
    return (
        <div>
            <span>{alliance_station}</span>
        </div>
    );
};

export default AllianceStation;