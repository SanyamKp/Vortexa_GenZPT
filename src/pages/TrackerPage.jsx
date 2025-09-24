import React, { useState, useEffect } from 'react';
import DashboardPage from './DashboardPage';
import AnalysisPage from './AnalysisPage';
import Sidebar from '../components/Sidebar'; // Import the new Sidebar
import demoReports from '../demo-reports.json';

// New Toggle Button Component
const SidebarToggle = ({ isOpen, toggle }) => (
  <button className={`sidebar-toggle ${isOpen ? 'open' : ''}`} onClick={toggle}>
    <div className="hamburger-icon">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </button>
);

function TrackerPage() {
  const [page, setPage] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default

  useEffect(() => {
    setReports(demoReports);
  }, []);

  const handleNewReport = (newReport) => {
    setReports(prevReports => [newReport, ...prevReports]);
    setPage('dashboard');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar currentPage={page} setPage={setPage} isOpen={isSidebarOpen} />
      <div className="main-content-wrapper">
        <SidebarToggle isOpen={isSidebarOpen} toggle={toggleSidebar} />
        <main className="main-content">
          {page === 'dashboard' && <DashboardPage reports={reports} />}
          {page === 'analysis' && <AnalysisPage onNewReport={handleNewReport} />}
        </main>
      </div>
    </div>
  );
}

export default TrackerPage;