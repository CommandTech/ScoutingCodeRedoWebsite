import './CSS/AllianceSelection.css';
import PickList from './AllianceSelectionPage/PickList';
import TeamList from './AllianceSelectionPage/TeamList';
import { useState } from 'react';

const AllianceSelection = () => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  return (
    <div className="allianceselection-container">
      <div className="picklist-wrapper">
        <PickList setSelectedTeams={setSelectedTeams} />
      </div>
      <div className="teamlist-wrapper">
        <TeamList selectedTeams={selectedTeams} />
      </div>
    </div>
  );
};

export default AllianceSelection;