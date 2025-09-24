import React from 'react';

const riskStyles = {
  Low: { color: '#28a745', fontWeight: 'bold' },
  Medium: { color: '#ffc107', fontWeight: 'bold' },
  High: { color: '#dc3545', fontWeight: 'bold' },
};

const recommendations = {
  "Tomato Early blight": [
    "Prune affected lower leaves and stems.",
    "Apply a copper-based fungicide.",
    "Ensure proper air circulation around plants."
  ],
  "Tomato Late blight": [
    "Remove and destroy infected plants immediately.",
    "Apply preventative fungicides before symptoms appear.",
    "Avoid overhead watering; use drip irrigation."
  ],
  "Potato Late blight": [
    "Destroy infected foliage and tubers.",
    "Apply systemic fungicides.",
    "Harvest in dry weather to reduce tuber rot."
  ],
  "Default": [
    "Monitor crop health daily.",
    "Ensure balanced nutrition and watering.",
    "Consult a local agricultural extension office."
  ]
};

function ReportCard({ report }) {
  if (!report) return null;

  const actions = recommendations[report.disease] || recommendations["Default"];

  return (
    <div className="report-card-content">
      <h3>Analysis Result</h3>
      <img src={report.heatmap_url} alt="Analysis heatmap" className="heatmap-image" />
      <div className="result-details">
        <p><strong>Disease:</strong> {report.disease}</p>
        <p><strong>Confidence:</strong> {(report.confidence * 100).toFixed(1)}%</p>
        <p><strong>Risk Level:</strong><span style={riskStyles[report.risk]}> {report.risk}</span></p>
      </div>
      <div className="recommendations">
        <h4>💡 Recommended Actions</h4>
        <ul>
          {actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReportCard;