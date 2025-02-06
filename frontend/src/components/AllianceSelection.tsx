import './CSS/AllianceSelection.css';
import PickList from './AllianceSelectionPage/PickList';
import TeamList from './AllianceSelectionPage/TeamList';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchTeams } from '../utils/fetchTeams';
import PickedTeams from './AllianceSelectionPage/PickedTeams';
import AllianceBarGraph from './AllianceSelectionPage/AllianceBarGraph';

interface RowData {
  id: number;
  name: string;
  autoPoints: string;
  algaePoints: string;
  coralPoints: string;
  surfacingPoints: string;
  overall: string;
}

const AllianceSelection = () => {
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [pickedTeams, setPickedTeams] = useState<string[][]>(Array(8).fill('').map(() => Array(4).fill('')));
  const [teamData, setTeamData] = useState<any>(null);
  const [rows, setRows] = useState<RowData[]>([{ id: 1, name: '', autoPoints: '', algaePoints: '', coralPoints: '', surfacingPoints: '', overall: '' }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
        setAllTeams(data.teams);
        setTeamData(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();

    const savedSelectedTeams = Cookies.get('selectedTeams');
    if (savedSelectedTeams) {
      setSelectedTeams(JSON.parse(savedSelectedTeams));
    }

    const savedPickedTeams = Cookies.get('pickedTeams');
    if (savedPickedTeams) {
      setPickedTeams(JSON.parse(savedPickedTeams));
    }
  }, []);

  const removeTeamFromPickList = (team: string) => {
    const newRows = rows.filter(row => row.name !== team);
    setRows(newRows);
    Cookies.set('picklist', JSON.stringify(newRows), { expires: 7 });
  };

  return (
    <div className="allianceselection-container">
      <div className="picklist-wrapper">
        <PickList allTeams={allTeams} selectedTeams={selectedTeams} setSelectedTeams={setSelectedTeams} rows={rows} setRows={setRows} />
        <PickedTeams allTeams={allTeams} selectedTeams={selectedTeams} setPickedTeams={setPickedTeams} setSelectedTeams={setSelectedTeams} removeTeamFromPickList={removeTeamFromPickList} />
        {teamData && <AllianceBarGraph teamData={teamData} pickedTeams={pickedTeams} />}
      </div>
      <div className="teamlist-wrapper">
        <TeamList allTeams={allTeams} selectedTeams={selectedTeams} />
      </div>
    </div>
  );
};

export default AllianceSelection;