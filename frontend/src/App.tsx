import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExcelReader from './components/ExcelReader';
import Summary from './components/Summary';
import Team from './components/Team';
import TBAMain from './components/TBAMain';
import Match from './components/TBAData/Match';
import Schedule from './components/TBAData/Schedule';
import Rankings from './components/TBAData/Rankings';

const App: React.FC = () => {
  const [config, setConfig] = useState({ baseURL: '', apiKey: '' });
  const [serverIP, setServerIP] = useState('');

  useEffect(() => {
    fetch('/config')
      .then(response => response.json())
      .then(data => {
        setServerIP(data.ServerIP);
        return fetch(`${data.ServerIP}/config`);
      })
      .then(response => response.json())
      .then(data => setConfig({ baseURL: data.baseURL, apiKey: data.apiKey }))
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>FRC190 Scouting Website</h1>
          <nav>
            <Link to="/"><button>Home</button></Link>
            <Link to="/summary"><button>Summary</button></Link>
            <Link to="/team"><button>Team</button></Link>
            <Link to="/TBA"><button>The Blue Alliance</button></Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<ExcelReader />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/team" element={<Team />} />
          <Route path="/TBA" element={<TBAMain />} />
          <Route path="/TBA/:eventCode/:matchType/:matchNumber" element={<Match />} />
          <Route path="/TBA/:eventCode" element={<Schedule />} />
          <Route path="/TBA/:eventCode/rankings" element={<Rankings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;