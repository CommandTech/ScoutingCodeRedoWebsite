// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExcelReader from './components/ExcelReader';
import Summary from './components/Summary';
import Team from './components/Team';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to React with TypeScript</h1>
          <nav>
            <Link to="/"><button>Home</button></Link>
            <Link to="/summary"><button>Summary</button></Link>
            <Link to="/team"><button>Team</button></Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<ExcelReader />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;