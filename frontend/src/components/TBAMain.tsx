import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TBAMain = () => {
    const [serverIp, setServerIp] = useState('');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                console.log('Fetching config...');
                const response = await axios.get('/config');
                console.log('Config response:', response.data);
                if (response.data && response.data.server_ip) {
                    console.log('Setting serverIp:', response.data.server_ip);
                    setServerIp(response.data.server_ip);
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
            console.log('Current serverIp:', serverIp);
            if (serverIp) {
                try {
                    const response = await axios.get(`${serverIp}/api-key`);
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
    }, [serverIp]);

    return (
        <div>
            <div>TBAMain</div>
            <p>API Key: {apiKey}</p>
        </div>
    );
};

export default TBAMain;