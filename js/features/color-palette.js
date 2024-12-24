import { BaseTool } from './base-tool.js';
import { notifications, modal } from '../utils/ui.js';
import { STORAGE_KEYS, UI_CONSTANTS } from '../utils/constants.js';
import utils from '../utils/helpers.js';

class ColorPalette extends BaseTool {
    initializeElements() {
        return {
            colorPicker: document.querySelector('.color-picker-container canvas'),
            paletteContainer: document.querySelector('.palette-container'),
            selectedColors: document.querySelector('.selected-colors'),
            harmonySelect: document.getElementById('harmony'),
            generateButton: document.getElementById('generate-button'),
            saveButton: document.getElementById('save-button'),
            exportButton: document.getElementById('export-button'),
            savedPalettes: document.querySelector('.saved-palette-grid'),
            themeButton: document.getElementById('theme-button'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            currentColor: '#000000',
            selectedColors: [],
            maxColors: 5,
            currentTheme: utils.getStorageItem(STORAGE_KEYS.THEME) || 'dark',
            savedPalettes: utils.getStorageItem('saved-palettes') || [],
            colorPickerContext: null
        };
    }

    initializeColorPicker() {
        const canvas = this.elements.colorPicker;
        const ctx = canvas.getContext('2d');
        this.state.colorPickerContext = ctx;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        for (let i = 0; i <= 360; i += 60) {
            gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add black to white vertical gradient
        const bwGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bwGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        bwGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        bwGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        bwGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = bwGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    getColorFromCanvas(x, y) {
        const pixel = this.state.colorPickerContext.getImageData(x, y, 1, 1).data;
        return `#${[...pixel].slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('')}`;
    }

    addColor(color) {
        if (this.state.selectedColors.length >= this.state.maxColors) {
            notifications.warning('Maximum colors reached. Remove some to add more.');
            return;
        }
        
        if (!this.state.selectedColors.includes(color)) {
            this.state.selectedColors.push(color);
            this.updateSelectedColors();
            notifications.success('Color added to palette');
        }
    }

    removeColor(index) {
        this.state.selectedColors.splice(index, 1);
        this.updateSelectedColors();
        notifications.info('Color removed from palette');
    }

    updateSelectedColors() {
        this.elements.selectedColors.innerHTML = this.state.selectedColors
            .map((color, index) => `
                <div class="selected-color" 
                     style="background-color: ${utils.sanitizeHTML(color)}"
                     data-index="${index}"
                     title="${utils.sanitizeHTML(color)}">
                </div>
            `).join('');
    }

    generateHarmony() {
        const harmony = this.elements.harmonySelect.value;
        const baseColor = this.state.selectedColors[0];
        if (!baseColor) {
            notifications.error('Please select a base color first.');
            return;
        }

        const hsl = this.hexToHSL(baseColor);
        let colors = [baseColor];

        switch (harmony) {
            case 'complementary':
                colors.push(this.HSLToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]));
                break;
            case 'analogous':
                colors.push(this.HSLToHex((hsl[0] + 30) % 360, hsl[1], hsl[2]));
                colors.push(this.HSLToHex((hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]));
                break;
            case 'triadic':
                colors.push(this.HSLToHex((hsl[0] + 120) % 360, hsl[1], hsl[2]));
                colors.push(this.HSLToHex((hsl[0] + 240) % 360, hsl[1], hsl[2]));
                break;
            case 'split-complementary':
                colors.push(this.HSLToHex((hsl[0] + 150) % 360, hsl[1], hsl[2]));
                colors.push(this.HSLToHex((hsl[0] + 210) % 360, hsl[1], hsl[2]));
                break;
            case 'tetradic':
                colors.push(this.HSLToHex((hsl[0] + 90) % 360, hsl[1], hsl[2]));
                colors.push(this.HSLToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]));
                colors.push(this.HSLToHex((hsl[0] + 270) % 360, hsl[1], hsl[2]));
                break;
        }

