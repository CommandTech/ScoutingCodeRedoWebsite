import React, { useEffect, useState } from 'react'
import axios from 'axios'

const TBASchedule = () => {
    const [apiKey, setApiKey] = useState('')
    const [jsonData, setJsonData] = useState(null)

    const baseURL = 'https://www.thebluealliance.com/api/v3/event'
    const eventKey = '2024nytr'

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api-key')
                setApiKey(response.data.apiKey)
            } catch (error) {
                console.error('Error fetching API key:', error)
            }
        }

        fetchApiKey()
    }, [])

    return (
        <div>
            <div>TBASchedule</div>
            <p>API Key: {apiKey}</p>
            <a href={`${baseURL}/${eventKey}/teams?X-TBA-Auth-Key=${apiKey}`} target="_blank" rel="noopener noreferrer">
                {`${baseURL}/${eventKey}/teams?X-TBA-Auth-Key=${apiKey}`}
            </a>
        </div>
    )
}

export default TBASchedule