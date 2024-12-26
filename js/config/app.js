/**
 * Application configuration
 */

export const APP_CONFIG = {
    NAME: 'Digital Services Hub',
    VERSION: '1.0.0',
    AUTHOR: 'TMH Digital',
    GITHUB_URL: 'https://github.com/TMHDigital/Digital_Services.HUB'
};

/**
 * Storage keys used throughout the application
 * @readonly
 * @enum {string}
 */
export const STORAGE_KEYS = {
    THEME: 'theme',
    RECENT_URLS: 'shortened_urls',
    RECENT_PALETTES: 'saved_palettes',
    RECENT_QR_CODES: 'saved_qr_codes',
    PASSWORD_HISTORY: 'password_history'
};

/**
 * Available themes
 * @readonly
 * @enum {string}
 */
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
}; 