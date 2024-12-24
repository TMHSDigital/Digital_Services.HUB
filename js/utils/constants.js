/**
 * Constants and configuration values for Digital Services Hub
 */

export const APP_CONFIG = {
    NAME: 'Digital Services Hub',
    VERSION: '1.0.0',
    AUTHOR: 'Digital Services Team',
    GITHUB_URL: 'https://github.com/yourusername/digital-services-hub'
};

export const STORAGE_KEYS = {
    THEME: 'ds_hub_theme',
    LANGUAGE: 'ds_hub_language',
    USER_PREFERENCES: 'ds_hub_preferences',
    RECENT_FILES: 'ds_hub_recent_files'
};

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

export const FILE_LIMITS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_DIMENSION: 4096,
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    SUPPORTED_TEXT_TYPES: ['text/plain', 'text/html', 'text/css', 'text/javascript']
};

export const UI_CONSTANTS = {
    NOTIFICATION_DURATION: 3000,
    MAX_RECENT_FILES: 10,
    DEBOUNCE_DELAY: 300,
    MOBILE_BREAKPOINT: 768
};

export const ERROR_MESSAGES = {
    FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10MB',
    UNSUPPORTED_FILE_TYPE: 'File type is not supported',
    INVALID_DIMENSIONS: 'Image dimensions exceed the maximum limit',
    NETWORK_ERROR: 'Network error occurred. Please check your connection',
    STORAGE_ERROR: 'Error accessing local storage',
    GENERIC_ERROR: 'An unexpected error occurred'
};

export const API_ENDPOINTS = {
    BASE_URL: 'https://api.example.com',
    ROUTES: {
        AUTH: '/auth',
        FILES: '/files',
        CONVERT: '/convert',
        GENERATE: '/generate'
    }
};

export const KEYBOARD_SHORTCUTS = {
    SAVE: {
        key: 's',
        ctrl: true,
        description: 'Save current work'
    },
    UNDO: {
        key: 'z',
        ctrl: true,
        description: 'Undo last action'
    },
    REDO: {
        key: 'y',
        ctrl: true,
        description: 'Redo last action'
    },
    TOGGLE_THEME: {
        key: 't',
        ctrl: true,
        shift: true,
        description: 'Toggle dark/light theme'
    }
};

export const ACCESSIBILITY = {
    ARIA_LABELS: {
        MAIN_NAVIGATION: 'Main navigation',
        THEME_TOGGLE: 'Toggle theme',
        LANGUAGE_SELECTOR: 'Select language',
        FILE_UPLOAD: 'Upload file',
        SETTINGS_MENU: 'Settings menu'
    },
    ROLES: {
        MAIN: 'main',
        NAVIGATION: 'navigation',
        BUTTON: 'button',
        MENU: 'menu',
        MENUITEM: 'menuitem',
        DIALOG: 'dialog'
    }
}; 