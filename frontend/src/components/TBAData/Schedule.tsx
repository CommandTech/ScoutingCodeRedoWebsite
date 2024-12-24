import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ScheduleProps {
    baseURL: string;
    year: string;
    eventCode: string;
    apiKey: string;
}

const Schedule: React.FC<ScheduleProps> = ({ baseURL, year, eventCode, apiKey }) => {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            if (eventCode) {
                setLoading(true);
                try {
                    const response = await axios.get(`${baseURL}event/${year}${eventCode}/matches?X-TBA-Auth-Key=${apiKey}`);
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
    }, [baseURL, year, eventCode, apiKey]);

    const matchesLink = `${baseURL}event/${year}${eventCode}/matches?X-TBA-Auth-Key=${apiKey}`;

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
            <p>Year: {year}</p>
            <a href={matchesLink} target="_blank" rel="noopener noreferrer">
                {matchesLink}
            </a>
            <div>
                {Object.keys(groupedMatches).length > 0 ? (
                    Object.keys(groupedMatches).map((level) => (
                        <div key={level}>
                            <h4>{level.toUpperCase()}</h4>
                            <ul>
                                {groupedMatches[level].map((match: any, index: number) => (
                                    <li key={index}>
                                        <Link to={`/TBA/${level === 'qm' ? `QualificationMatch/${match.match_number}` :
                                                        level === 'sf' ? `SemifinalMatch/${match.match_number}` :
                                                        level === 'f' ? `FinalMatch/${match.match_number}` :
                                                        match.key}?baseURL=${baseURL}&year=${year}&eventCode=${eventCode}&apiKey=${apiKey}`}>
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