/**
 * Theme system initialization and management
 */

// Theme constants
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

// Theme manager class
class ThemeManager {
    constructor() {
        this.theme = THEMES.SYSTEM;
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.observers = new Set();
    }

    initialize() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
            this.theme = savedTheme;
        }

        // Initialize theme
        this.applyTheme();

        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', () => {
            if (this.theme === THEMES.SYSTEM) {
                this.applyTheme();
            }
        });

        // Initialize theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateToggleButton(themeToggle);
        }
    }

    applyTheme() {
        let effectiveTheme = this.theme;

        // If system theme, use system preference
        if (effectiveTheme === THEMES.SYSTEM) {
            effectiveTheme = this.mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
        }

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', effectiveTheme);

        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                effectiveTheme === THEMES.DARK ? '#1a1a1a' : '#ffffff'
            );
        }

        // Notify observers
        this.notifyObservers();
    }

    toggleTheme() {
        const currentTheme = this.getEffectiveTheme();
        this.setTheme(currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
    }

    setTheme(theme) {
        if (!Object.values(THEMES).includes(theme)) {
            console.error(`Invalid theme: ${theme}`);
            return;
        }

        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();

        // Update toggle button if it exists
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            this.updateToggleButton(themeToggle);
        }
    }

    getTheme() {
        return this.theme;
    }

    getEffectiveTheme() {
        if (this.theme === THEMES.SYSTEM) {
            return this.mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
        }
        return this.theme;
    }

    updateToggleButton(button) {
        const isDark = this.getEffectiveTheme() === THEMES.DARK;
        button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
        button.innerHTML = `
            <i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>
            <span class="sr-only">${isDark ? 'Light' : 'Dark'} Mode</span>
        `;
    }

    addObserver(callback) {
        this.observers.add(callback);
    }

    removeObserver(callback) {
        this.observers.delete(callback);
    }

    notifyObservers() {
        const effectiveTheme = this.getEffectiveTheme();
        this.observers.forEach(callback => callback(effectiveTheme));
    }
}

// Create and export theme manager instance
const themeManager = new ThemeManager();

export function initializeTheme() {
    themeManager.initialize();
}

export function setTheme(theme) {
    themeManager.setTheme(theme);
}

export function getTheme() {
    return themeManager.getTheme();
}

export function getEffectiveTheme() {
    return themeManager.getEffectiveTheme();
}

export function addThemeObserver(callback) {
    themeManager.addObserver(callback);
}

export function removeThemeObserver(callback) {
    themeManager.removeObserver(callback);
}

export { THEMES };
