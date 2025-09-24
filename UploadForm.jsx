import React, { useState } from 'react';

export default function UploadForm({ onAnalysisComplete, onAnalysisStart, onError }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      onError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    onAnalysisStart();

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lat', latitude);
      formData.append('lon', longitude);

      try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Prediction failed');
        const data = await response.json();
        onAnalysisComplete(data);
      } catch (error) {
        console.error("Analysis Error:", error);
        onError("Failed to get prediction from the server.");
      } finally {
        setIsLoading(false);
      }
    }, (geoError) => {
      console.error("Geolocation Error:", geoError);
      onError("Could not get location. Please enable location services.");
      setIsLoading(false);
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Crop Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
        <button type="submit" disabled={isLoading} className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors">
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>
    </div>
  );
}