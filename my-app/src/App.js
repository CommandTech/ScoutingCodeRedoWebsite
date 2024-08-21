import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css'; // Make sure to import your CSS file

function App() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const getUniqueValues = (column) => {
    return [...new Set(data.map((row) => row[column]))];
  };

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((column) => {
      return filters[column] === '' || String(row[column]) === String(filters[column]);
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
        <div className="table-container">
          {data.length > 0 && (
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>
                      {key}
                      <select
                        onChange={(e) => handleFilterChange(key, e.target.value)}
                        value={filters[key] || ''}
                      >
                        <option value="">All</option>
                        {getUniqueValues(key).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;