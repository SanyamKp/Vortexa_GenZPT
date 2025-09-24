import React from 'react';

// SVG Icons for the feature cards
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const GpsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const RiskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="32" height="32"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 007.5 3v7.5z" /></svg>;

function HomePage({ onNavigate }) {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo">
          🌿 AI Crop Disease Tracker
        </div>
        <nav className="homepage-nav">
          <a href="#home" onClick={() => onNavigate('home')}>Home</a>
          <a href="#tracker" onClick={() => onNavigate('tracker')}>Tracker</a>
          <a href="#about">About</a>
        </nav>
      </header>
      <main className="hero-section">
        <div className="hero-content">
          <h1>AI-Powered Crop Disease Detection</h1>
          <p>Upload plant leaf images and get instant AI-powered disease identification with confidence scores, risk assessments, and interactive mapping of affected areas.</p>
          <button className="get-started-btn" onClick={() => onNavigate('tracker')}>
            Get Started →
          </button>
        </div>
        <div className="feature-cards-container">
          <div className="feature-card">
            <ImageIcon />
            <h3>Image Analysis</h3>
            <p>Upload leaf images for instant AI-powered disease detection.</p>
          </div>
          <div className="feature-card">
            <GpsIcon />
            <h3>GPS Tracking</h3>
            <p>Automatically capture location data for disease mapping.</p>
          </div>
          <div className="feature-card">
            <RiskIcon />
            <h3>Risk Assessment</h3>
            <p>Get detailed risk levels and confidence scores for your crops.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;