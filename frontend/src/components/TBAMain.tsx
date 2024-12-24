import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Events from './TBAData/Events';
import Schedule from './TBAData/Schedule';

const TBAMain = () => {
    const [ServerIP, setServerIP] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [selectedEventCode, setSelectedEventCode] = useState<string>(''); // Add state for selected event code
    const [year, setYear] = useState<string>(''); // Add state for year
    const baseURL = 'https://www.thebluealliance.com/api/v3/';

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                console.log('Fetching config...');
                const response = await axios.get('/config');
                console.log('Config response:', response.data);
                if (response.data && response.data.server_ip) {
                    console.log('Setting ServerIP:', response.data.server_ip);
                    setServerIP(response.data.server_ip);
                    setYear(response.data.year); // Set the year from config
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
            console.log('Current ServerIP:', ServerIP);
            if (ServerIP) {
                try {
                    const response = await axios.get(`${ServerIP}/api-key`);
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
    }, [ServerIP]);

    return (
        <div>
            <h1>TBAMain</h1>
            <Events baseURL={baseURL} onEventSelect={setSelectedEventCode} />
            <Schedule baseURL={baseURL} year={year} eventCode={selectedEventCode} apiKey={apiKey} />
        </div>
    );
};

export default TBAMain;