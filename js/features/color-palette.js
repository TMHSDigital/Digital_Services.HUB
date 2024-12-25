import { BaseTool } from './base-tool.js';
import { notifications, modal } from '../utils/ui.js';
import { STORAGE_KEYS, UI_CONSTANTS } from '../utils/constants.js';
import utils from '../utils/helpers.js';

class ColorPalette extends BaseTool {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.setupColorWheel();
        this.setupEventListeners();
        this.loadSavedPalettes();
    }

    initializeElements() {
        // Color picker elements
        this.colorWheel = document.getElementById('color-wheel');
        this.hueInput = document.getElementById('hue');
        this.saturationInput = document.getElementById('saturation');
        this.lightnessInput = document.getElementById('lightness');
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

        // Modal elements
        this.colorModal = document.getElementById('color-modal');
        this.modalPreview = this.colorModal.querySelector('.color-preview');
        this.hexValue = document.getElementById('hex-value');
        this.rgbValue = document.getElementById('rgb-value');
        this.hslValue = document.getElementById('hsl-value');
        this.closeModal = this.colorModal.querySelector('.close-modal');

        // Notification
        this.notification = document.querySelector('.notification');
    }

    initializeState() {
        this.currentColor = { h: 0, s: 100, l: 50 };
        this.currentPalette = [];
        this.savedPalettes = [];
    }

    setupColorWheel() {
        this.colorPicker = new iro.ColorPicker('#color-wheel', {
            width: 250,
            color: 'hsl(0, 100%, 50%)',
            borderWidth: 1,
            borderColor: '#fff',
            layout: [
                { 
                    component: iro.ui.Wheel,
                    options: {}
                }
            ]
        });

        this.colorPicker.on('color:change', (color) => {
            this.updateColorValues(color);
        });
    }

    setupEventListeners() {
        // Generate buttons
        this.generateButton.addEventListener('click', () => this.generateHarmony());
        this.randomButton.addEventListener('click', () => this.generateRandomPalette());

        // Save and export
        this.saveButton.addEventListener('click', () => this.savePalette());
        this.exportButton.addEventListener('click', () => this.toggleExportMenu());
        this.clearSavedButton.addEventListener('click', () => this.clearSavedPalettes());

        // Export menu options
        this.exportMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.exportPalette(e.target.dataset.format);
            }
        });

        // Modal
        this.closeModal.addEventListener('click', () => this.hideColorModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.colorModal) {
                this.hideColorModal();
            }
        });

        // Color value copy buttons
        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                const input = document.getElementById(`${type}-value`);
                this.copyToClipboard(input.value);
            });
        });

        // Close export menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.export-dropdown')) {
                this.exportMenu.classList.remove('show');
            }
        });
    }

    updateColorValues(color) {
        this.currentColor = {
            h: color.hsl.h,
            s: color.hsl.s,
            l: color.hsl.l
        };

        this.hueValue.textContent = `${Math.round(this.currentColor.h)}°`;
        this.saturationValue.textContent = `${Math.round(this.currentColor.s)}%`;
        this.lightnessValue.textContent = `${Math.round(this.currentColor.l)}%`;

        this.hueInput.value = this.currentColor.h;
        this.saturationInput.value = this.currentColor.s;
        this.lightnessInput.value = this.currentColor.l;
    }

    generateHarmony() {
        const harmony = this.harmonySelect.value;
        const h = this.currentColor.h;
        const s = this.currentColor.s;
        const l = this.currentColor.l;

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
                    { h, s, l: Math.min(100, l + 30) }
                ];
                break;
        }

        this.currentPalette = colors;
        this.displayPalette(colors);
    }

    generateRandomPalette() {
        const colors = Array(5).fill().map(() => ({
            h: Math.floor(Math.random() * 360),
            s: Math.floor(Math.random() * 40) + 60, // 60-100% saturation
            l: Math.floor(Math.random() * 40) + 30  // 30-70% lightness
        }));

        this.currentPalette = colors;
        this.displayPalette(colors);
    }

    displayPalette(colors) {
        this.colorSwatches.innerHTML = colors.map(color => `
            <div class="color-swatch" 
                 style="background-color: hsl(${color.h}, ${color.s}%, ${color.l}%)"
                 data-color='${JSON.stringify(color)}'
                 role="listitem"
                 tabindex="0"
                 aria-label="Color swatch: hsl(${color.h}, ${color.s}%, ${color.l}%)">
            </div>
        `).join('');

        // Add click listeners to swatches
        this.colorSwatches.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = JSON.parse(swatch.dataset.color);
                this.showColorModal(color);
            });
        });
    }

    showColorModal(color) {
        const hsl = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
        const rgb = this.hslToRgb(color.h, color.s, color.l);
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

        this.modalPreview.style.backgroundColor = hsl;
        this.hexValue.value = hex;
        this.rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.hslValue.value = hsl;

        this.colorModal.style.display = 'block';
    }

    hideColorModal() {
        this.colorModal.style.display = 'none';
    }

    savePalette() {
        if (this.currentPalette.length === 0) {
            this.showNotification('No palette to save', 'error');
            return;
        }

        const palette = {
            id: Date.now(),
            colors: this.currentPalette,
            timestamp: new Date().toISOString()
        };

        this.savedPalettes.unshift(palette);
        if (this.savedPalettes.length > 10) {
            this.savedPalettes.pop();
        }

        this.savePalettesToStorage();
        this.displaySavedPalettes();
        this.showNotification('Palette saved successfully', 'success');
    }

    displaySavedPalettes() {
        this.savedPaletteGrid.innerHTML = this.savedPalettes.map(palette => `
            <div class="saved-palette" data-id="${palette.id}" role="listitem">
                <div class="saved-swatches">
                    ${palette.colors.map(color => `
                        <div class="saved-swatch" 
                             style="background-color: hsl(${color.h}, ${color.s}%, ${color.l}%)"
                             role="img"
                             aria-label="Color: hsl(${color.h}, ${color.s}%, ${color.l}%)">
                        </div>
                    `).join('')}
                </div>
                <div class="saved-palette-actions">
                    <button class="load-palette" aria-label="Load this palette">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="delete-palette" aria-label="Delete this palette">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to saved palette actions
        this.savedPaletteGrid.querySelectorAll('.saved-palette').forEach(paletteEl => {
            const id = parseInt(paletteEl.dataset.id);
            paletteEl.querySelector('.load-palette').addEventListener('click', () => {
                this.loadPalette(id);
            });
            paletteEl.querySelector('.delete-palette').addEventListener('click', () => {
                this.deletePalette(id);
            });
        });
    }

    loadPalette(id) {
        const palette = this.savedPalettes.find(p => p.id === id);
        if (palette) {
            this.currentPalette = palette.colors;
            this.displayPalette(palette.colors);
            this.showNotification('Palette loaded', 'success');
        }
    }

    deletePalette(id) {
        this.savedPalettes = this.savedPalettes.filter(p => p.id !== id);
        this.savePalettesToStorage();
        this.displaySavedPalettes();
        this.showNotification('Palette deleted', 'success');
    }

    clearSavedPalettes() {
        this.savedPalettes = [];
        this.savePalettesToStorage();
        this.displaySavedPalettes();
        this.showNotification('All palettes cleared', 'success');
    }

    toggleExportMenu() {
        this.exportMenu.classList.toggle('show');
    }

    exportPalette(format) {
        if (this.currentPalette.length === 0) {
            this.showNotification('No palette to export', 'error');
            return;
        }

        let text = '';
        switch (format) {
            case 'hex':
                text = this.currentPalette.map(color => {
                    const rgb = this.hslToRgb(color.h, color.s, color.l);
                    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
                }).join(', ');
                break;
            case 'rgb':
                text = this.currentPalette.map(color => {
                    const rgb = this.hslToRgb(color.h, color.s, color.l);
                    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                }).join(', ');
                break;
            case 'hsl':
                text = this.currentPalette.map(color => 
                    `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`
                ).join(', ');
                break;
            case 'css':
                text = this.currentPalette.map((color, i) => {
                    const rgb = this.hslToRgb(color.h, color.s, color.l);
                    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
                    return `--color-${i + 1}: ${hex};`;
                }).join('\n');
                break;
            case 'sass':
                text = this.currentPalette.map((color, i) => {
                    const rgb = this.hslToRgb(color.h, color.s, color.l);
                    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
                    return `$color-${i + 1}: ${hex};`;
                }).join('\n');
                break;
        }

        this.copyToClipboard(text);
        this.exportMenu.classList.remove('show');
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard', 'success');
        }).catch(err => {
            console.error('Copy failed:', err);
            this.showNotification('Failed to copy to clipboard', 'error');
        });
    }

    loadSavedPalettes() {
        const saved = localStorage.getItem('saved-palettes');
        this.savedPalettes = saved ? JSON.parse(saved) : [];
        this.displaySavedPalettes();
    }

    savePalettesToStorage() {
        localStorage.setItem('saved-palettes', JSON.stringify(this.savedPalettes));
    }

    // Color conversion utilities
    hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return {
            r: Math.round(255 * f(0)),
            g: Math.round(255 * f(8)),
            b: Math.round(255 * f(4))
        };
    }

    rgbToHex(r, g, b) {
        const toHex = x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
const colorPalette = new ColorPalette(); 