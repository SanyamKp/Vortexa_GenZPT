import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportCard from '../components/ReportCard';

const API_URL = 'http://localhost:8000';

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    width="48"
    height="48"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

function AnalysisPage({ onNewReport }) {
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setStep('analyzing');
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post(`${API_URL}/predict`, formData)
      .then((response) => {
        setAnalysisResult(response.data);
        setStep('result');
      })
      .catch((err) => {
        console.error('Analysis failed:', err);
        setError(
          'Analysis failed. Could not connect to the AI server. Please try again.'
        );
        setStep('upload');
      });
  };

  const handleSubmitToMap = () => {
    if (!analysisResult) return;
    setIsSubmitting(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const completeReport = {
          ...analysisResult,
          id: `report-${Date.now()}`,
          lat: latitude,
          lon: longitude,
          timestamp: new Date().toISOString(),
        };
        onNewReport(completeReport);
        setIsSubmitting(false);
      },
      (err) => {
        setError(
          'Could not get location. Please enable location services in your browser.'
        );
        setIsSubmitting(false);
      }
    );
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError('');
  };

  return (
    <div className="analysis-page">
      <div className="page-header">
        <h2>New Disease Analysis</h2>
        <p>Upload a crop leaf image to get a live diagnosis from our AI model.</p>
        {error && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
        )}
      </div>

      <div className="analysis-card-main">
        {step === 'upload' && (
          <label className="step-upload" htmlFor="file-input-main">
            <input
              type="file"
              id="file-input-main"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
              disabled={isSubmitting}
            />
            <UploadIcon />
            <h3>Click or Drag File to Upload</h3>
            <p>We'll analyze the leaf and identify any diseases.</p>
          </label>
        )}

        {step === 'analyzing' && (
          <div className="step-analyzing">
            <div className="scanner-animation">
              <div className="leaf-icon">🌿</div>
              <div className="scan-line"></div>
            </div>
            <h3>Analyzing Image...</h3>
            <p>Our AI is looking for patterns and identifying potential diseases.</p>
          </div>
        )}

        {step === 'result' && analysisResult && (
          <div className="step-result">
            <div className="result-comparison">
              <div className="image-container">
                <h4>Original Image</h4>
                <img src={previewUrl} alt="Original crop leaf" />
              </div>
              <div className="image-container">
                <h4>AI Heatmap Analysis</h4>
                <img
                  src={`${API_URL}${analysisResult.heatmap_url}`}
                  alt="AI analysis heatmap"
                />
              </div>
            </div>

            <div className="result-details-card">
              <ReportCard report={analysisResult} />
              <div className="result-actions">
                <button className="reset-button" onClick={handleReset}>
                  Analyze Another Image
                </button>
                <button
                  className="submit-map-button"
                  onClick={handleSubmitToMap}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add to Public Map'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;
