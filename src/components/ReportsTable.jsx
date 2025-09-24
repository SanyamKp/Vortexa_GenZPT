import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function ReportsTable({ reports, onRowClick, selectedReportId }) {
  return (
    <div className="reports-table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Disease Detected</th>
            <th>Confidence</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr 
              key={report.id} 
              onClick={() => onRowClick(report.id)}
              className={report.id === selectedReportId ? 'selected' : ''}
            >
              <td>{formatDate(report.timestamp)}</td>
              <td>{report.disease}</td>
              <td>{(report.confidence * 100).toFixed(1)}%</td>
              <td>
                <span className={`risk-pill risk-${report.risk?.toLowerCase()}`}>
                  {report.risk}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportsTable;