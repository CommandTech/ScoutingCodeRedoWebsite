import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Cookies from 'js-cookie';

interface PickedTeamsProps {
  allTeams: string[];
  selectedTeams: string[];
  setPickedTeams: (teams: string[][]) => void;
  setSelectedTeams: (teams: string[]) => void;
  removeTeamFromPickList: (team: string) => void; // Add this prop
}

const PickedTeams: React.FC<PickedTeamsProps> = ({ allTeams, selectedTeams, setPickedTeams, setSelectedTeams, removeTeamFromPickList }) => {
  const [pickedTeams, setPickedTeamsState] = useState<string[][]>(() => {
    const savedTeams = Cookies.get('pickedTeams');
    return savedTeams ? JSON.parse(savedTeams) : Array(8).fill('').map(() => Array(4).fill(''));
  });
  const rows = ['Captain', '1st Pick', '2nd Pick', '3rd Pick'];

  useEffect(() => {
    Cookies.set('pickedTeams', JSON.stringify(pickedTeams));
    setPickedTeams(pickedTeams);
  }, [pickedTeams, setPickedTeams]);

  const handleChange = (event: SelectChangeEvent<string>, rowIndex: number, colIndex: number) => {
    const newPickedTeams = pickedTeams.map((col, cIndex) =>
      col.map((team, rIndex) => (rIndex === rowIndex && cIndex === colIndex ? event.target.value as string : team))
    );
    setPickedTeamsState(newPickedTeams);

    const newSelectedTeams = newPickedTeams.flat().filter(team => team !== '');
    setSelectedTeams(newSelectedTeams);

    // Remove the team from the picklist if it is added to the picked teams
    if (event.target.value) {
      removeTeamFromPickList(event.target.value as string);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {[...Array(8)].map((_, index) => (
              <TableCell key={index}>Alliance {index + 1}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{row}</TableCell>
              {pickedTeams.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  <Select
                    fullWidth
                    value={col[rowIndex] || ''}
                    onChange={(event) => handleChange(event, rowIndex, colIndex)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {allTeams
                      .filter((team) => !pickedTeams.flat().includes(team) || col[rowIndex] === team)
                      .map((team, teamIndex) => (
                        <MenuItem key={teamIndex} value={team}>
                          {team}
                        </MenuItem>
                      ))}
                  </Select>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PickedTeams;