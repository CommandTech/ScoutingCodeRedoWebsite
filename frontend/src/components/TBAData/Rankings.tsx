import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Rankings: React.FC = () => {
    const { eventCode } = useParams<{ eventCode: string }>();
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
                console.error(error);
            }
        };

        fetchConfig();
    }, []);

    const link = `${config.baseURL}event/${config.year}${eventCode}/rankings?X-TBA-Auth-Key=${config.apiKey}`;

    useEffect(() => {
        const fetchRankings = async () => {
            if (eventCode && config.baseURL && config.apiKey) {
                setLoading(true);
                try {
                    const response = await axios.get(link);
                    setRankings(response.data.rankings);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRankings();
    }, [eventCode, config]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h3>Rankings</h3>
            <Link to={link}>{link}</Link>
            <ul>
                {rankings.map((ranking, index) => (
                    <li key={index}>{ranking.rank}: {ranking.team_key}</li>
                ))}
            </ul>
        </div>
    );
};

export default Rankings;