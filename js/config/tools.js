/**
 * @typedef {Object} Tool
 * @property {string} id - Unique identifier for the tool
 * @property {string} name - Display name of the tool
 * @property {string} description - Tool description
 * @property {string} icon - FontAwesome icon class
 * @property {string[]} features - List of key features
 * @property {string} path - Path to the tool's page
 * @property {string} category - Tool category
 * @property {number} order - Display order
 */

/**
 * Tool categories
 * @readonly
 * @enum {string}
 */
export const TOOL_CATEGORIES = {
    AUDIO: 'audio',
    IMAGE: 'image',
    TEXT: 'text',
    UTILITY: 'utility',
    DESIGN: 'design',
    SECURITY: 'security'
};

/** @type {Tool[]} */
export const TOOLS = [
    {
        id: 'text-to-speech',
        name: 'Text to Speech',
        description: 'Convert text to natural-sounding speech with multiple voices and languages.',
        icon: 'fas fa-volume-up',
        features: [
            { name: 'Multiple Voices', icon: 'fas fa-microphone', description: 'Choose from various voices' },
            { name: 'Language Support', icon: 'fas fa-language', description: 'Multiple language options' },
            { name: 'Download Audio', icon: 'fas fa-download', description: 'Save as MP3' }
        ],
        path: '/tools/text-to-speech',
        category: TOOL_CATEGORIES.AUDIO,
        order: 1
    },
    {
        id: 'image-resizer',
        name: 'Image Resizer',
        description: 'Resize and optimize your images while maintaining quality.',
        icon: 'fas fa-image',
        features: [
            { name: 'Preserve Ratio', icon: 'fas fa-expand', description: 'Maintain aspect ratio' },
            { name: 'Multiple Formats', icon: 'fas fa-file-image', description: 'Support for PNG, JPG, WebP' },
            { name: 'Batch Processing', icon: 'fas fa-layer-group', description: 'Process multiple images' }
        ],
        path: '/tools/image-resizer',
        category: TOOL_CATEGORIES.IMAGE,
        order: 2
    },
    {
        id: 'color-palette',
        name: 'Color Palette',
        description: 'Generate beautiful color harmonies for your designs.',
        icon: 'fas fa-palette',
        features: [
            { name: 'Color Harmony', icon: 'fas fa-paint-brush', description: 'Generate matching colors' },
            { name: 'Export Options', icon: 'fas fa-file-export', description: 'Save in various formats' },
            { name: 'Accessibility', icon: 'fas fa-universal-access', description: 'Check contrast ratios' }
        ],
        path: '/tools/color-palette',
        category: TOOL_CATEGORIES.DESIGN,
        order: 3
    },
    {
        id: 'ascii-art',
        name: 'ASCII Art',
        description: 'Convert images into creative ASCII art with customization options.',
        icon: 'fas fa-font',
        features: [
            { name: 'Custom Styles', icon: 'fas fa-brush', description: 'Multiple art styles' },
            { name: 'Export Text', icon: 'fas fa-file-alt', description: 'Save as text file' },
            { name: 'Image Input', icon: 'fas fa-file-image', description: 'Convert from images' }
        ],
        path: '/tools/ascii-art',
        category: TOOL_CATEGORIES.IMAGE,
        order: 4
    },
    {
        id: 'qr-code',
        name: 'QR Code',
        description: 'Generate customizable QR codes for your links and data.',
        icon: 'fas fa-qrcode',
        features: [
            { name: 'Custom Styles', icon: 'fas fa-paint-roller', description: 'Customize appearance' },
            { name: 'Download PNG', icon: 'fas fa-download', description: 'High-quality export' },
            { name: 'Error Correction', icon: 'fas fa-shield-alt', description: 'Reliable scanning' }
        ],
        path: '/tools/qr-code',
        category: TOOL_CATEGORIES.UTILITY,
        order: 5
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Create strong, secure passwords with advanced customization.',
        icon: 'fas fa-key',
        features: [
            { name: 'Custom Options', icon: 'fas fa-sliders-h', description: 'Customize complexity' },
            { name: 'Strength Meter', icon: 'fas fa-tachometer-alt', description: 'Check password strength' },
            { name: 'Secure Generation', icon: 'fas fa-lock', description: 'Cryptographically secure' }
        ],
        path: '/tools/password-generator',
        category: TOOL_CATEGORIES.SECURITY,
        order: 6
    },
    {
        id: 'url-shortener',
        name: 'URL Shortener',
        description: 'Create short, memorable links for easy sharing and tracking.',
        icon: 'fas fa-link',
        features: [
            { name: 'Click Analytics', icon: 'fas fa-chart-line', description: 'Track link usage' },
            { name: 'Custom Aliases', icon: 'fas fa-tag', description: 'Personalize URLs' },
            { name: 'QR Code Export', icon: 'fas fa-qrcode', description: 'Generate QR codes' }
        ],
        path: '/tools/url-shortener',
        category: TOOL_CATEGORIES.UTILITY,
        order: 7
    }
];

/**
 * @typedef {Object} CategoryInfo
 * @property {string} name - Display name of the category
 * @property {string} description - Category description
 * @property {string} icon - FontAwesome icon class
 * @property {string} color - Category color
 */

/** @type {Record<string, CategoryInfo>} */
export const CATEGORIES = {
    [TOOL_CATEGORIES.AUDIO]: {
        name: 'Audio Tools',
        description: 'Tools for audio processing and conversion',
        icon: 'fas fa-music',
        color: '#00f2fe'
    },
    [TOOL_CATEGORIES.IMAGE]: {
        name: 'Image Tools',
        description: 'Tools for image manipulation and conversion',
        icon: 'fas fa-image',
        color: '#4facfe'
    },
    [TOOL_CATEGORIES.DESIGN]: {
        name: 'Design Tools',
        description: 'Tools for design and color management',
        icon: 'fas fa-palette',
        color: '#b721ff'
    },
    [TOOL_CATEGORIES.UTILITY]: {
        name: 'Utility Tools',
        description: 'General purpose utility tools',
        icon: 'fas fa-tools',
        color: '#21d4fd'
    },
    [TOOL_CATEGORIES.SECURITY]: {
        name: 'Security Tools',
        description: 'Tools for security and privacy',
        icon: 'fas fa-shield-alt',
        color: '#0061ff'
    },
    [TOOL_CATEGORIES.TEXT]: {
        name: 'Text Tools',
        description: 'Tools for text manipulation and processing',
        icon: 'fas fa-font',
        color: '#60efff'
    }
};

/**
 * @typedef {Object} ToolStats
 * @property {number} totalTools - Total number of tools
 * @property {Record<string, number>} toolsByCategory - Number of tools in each category
 */

/** @type {ToolStats} */
export const TOOL_STATS = {
    totalTools: TOOLS.length,
    toolsByCategory: Object.fromEntries(
        Object.keys(CATEGORIES).map(category => [
            category,
            TOOLS.filter(tool => tool.category === category).length
        ])
    )
};