        this.state.selectedColors = colors;
        this.updateSelectedColors();
        notifications.success(`Generated ${harmony} color harmony`);
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
            h *= 60;
        }

        return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    }

    HSLToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    savePalette() {
        if (this.state.selectedColors.length === 0) {
            notifications.error('Please select some colors first.');
            return;
        }

        const palette = {
            colors: [...this.state.selectedColors],
            timestamp: Date.now()
        };

        this.state.savedPalettes.unshift(palette);
        if (this.state.savedPalettes.length > UI_CONSTANTS.MAX_RECENT_FILES) {
            this.state.savedPalettes.pop();
        }

        utils.setStorageItem('saved-palettes', this.state.savedPalettes);
        this.updateSavedPalettes();
        notifications.success('Palette saved successfully!');
    }

    updateSavedPalettes() {
        this.elements.savedPalettes.innerHTML = this.state.savedPalettes
            .map((palette, index) => `
                <div class="saved-palette" data-index="${index}">
                    <div class="saved-palette-colors">
                        ${palette.colors.map(color => `
                            <div class="saved-palette-color" 
                                 style="background-color: ${utils.sanitizeHTML(color)}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="saved-palette-info">
                        ${new Date(palette.timestamp).toLocaleDateString(utils.getBrowserLanguage())}
                    </div>
                </div>
            `).join('');
    }

    async exportPalette(format = 'hex') {
        if (this.state.selectedColors.length === 0) {
            notifications.error('Please select some colors first.');
            return;
        }

        let output = '';
        switch (format) {
            case 'hex':
                output = this.state.selectedColors.join(', ');
                break;
            case 'rgb':
                output = this.state.selectedColors
                    .map(color => {
                        const r = parseInt(color.slice(1, 3), 16);
                        const g = parseInt(color.slice(3, 5), 16);
                        const b = parseInt(color.slice(5, 7), 16);
                        return `rgb(${r}, ${g}, ${b})`;
                    })
                    .join(', ');
                break;
            case 'css':
                output = `:root {\n${this.state.selectedColors
                    .map((color, i) => `    --color-${i + 1}: ${color};`)
                    .join('\n')}\n}`;
                break;
        }

        try {
            await utils.copyToClipboard(output);
            notifications.success(`Copied ${format.toUpperCase()} values to clipboard!`);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            notifications.error('Failed to copy to clipboard. Please try again.');
        }
    }

    bindEvents() {
        // Color picker events
        this.elements.colorPicker.addEventListener('click', 
            this.debounce((e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const color = this.getColorFromCanvas(x, y);
                this.addColor(color);
            }, UI_CONSTANTS.DEBOUNCE_DELAY)
        );

        // Selected colors events
        this.elements.selectedColors.addEventListener('click', (e) => {
            const colorElement = e.target.closest('.selected-color');
            if (colorElement) {
                const index = parseInt(colorElement.dataset.index);
                this.removeColor(index);
            }
        });

        // Generate harmony
        this.elements.generateButton.addEventListener('click', () => {
            this.generateHarmony();
        });

        // Save palette
        this.elements.saveButton.addEventListener('click', () => {
            this.savePalette();
        });

        // Export options
        this.elements.exportButton.addEventListener('click', (e) => {
            const format = e.target.dataset.format || 'hex';
            this.exportPalette(format);
        });

        // Load saved palette
        this.elements.savedPalettes.addEventListener('click', (e) => {
            const palette = e.target.closest('.saved-palette');
            if (palette) {
                const index = parseInt(palette.dataset.index);
                this.state.selectedColors = [...this.state.savedPalettes[index].colors];
                this.updateSelectedColors();
                notifications.success('Palette loaded successfully');
            }
        });

        // Theme toggle
        this.elements.themeButton.addEventListener('click', () => {
            this.toggleTheme(STORAGE_KEYS.THEME);
        });

        // Window resize
        window.addEventListener('resize', 
            this.debounce(() => this.initializeColorPicker(), UI_CONSTANTS.DEBOUNCE_DELAY)
        );

        // Keyboard shortcuts
        this.addKeyboardShortcut('s', () => this.savePalette(), { ctrl: true });
        this.addKeyboardShortcut('e', () => this.exportPalette('hex'), { ctrl: true });
        this.addKeyboardShortcut('g', () => this.generateHarmony(), { ctrl: true });
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        this.initializeColorPicker();
        this.updateSavedPalettes();
    }
}

// Initialize the feature when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ColorPalette();
}); 