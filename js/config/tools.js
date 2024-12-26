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
        icon: 'fa-volume-up',
        features: ['Multiple voices', 'Download audio'],
        path: 'pages/text-to-speech.html',
        category: TOOL_CATEGORIES.AUDIO,
        order: 1
    },
    {
        id: 'image-resizer',
        name: 'Image Resizer',
        description: 'Resize and optimize your images while maintaining quality.',
        icon: 'fa-image',
        features: ['Preserve ratio', 'Multiple formats'],
        path: 'pages/image-resizer.html',
        category: TOOL_CATEGORIES.IMAGE,
        order: 2
    },
    {
        id: 'color-palette',
        name: 'Color Palette',
        description: 'Generate beautiful color harmonies for your designs.',
        icon: 'fa-palette',
        features: ['Color harmony', 'Export options'],
        path: 'pages/color-palette.html',
        category: TOOL_CATEGORIES.DESIGN,
        order: 3
    },
    {
        id: 'ascii-art',
        name: 'ASCII Art',
        description: 'Convert images into creative ASCII art with customization options.',
        icon: 'fa-font',
        features: ['Custom styles', 'Export text'],
        path: 'pages/ascii-art.html',
        category: TOOL_CATEGORIES.IMAGE,
        order: 4
    },
    {
        id: 'qr-code',
        name: 'QR Code',
        description: 'Generate customizable QR codes for your links and data.',
        icon: 'fa-qrcode',
        features: ['Custom styles', 'Download PNG'],
        path: 'pages/qr-code.html',
        category: TOOL_CATEGORIES.UTILITY,
        order: 5
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Create strong, secure passwords with advanced customization.',
        icon: 'fa-key',
        features: ['Custom options', 'Strength meter'],
        path: 'pages/password-generator.html',
        category: TOOL_CATEGORIES.SECURITY,
        order: 6
    },
    {
        id: 'url-shortener',
        name: 'URL Shortener',
        description: 'Create short, memorable links for easy sharing and tracking.',
        icon: 'fa-link',
        features: ['Click analytics', 'Custom aliases'],
        path: 'pages/url-shortener.html',
        category: TOOL_CATEGORIES.UTILITY,
        order: 7
    }
];

/**
 * @typedef {Object} CategoryInfo
 * @property {string} name - Display name of the category
 * @property {string} description - Category description
 * @property {string} icon - FontAwesome icon class
 */

/** @type {Record<string, CategoryInfo>} */
export const CATEGORIES = {
    [TOOL_CATEGORIES.AUDIO]: {
        name: 'Audio Tools',
        description: 'Tools for audio processing and conversion',
        icon: 'fa-music'
    },
    [TOOL_CATEGORIES.IMAGE]: {
        name: 'Image Tools',
        description: 'Tools for image manipulation and conversion',
        icon: 'fa-image'
    },
    [TOOL_CATEGORIES.DESIGN]: {
        name: 'Design Tools',
        description: 'Tools for design and color management',
        icon: 'fa-palette'
    },
    [TOOL_CATEGORIES.UTILITY]: {
        name: 'Utility Tools',
        description: 'General purpose utility tools',
        icon: 'fa-tools'
    },
    [TOOL_CATEGORIES.SECURITY]: {
        name: 'Security Tools',
        description: 'Tools for security and privacy',
        icon: 'fa-shield-alt'
    },
    [TOOL_CATEGORIES.TEXT]: {
        name: 'Text Tools',
        description: 'Tools for text manipulation and processing',
        icon: 'fa-font'
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
