export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};

export const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
};

export const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getTransformedCanvas = (image, scale, rotation) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // To ensure the rotated image fits, we calculate the bounding box
    const rads = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rads));
    const sin = Math.abs(Math.sin(rads));

    const width = image.naturalWidth;
    const height = image.naturalHeight;

    // Bounding box dimensions
    const newWidth = width * cos + height * sin;
    const newHeight = width * sin + height * cos;

    // Final canvas dimensions (scaled)
    const finalWidth = Math.max(1, Math.floor(newWidth * scale));
    const finalHeight = Math.max(1, Math.floor(newHeight * scale));

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Move context to center of canvas
    ctx.translate(finalWidth / 2, finalHeight / 2);

    // Rotate
    ctx.rotate(rads);

    // Scale (we already sized the canvas for the scaled content, 
    // but we need to draw the image scaled or draw it naturally and let the canvas size handle it? 
    // Wait, if canvas is `newWidth * scale`, then 0,0 is top left.
    // We need to draw the image such that after scale/rotate it fits.

    // Easier approach:
    // 1. Scale context.
    // 2. Draw image centered.

    ctx.scale(scale, scale);

    // Draw image centered
    ctx.drawImage(image, -width / 2, -height / 2);

    return canvas;
};
