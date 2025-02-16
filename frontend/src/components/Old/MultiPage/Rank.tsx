import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RankProps {
  teamNumber: string;
}

const Rank: React.FC<RankProps> = ({ teamNumber }) => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const configResponse = await axios.get('/config');
        const config = configResponse.data;

        const { baseURL, year, EventCode, apiKey, serverip } = config;
        const rankingsUrl = `${baseURL}event/${year}${EventCode}/rankings?X-TBA-Auth-Key=${apiKey}&serverip=${serverip}`;

        const rankingsResponse = await axios.get(rankingsUrl);
        const rankingsData = rankingsResponse.data.rankings;

        setRankings(rankingsData);
      } catch (error) {
        setError('Error fetching rankings');
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const teamRanking = rankings.find(ranking => ranking.team_key === `frc${teamNumber}`);

  return (
    <div>
      {teamRanking ? (
        <div>{String(teamRanking.rank).trim()}</div>
      ) : (
        <div>Team {teamNumber} not found in rankings.</div>
      )}
    </div>
  );
};

export default Rank;