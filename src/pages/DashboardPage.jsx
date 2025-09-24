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

function DashboardPage({ reports }) {
  const [selectedReportId, setSelectedReportId] = useState(null);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Real-time overview of crop health and disease outbreaks.</p>
      </div>
      
      <div className="stats-grid">
        <StatCard value="4" label="Total Reports" />
        <StatCard value="High" label="Highest Risk" />
        <StatCard value="Tomato Blight" label="Most Common" />
        <StatCard value="3" label="Regions Affected" />
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