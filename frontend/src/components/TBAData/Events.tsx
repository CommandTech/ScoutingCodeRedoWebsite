import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Events.css';

interface EventsProps {
    baseURL: string;
    onEventSelect: (eventCode: string) => void; // Add prop for event selection callback
}

interface EventData {
    event_code: string;
    short_name?: string;
    name: string;
    formatted: string;
}

const Events: React.FC<EventsProps> = ({ baseURL, onEventSelect }) => {
    const [apiKey, setApiKey] = useState<string>('');
    const [data, setData] = useState<EventData[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [year, setYear] = useState<string>(''); // Add state for year

    useEffect(() => {
        const fetchConfigAndApiKey = async () => {
            try {
                const configResponse = await axios.get('/config');
                const serverIP = configResponse.data.server_ip;
                setYear(configResponse.data.year); // Set the year from config

                const apiKeyResponse = await axios.get(`${serverIP}/api-key`);
                setApiKey(apiKeyResponse.data.apiKey);
            } catch (error) {
                setError('Error fetching configuration or API key');
                console.error(error);
            }
        };

        const fetchData = async () => {
            if (apiKey && year) {
                try {
                    const response = await axios.get(`${baseURL}events/${year}?X-TBA-Auth-Key=${apiKey}`);
                    const formattedData = response.data.map((item: any) => ({
                        ...item,
                        formatted: `${item.event_code}: ${item.short_name || item.name}`
                    }));
                    setData(formattedData);
                } catch (error) {
                    setError('Error fetching data');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchConfigAndApiKey().then(fetchData);
    }, [apiKey, year, baseURL]);

    const link = `${baseURL}events/${year}?X-TBA-Auth-Key=${apiKey}`;

    const options = data.map((event) => ({
        value: event.event_code, // Use event_code as the value
        label: event.formatted
    }));

    const handleEventSelect = (selectedOption: any) => {
        const eventCode = selectedOption?.value || '';
        setSelectedEvent(eventCode);
        onEventSelect(eventCode); // Call the callback with the selected event code
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Events:</h2>
            <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
            </a>
            {data.length > 0 && (
                <div className="select-container">
                    <Select
                        value={options.find(option => option.value === selectedEvent)}
                        onChange={handleEventSelect}
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