import React, { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import TrackerPage from './pages/TrackerPage';

function App() {
  const [page, setPage] = useState('home'); // 'home' or 'tracker'

  const navigateTo = (pageName) => {
    setPage(pageName);
  };

  return (
    <div className="app-root">
      {page === 'home' && <HomePage onNavigate={navigateTo} />}
      {page === 'tracker' && <TrackerPage />}
    </div>
  );
}

export default App;