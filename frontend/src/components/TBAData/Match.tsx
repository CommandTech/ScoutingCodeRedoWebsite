import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const Match: React.FC = () => {
    const { eventCode, matchType, matchNumber } = useParams<Record<string, string>>();
    const [matchData, setMatchData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState({ baseURL: '', apiKey: '', year: '' });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('/config');
                setConfig(response.data);
            } catch (error) {
                setError('Error fetching configuration');
                console.error(error);
            }
        };

        fetchConfig();
    }, []);

    const link = `${config.baseURL}event/${config.year}${eventCode}/matches?X-TBA-Auth-Key=${config.apiKey}`;

    useEffect(() => {
        const fetchMatchData = async () => {
            if (config.baseURL && config.apiKey) {
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
    }, [config, eventCode, matchType, matchNumber]);

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
            <Link to={link}>{link}</Link>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {matchData && (
                <pre>{JSON.stringify(matchData, null, 2)}</pre>
            )}
        </div>
    );
};

export default Match;