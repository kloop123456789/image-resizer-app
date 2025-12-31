import { useEffect, useRef, useState } from 'react';
import { getTransformedCanvas, formatBytes, loadImage } from '../utils/imageProcessing';

const Preview = ({ imageSrc, scale, rotation, onStatsUpdate }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ width: 0, height: 0, size: null });

    useEffect(() => {
        let active = true;

        const render = async () => {
            if (!imageSrc) return;

            setLoading(true);
            try {
                const img = await loadImage(imageSrc);
                if (!active) return;

                const canvas = getTransformedCanvas(img, scale, rotation);

                // Update visible canvas
                const displayCanvas = canvasRef.current;
                if (displayCanvas) {
                    displayCanvas.width = canvas.width;
                    displayCanvas.height = canvas.height;
                    const ctx = displayCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, 0);
                }

                // Calculate stats
                // To get size, we need to export to blob. This can be heavy, so maybe debounce?
                // For now, let's try doing it every time, but purely for stats.
                canvas.toBlob((blob) => {
                    if (!active) return;
                    const size = blob ? blob.size : 0;
                    const newStats = {
                        width: canvas.width,
                        height: canvas.height,
                        size: size
                    };
                    setStats(newStats);
                    if (onStatsUpdate) onStatsUpdate(newStats);
                    setLoading(false);
                }, 'image/png'); // Defaulting to PNG for now. Ideally should match input or user choice.

            } catch (error) {
                console.error("Preview render failed:", error);
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(render, 100); // 100ms debounce
        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [imageSrc, scale, rotation]);

    if (!imageSrc) return null;

    return (
        <div className="preview-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            width: '100%',
            alignItems: 'center'
        }}>
            <div
                ref={containerRef}
                style={{
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    overflow: 'auto',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.2)', // Darker background to see transparency
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 'var(--spacing-sm)'
                }}>
                <canvas
                    ref={canvasRef}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                />
            </div>

            <div className="stats-panel" style={{
                display: 'flex',
                gap: 'var(--spacing-lg)',
                background: 'rgba(30, 41, 59, 0.5)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: '20px',
                border: '1px solid var(--glass-border)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
            }}>
                <div title="Dimensions">
                    📏 <span style={{ color: 'var(--text-primary)' }}>{stats.width} x {stats.height}</span> px
                </div>
                <div title="Estimated File Size">
                    💾 <span style={{ color: 'var(--text-primary)' }}>{loading ? '...' : formatBytes(stats.size)}</span>
                </div>
            </div>
        </div>
    );
};

export default Preview;
