import React from 'react'

interface RobotProps {
    selectedTeam: string;
}

const RobotPicture: React.FC<RobotProps> = ({ selectedTeam }) => {
    const teamName = selectedTeam.replace('frc', '');
    const imagePath = `/RobotPictures/${teamName}.png`;
    return (
        <div>
            <img src={imagePath} alt={`Robot of team ${teamName}`} />
        </div>
    )
}

export default RobotPicture