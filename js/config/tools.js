export const TOOLS = [
    {
        id: 'text-to-speech',
        name: 'Text to Speech',
        description: 'Convert text to natural-sounding speech with multiple voices and languages.',
        icon: 'fa-volume-up',
        features: ['Multiple voices', 'Download audio'],
        path: 'pages/text-to-speech.html',
        category: 'audio',
        order: 1
    },
    {
        id: 'image-resizer',
        name: 'Image Resizer',
        description: 'Resize and optimize your images while maintaining quality.',
        icon: 'fa-image',
        features: ['Preserve ratio', 'Multiple formats'],
        path: 'pages/image-resizer.html',
        category: 'image',
        order: 2
    },
    {
        id: 'color-palette',
        name: 'Color Palette',
        description: 'Generate beautiful color harmonies for your designs.',
        icon: 'fa-palette',
        features: ['Color harmony', 'Export options'],
        path: 'pages/color-palette.html',
        category: 'design',
        order: 3
    },
    {
        id: 'ascii-art',
        name: 'ASCII Art',
        description: 'Convert images into creative ASCII art with customization options.',
        icon: 'fa-font',
        features: ['Custom styles', 'Export text'],
        path: 'pages/ascii-art.html',
        category: 'image',
        order: 4
    },
    {
        id: 'qr-code',
        name: 'QR Code',
        description: 'Generate customizable QR codes for your links and data.',
        icon: 'fa-qrcode',
        features: ['Custom styles', 'Download PNG'],
        path: 'pages/qr-code.html',
        category: 'utility',
        order: 5
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Create strong, secure passwords with advanced customization.',
        icon: 'fa-key',
        features: ['Custom options', 'Strength meter'],
        path: 'pages/password-generator.html',
        category: 'security',
        order: 6
    },
    {
        id: 'url-shortener',
        name: 'URL Shortener',
        description: 'Create short, memorable links for easy sharing and tracking.',
        icon: 'fa-link',
        features: ['Click analytics', 'Custom aliases'],
        path: 'pages/url-shortener.html',
        category: 'utility',
        order: 7
    }
];

export const CATEGORIES = {
    audio: {
        name: 'Audio Tools',
        description: 'Tools for audio processing and conversion',
        icon: 'fa-music'
    },
    image: {
        name: 'Image Tools',
        description: 'Tools for image manipulation and conversion',
        icon: 'fa-image'
    },
    design: {
        name: 'Design Tools',
        description: 'Tools for design and color management',
        icon: 'fa-palette'
    },
    utility: {
        name: 'Utility Tools',
        description: 'General purpose utility tools',
        icon: 'fa-tools'
    },
    security: {
        name: 'Security Tools',
        description: 'Tools for security and privacy',
        icon: 'fa-shield-alt'
    }
};

export const TOOL_STATS = {
    totalTools: TOOLS.length,
    toolsByCategory: Object.fromEntries(
        Object.keys(CATEGORIES).map(category => [
            category,
            TOOLS.filter(tool => tool.category === category).length
        ])
    )
}; 