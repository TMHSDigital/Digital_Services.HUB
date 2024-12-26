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
        path: './pages/text-to-speech.html',
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
        path: './pages/image-resizer.html',
        category: TOOL_CATEGORIES.IMAGE,
        order: 2
    },
    {
        id: 'ascii-art',
        name: 'ASCII Art',
        description: 'Convert images into creative ASCII art.',
        icon: 'fas fa-font',
        features: [
            { name: 'Custom Characters', icon: 'fas fa-keyboard', description: 'Choose character set' },
            { name: 'Size Control', icon: 'fas fa-arrows-alt', description: 'Adjust output size' },
            { name: 'Export Options', icon: 'fas fa-file-export', description: 'Save as text or image' }
        ],
        path: './pages/ascii-art.html',
        category: TOOL_CATEGORIES.IMAGE,
        order: 3
    },
    {
        id: 'color-palette',
        name: 'Color Palette',
        description: 'Generate beautiful color harmonies for designs.',
        icon: 'fas fa-palette',
        features: [
            { name: 'Color Harmonies', icon: 'fas fa-sync', description: 'Generate matching colors' },
            { name: 'Export Formats', icon: 'fas fa-file-code', description: 'CSS, SCSS, JSON' },
            { name: 'Accessibility', icon: 'fas fa-universal-access', description: 'Check contrast ratios' }
        ],
        path: './pages/color-palette.html',
        category: TOOL_CATEGORIES.DESIGN,
        order: 4
    },
    {
        id: 'qr-code',
        name: 'QR Code Generator',
        description: 'Create customizable QR codes for your links and data.',
        icon: 'fas fa-qrcode',
        features: [
            { name: 'Custom Styles', icon: 'fas fa-paint-brush', description: 'Customize colors and style' },
            { name: 'Multiple Formats', icon: 'fas fa-file-image', description: 'PNG, SVG, PDF' },
            { name: 'Error Correction', icon: 'fas fa-shield-alt', description: 'Reliable scanning' }
        ],
        path: './pages/qr-code.html',
        category: TOOL_CATEGORIES.UTILITY,
        order: 5
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate secure passwords with advanced options.',
        icon: 'fas fa-key',
        features: [
            { name: 'Custom Rules', icon: 'fas fa-sliders-h', description: 'Customize complexity' },
            { name: 'Strength Check', icon: 'fas fa-shield-alt', description: 'Password strength meter' },
            { name: 'Save History', icon: 'fas fa-history', description: 'Recent passwords' }
        ],
        path: './pages/password-generator.html',
        category: TOOL_CATEGORIES.SECURITY,
        order: 6
    },
    {
        id: 'url-shortener',
        name: 'URL Shortener',
        description: 'Create short, trackable links instantly.',
        icon: 'fas fa-link',
        features: [
            { name: 'Custom Aliases', icon: 'fas fa-tag', description: 'Create memorable links' },
            { name: 'Click Tracking', icon: 'fas fa-chart-line', description: 'Track link usage' },
            { name: 'QR Code Export', icon: 'fas fa-qrcode', description: 'Generate QR codes' }
        ],
        path: './pages/url-shortener.html',
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
