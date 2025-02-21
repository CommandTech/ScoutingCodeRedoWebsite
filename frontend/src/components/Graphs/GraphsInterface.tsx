import React from 'react'
import StartingLocation from './StartingLocation';
import PointsPerStartLocation from './PointsPerStartLocation';
import PointsPerMatchAuto from './PointsPerMatchAuto';
import AcquireAlgaePerLocation from './AcquireAlgaePerLocation';
import DeliveriesNearVsFar from './DeliveriesNearVsFar';
import PointsPerMatch from './PointsPerMatch';
import AcquireCoralPerLocation from './AcquireCoralPerLocation';
import AlgaeSuccessRateAuto from './AlgaeSuccessRateAuto';
import CoralSuccessRateAuto from './CoralSuccessRateAuto';
import PointsPerDriverStation from './PointsPerDriverStation';
import DeliveriesPerDriverStation from './DeliveriesPerDriverStation';
import AlgaeSuccessRate from './AlgaeSuccessRate';

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
            case 'PointsPerMatchAuto':
                return <PointsPerMatchAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireAlgaePerLocation':
                return <AcquireAlgaePerLocation chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireCoralPerLocation':
                return <AcquireCoralPerLocation chart={chart} selectedTeam={selectedTeam} />;
            case 'AlgaeSuccessRateAuto':
                return <AlgaeSuccessRateAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'CoralSuccessRateAuto':
                return <CoralSuccessRateAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'DeliveriesNearVsFar':
                return <DeliveriesNearVsFar chart={chart} selectedTeam={selectedTeam} />;
            case 'PointsPerMatch':
                return <PointsPerMatch chart={chart} selectedTeam={selectedTeam} />;
            case 'PointsPerDriverStation':
                return <PointsPerDriverStation chart={chart} selectedTeam={selectedTeam} />;
            case 'DeliveriesPerDriverStation':
                return <DeliveriesPerDriverStation chart={chart} selectedTeam={selectedTeam} />;
            case 'AlgaeSuccessRate':
                return <AlgaeSuccessRate chart={chart} selectedTeam={selectedTeam} />;
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