import { showNotification } from './ui.js';

export class BaseTool {
    constructor(toolId) {
        if (new.target === BaseTool) {
            throw new Error('BaseTool is an abstract class and cannot be instantiated directly.');
        }

        this.toolId = toolId;
        this.isInitialized = false;
    }

    async initialize() {
        // Override in child class
        // Should perform any necessary initialization
    }

    handleError(error, context = '') {
        console.error(`${this.toolId} error${context ? ` (${context})` : ''}:`, error);
        showNotification(
            `An error occurred${context ? ` while ${context}` : ''}. Please try again.`,
            'error'
        );
    }

    validateState() {
        if (!this.isInitialized) {
            throw new Error(`${this.toolId} is not initialized`);
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Copied to clipboard!', 'success');
        } catch (error) {
            this.handleError(error, 'copying to clipboard');
        }
    }

    async readFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (error) {
            this.handleError(error, 'reading from clipboard');
            return null;
        }
    }

    downloadFile(content, filename, type = 'text/plain') {
        try {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            this.handleError(error, 'downloading file');
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    getRandomId() {
        return `${this.toolId}-${Math.random().toString(36).substr(2, 9)}`;
    }

    setLocalStorage(key, value) {
        try {
            const fullKey = `${this.toolId}-${key}`;
            localStorage.setItem(fullKey, JSON.stringify(value));
        } catch (error) {
            this.handleError(error, 'saving to local storage');
        }
    }

    getLocalStorage(key) {
        try {
            const fullKey = `${this.toolId}-${key}`;
            const value = localStorage.getItem(fullKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.handleError(error, 'reading from local storage');
            return null;
        }
    }

    removeLocalStorage(key) {
        try {
            const fullKey = `${this.toolId}-${key}`;
            localStorage.removeItem(fullKey);
        } catch (error) {
            this.handleError(error, 'removing from local storage');
        }
    }
}
