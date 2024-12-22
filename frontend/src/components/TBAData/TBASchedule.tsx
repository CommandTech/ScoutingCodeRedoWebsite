import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TBASchedule = () => {
    const [apiKey, setApiKey] = useState('');
    const [serverIp, setServerIp] = useState('');

    const baseURL = 'https://www.thebluealliance.com/api/v3/event';
    const eventKey = '2024nytr';

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('/config');
                setServerIp(response.data.server_ip);
            } catch (error) {
                console.error('Error fetching server IP:', error);
            }
        };

        const fetchApiKey = async () => {
            if (serverIp) {
                try {
                    const response = await axios.get(`${serverIp}/api-key`);
                    setApiKey(response.data.apiKey);
                } catch (error) {
                    console.error('Error fetching API key:', error);
                }
            }
        };

        fetchConfig().then(fetchApiKey);
    }, [serverIp]);

    return (
        <div>
            <div>TBASchedule</div>
            <p>API Key: {apiKey}</p>
            <a href={`${baseURL}/${eventKey}/teams?X-TBA-Auth-Key=${apiKey}`} target="_blank" rel="noopener noreferrer">
                {`${baseURL}/${eventKey}/teams?X-TBA-Auth-Key=${apiKey}`}
            </a>
        </div>
    );
};

export default TBASchedule;