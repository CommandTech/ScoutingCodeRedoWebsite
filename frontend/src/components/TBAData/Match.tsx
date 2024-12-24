import React from 'react';
import { useParams } from 'react-router-dom';

const Match: React.FC = () => {
    const { matchType, matchNumber } = useParams<{ matchType: string, matchNumber: string }>();

    const getMatchTitle = () => {
        switch (matchType) {
            case 'QualificationMatch':
                return `Qualification Match ${matchNumber}`;
            case 'SemifinalMatch':
                return `Semifinal Match ${matchNumber}`;
            case 'FinalMatch':
                return `Final Match ${matchNumber}`;
            default:
                return 'Match';
        }
    };

    return (
        <div>
            <h3>{getMatchTitle()}</h3>
            {/* Add more details about the match here */}
        </div>
    );
};

export default Match;