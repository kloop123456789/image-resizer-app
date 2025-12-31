import { useState, useRef } from 'react';

const ImageUploader = ({ onImageSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndPass(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndPass(files[0]);
        }
    };

    const validateAndPass = (file) => {
        if (file.type.startsWith('image/')) {
            onImageSelect(file);
        } else {
            alert('Please upload an image file.');
        }
    };

    const triggerSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerSelect}
            style={{
                width: '100%',
                minHeight: '200px',
                border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                borderRadius: '16px',
                backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isDragging ? '0 0 20px var(--accent-glow)' : 'none'
            }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div style={{
                fontSize: '3rem',
                marginBottom: 'var(--spacing-sm)',
                color: isDragging ? 'var(--accent-primary)' : 'var(--text-secondary)'
            }}>
                📂
            </div>

            <h3 style={{
                margin: 0,
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-lg)'
            }}>
                {isDragging ? 'Drop Image Here' : 'Click or Drag Image Here'}
            </h3>

            <p style={{
                margin: 'var(--spacing-xs) 0 0',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
            }}>
                Supports JPG, PNG, WEBP
            </p>
        </div>
    );
};

export default ImageUploader;
