/**
 * Formatting utilities for various data types
 */

/**
 * Format date with options
 * @param {Date|string|number} date - Date to format
 * @param {Intl.DateTimeFormatOptions} options - Format options
 * @returns {string} Formatted date
 */
export function formatDate(date, options = {}) {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat(undefined, options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
        return formatDate(then);
    } else if (days > 0) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
        return 'Just now';
    }
}

/**
 * Format file size in bytes to human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
export function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Convert RGB to Hex color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color
 */
export function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Convert Hex to RGB color
 * @param {string} hex - Hex color
 * @returns {{r: number, g: number, b: number}|null} RGB color or null if invalid
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Check if color is light
 * @param {string} color - Hex color
 * @returns {boolean} Whether color is light
 */
export function isLightColor(color) {
    const rgb = hexToRgb(color);
    if (!rgb) return false;
    const { r, g, b } = rgb;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
} 