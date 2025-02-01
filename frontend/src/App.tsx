import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import ExcelReader from './components/ExcelReader';
import Summary from './components/Summary';
import Team from './components/Team';
import TBAMain from './components/TBAMain';
import Match from './components/TBAData/Match';
import Schedule from './components/TBAData/Schedule';
import Rankings from './components/TBAData/Rankings';
import MPR from './components/MPR';
import AutoHelp from './components/AutoHelp';
import PickList from './components/PickList';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>FRC190 Scouting Website</h1>
          <Tabs value={value} onChange={handleChange} aria-label="nav tabs">
            <Tab label="Team" component={Link} to="/Team" />
            <Tab label="MPR" component={Link} to="/MPR" />
            <Tab label="Auto Help" component={Link} to="/AutoHelp" />
            <Tab label="Pick List" component={Link} to="/PickList" />
            <Tab label="Upload" component={Link} to="/upload" />
          </Tabs>
        </header>
        <Routes>
          <Route path="/" element={<Team />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/team" element={<Team />} />
          <Route path="/TBA" element={<TBAMain />} />
          <Route path="/TBA/:eventCode/:matchType/:matchNumber" element={<Match />} />
          <Route path="/TBA/:eventCode" element={<Schedule />} />
          <Route path="/TBA/:eventCode/rankings" element={<Rankings />} />
          <Route path="/MPR" element={<MPR />} />
          <Route path="/AutoHelp" element={<AutoHelp />} />
          <Route path="/PickList" element={<PickList />} />
          <Route path="/upload" element={<ExcelReader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;