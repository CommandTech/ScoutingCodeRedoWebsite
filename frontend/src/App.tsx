// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExcelReader from './components/ExcelReader';
import Summary from './components/Summary';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to React with TypeScript</h1>
          <nav>
            <Link to="/"><button>Home</button></Link>
            <Link to="/summary"><button>Summary</button></Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<ExcelReader />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;