import './CSS/AllianceSelection.css';
import PickList from './AllianceSelectionPage/PickList';
import TeamList from './AllianceSelectionPage/TeamList';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchTeams } from '../utils/fetchTeams';

const AllianceSelection = () => {
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
        setAllTeams(data.teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();

    const savedSelectedTeams = Cookies.get('selectedTeams');
    if (savedSelectedTeams) {
      setSelectedTeams(JSON.parse(savedSelectedTeams));
    }
  }, []);

  return (
    <div className="allianceselection-container">
      <div className="picklist-wrapper">
        <PickList allTeams={allTeams} selectedTeams={selectedTeams} setSelectedTeams={setSelectedTeams} />
      </div>
      <div className="teamlist-wrapper">
        <TeamList allTeams={allTeams} selectedTeams={selectedTeams} />
      </div>
    </div>
  );
};

export default AllianceSelection;