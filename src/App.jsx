import { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import Controls from './components/Controls';
import Preview from './components/Preview';
import { readFileAsDataURL, loadImage, getTransformedCanvas } from './utils/imageProcessing';
import './index.css';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleImageSelect = async (file) => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageSrc(dataUrl);
      // Reset controls on new image
      setScale(1);
      setRotation(0);
    } catch (error) {
      console.error("Failed to load image:", error);
      alert("Failed to load image. Please try another file.");
    }
  };

  const handleDownload = async () => {
    if (!imageSrc) return;
    setProcessing(true);

    try {
      // Use a small timeout to allow UI to update to "Processing..."
      setTimeout(async () => {
        const img = await loadImage(imageSrc);
        const canvas = getTransformedCanvas(img, scale, rotation);

        // Create download link
        const link = document.createElement('a');
        link.download = `resized-image-${Date.now()}.png`; // Defaulting to png
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setProcessing(false);
      }, 50);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to process image for download.");
      setProcessing(false);
    }
  };

  return (
    <div className="app-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: 'var(--spacing-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-lg)',
      alignItems: 'center'
    }}>
      <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h1 style={{
          fontSize: 'var(--font-size-2xl)',
          margin: 0,
          background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}>
          Image Resizer Pro
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
          Scale, Rotate, and Optimize your images instantly.
        </p>
      </header>

      <main style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--glass-shadow)',
        alignItems: 'center'
      }}>

        {!imageSrc ? (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <div className="editor-layout" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: 'var(--spacing-lg)',
            width: '100%'
          }}>
            <div className="preview-section" style={{
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Preview
                imageSrc={imageSrc}
                scale={scale}
                rotation={rotation}
              />
              <button
                onClick={() => setImageSrc(null)}
                style={{
                  marginTop: 'var(--spacing-md)',
                  background: 'transparent',
                  border: '1px solid var(--text-secondary)',
                  color: 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Upload New Image
              </button>
            </div>

            <div className="controls-section">
              <Controls
                scale={scale}
                setScale={setScale}
                rotation={rotation}
                setRotation={setRotation}
                onDownload={handleDownload}
                processing={processing}
              />
            </div>
          </div>
        )}
      </main>

      {/* Responsive adjustments for mobile */}
      <style>{`
        @media (max-width: 800px) {
          .editor-layout {
            grid-template-columns: 1fr !important;
          }
          .controls-section {
            width: 100%;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
