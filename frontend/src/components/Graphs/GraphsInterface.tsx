import React from 'react'
import StartingLocation from './StartingLocation';

interface GraphsInterfaceProps {
    chart: string;
    selectedTeam: string;
}

const GraphsInterface: React.FC<GraphsInterfaceProps> = ({ chart, selectedTeam }) => {
    const renderContent = () => {
        switch (chart) {
            case 'StartingLocation':
                return <StartingLocation chart={chart} selectedTeam={selectedTeam} />;
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