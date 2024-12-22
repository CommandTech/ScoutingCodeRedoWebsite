import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Events.css';

interface EventsProps {
    baseURL: string;
}

const Events: React.FC<EventsProps> = ({ baseURL }) => {
    const [serverIp, setServerIp] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState('');

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

        const fetchData = async () => {
            if (apiKey) {
                try {
                    const response = await axios.get(`${baseURL}?X-TBA-Auth-Key=${apiKey}`);
                    console.log('Fetched data:', response.data); // Add this line to log the data
                    const formattedData = response.data.map((item: any) => ({
                        formatted: `${item.first_event_code}/${item.short_name || item.name}`,
                        ...item
                    }));
                    setData(formattedData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchConfig().then(fetchApiKey).then(fetchData);
    }, [serverIp, apiKey]);

    const link = `${baseURL}?X-TBA-Auth-Key=${apiKey}`;

    const options = data.map((event) => ({
        value: event.formatted,
        label: event.formatted
    }));

    return (
        <div>
            <div>Events:</div>
            <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
            </a>
            {data && (
                <div className="select-container">
                    <Select
                        value={options.find(option => option.value === selectedEvent)}
                        onChange={(selectedOption) => setSelectedEvent(selectedOption?.value || '')}
                        options={options}
                        placeholder="Select an event"
                        isClearable
                    />
                </div>
            )}
        </div>
    );
};

export default Events;