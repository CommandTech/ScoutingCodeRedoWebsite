import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Events from './TBAData/Events';

const TBAMain = () => {
    const [SERVER_IP, setServerIP] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [selectedEventCode, setSelectedEventCode] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [baseURL, setBaseURL] = useState<string>('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get('/config');
                if (response.data && response.data.ServerIP) {
                    setServerIP(response.data.ServerIP);
                    setYear(response.data.year);
                    setBaseURL(response.data.baseURL);
                } else {
                    console.error('Server IP not found in config response');
                }
            } catch (error) {
                console.error('Error fetching server IP:', error);
            }
        };

        fetchConfig();
    }, []);

    useEffect(() => {
        const fetchApiKey = async () => {
            if (SERVER_IP) {
                try {
                    const response = await axios.get(`${SERVER_IP}/config`);
                    setApiKey(response.data.apiKey);
                } catch (error) {
                    console.error('Error fetching API key:', error);
                }
            }
        };

        fetchApiKey();
    }, [SERVER_IP]);

    return (
        <div>
            <h1>TBAMain</h1>
            <Events baseURL={baseURL} apiKey={apiKey} onEventSelect={setSelectedEventCode} />
        </div>
    );
};

export default TBAMain;