import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS } from '../utils/constants.js';

export default class ColorPalette extends BaseTool {
    constructor() {
        super();
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

    initializeElements() {
        return {
            // Color input elements
            colorInput: document.getElementById('color-input'),
            colorPicker: document.getElementById('color-picker'),

            // Palette elements
            paletteContainer: document.getElementById('palette-container'),
            paletteList: document.getElementById('palette-list'),

            // Action buttons
            generateButton: document.getElementById('generate-button'),
            copyButton: document.getElementById('copy-button'),
            clearButton: document.getElementById('clear-button'),

            // Scheme options
            schemeSelect: document.getElementById('scheme-select'),
            countSelect: document.getElementById('count-select'),

            // Notification
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            currentColor: '#000000',
            palette: [],
            schemes: {
                monochromatic: { count: [3, 5] },
                analogous: { count: [3, 5] },
                complementary: { count: [2, 4] },
                triadic: { count: [3] },
                tetradic: { count: [4] },
                splitComplementary: { count: [3] }
            }
        };
    }

    bindEvents() {
        const { colorInput, colorPicker, generateButton, copyButton, clearButton, schemeSelect, countSelect } = this.elements;

        // Color input events
        colorInput.addEventListener('input', this.handleColorInput.bind(this));
        colorPicker.addEventListener('change', this.handleColorPicker.bind(this));

        // Action button events
        generateButton.addEventListener('click', this.generatePalette.bind(this));
        copyButton.addEventListener('click', this.copyPalette.bind(this));
        clearButton.addEventListener('click', this.clearPalette.bind(this));

        // Scheme events
        schemeSelect.addEventListener('change', this.handleSchemeChange.bind(this));

        // Keyboard shortcuts
        this.addKeyboardShortcut('g', this.generatePalette.bind(this), { ctrl: true });
        this.addKeyboardShortcut('c', this.copyPalette.bind(this), { ctrl: true });
    }

    initialize() {
        // Set initial color
        this.elements.colorInput.value = this.state.currentColor;
        this.elements.colorPicker.value = this.state.currentColor;

        // Populate scheme select
        this.populateSchemeSelect();

        // Generate initial palette
        this.generatePalette();
    }

    handleColorInput(event) {
        const color = event.target.value;
        this.state.currentColor = color;
        this.elements.colorPicker.value = color;
        this.generatePalette();
    }

    handleColorPicker(event) {
        const color = event.target.value;
        this.state.currentColor = color;
        this.elements.colorInput.value = color;
        this.generatePalette();
    }

    handleSchemeChange() {
        const scheme = this.elements.schemeSelect.value;
        const counts = this.state.schemes[scheme].count;

        // Update count select options
        this.elements.countSelect.innerHTML = counts
            .map(count => `<option value="${count}">${count} colors</option>`)
            .join('');

        this.generatePalette();
    }

    populateSchemeSelect() {
        this.elements.schemeSelect.innerHTML = Object.keys(this.state.schemes)
            .map(scheme => {
                const name = scheme.replace(/([A-Z])/g, ' $1').toLowerCase();
                return `<option value="${scheme}">${name}</option>`;
            })
            .join('');
    }

    generatePalette() {
        const scheme = this.elements.schemeSelect.value;
        const count = parseInt(this.elements.countSelect.value);
        const color = this.state.currentColor;

        try {
            this.state.palette = this.generateColors(color, scheme, count);
            this.displayPalette();
        } catch (error) {
            console.error('Error generating palette:', error);
            this.showNotification('Failed to generate palette', 'error');
        }
    }

    generateColors(baseColor, scheme, count) {
        const hsl = this.hexToHSL(baseColor);
        let colors = [];

        switch (scheme) {
            case 'monochromatic':
                colors = this.generateMonochromatic(hsl, count);
                break;
            case 'analogous':
                colors = this.generateAnalogous(hsl, count);
                break;
            case 'complementary':
                colors = this.generateComplementary(hsl, count);
                break;
            case 'triadic':
                colors = this.generateTriadic(hsl);
                break;
            case 'tetradic':
                colors = this.generateTetradic(hsl);
                break;
            case 'splitComplementary':
                colors = this.generateSplitComplementary(hsl);
                break;
        }

        return colors.map(this.HSLToHex);
    }

    displayPalette() {
        this.elements.paletteList.innerHTML = this.state.palette
            .map(color => `
                <div class="color-item" style="background-color: ${color}">
                    <span class="color-value">${color}</span>
                </div>
            `)
            .join('');
    }

    copyPalette() {
        const colors = this.state.palette.join(', ');
        this.copyToClipboard(colors);
    }

    clearPalette() {
        this.state.palette = [];
        this.displayPalette();
    }

    // Color conversion utilities
    hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    HSLToHex({ h, s, l }) {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Color scheme generators
    generateMonochromatic({ h, s, l }, count) {
        const step = 100 / (count + 1);
        return Array.from({ length: count }, (_, i) => ({
            h,
            s,
            l: Math.min(100, Math.max(0, step * (i + 1)))
        }));
    }

    generateAnalogous({ h, s, l }, count) {
        const angle = 30;
        const step = angle / (count - 1);
        return Array.from({ length: count }, (_, i) => ({
            h: (h + step * i + 360) % 360,
            s,
            l
        }));
    }

    generateComplementary({ h, s, l }, count) {
        const complement = (h + 180) % 360;
        return count === 2 ? [
            { h, s, l },
            { h: complement, s, l }
        ] : [
            { h, s, l },
            { h: complement, s, l },
            { h, s: s * 0.8, l: l * 1.1 },
            { h: complement, s: s * 0.8, l: l * 1.1 }
        ];
    }

    generateTriadic({ h, s, l }) {
        return [
            { h, s, l },
            { h: (h + 120) % 360, s, l },
            { h: (h + 240) % 360, s, l }
        ];
    }

    generateTetradic({ h, s, l }) {
        return [
            { h, s, l },
            { h: (h + 90) % 360, s, l },
            { h: (h + 180) % 360, s, l },
            { h: (h + 270) % 360, s, l }
        ];
    }

    generateSplitComplementary({ h, s, l }) {
        return [
            { h, s, l },
            { h: (h + 150) % 360, s, l },
            { h: (h + 210) % 360, s, l }
        ];
    }
}

// Initialize the tool if we're on the color palette page
if (document.querySelector('.color-palette-container')) {
    new ColorPalette();
}
