import { BaseTool } from './base-tool.js';
import { notifications, modal } from '../utils/ui.js';
import { STORAGE_KEYS, UI_CONSTANTS } from '../utils/constants.js';
import utils from '../utils/helpers.js';

class ColorPalette extends BaseTool {
    constructor() {
        this.initializeElements();
        this.initializeColorPicker();
        this.initializeState();
        this.setupEventListeners();
        this.loadSavedPalettes();
    }

    initializeElements() {
        // Color picker elements
        this.colorWheel = document.getElementById('color-wheel');
        this.hueSlider = document.getElementById('hue');
        this.saturationSlider = document.getElementById('saturation');
        this.lightnessSlider = document.getElementById('lightness');
        this.hueValue = document.getElementById('hue-value');
        this.saturationValue = document.getElementById('saturation-value');
        this.lightnessValue = document.getElementById('lightness-value');

        // Control elements
        this.harmonySelect = document.getElementById('harmony');
        this.generateButton = document.getElementById('generate-button');
        this.randomButton = document.getElementById('random-button');
        this.saveButton = document.getElementById('save-button');
        this.exportButton = document.getElementById('export-button');
        this.clearSavedButton = document.getElementById('clear-saved');

        // Display elements
        this.colorSwatches = document.getElementById('color-swatches');
        this.savedPaletteGrid = document.getElementById('saved-palette-grid');
        this.exportMenu = document.querySelector('.export-menu');
        this.notification = document.querySelector('.notification');

        // Modal elements
        this.modal = document.getElementById('color-modal');
        this.modalPreview = this.modal.querySelector('.color-preview');
        this.modalInputs = {
            hex: this.modal.querySelector('.hex-value'),
            rgb: this.modal.querySelector('.rgb-value'),
            hsl: this.modal.querySelector('.hsl-value')
        };
        this.closeModalButton = this.modal.querySelector('.close-modal');
    }

    initializeColorPicker() {
        this.colorPicker = new iro.ColorPicker('#color-wheel', {
            width: 280,
            color: '#f00',
            borderWidth: 1,
            borderColor: '#fff',
            layout: [
                { 
                    component: iro.ui.Wheel,
                    options: {}
                }
            ]
        });

        // Sync color picker with sliders
        this.colorPicker.on('color:change', (color) => {
            this.updateSliders(color);
        });
    }

    initializeState() {
        this.currentColor = this.colorPicker.color;
        this.currentPalette = [];
        this.savedPalettes = [];
    }

