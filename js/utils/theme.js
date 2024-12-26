/**
 * Theme system initialization and management
 */

const THEME_KEY = 'preferred-theme';
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

/**
 * Initialize theme system
 */
export function initializeTheme() {
    const themeButton = document.getElementById('theme-button');
    if (!themeButton) return;

    // Set initial theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? THEMES.DARK : THEMES.LIGHT);

    setTheme(initialTheme);

    // Add theme toggle handler
    themeButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        setTheme(newTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
        }
    });
}

/**
 * Set theme and update UI
 * @param {string} theme - Theme to set (light/dark)
 */
function setTheme(theme) {
    // Update document theme
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme button icon
    const themeButton = document.getElementById('theme-button');
    if (themeButton) {
        const icon = themeButton.querySelector('i');
        if (icon) {
            icon.className = theme === THEMES.DARK ? 'fas fa-sun' : 'fas fa-moon';
        }
        themeButton.setAttribute('aria-label', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} theme`);
    }

    // Save preference
    localStorage.setItem(THEME_KEY, theme);

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Get current theme
 * @returns {string} Current theme (light/dark)
 */
export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || THEMES.LIGHT;
}

/**
 * Check if dark theme is active
 * @returns {boolean} True if dark theme is active
 */
export function isDarkTheme() {
    return getCurrentTheme() === THEMES.DARK;
}
