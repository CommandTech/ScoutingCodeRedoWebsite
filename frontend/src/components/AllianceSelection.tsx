import './CSS/AllianceSelection.css';
import PickList from './AllianceSelectionPage/PickList';

const AllianceSelection = () => {
  return (
    <div className="allianceselection-container">
      <div className="picklist-wrapper">
        <PickList />
      </div>
    </div>
  );
};

export default AllianceSelection;