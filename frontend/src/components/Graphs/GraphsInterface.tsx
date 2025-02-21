import React from 'react'
import StartingLocation from './StartingLocation';
import PointsPerStartLocation from './PointsPerStartLocation';
import PointsPerMatch from './PointsPerMatch';
import AcquireAlgaePerLocation from './AcquireAlgaePerLocation';
import DeliveriesNearVsFar from './DeliveriesNearVsFar';

interface GraphsInterfaceProps {
    chart: string;
    selectedTeam: string;
}

const GraphsInterface: React.FC<GraphsInterfaceProps> = ({ chart, selectedTeam }) => {
    const renderContent = () => {
        switch (chart) {
            case 'StartingLocation':
                return <StartingLocation chart={chart} selectedTeam={selectedTeam} />;
            case 'PointsPerStartLocation':
                return <PointsPerStartLocation chart={chart} selectedTeam={selectedTeam} />;
            case 'PointsPerMatch':
                return <PointsPerMatch chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireAlgaePerLocation':
                return <AcquireAlgaePerLocation chart={chart} selectedTeam={selectedTeam} />;
            case 'DeliveriesNearVsFar':
                return <DeliveriesNearVsFar chart={chart} selectedTeam={selectedTeam} />;
            default:
                return <div>No Defined Graph</div>;
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    )
}

export default GraphsInterface