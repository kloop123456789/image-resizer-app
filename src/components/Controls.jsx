import React from 'react';

const ControlSlider = ({ label, value, onChange, min, max, step, unit = '' }) => (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
        }}>
            <span>{label}</span>
            <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                {value}{unit}
            </span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            style={{
                width: '100%',
                accentColor: 'var(--accent-primary)',
                cursor: 'pointer'
            }}
        />
    </div>
);

const Controls = ({ scale, setScale, rotation, setRotation, onDownload, processing }) => {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            padding: 'var(--spacing-md)',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            width: '100%',
            maxWidth: '400px'
        }}>
            <h3 style={{
                margin: '0 0 var(--spacing-md) 0',
                fontSize: '1.1rem',
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: 'var(--spacing-xs)'
            }}>
                Adjustments
            </h3>

            <ControlSlider
                label="Scale (Zoom)"
                value={scale}
                onChange={setScale}
                min={0.1}
                max={3}
                step={0.1}
                unit="x"
            />

            <ControlSlider
                label="Rotation"
                value={rotation}
                onChange={setRotation}
                min={-180}
                max={180}
                step={1}
                unit="°"
            />

            <button
                onClick={onDownload}
                disabled={processing}
                style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    marginTop: 'var(--spacing-sm)',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: processing ? 'wait' : 'pointer',
                    opacity: processing ? 0.7 : 1,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
                }}
                onMouseEnter={(e) => {
                    if (!processing) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(56, 189, 248, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.3)';
                }}
            >
                {processing ? 'Processing...' : 'Download Image'}
            </button>
        </div>
    );
};

export default Controls;
