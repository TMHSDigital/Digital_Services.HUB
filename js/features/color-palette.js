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
            colorInput: document.getElementById('color-input'),
            colorPicker: document.getElementById('color-picker'),
            paletteContainer: document.getElementById('palette-container'),
            paletteList: document.getElementById('palette-list'),
            generateButton: document.getElementById('generate-button'),
            copyButton: document.getElementById('copy-button'),
            clearButton: document.getElementById('clear-button'),
            schemeSelect: document.getElementById('scheme-select'),
            countSelect: document.getElementById('count-select'),
            notification: document.querySelector('.notification'),
            exportButtons: document.querySelectorAll('.export-menu button'),
            savedPaletteGrid: document.getElementById('saved-palette-grid'),
            clearSavedButton: document.getElementById('clear-saved')
        };
    }

    initializeState() {
        return {
            currentColor: '#000000',
            palette: [],
            savedPalettes: [],
            maxSavedPalettes: 20,
            schemes: {
                monochromatic: { count: [3, 5], label: 'Monochromatic' },
                analogous: { count: [3, 5], label: 'Analogous' },
                complementary: { count: [2, 4], label: 'Complementary' },
                triadic: { count: [3], label: 'Triadic' },
                tetradic: { count: [4], label: 'Tetradic' },
                splitComplementary: { count: [3], label: 'Split Complementary' }
            }
        };
    }

    bindEvents() {
        const { colorInput, colorPicker, generateButton, copyButton, clearButton,
                schemeSelect, exportButtons, clearSavedButton } = this.elements;

        colorInput.addEventListener('input', this.handleColorInput.bind(this));
        colorPicker.addEventListener('change', this.handleColorPicker.bind(this));
        generateButton.addEventListener('click', this.generatePalette.bind(this));
        copyButton.addEventListener('click', this.copyPalette.bind(this));
        clearButton.addEventListener('click', this.clearPalette.bind(this));
        schemeSelect.addEventListener('change', this.handleSchemeChange.bind(this));
        clearSavedButton?.addEventListener('click', this.clearSavedPalettes.bind(this));

        exportButtons?.forEach(button => {
            button.addEventListener('click', () => this.exportPalette(button.dataset.format));
        });

        this.addKeyboardShortcut('g', this.generatePalette.bind(this), { ctrl: true });
        this.addKeyboardShortcut('c', this.copyPalette.bind(this), { ctrl: true });
    }

    initialize() {
        this.elements.colorInput.value = this.state.currentColor;
        this.elements.colorPicker.value = this.state.currentColor;
        this.populateSchemeSelect();
        this.loadSavedPalettes();
        this.generatePalette();
    }

    handleColorInput(event) {
        const color = event.target.value;
        if (!this.isValidColor(color)) return;

        this.updateCurrentColor(color);
        this.generatePalette();
    }

    handleColorPicker(event) {
        const color = event.target.value;
        if (!this.isValidColor(color)) return;

        this.updateCurrentColor(color);
        this.generatePalette();
    }

    handleSchemeChange() {
        const scheme = this.elements.schemeSelect.value;
        const counts = this.state.schemes[scheme].count;

        this.elements.countSelect.innerHTML = counts
            .map(count => `<option value="${count}">${count} colors</option>`)
            .join('');

        this.generatePalette();
    }

    updateCurrentColor(color) {
        this.state.currentColor = color;
        this.elements.colorInput.value = color;
        this.elements.colorPicker.value = color;
    }

    populateSchemeSelect() {
        this.elements.schemeSelect.innerHTML = Object.entries(this.state.schemes)
            .map(([value, { label }]) => `<option value="${value}">${label}</option>`)
            .join('');
    }

    async generatePalette() {
        const scheme = this.elements.schemeSelect.value;
        const count = parseInt(this.elements.countSelect.value);
        const color = this.state.currentColor;

        try {
            this.state.palette = this.generateColors(color, scheme, count);
            this.displayPalette();
            this.showNotification('Palette generated successfully');
        } catch (error) {
            console.error('Error generating palette:', error);
            this.showNotification('Failed to generate palette', 'error');
        }
    }

    generateColors(baseColor, scheme, count) {
        const hsl = this.hexToHSL(baseColor);

        const generators = {
            monochromatic: () => this.generateMonochromatic(hsl, count),
            analogous: () => this.generateAnalogous(hsl, count),
            complementary: () => this.generateComplementary(hsl, count),
            triadic: () => this.generateTriadic(hsl),
            tetradic: () => this.generateTetradic(hsl),
            splitComplementary: () => this.generateSplitComplementary(hsl)
        };

        const generator = generators[scheme];
        if (!generator) {
            throw new Error(`Invalid color scheme: ${scheme}`);
        }

        return generator().map(this.HSLToHex.bind(this));
    }

    displayPalette() {
        if (!this.elements.paletteList) return;

        this.elements.paletteList.innerHTML = this.state.palette
            .map(color => `
                <div class="color-item" style="background-color: ${color}">
                    <span class="color-value" role="button" tabindex="0" aria-label="Copy color value: ${color}">
                        ${color}
                    </span>
                </div>
            `)
            .join('');

        const colorItems = this.elements.paletteList.querySelectorAll('.color-value');
        colorItems.forEach(item => {
            item.addEventListener('click', () => this.copyToClipboard(item.textContent.trim()));
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.copyToClipboard(item.textContent.trim());
                }
            });
        });
    }

    exportPalette(format) {
        if (!this.state.palette.length) return;

        const formatters = {
            hex: () => this.state.palette.join(', '),
            rgb: () => this.state.palette.map(this.hexToRGB).join(', '),
            hsl: () => this.state.palette.map(hex => {
                const { h, s, l } = this.hexToHSL(hex);
                return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
            }).join(', '),
            css: () => this.state.palette
                .map((hex, i) => `--color-${i + 1}: ${hex};`)
                .join('\n'),
            sass: () => this.state.palette
                .map((hex, i) => `$color-${i + 1}: ${hex};`)
                .join('\n')
        };

        const formatter = formatters[format];
        if (!formatter) {
            this.showNotification(`Invalid export format: ${format}`, 'error');
            return;
        }

        this.copyToClipboard(formatter());
        this.showNotification(`Palette exported as ${format.toUpperCase()}`);
    }

    savePalette() {
        if (!this.state.palette.length) return;

        const palette = {
            colors: this.state.palette,
            timestamp: Date.now()
        };

        this.state.savedPalettes.unshift(palette);
        if (this.state.savedPalettes.length > this.state.maxSavedPalettes) {
            this.state.savedPalettes.pop();
        }

        this.saveToStorage('savedPalettes', this.state.savedPalettes);
        this.updateSavedPalettes();
        this.showNotification('Palette saved successfully');
    }

    loadSavedPalettes() {
        const savedPalettes = this.loadFromStorage('savedPalettes');
        if (savedPalettes) {
            this.state.savedPalettes = savedPalettes;
            this.updateSavedPalettes();
        }
    }

    updateSavedPalettes() {
        if (!this.elements.savedPaletteGrid) return;

        this.elements.savedPaletteGrid.innerHTML = this.state.savedPalettes
            .map((palette, index) => this.createSavedPaletteElement(palette, index))
            .join('');

        this.elements.clearSavedButton.style.display =
            this.state.savedPalettes.length ? 'block' : 'none';
    }

    createSavedPaletteElement(palette, index) {
        return `
            <div class="saved-palette" data-index="${index}">
                <div class="saved-swatches">
                    ${palette.colors.map(color => `
                        <div class="saved-swatch"
                             style="background-color: ${color}"
                             title="${color}">
                        </div>
                    `).join('')}
                </div>
                <div class="saved-palette-actions">
                    <button class="load-palette" aria-label="Load this palette">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="delete-palette" aria-label="Delete this palette">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    clearSavedPalettes() {
        this.state.savedPalettes = [];
        this.saveToStorage('savedPalettes', []);
        this.updateSavedPalettes();
        this.showNotification('All saved palettes cleared');
    }

    copyPalette() {
        const colors = this.state.palette.join(', ');
        this.copyToClipboard(colors);
    }

    clearPalette() {
        this.state.palette = [];
        this.displayPalette();
        this.showNotification('Palette cleared');
    }

    isValidColor(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }

    hexToRGB(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

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

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
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
