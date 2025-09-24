import React, { useState } from 'react';
import MapView from '../components/MapView';
import ReportsTable from '../components/ReportsTable';
import AnalyticsCharts from '../components/AnalyticsCharts';

const StatCard = ({ value, label }) => (
  <div className="stat-card">
    <div className="value">{value}</div>
    <div className="label">{label}</div>
  </div>
);

function DashboardPage({ reports = [], error }) {
  const [selectedReportId, setSelectedReportId] = useState(null);

  // Count unique regions (latitude & longitude rounded to 2 decimals)
  const countUniqueRegions = (reports) => {
    const regions = new Set(
      reports.map(
        (r) =>
          `${r.lat !== undefined ? r.lat.toFixed(2) : '0'},${
            r.lon !== undefined ? r.lon.toFixed(2) : '0'
          }`
      )
    );
    return regions.size;
  };

  // Optional: Compute the most common disease
  const mostCommonDisease = () => {
    if (reports.length === 0) return 'N/A';
    const freq = {};
    reports.forEach((r) => {
      const name = r.disease || 'Unknown';
      freq[name] = (freq[name] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Real-time overview of crop health and disease outbreaks.</p>
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      </div>

      <div className="stats-grid">
        <StatCard value={reports.length} label="Total Reports" />
        <StatCard value="High" label="Highest Risk Area" /> {/* Can be dynamic later */}
        <StatCard value={mostCommonDisease()} label="Most Common" />
        <StatCard value={countUniqueRegions(reports)} label="Regions Affected" />
      </div>

      <div className="dashboard-main-view">
        <div className="map-card">
          <MapView
            reports={reports}
            onMarkerClick={setSelectedReportId}
            selectedReportId={selectedReportId}
          />
        </div>

        <div className="dashboard-right-column">
          <div className="table-card">
            <ReportsTable
              reports={reports}
              onRowClick={setSelectedReportId}
              selectedReportId={selectedReportId}
            />
          </div>
          <div className="chart-card">
            <AnalyticsCharts reports={reports} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
