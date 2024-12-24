import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExcelReader from './components/ExcelReader';
import Summary from './components/Summary';
import Team from './components/Team';
import TBAMain from './components/TBAMain';
import Match from './components/TBAData/Match';

const App: React.FC = () => {
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
          <Route path="/TBA/:matchType:matchNumber" element={<Match />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;