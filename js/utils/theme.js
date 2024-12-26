import { THEMES } from '../config/app.js';

/**
 * Initialize theme system
 */
export function initializeTheme() {
    const themeButton = document.getElementById('theme-button');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');

    // Set initial theme
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === THEMES.DARK);
    } else {
        const isDark = prefersDarkScheme.matches;
        document.documentElement.setAttribute('data-theme', isDark ? THEMES.DARK : THEMES.LIGHT);
        updateThemeIcon(isDark);
    }

    // Theme toggle functionality
    themeButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme === THEMES.DARK);

        // Trigger a custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    });

    // Handle system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(e.matches);
        }
    });
}

/**
 * Update theme icon
 * @param {boolean} isDark - Whether dark theme is active
 */
function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-button').querySelector('i');
    if (isDark) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}
