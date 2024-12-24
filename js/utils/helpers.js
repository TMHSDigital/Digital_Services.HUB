/**
 * Utility functions for Digital Services Hub
 */

const utils = {
    /**
     * Sanitize HTML string to prevent XSS
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    },

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} Whether email is valid
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    generateUID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, this.deepClone(value)])
            );
        }
        throw new Error(`Unable to clone object of type ${typeof obj}`);
    },

    /**
     * Check if running in mobile browser
     * @returns {boolean} Whether browser is mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Get browser language
     * @returns {string} Browser language code
     */
    getBrowserLanguage() {
        return navigator.language || navigator.userLanguage;
    },

    /**
     * Format date to locale string
     * @param {Date|string|number} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date
     */
    formatDate(date, options = {}) {
        const d = new Date(date);
        return d.toLocaleDateString(this.getBrowserLanguage(), options);
    },

    /**
     * Format relative time
     * @param {Date|string|number} date - Date to format
     * @returns {string} Relative time string
     */
    formatRelativeTime(date) {
        const rtf = new Intl.RelativeTimeFormat(this.getBrowserLanguage(), { numeric: 'auto' });
        const now = new Date();
        const diff = new Date(date).getTime() - now.getTime();
        const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
        const diffHours = Math.round(diff / (1000 * 60 * 60));
        const diffMinutes = Math.round(diff / (1000 * 60));

        if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, 'day');
        if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, 'hour');
        return rtf.format(diffMinutes, 'minute');
    },

    /**
     * Check if storage is available
     * @param {string} type - Storage type ('localStorage' or 'sessionStorage')
     * @returns {boolean} Whether storage is available
     */
    isStorageAvailable(type) {
        try {
            const storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Safe storage getter
     * @param {string} key - Storage key
     * @param {string} type - Storage type ('local' or 'session')
     * @returns {any} Stored value or null
     */
    getStorageItem(key, type = 'local') {
        try {
            const storage = type === 'local' ? localStorage : sessionStorage;
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from ${type}Storage:`, error);
            return null;
        }
    },

    /**
     * Safe storage setter
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @param {string} type - Storage type ('local' or 'session')
     * @returns {boolean} Whether operation was successful
     */
    setStorageItem(key, value, type = 'local') {
        try {
            const storage = type === 'local' ? localStorage : sessionStorage;
            storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to ${type}Storage:`, error);
            return false;
        }
    },

    /**
     * Load image as Promise
     * @param {string} src - Image URL
     * @returns {Promise<HTMLImageElement>} Loaded image
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} [offset=0] - Offset from viewport edges
     * @returns {boolean} Whether element is in viewport
     */
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 - offset &&
            rect.left >= 0 - offset &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
        );
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Whether copy was successful
     */
    async copyToClipboard(text) {
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                console.error('Failed to copy using Clipboard API:', error);
            }
        }
        
        // Fallback
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (error) {
            console.error('Failed to copy using fallback:', error);
            return false;
        }
    },

    /**
     * Detect file type from array buffer
     * @param {ArrayBuffer} buffer - File data
     * @returns {string|null} MIME type or null
     */
    detectFileType(buffer) {
        const arr = new Uint8Array(buffer).subarray(0, 4);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
        }
        
        switch (header) {
            case '89504e47': return 'image/png';
            case '47494638': return 'image/gif';
            case 'ffd8ffe0':
            case 'ffd8ffe1':
            case 'ffd8ffe2': return 'image/jpeg';
            case '52494646': return 'image/webp';
            default: return null;
        }
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Format file size
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    },

    /**
     * Get file extension
     * @param {string} filename - File name
     * @returns {string} File extension
     */
    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    },

    /**
     * Generate random string
     * @param {number} length - String length
     * @param {string} [chars] - Characters to use
     * @returns {string} Random string
     */
    generateRandomString(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        let result = '';
        const charactersLength = chars.length;
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    /**
     * Check if color is light
     * @param {string} color - Color in hex format
     * @returns {boolean} Whether color is light
     */
    isLightColor(color) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 155;
    },

    /**
     * Convert RGB to Hex
     * @param {number} r - Red value
     * @param {number} g - Green value
     * @param {number} b - Blue value
     * @returns {string} Hex color
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    /**
     * Convert Hex to RGB
     * @param {string} hex - Hex color
     * @returns {Object} RGB values
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};

// Export for ES modules
export default utils; 