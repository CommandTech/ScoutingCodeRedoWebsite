import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { fetchTeams } from '../../utils/fetchTeams';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface PickListProps {
  allTeams: string[];
  selectedTeams: string[];
  setSelectedTeams: (teams: string[]) => void;
  rows: RowData[];
  setRows: (rows: RowData[]) => void;
}

interface RowData {
  id: number;
  name: string;
  autoPoints: string;
  algaePoints: string;
  coralPoints: string;
  surfacingPoints: string;
  overall: string;
}

const PickList: React.FC<PickListProps> = ({ allTeams, selectedTeams, setSelectedTeams, rows, setRows }) => {
  const [teamData, setTeamData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
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
  }, [setRows]);

  const saveToCookies = (rows: RowData[]) => {
    Cookies.set('picklist', JSON.stringify(rows), { expires: 7 });
    Cookies.set('selectedTeams', JSON.stringify(rows.map((row: RowData) => row.name).filter((name: string) => name)), { expires: 7 });
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
          updatedRow.autoPoints = (teamData.teamAverageAutoPoints[team] || 0).toFixed(2);
          updatedRow.algaePoints = (teamData.teamAverageAlgaePoints[team] || 0).toFixed(2);
          updatedRow.coralPoints = (teamData.teamAverageCoralPoints[team] || 0).toFixed(2);
          updatedRow.surfacingPoints = (teamData.teamAverageSurfacingPoints[team] || 0).toFixed(2);
          updatedRow.overall = (teamData.teamAveragePoints[team] || 0).toFixed(2);
        }
        return updatedRow;
      }
      return row;
    });
    setRows(newRows);
    saveToCookies(newRows);
    setSelectedTeams(newRows.map(row => row.name).filter(name => name));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the id's after reordering
    const updatedRows = items.map((row, index) => ({ ...row, id: index + 1 }));

    setRows(updatedRows);
    saveToCookies(updatedRows);
  };

  return (
    <div className="allianceselection-container">
      <div className="picklist-wrapper">
        <TableContainer component={Paper}>
          <DragDropContext onDragEnd={onDragEnd}>
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
              <Droppable droppableId="picklist-table">
                {(provided) => (
                  <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                    {rows.map((row, index) => (
                      <Draggable key={row.id.toString()} draggableId={row.id.toString()} index={index}>
                        {(provided) => (
                          <TableRow
                            key={row.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableCell>
                              <Select
                                name="name"
                                value={row.name}
                                onChange={(event) => handleInputChange(row.id, event)}
                                displayEmpty
                              >
                                <MenuItem value="" disabled>Select Team</MenuItem>
                                {allTeams.filter(team => !selectedTeams.includes(team) || team === row.name).map((team, index) => (
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </Table>
          </DragDropContext>
          <Button variant="contained" color="primary" onClick={addRow}>
            Add Row
          </Button>
        </TableContainer>
      </div>
    </div>
  );
};

export default PickList;