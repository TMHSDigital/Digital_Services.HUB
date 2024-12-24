/**
 * Constants and configuration values for Digital Services Hub
 */

export const APP_CONFIG = {
    NAME: 'Digital Services Hub',
    VERSION: '1.0.0',
    AUTHOR: 'TMH Digital',
    GITHUB_URL: 'https://github.com/TMHDigital/Digital_Services.HUB'
};

export const STORAGE_KEYS = {
    THEME: 'theme',
    RECENT_URLS: 'shortened_urls',
    RECENT_PALETTES: 'saved_palettes',
    RECENT_QR_CODES: 'saved_qr_codes',
    PASSWORD_HISTORY: 'password_history'
};

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
};

export const FILE_LIMITS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_IMAGE_DIMENSION: 4096,
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    SUPPORTED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/mpeg'],
    MAX_HISTORY_ITEMS: 10
};

export const UI_CONSTANTS = {
    NOTIFICATION_DURATION: 3000,
    MOBILE_BREAKPOINT: 768,
    ANIMATION_DURATION: 300,
    MAX_NOTIFICATIONS: 3,
    DEBOUNCE_DELAY: 250,
    MODAL_Z_INDEX: 1000,
    NOTIFICATION_Z_INDEX: 1100,
    LOADER_Z_INDEX: 1200
};

export const ERROR_MESSAGES = {
    FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10MB',
    UNSUPPORTED_FILE_TYPE: 'File type is not supported',
    INVALID_DIMENSIONS: 'Image dimensions exceed the maximum limit',
    NETWORK_ERROR: 'Network error occurred. Please check your connection',
    STORAGE_ERROR: 'Error accessing local storage',
    GENERIC_ERROR: 'An unexpected error occurred. Please try again'
};

export const KEYBOARD_SHORTCUTS = {
    THEME_TOGGLE: {
        key: 't',
        ctrl: true,
        shift: true,
        description: 'Toggle dark/light theme'
    },
    CLOSE_MODAL: {
        key: 'Escape',
        description: 'Close modal or popup'
    },
    COPY_TO_CLIPBOARD: {
        key: 'c',
        ctrl: true,
        description: 'Copy to clipboard'
    }
};

export const ACCESSIBILITY = {
    ARIA_LABELS: {
        THEME_TOGGLE: 'Toggle dark/light theme',
        FILE_UPLOAD: 'Choose a file to upload',
        CLOSE_MODAL: 'Close modal',
        COPY_BUTTON: 'Copy to clipboard',
        DOWNLOAD_BUTTON: 'Download file',
        GENERATE_BUTTON: 'Generate',
        NOTIFICATION: 'Notification message',
        LOADING: 'Loading, please wait'
    },
    ROLES: {
        ALERT: 'alert',
        DIALOG: 'dialog',
        STATUS: 'status',
        BUTTON: 'button',
        TOOLBAR: 'toolbar',
        TABLIST: 'tablist',
        TAB: 'tab',
        TABPANEL: 'tabpanel'
    }
}; 