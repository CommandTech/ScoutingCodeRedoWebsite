import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import ExcelReader from './components/ExcelReader';
import Team from './components/Team';
import TBAMain from './components/Old/TBAMain';
import Match from './components/Old/TBAData/Match';
import Schedule from './components/Old/TBAData/Schedule';
import Rankings from './components/Old/TBAData/Rankings';
import MPR from './components/MPR';
import AutoHelp from './components/AutoHelp';
import AllianceSelection from './components/AllianceSelection';

function App() {
  const location = useLocation();
  const pathToIndexMap: { [key: string]: number } = {
    '/Team': 0,
    '/MPR': 1,
    '/AutoHelp': 2,
    '/AllianceSelection': 3,
    '/upload': 4,
  };

  const currentPath = location.pathname;
  const currentIndex = pathToIndexMap[currentPath] ?? 0;

  const [value, setValue] = React.useState(currentIndex);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>FRC190 Scouting Website</h1>
        <Tabs value={value} onChange={handleChange} aria-label="nav tabs">
          <Tab label="Team" component={Link} to="/Team" />
          <Tab label="MPR" component={Link} to="/MPR" />
          <Tab label="Auto Help" component={Link} to="/AutoHelp" />
          <Tab label="Alliance Selection" component={Link} to="/AllianceSelection" />
          <Tab label="Upload" component={Link} to="/upload" />
        </Tabs>
      </header>
      <Routes>
        <Route path="/" element={<Team />} />
        <Route path="/team" element={<Team />} />
        <Route path="/TBA" element={<TBAMain />} />
        <Route path="/TBA/:eventCode/:matchType/:matchNumber" element={<Match />} />
        <Route path="/TBA/:eventCode" element={<Schedule />} />
        <Route path="/TBA/:eventCode/rankings" element={<Rankings />} />
        <Route path="/MPR" element={<MPR />} />
        <Route path="/AutoHelp" element={<AutoHelp />} />
        <Route path="/AllianceSelection" element={<AllianceSelection />} />
        <Route path="/upload" element={<ExcelReader />} />
      </Routes>
    </div>
  );
}

export default App;