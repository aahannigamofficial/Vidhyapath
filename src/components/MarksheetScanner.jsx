import { useState } from 'react';

export default function MarksheetScanner({ onDataExtracted }) {
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState(null);

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Scan with Vision API
    setScanning(true);
    try {
      const base64Image = await toBase64(file);
      const extractedData = await scanMarksheet(base64Image);
      onDataExtracted(extractedData);
    } catch (error) {
      console.error('Scan failed:', error);
      alert('Could not read marksheet. Please fill manually.');
    }
    setScanning(false);
  }

  async function scanMarksheet(base64Image) {
    const API_KEY = process.env.REACT_APP_VISION_API_KEY;
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image.split(',')[1] },
          features: [{ type: 'TEXT_DETECTION' }]
        }]
      })
    });

    const data = await response.json();
    const text = data.responses[0]?.fullTextAnnotation?.text || '';

    // Smart extraction (you can improve this with better parsing)
    const extractedData = parseMarksheet(text);
    return extractedData;
  }

  function parseMarksheet(text) {
    const lines = text.toLowerCase().split('\n');
    let data = {};

    // Extract name (usually near "name" keyword)
    const nameIndex = lines.findIndex(l => l.includes('name'));
    if (nameIndex !== -1 && lines[nameIndex + 1]) {
      data.fullName = lines[nameIndex + 1].trim();
    }

    // Extract percentage (look for numbers followed by %)
    const percentMatch = text.match(/(\d{2,3})\.?\d*\s*%/);
    if (percentMatch) {
      data.percentage = parseFloat(percentMatch[1]);
    }

    // Detect stream from subjects
    const textLower = text.toLowerCase();
    if (textLower.includes('physics') || textLower.includes('chemistry') || textLower.includes('biology')) {
      data.suggestedStream = 'science';
    } else if (textLower.includes('accounts') || textLower.includes('economics') || textLower.includes('commerce')) {
      data.suggestedStream = 'commerce';
    } else if (textLower.includes('history') || textLower.includes('political') || textLower.includes('geography')) {
      data.suggestedStream = 'arts';
    }

    return data;
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f97316, #fb923c)',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      border: '2px solid #fdba74'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{
          width: 60,
          height: 60,
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          margin: '0 auto 12px'
        }}>
          📸
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>
          ✨ Smart Marksheet Scanner
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
          Take a photo of your Class 12 marksheet and we'll auto-fill your profile!
        </p>
      </div>

      {preview && (
        <div style={{
          width: '100%',
          maxWidth: 300,
          margin: '0 auto 16px',
          borderRadius: 12,
          overflow: 'hidden',
          border: '3px solid white'
        }}>
          <img src={preview} alt="Marksheet preview" style={{ width: '100%', display: 'block' }} />
        </div>
      )}

      <label style={{
        display: 'block',
        padding: 16,
        background: 'white',
        color: '#f97316',
        borderRadius: 12,
        fontSize: '1rem',
        fontWeight: 700,
        textAlign: 'center',
        cursor: scanning ? 'not-allowed' : 'pointer',
        opacity: scanning ? 0.6 : 1
      }}>
        {scanning ? '🔄 Scanning...' : '📷 Upload Marksheet Photo'}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          disabled={scanning}
          style={{ display: 'none' }}
        />
      </label>

      <p style={{
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 12
      }}>
        💡 Works with any marksheet format • Free & secure
      </p>
    </div>
  );
}