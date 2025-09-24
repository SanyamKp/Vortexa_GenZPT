import React, { useState } from 'react';
import ReportCard from '../components/ReportCard';

// This is a mock analysis function for the demo
const mockAnalyze = (file, callback) => {
  console.log("Mock analyzing file:", file.name);
  setTimeout(() => {
    const results = [
      { id: "new-1", disease: "Tomato Late blight", confidence: 0.96, risk: "High", heatmap_url: "https://i.ibb.co/L50n11d/tomato-early-blight-heatmap.jpg" },
      { id: "new-2", disease: "Potato healthy", confidence: 0.99, risk: "Low", heatmap_url: "https://i.ibb.co/GvxYmJq/potato-healthy.jpg" }
    ];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    callback(randomResult);
  }, 2500); // Increased delay to showcase animation
};

// SVG Icon for the uploader
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

function AnalysisPage({ onNewReport }) {
  const [step, setStep] = useState('upload'); // 'upload', 'analyzing', 'result'
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setStep('analyzing');
      mockAnalyze(selectedFile, (result) => {
        setAnalysisResult(result);
        setStep('result');
      });
    }
  };

  const handleSubmitToMap = () => {
    setIsSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const completeReport = {
          ...analysisResult,
          id: `report-${Date.now()}`,
          lat: latitude,
          lon: longitude,
          timestamp: new Date().toISOString()
        };
        onNewReport(completeReport);
      },
      (err) => {
        alert("Could not get location. Please enable location services.");
        setIsSubmitting(false);
      }
    );
  };

  const handleReset = () => {
      setStep('upload');
      setFile(null);
      setPreviewUrl(null);
      setAnalysisResult(null);
  }

  return (
    <div className="analysis-page">
      <div className="page-header">
        <h2>New Disease Analysis</h2>
        <p>Get an instant diagnosis from our AI model in three simple steps.</p>
      </div>
      
      <div className="analysis-card-main">
        {step === 'upload' && (
          <div className="step-upload" onClick={() => document.getElementById('file-input-main').click()}>
            <input type="file" id="file-input-main" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
            <UploadIcon />
            <h3>Click or Drag File to Upload</h3>
            <p>We'll analyze the leaf and identify any diseases.</p>
          </div>
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
                <img src={analysisResult.heatmap_url} alt="AI analysis heatmap" />
              </div>
            </div>
            <div className="result-details-card">
              <ReportCard report={analysisResult} />
              <div className="result-actions">
                <button className="reset-button" onClick={handleReset}>Analyze Another Image</button>
                <button className="submit-map-button" onClick={handleSubmitToMap} disabled={isSubmitting}>
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