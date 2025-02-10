import React from 'react';
import './CSS/OneTeamReport.css';

interface OneTeamReportProps {
    matchNumber: string;
    color: string;
}

const OneTeamReport: React.FC<OneTeamReportProps> = ({ matchNumber }) => {
  return (
    <div className="one-team-report">
      <h2>One Team Report</h2>
      <p>Match Number: {matchNumber}</p>
    </div>
  );
};

export default OneTeamReport;