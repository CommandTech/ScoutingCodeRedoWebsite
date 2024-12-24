import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const Schedule: React.FC = () => {
    const { eventCode } = useParams<{ eventCode: string }>();
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState({ baseURL: '', apiKey: '', year: '' });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('/config');
                setConfig({
                    baseURL: response.data.baseURL,
                    apiKey: response.data.apiKey,
                    year: response.data.year
                });
            } catch (error) {
                setError('Error fetching configuration');
                console.error(error);
            }
        };

        fetchConfig();
    }, []);

    useEffect(() => {
        const fetchMatches = async () => {
            if (eventCode && config.baseURL && config.apiKey) {
                setLoading(true);
                try {
                    const response = await axios.get(`${config.baseURL}event/${config.year}${eventCode}/matches?X-TBA-Auth-Key=${config.apiKey}`);
                    const sortedMatches = response.data.sort((a: any, b: any) => {
                        const order = { 'qm': 1, 'sf': 2, 'f': 3 };
                        const aCode = a.key.match(/(qm|sf|f)/)?.[0] as keyof typeof order;
                        const bCode = b.key.match(/(qm|sf|f)/)?.[0] as keyof typeof order;
                        if (aCode === bCode) {
                            return a.match_number - b.match_number;
                        }
                        return (order[aCode] || 4) - (order[bCode] || 4);
                    });
                    setMatches(sortedMatches);
                } catch (error) {
                    setError('Error fetching matches');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMatches();
    }, [eventCode, config]);

    const matchesLink = `${config.baseURL}event/${config.year}${eventCode}/matches?X-TBA-Auth-Key=${config.apiKey}`;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const groupedMatches = matches.reduce((acc: any, match: any) => {
        const level = match.key.match(/(qm|sf|f)/)?.[0];
        if (level) {
            if (!acc[level]) {
                acc[level] = [];
            }
            acc[level].push(match);
        }
        return acc;
    }, {});

    const formatDateTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    return (
        <div>
            <h3>Schedule</h3>
            <p>Selected Event Code: {eventCode}</p>
            <p>Year: {config.year}</p>
            <Link to={matchesLink}>{matchesLink}</Link>
            <br />
            <Link to={`/TBA/${eventCode}/rankings`}>
                <button>Go to Rankings</button>
            </Link>
            <div>
                {Object.keys(groupedMatches).length > 0 ? (
                    Object.keys(groupedMatches).map((level) => (
                        <div key={level}>
                            <h4>{level.toUpperCase()}</h4>
                            <ul>
                                {groupedMatches[level].map((match: any, index: number) => (
                                    <li key={index}>
                                        <Link to={`/TBA/${eventCode}/${level === 'qm' ? `QualificationMatch/${match.match_number}` :
                                            level === 'sf' ? `SemifinalMatch/${match.match_number}` :
                                                level === 'f' ? `FinalMatch/${match.match_number}` :
                                                    match.key}`}>
                                            {level === 'qm' ? `Qualification Match ${match.match_number}` :
                                                level === 'sf' ? `Semifinal Match ${match.match_number}` :
                                                    level === 'f' ? `Final Match ${match.match_number}` :
                                                        match.key}
                                        </Link>
                                        <div>Actual Time: {formatDateTime(match.actual_time)}</div>
                                        <div>Post Result Time: {formatDateTime(match.post_result_time)}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No matches found</p>
                )}
            </div>
        </div>
    );
};

export default Schedule;