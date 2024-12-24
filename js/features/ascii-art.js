import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, FILE_LIMITS, UI_CONSTANTS } from '../utils/constants.js';
import { fileValidation } from '../utils/validation.js';
import utils from '../utils/helpers.js';

class AsciiArt extends BaseTool {
    initializeElements() {
        return {
            fileInput: document.getElementById('file-input'),
            dropZone: document.querySelector('.drop-zone'),
            preview: document.getElementById('preview'),
            output: document.getElementById('ascii-output'),
            widthInput: document.getElementById('width-input'),
            charsetSelect: document.getElementById('charset-select'),
            invertCheckbox: document.getElementById('invert-checkbox'),
            colorCheckbox: document.getElementById('color-checkbox'),
            generateButton: document.getElementById('generate-button'),
            copyButton: document.getElementById('copy-button'),
            downloadButton: document.getElementById('download-button'),
            themeButton: document.getElementById('theme-button'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            currentImage: null,
            currentTheme: utils.getStorageItem(STORAGE_KEYS.THEME) || 'dark',
            charsets: {
                standard: '@%#*+=-:. ',
                blocks: '█▓▒░ ',
                simple: '#@$*. ',
                dots: '●○◐◑◒◓◔◕. ',
                custom: '@QB#NgWM8RDHdKA$kbq&pmtxjf[]{}?wyl<>i!;:,"^`. '
            }
        };
    }

    async handleFileSelect(file) {
        try {
            // Validate file
            await fileValidation.validateFileSize(file);
            fileValidation.validateFileType(file, FILE_LIMITS.SUPPORTED_IMAGE_TYPES);

            const img = await utils.loadImage(URL.createObjectURL(file));
            await fileValidation.validateImageDimensions(img);

            this.state.currentImage = img;
            this.displayPreview();
            notifications.success('Image loaded successfully');
        } catch (error) {
            console.error('Error loading image:', error);
            notifications.error(error.message || 'Failed to load image');
            this.resetState();
        }
    }

    resetState() {
        this.state.currentImage = null;
        this.elements.preview.innerHTML = '';
        this.elements.output.innerHTML = '';
    }

    displayPreview() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 300;
        const scale = maxWidth / this.state.currentImage.width;
        
        canvas.width = maxWidth;
        canvas.height = this.state.currentImage.height * scale;
        
        ctx.drawImage(this.state.currentImage, 0, 0, canvas.width, canvas.height);
        this.elements.preview.innerHTML = '';
        this.elements.preview.appendChild(canvas);
    }

    getPixelBrightness(r, g, b, invert) {
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return invert ? 1 - brightness : brightness;
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    generateAsciiArt() {
        if (!this.state.currentImage) {
            notifications.error('Please select an image first.');
            return;
        }

        const width = parseInt(this.elements.widthInput.value) || 100;
        const charset = this.state.charsets[this.elements.charsetSelect.value];
        const invert = this.elements.invertCheckbox.checked;
        const useColor = this.elements.colorCheckbox.checked;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scale = width / this.state.currentImage.width;
        
        canvas.width = width;
        canvas.height = Math.floor(this.state.currentImage.height * scale);
        
        ctx.drawImage(this.state.currentImage, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let ascii = '';
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const offset = (y * canvas.width + x) * 4;
                const r = pixels[offset];
                const g = pixels[offset + 1];
                const b = pixels[offset + 2];
                
                const brightness = this.getPixelBrightness(r, g, b, invert);
                const charIndex = Math.floor(brightness * (charset.length - 1));
                
                if (useColor) {
                    const color = this.rgbToHex(r, g, b);
                    ascii += `<span style="color: ${utils.sanitizeHTML(color)}">${utils.sanitizeHTML(charset[charIndex])}</span>`;
                } else {
                    ascii += utils.sanitizeHTML(charset[charIndex]);
                }
            }
            ascii += '\\n';
        }

        this.elements.output.innerHTML = ascii;
        notifications.success('ASCII art generated successfully!');
    }

    async copyToClipboard() {
        try {
            const text = this.elements.output.innerText;
            await utils.copyToClipboard(text);
            notifications.success('ASCII art copied to clipboard!');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            notifications.error('Failed to copy to clipboard. Please try again.');
        }
    }

    downloadAsciiArt() {
        try {
            const text = this.elements.output.innerText;
            const blob = new Blob([text], { type: 'text/plain' });
            const filename = `ascii-art_${new Date().toISOString().slice(0,10)}.txt`;
            this.downloadFile(blob, filename);
            notifications.success('ASCII art downloaded successfully!');
        } catch (error) {
            console.error('Error downloading ASCII art:', error);
            notifications.error('Failed to download ASCII art. Please try again.');
        }
    }

    bindEvents() {
        // File input events
        this.elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // Drag and drop events
        const dragOverHandler = this.debounce((e) => {
            e.preventDefault();
            this.elements.dropZone.classList.add('drag-over');
        }, UI_CONSTANTS.DEBOUNCE_DELAY);

        this.elements.dropZone.addEventListener('dragover', dragOverHandler);

        this.elements.dropZone.addEventListener('dragleave', () => {
            this.elements.dropZone.classList.remove('drag-over');
        });

        this.elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        // Generate button
        this.elements.generateButton.addEventListener('click', 
            this.debounce(() => this.generateAsciiArt(), UI_CONSTANTS.DEBOUNCE_DELAY)
        );

        // Copy button
        this.elements.copyButton.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Download button
        this.elements.downloadButton.addEventListener('click', () => {
            this.downloadAsciiArt();
        });

        // Theme toggle
        this.elements.themeButton.addEventListener('click', () => {
            this.toggleTheme(STORAGE_KEYS.THEME);
        });

        // Keyboard shortcuts
        this.addKeyboardShortcut('g', () => this.generateAsciiArt(), { ctrl: true });
        this.addKeyboardShortcut('c', () => this.copyToClipboard(), { ctrl: true });
        this.addKeyboardShortcut('s', () => this.downloadAsciiArt(), { ctrl: true });
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
    }
}

// Initialize the feature when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AsciiArt();
}); 