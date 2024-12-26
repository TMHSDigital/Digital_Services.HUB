export class BaseTool {
    constructor() {
        this.elements = {};
        this.state = {};
        this.keyboardShortcuts = new Map();
    }

    initializeElements() {
        // Override in child class
        // Should return an object containing all DOM elements
        return {};
    }

    initializeState() {
        // Override in child class
        // Should return an object containing initial state
        return {};
    }

    bindEvents() {
        // Override in child class
        // Should bind all event listeners
    }

    initialize() {
        // Override in child class
        // Should perform any necessary initialization
    }

    addKeyboardShortcut(key, callback, options = {}) {
        const shortcut = {
            key: key.toLowerCase(),
            ctrl: options.ctrl || false,
            alt: options.alt || false,
            shift: options.shift || false,
            callback
        };

        this.keyboardShortcuts.set(key, shortcut);

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === shortcut.key &&
                (!shortcut.ctrl || (e.ctrlKey || e.metaKey)) &&
                (!shortcut.alt || e.altKey) &&
                (!shortcut.shift || e.shiftKey)) {
                e.preventDefault();
                shortcut.callback();
            }
        });
    }

    showNotification(message, type = 'success') {
        if (!this.elements.notification) return;

        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        this.elements.notification.style.display = 'block';

        setTimeout(() => {
            this.elements.notification.style.display = 'none';
        }, 3000);
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading from storage: ${error}`);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving to storage: ${error}`);
            return false;
        }
    }

    validateInput() {
        // Override in child class if needed
        // Should return true if input is valid, false otherwise
        return true;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification('Copied to clipboard', 'success'))
            .catch(() => this.showNotification('Failed to copy to clipboard', 'error'));
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
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}
