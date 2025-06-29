import React, { useState } from 'react';

const GOOGLE_VISION_API_KEY = 'AIzaSyD3SlHJ9q_A_griCDYQNUKrCRmN2KEq974';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callVisionAPI(base64Image: string) {
  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
      }
    ]
  };

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );
  return await response.json();
}

const GoogleOcrDemo: React.FC = () => {
  const [ocrText, setOcrText] = useState('');
  const [fullJson, setFullJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setOcrText('');
    setFullJson(null);
    const base64 = await fileToBase64(file);
    const result = await callVisionAPI(base64);
    setFullJson(result);
    const text = result.responses?.[0]?.fullTextAnnotation?.text || 'No text found.';
    setOcrText(text);
    setLoading(false);
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Google Vision OCR Demo</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <div>Processing...</div>}
      {ocrText && (
        <pre style={{ background: '#222', color: '#0f0', padding: 12, marginTop: 16, borderRadius: 8 }}>
          {ocrText}
        </pre>
      )}
      {fullJson && (
        <div style={{ marginTop: 16 }}>
          <button onClick={() => setShowJson(v => !v)} style={{ marginBottom: 8 }}>
            {showJson ? 'Hide' : 'Show'} Full Vision API JSON
          </button>
          {showJson && (
            <pre style={{ background: '#111', color: '#fff', padding: 12, maxHeight: 400, overflow: 'auto', borderRadius: 8 }}>
              {JSON.stringify(fullJson, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleOcrDemo; 