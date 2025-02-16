import React from 'react';

interface AllianceStationProps {
    alliance_station: string;
}

export const labels = ["Amp Sta.", "Center Sta.", "Source Sta."];

const AllianceStation: React.FC<AllianceStationProps> = ({ alliance_station }) => {
    return (
        <div>
            <span>&nbsp;{alliance_station}&nbsp;</span>
        </div>
    );
};

export default AllianceStation;