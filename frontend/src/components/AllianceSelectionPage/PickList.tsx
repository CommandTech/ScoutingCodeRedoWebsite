import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { fetchTeams } from '../../utils/fetchTeams';

interface PickListProps {
  setSelectedTeams: (teams: string[]) => void;
}

const PickList: React.FC<PickListProps> = ({ setSelectedTeams }) => {
  const [rows, setRows] = useState([{ id: 1, name: '', autoPoints: '', algaePoints: '', coralPoints: '', surfacingPoints: '', overall: '' }]);
  const [teams, setTeams] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
        setTeams(data.teams);
        setTeamData(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchData();

    const savedRows = Cookies.get('picklist');
    if (savedRows) {
      setRows(JSON.parse(savedRows));
    }
  }, []);

  const saveToCookies = (rows: any) => {
    Cookies.set('picklist', JSON.stringify(rows), { expires: 7 });
  };

  const addRow = () => {
    const newRows = [...rows, { id: rows.length + 1, name: '', autoPoints: '', algaePoints: '', coralPoints: '', surfacingPoints: '', overall: '' }];
    setRows(newRows);
    saveToCookies(newRows);
  };

  const removeRow = (id: number) => {
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
    saveToCookies(newRows);
    setSelectedTeams(newRows.map(row => row.name).filter(name => name));
  };

  const handleInputChange = (id: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    const newRows = rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [name as string]: value };
        if (name === 'name') {
          const team = value as string;
          updatedRow.autoPoints = teamData.teamAverageAutoPoints[team] || '';
          updatedRow.algaePoints = teamData.teamAverageAlgaePoints[team] || '';
          updatedRow.coralPoints = teamData.teamAverageCoralPoints[team] || '';
          updatedRow.surfacingPoints = teamData.teamAverageSurfacingPoints[team] || '';
          updatedRow.overall = teamData.teamAveragePoints[team] || '';
        }
        return updatedRow;
      }
      return row;
    });
    setRows(newRows);
    saveToCookies(newRows);
    setSelectedTeams(newRows.map(row => row.name).filter(name => name));
  };

  return (
    <div className="allianceselection-container">
      <div className="picklist-wrapper">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell>Avg: Auto Points</TableCell>
                <TableCell>Avg: Algae Points</TableCell>
                <TableCell>Avg: Coral Points</TableCell>
                <TableCell>Avg: Surfacing Points</TableCell>
                <TableCell>Avg: Overall</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Select
                      name="name"
                      value={row.name}
                      onChange={(event) => handleInputChange(row.id, event)}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select Team</MenuItem>
                      {teams.map((team, index) => (
                        <MenuItem key={index} value={team}>{team}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="autoPoints"
                      value={row.autoPoints}
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="algaePoints"
                      value={row.algaePoints}
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="coralPoints"
                      value={row.coralPoints}
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="surfacingPoints"
                      value={row.surfacingPoints}
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="overall"
                      value={row.overall}
                      InputProps={{ readOnly: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => removeRow(row.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="primary" onClick={addRow}>
            Add Row
          </Button>
        </TableContainer>
      </div>
    </div>
  );
};

export default PickList;