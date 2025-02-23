import React from 'react'
import StartingLocation from './StartingLocation';
import PointsPerStartLocation from './PointsPerStartLocation';
import PointsPerMatchAuto from './PointsPerMatchAuto';
import AcquireAlgaePerLocationAuto from './AcquireAlgaePerLocationAuto';
import DeliveriesNearVsFarAuto from './DeliveriesNearVsFarAuto';
import PointsPerMatch from './PointsPerMatch';
import AcquireCoralPerLocationAuto from './AcquireCoralPerLocationAuto';
import AlgaeSuccessRateAuto from './AlgaeSuccessRateAuto';
import CoralSuccessRateAuto from './CoralSuccessRateAuto';
import PointsPerDriverStation from './PointsPerDriverStation';
import DeliveriesPerDriverStation from './DeliveriesPerDriverStation';
import AlgaeSuccessRate from './AlgaeSuccessRate';
import CoralSuccessRate from './CoralSuccessRate';
import AcquireAlgaeNearVsFar from './AcquireAlgaeNearVsFar';
import AcquireCoralNearVsFar from './AcquireCoralNearVsFar';
import DeliveriesNearVsFar from './DeliveriesNearVsFar';
import AcquireAlgaePerLocation from './AcquireAlgaePerLocation';
import AcquireCoralPerLocation from './AcquireCoralPerLocation';
import SurfacingPointsPerMatch from './SurfacingPointsPerMatch';
import CageAttempt from './CageAttempt';
import EndState from './EndState';
import ClimbSuccess from './ClimbSuccess';

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
            case 'AcquireAlgaePerLocationAuto':
                return <AcquireAlgaePerLocationAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireCoralPerLocationAuto':
                return <AcquireCoralPerLocationAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'AlgaeSuccessRateAuto':
                return <AlgaeSuccessRateAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'CoralSuccessRateAuto':
                return <CoralSuccessRateAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'DeliveriesNearVsFarAuto':
                return <DeliveriesNearVsFarAuto chart={chart} selectedTeam={selectedTeam} />;
            case 'PointsPerMatch':
                return <PointsPerMatch chart={chart} selectedTeam={selectedTeam} />;
            case 'PointsPerDriverStation':
                return <PointsPerDriverStation chart={chart} selectedTeam={selectedTeam} />;
            case 'DeliveriesPerDriverStation':
                return <DeliveriesPerDriverStation chart={chart} selectedTeam={selectedTeam} />;
            case 'AlgaeSuccessRate':
                return <AlgaeSuccessRate chart={chart} selectedTeam={selectedTeam} />;
            case 'CoralSuccessRate':
                return <CoralSuccessRate chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireAlgaeNearVsFar':
                return <AcquireAlgaeNearVsFar chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireCoralNearVsFar':
                return <AcquireCoralNearVsFar chart={chart} selectedTeam={selectedTeam} />;
            case 'DeliveriesNearVsFar':
                return <DeliveriesNearVsFar chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireAlgaePerLocation':
                return <AcquireAlgaePerLocation chart={chart} selectedTeam={selectedTeam} />;
            case 'AcquireCoralPerLocation':
                return <AcquireCoralPerLocation chart={chart} selectedTeam={selectedTeam} />;
            case 'SurfacingPointsPerMatch':
                return <SurfacingPointsPerMatch chart={chart} selectedTeam={selectedTeam} />;
            case 'CageAttempt':
                return <CageAttempt chart={chart} selectedTeam={selectedTeam} />;
            case 'EndState':
                return <EndState chart={chart} selectedTeam={selectedTeam} />;
            case 'ClimbSuccess':
                return <ClimbSuccess chart={chart} selectedTeam={selectedTeam} />;
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