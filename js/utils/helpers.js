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
     * @returns {Promise<void>}
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
            default: return null;
        }
    }
};

// Export for ES modules
export default utils; 