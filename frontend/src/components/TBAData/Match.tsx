import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

interface MatchParams {
    matchType: string;
    matchNumber: string;
}

const Match: React.FC = () => {
    const { matchType, matchNumber } = useParams<Record<string, string>>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const baseURL = queryParams.get('baseURL') || '';
    const year = queryParams.get('year') || '';
    const eventCode = queryParams.get('eventCode') || '';
    const apiKey = queryParams.get('apiKey') || '';
    const link = `${baseURL}event/${year}${eventCode}/matches?X-TBA-Auth-Key=${apiKey}`;

    const [matchData, setMatchData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatchData = async () => {
            if (baseURL && apiKey) {
                try {
                    const response = await axios.get(link);
                    console.log('Match data response:', response.data);
                    
                    const matchTypeMap: { [key: string]: string } = {
                        'QualificationMatch': 'qm',
                        'SemifinalMatch': 'sf',
                        'FinalMatch': 'f'
                    };

                    const filteredMatch = response.data.find((match: any) => 
                        matchType && match.comp_level === matchTypeMap[matchType] && match.match_number.toString() === matchNumber
                    );
                    setMatchData(filteredMatch);
                } catch (error) {
                    setError('Error fetching match data');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMatchData();
    }, [baseURL, apiKey, matchType, matchNumber]);

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
            <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
            </a>            
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {matchData && (
                <pre>{JSON.stringify(matchData, null, 2)}</pre>
            )}
        </div>
    );
};

export default Match;