import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onUpload: (data: any) => void;
  isProcessing: boolean;
  onReset: () => void;
}

const UploadForm: React.FC<Props> = ({ onUpload, isProcessing, onReset }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(res.data);
      setError(null);
    } catch (err: any) {
      setError('Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept=".pdf,image/*" 
        disabled={isProcessing}
      />
      <button
        onClick={handleUpload}
        disabled={uploading || isProcessing}
        className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <button
        onClick={onReset}
        disabled={isProcessing}
        className="ml-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
      >
        Reset
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default UploadForm;