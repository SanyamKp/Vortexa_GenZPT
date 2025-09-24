import React, { useState } from 'react';

function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      setIsUploading(true);
      onUpload(file);
    }
  };

  return (
    <div className="upload-form">
      <div className="drop-zone" onClick={() => document.getElementById('file-input').click()}>
        <input type="file" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
        {file ? (
          <p>Selected File: {file.name}</p>
        ) : (
          <p>Click or drag file to this area to upload</p>
        )}
      </div>
      <button onClick={handleSubmit} disabled={!file || isUploading}>
        {isUploading ? 'Analyzing...' : 'Run Analysis'}
      </button>
    </div>
  );
}

export default UploadForm;