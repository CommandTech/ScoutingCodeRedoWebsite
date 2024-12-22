import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TBASchedule from './TBAData/TBASchedule'

const TBAMain = () => {
    const [apiKey, setApiKey] = useState('')

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
            <h1>TBAMain</h1>
            <TBASchedule />
        </div>
    )
}

export default TBAMain