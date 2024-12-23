import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Events from './TBAData/Events';

const TBAMain = () => {
    const [ServerIP, setServerIP] = useState('');
    const [apiKey, setApiKey] = useState('');
    const baseURL = 'https://www.thebluealliance.com/api/v3/events/2024';
    const eventKey = '2024nytr'; // Example event key, replace with actual event key

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                console.log('Fetching config...');
                const response = await axios.get('/config');
                console.log('Config response:', response.data);
                if (response.data && response.data.server_ip) {
                    console.log('Setting ServerIP:', response.data.server_ip);
                    setServerIP(response.data.server_ip);
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
            <Events baseURL={baseURL} />
        </div>
    );
};

export default TBAMain;