import React from 'react'
import TeamList from './AllianceSelectionPage/TeamList'
import './CSS/AllianceSelection.css';

const AllianceSelection = () => {
  return (
    <div className="allianceselection-container">
      <div className="teamlist-wrapper">
        <TeamList />
      </div>
    </div>
  )
}

export default AllianceSelection