    setupEventListeners() {
        // Color control events
        this.hueSlider.addEventListener('input', () => this.updateFromSliders());
        this.saturationSlider.addEventListener('input', () => this.updateFromSliders());
        this.lightnessSlider.addEventListener('input', () => this.updateFromSliders());

        // Button events
        this.generateButton.addEventListener('click', () => this.generateHarmony());
        this.randomButton.addEventListener('click', () => this.generateRandomPalette());
        this.saveButton.addEventListener('click', () => this.savePalette());
        this.clearSavedButton.addEventListener('click', () => this.clearSavedPalettes());

        // Export menu events
        this.exportButton.addEventListener('click', () => this.toggleExportMenu());
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.export-dropdown')) {
                this.exportMenu.classList.remove('active');
            }
        });

        this.exportMenu.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const format = button.dataset.format;
                this.copyPaletteValues(format);
            });
        });

        // Modal events
        this.closeModalButton.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Copy button events
        this.modal.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                const value = this.modalInputs[type].value;
                this.copyToClipboard(value);
            });
        });
    }

    updateSliders(color) {
        const hsl = color.hsl;
        this.hueSlider.value = hsl.h;
        this.saturationSlider.value = hsl.s;
        this.lightnessSlider.value = hsl.l;
        this.updateSliderValues();
    }

    updateFromSliders() {
        const hsl = {
            h: parseInt(this.hueSlider.value),
            s: parseInt(this.saturationSlider.value),
            l: parseInt(this.lightnessSlider.value)
        };
        this.colorPicker.color.hsl = hsl;
        this.updateSliderValues();
    }

    updateSliderValues() {
        this.hueValue.textContent = `${Math.round(this.hueSlider.value)}°`;
        this.saturationValue.textContent = `${Math.round(this.saturationSlider.value)}%`;
        this.lightnessValue.textContent = `${Math.round(this.lightnessSlider.value)}%`;
    }

    generateHarmony() {
        const baseColor = this.colorPicker.color.hsl;
        const harmony = this.harmonySelect.value;
        this.currentPalette = this.calculateHarmony(baseColor, harmony);
        this.displayPalette(this.currentPalette);
    }

    calculateHarmony(baseColor, harmony) {
        const { h, s, l } = baseColor;
        let colors = [];

        switch (harmony) {
            case 'complementary':
                colors = [
                    { h, s, l },
                    { h: (h + 180) % 360, s, l }
                ];
                break;
            case 'analogous':
                colors = [
                    { h: (h - 30 + 360) % 360, s, l },
                    { h, s, l },
                    { h: (h + 30) % 360, s, l }
                ];
                break;
            case 'triadic':
                colors = [
                    { h, s, l },
                    { h: (h + 120) % 360, s, l },
                    { h: (h + 240) % 360, s, l }
                ];
                break;
            case 'split-complementary':
                colors = [
                    { h, s, l },
                    { h: (h + 150) % 360, s, l },
                    { h: (h + 210) % 360, s, l }
                ];
                break;
            case 'tetradic':
                colors = [
                    { h, s, l },
                    { h: (h + 90) % 360, s, l },
                    { h: (h + 180) % 360, s, l },
                    { h: (h + 270) % 360, s, l }
                ];
                break;
            case 'monochromatic':
                colors = [
                    { h, s, l: Math.max(0, l - 30) },
                    { h, s, l },
                    { h, s: Math.min(100, s + 20), l },
                    { h, s, l: Math.min(100, l + 30) }
                ];
                break;
        }

        return colors;
    }

    generateRandomPalette() {
        const colors = [];
        for (let i = 0; i < 5; i++) {
            colors.push({
                h: Math.floor(Math.random() * 360),
                s: Math.floor(Math.random() * 40) + 60, // 60-100 for vibrant colors
                l: Math.floor(Math.random() * 40) + 30  // 30-70 for visible colors
            });
        }
        this.currentPalette = colors;
        this.displayPalette(colors);
    }

    displayPalette(colors) {
        this.colorSwatches.innerHTML = '';
        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
            
            const info = document.createElement('div');
            info.className = 'color-swatch-info';
            info.textContent = this.formatColor(color, 'hex');
            
            swatch.appendChild(info);
            swatch.addEventListener('click', () => this.showColorInfo(color));
            this.colorSwatches.appendChild(swatch);
        });
    }

    formatColor(color, format) {
        const hslToRgb = (h, s, l) => {
            s /= 100;
            l /= 100;
            const a = s * Math.min(l, 1 - l);
            const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return [f(0), f(8), f(4)].map(x => Math.round(x * 255));
        };

        const hslToHex = (h, s, l) => {
            const rgb = hslToRgb(h, s, l);
            return '#' + rgb.map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        };

        switch (format) {
            case 'hex':
                return hslToHex(color.h, color.s, color.l);
            case 'rgb':
                const [r, g, b] = hslToRgb(color.h, color.s, color.l);
                return `rgb(${r}, ${g}, ${b})`;
            case 'hsl':
                return `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`;
            case 'css':
                return `--color: ${hslToHex(color.h, color.s, color.l)};`;
            case 'sass':
                return `$color: ${hslToHex(color.h, color.s, color.l)};`;
            default:
                return hslToHex(color.h, color.s, color.l);
        }
    }

    showColorInfo(color) {
        this.modalPreview.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
        this.modalInputs.hex.value = this.formatColor(color, 'hex');
        this.modalInputs.rgb.value = this.formatColor(color, 'rgb');
        this.modalInputs.hsl.value = this.formatColor(color, 'hsl');
        this.modal.classList.add('active');
    }

    closeModal() {
        this.modal.classList.remove('active');
    }

    savePalette() {
        if (this.currentPalette.length === 0) {
            this.showNotification('Please generate a palette first', 'error');
            return;
        }

        const palette = {
            id: Date.now(),
            colors: this.currentPalette,
            timestamp: new Date().toISOString()
        };

        this.savedPalettes.unshift(palette);
        this.savePalettesToStorage();
        this.displaySavedPalettes();
        this.showNotification('Palette saved successfully', 'success');
    }

    savePalettesToStorage() {
        localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));
    }

    loadSavedPalettes() {
        const saved = localStorage.getItem('savedPalettes');
        this.savedPalettes = saved ? JSON.parse(saved) : [];
        this.displaySavedPalettes();
    }

    displaySavedPalettes() {
        this.savedPaletteGrid.innerHTML = '';
        this.savedPalettes.forEach(palette => {
            const element = document.createElement('div');
            element.className = 'saved-palette';
            
            const colors = document.createElement('div');
            colors.className = 'saved-palette-colors';
            palette.colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'saved-palette-color';
                swatch.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
                colors.appendChild(swatch);
            });

            const info = document.createElement('div');
            info.className = 'saved-palette-info';
            
            const date = new Date(palette.timestamp);
            const dateStr = date.toLocaleDateString();
            
            const actions = document.createElement('div');
            actions.className = 'saved-palette-actions';
            
            const loadButton = document.createElement('button');
            loadButton.className = 'secondary-button small';
            loadButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
            loadButton.setAttribute('aria-label', 'Load palette');
            loadButton.addEventListener('click', () => {
                this.currentPalette = palette.colors;
                this.displayPalette(palette.colors);
                this.showNotification('Palette loaded', 'success');
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'secondary-button small';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.setAttribute('aria-label', 'Delete palette');
            deleteButton.addEventListener('click', () => {
                this.deletePalette(palette.id);
            });

            actions.appendChild(loadButton);
            actions.appendChild(deleteButton);
            info.appendChild(document.createTextNode(dateStr));
            info.appendChild(actions);

            element.appendChild(colors);
            element.appendChild(info);
            this.savedPaletteGrid.appendChild(element);
        });
    }

    deletePalette(id) {
        this.savedPalettes = this.savedPalettes.filter(p => p.id !== id);
        this.savePalettesToStorage();
        this.displaySavedPalettes();
        this.showNotification('Palette deleted', 'success');
    }

    clearSavedPalettes() {
        if (confirm('Are you sure you want to clear all saved palettes?')) {
            this.savedPalettes = [];
            this.savePalettesToStorage();
            this.displaySavedPalettes();
            this.showNotification('All palettes cleared', 'success');
        }
    }

    toggleExportMenu() {
        this.exportMenu.classList.toggle('active');
    }

    copyPaletteValues(format) {
        if (this.currentPalette.length === 0) {
            this.showNotification('Please generate a palette first', 'error');
            return;
        }

        let text = '';
        switch (format) {
            case 'hex':
            case 'rgb':
            case 'hsl':
                text = this.currentPalette
                    .map(color => this.formatColor(color, format))
                    .join('\n');
                break;
            case 'css':
                text = this.currentPalette
                    .map((color, i) => `--color-${i + 1}: ${this.formatColor(color, 'hex')};`)
                    .join('\n');
                break;
            case 'sass':
                text = this.currentPalette
                    .map((color, i) => `$color-${i + 1}: ${this.formatColor(color, 'hex')};`)
                    .join('\n');
                break;
        }

        this.copyToClipboard(text);
        this.exportMenu.classList.remove('active');
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy to clipboard', 'error');
        });
    }

    showNotification(message, type = 'success') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type}`;
        this.notification.style.display = 'block';
        
        setTimeout(() => {
            this.notification.style.display = 'none';
        }, 3000);
    }
}

// Initialize the color palette generator
document.addEventListener('DOMContentLoaded', () => {
    new ColorPalette();
}); 