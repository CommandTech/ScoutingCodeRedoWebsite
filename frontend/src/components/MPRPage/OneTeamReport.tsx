import React from 'react';
import './CSS/OneTeamReport.css';

interface OneTeamReportProps {
    color: string;
    robotNumber: string;
}

const OneTeamReport: React.FC<OneTeamReportProps> = ({color, robotNumber }) => {
  return (
    <div className={`one-team-report`}>
      <h2>One Team Report</h2>
      <p>Color: {color}</p>
      <p>Robot Number: {robotNumber}</p>
    </div>
  );
};

export default OneTeamReport;