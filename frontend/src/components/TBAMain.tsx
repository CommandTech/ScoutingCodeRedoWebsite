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
                console.log('Fetching config...');
                const response = await axios.get('/config');
                console.log('Config response:', response.data);
                if (response.data && response.data.ServerIP) {
                    console.log('Setting SERVER_IP:', response.data.ServerIP);
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
            console.log('Current SERVER_IP:', SERVER_IP);
            if (SERVER_IP) {
                try {
                    const response = await axios.get(`${SERVER_IP}/config`);
                    console.log('API key response:', response.data);
                    setApiKey(response.data.apiKey);
                } catch (error) {
                    console.error('Error fetching API key:', error);
                }
            } else {
                console.log('Server IP not set yet');
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