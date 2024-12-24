import { initializeTheme } from '../utils/theme.js';
import { notifications } from '../utils/ui.js';

export class BaseTool {
    constructor() {
        if (new.target === BaseTool) {
            throw new Error('BaseTool is an abstract class and cannot be instantiated directly');
        }
        
        // Initialize theme first
        initializeTheme();
        
        // Initialize tool
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.bindEvents();
        this.initialize();
        
        // Set up error boundary
        this.setupErrorBoundary();
    }

    /**
     * Initialize DOM elements used by the tool
     * @abstract
     * @returns {Object} Map of element references
     */
    initializeElements() {
        throw new Error('initializeElements must be implemented by subclass');
    }

    /**
     * Initialize tool state
     * @abstract
     * @returns {Object} Initial state object
     */
    initializeState() {
        throw new Error('initializeState must be implemented by subclass');
    }

    /**
     * Bind event listeners
     * @abstract
     */
    bindEvents() {
        throw new Error('bindEvents must be implemented by subclass');
    }

    /**
     * Initialize the tool
     * @abstract
     */
    initialize() {
        throw new Error('initialize must be implemented by subclass');
    }

    /**
     * Set up error boundary for the tool
     * @private
     */
    setupErrorBoundary() {
        window.addEventListener('error', (event) => {
            if (this.isEventFromTool(event)) {
                this.handleError(event.error);
                event.preventDefault();
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            if (this.isEventFromTool(event)) {
                this.handleError(event.reason);
                event.preventDefault();
            }
        });
    }

    /**
     * Check if an error event originated from this tool
     * @private
     * @param {Event} event - The error event
     * @returns {boolean} Whether the event is from this tool
     */
    isEventFromTool(event) {
        const toolContainer = document.getElementById(`${this.constructor.name.toLowerCase()}-container`);
        return toolContainer && (event.target === toolContainer || toolContainer.contains(event.target));
    }

    /**
     * Handle tool errors
     * @private
     * @param {Error} error - The error to handle
     */
    handleError(error) {
        console.error(`${this.constructor.name} Error:`, error);
        notifications.error('An error occurred. Please try again or refresh the page.');
    }

    /**
     * Show a notification to the user
     * @param {string} message - Message to display
     * @param {'success' | 'error' | 'info'} [type='info'] - Type of notification
     * @param {number} [duration=3000] - Duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        notifications[type](message, duration);
    }

    /**
     * Handle file selection with validation
     * @param {File} file - The selected file
     * @param {Object} options - Validation options
     * @param {string[]} options.allowedTypes - Allowed MIME types
     * @param {number} options.maxSize - Maximum file size in bytes
     * @returns {Promise<boolean>} Whether the file is valid
     */
    async validateFile(file, { allowedTypes, maxSize }) {
        if (!file) {
            this.showNotification('No file selected', 'error');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showNotification(
                `Unsupported file type. Please use: ${allowedTypes.join(', ')}`,
                'error'
            );
            return false;
        }

        if (file.size > maxSize) {
            this.showNotification(
                `File too large. Maximum size is ${this.formatFileSize(maxSize)}`,
                'error'
            );
            return false;
        }

        return true;
    }

    /**
     * Format file size in human-readable format
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Add keyboard shortcut
     * @param {string} key - Key to listen for
     * @param {Function} callback - Function to call
     * @param {Object} options - Options object
     * @param {boolean} options.ctrl - Whether Ctrl key is required
     * @param {boolean} options.alt - Whether Alt key is required
     * @param {boolean} options.shift - Whether Shift key is required
     */
    addKeyboardShortcut(key, callback, { ctrl = false, alt = false, shift = false } = {}) {
        const listener = (e) => {
            if (
                e.key.toLowerCase() === key.toLowerCase() &&
                e.ctrlKey === ctrl &&
                e.altKey === alt &&
                e.shiftKey === shift
            ) {
                e.preventDefault();
                callback.call(this);
            }
        };
        
        document.addEventListener('keydown', listener);
        this._boundEvents = this._boundEvents || [];
        this._boundEvents.push({ element: document, type: 'keydown', listener });
    }

    /**
     * Download a file
     * @param {Blob} blob - File data
     * @param {string} filename - Name for the downloaded file
     */
    downloadFile(blob, filename) {
        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showNotification('File downloaded successfully', 'success');
        } catch (error) {
            console.error('Error downloading file:', error);
            this.showNotification('Failed to download file', 'error');
        }
    }

    /**
     * Load a script dynamically
     * @param {string} src - Script URL
     * @returns {Promise} Promise that resolves when script is loaded
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Clear notification timeout
        if (this._notificationTimeout) {
            clearTimeout(this._notificationTimeout);
        }

        // Remove event listeners
        if (this._boundEvents) {
            this._boundEvents.forEach(({ element, type, listener }) => {
                element.removeEventListener(type, listener);
            });
        }
    }
} 