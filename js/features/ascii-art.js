import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, FILE_LIMITS, UI_CONSTANTS } from '../utils/constants.js';
import { fileValidation } from '../utils/validation.js';
import utils from '../utils/helpers.js';

class AsciiArt extends BaseTool {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.setupEventListeners();
    }

    initializeElements() {
        // File input elements
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');
        this.previewContainer = document.getElementById('preview-container');
        this.previewImage = document.getElementById('preview-image');

        // Control elements
        this.widthInput = document.getElementById('width-input');
        this.charsetSelect = document.getElementById('charset-select');
        this.customCharsGroup = document.querySelector('.custom-chars-group');
        this.customCharsInput = document.getElementById('custom-chars');
        this.contrastInput = document.getElementById('contrast-input');
        this.brightnessInput = document.getElementById('brightness-input');
        this.invertCheckbox = document.getElementById('invert-checkbox');
        this.colorCheckbox = document.getElementById('color-checkbox');
        this.generateButton = document.getElementById('generate-button');

        // Output elements
        this.outputContainer = document.getElementById('output-container');
        this.asciiOutput = document.getElementById('ascii-output');
        this.copyButton = document.getElementById('copy-button');
        this.downloadButton = document.getElementById('download-button');
        this.shareButton = document.getElementById('share-button');

        // Modal elements
        this.shareModal = document.getElementById('share-modal');
        this.closeModalButton = this.shareModal.querySelector('.close-modal');
        this.shareButtons = this.shareModal.querySelectorAll('.share-button');

        // Notification
        this.notification = document.querySelector('.notification');
    }

    initializeState() {
        this.charsets = {
            standard: '@#$%=+~-.,',
            blocks: '█▓▒░ ',
            simple: '#. ',
            dots: '●○• '
        };
        this.currentImage = null;
        this.imageData = null;
        this.asciiResult = '';
    }

    setupEventListeners() {
        // File input events
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', () => this.handleDragLeave());
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));

        // Control events
        this.charsetSelect.addEventListener('change', () => this.handleCharsetChange());
        this.customCharsInput.addEventListener('input', () => this.validateCustomChars());
        this.generateButton.addEventListener('click', () => this.generateAsciiArt());

        // Output events
        this.copyButton.addEventListener('click', () => this.copyToClipboard());
        this.downloadButton.addEventListener('click', () => this.downloadAsciiArt());
        this.shareButton.addEventListener('click', () => this.openShareModal());

        // Modal events
        this.closeModalButton.addEventListener('click', () => this.closeShareModal());
        this.shareModal.addEventListener('click', (e) => {
            if (e.target === this.shareModal) this.closeShareModal();
        });

        this.shareButtons.forEach(button => {
            button.addEventListener('click', () => this.handleShare(button.dataset.platform));
        });

        // Real-time preview events
        ['input', 'change'].forEach(event => {
            this.contrastInput.addEventListener(event, () => this.updateImagePreview());
            this.brightnessInput.addEventListener(event, () => this.updateImagePreview());
            this.invertCheckbox.addEventListener(event, () => this.updateImagePreview());
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        this.processFile(file);
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropZone.classList.add('dragover');
    }

    handleDragLeave() {
        this.dropZone.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropZone.classList.remove('dragover');
        
        const file = event.dataTransfer.files[0];
        this.processFile(file);
    }

    processFile(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('File size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = new Image();
            this.currentImage.onload = () => {
                this.previewImage.src = e.target.result;
                this.previewContainer.classList.add('active');
                this.updateImagePreview();
            };
            this.currentImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    handleCharsetChange() {
        const isCustom = this.charsetSelect.value === 'custom';
        this.customCharsGroup.style.display = isCustom ? 'block' : 'none';
        if (isCustom && !this.customCharsInput.value) {
            this.customCharsInput.value = this.charsets.standard;
        }
    }

    validateCustomChars() {
        const chars = this.customCharsInput.value.trim();
        if (chars.length < 2) {
            this.showNotification('Please enter at least 2 characters', 'error');
            return false;
        }
        return true;
    }

    getCharset() {
        const selected = this.charsetSelect.value;
        return selected === 'custom' ? 
            this.customCharsInput.value.trim() : 
            this.charsets[selected];
    }

    updateImagePreview() {
        if (!this.currentImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match the image's aspect ratio
        const aspectRatio = this.currentImage.width / this.currentImage.height;
        canvas.width = 400;
        canvas.height = canvas.width / aspectRatio;

        // Apply image adjustments
        ctx.filter = `
            contrast(${this.contrastInput.value}%) 
            brightness(${this.brightnessInput.value}%)
            ${this.invertCheckbox.checked ? 'invert(100%)' : ''}
        `;

        ctx.drawImage(this.currentImage, 0, 0, canvas.width, canvas.height);
        this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    generateAsciiArt() {
        if (!this.currentImage) {
            this.showNotification('Please select an image first', 'error');
            return;
        }

        if (this.charsetSelect.value === 'custom' && !this.validateCustomChars()) {
            return;
        }

        this.generateButton.classList.add('loading');
        this.updateImagePreview();

        // Use a small delay to allow the UI to update
        setTimeout(() => {
            const charset = this.getCharset();
            const width = parseInt(this.widthInput.value);
            const useColor = this.colorCheckbox.checked;

            this.asciiResult = this.convertToAscii(this.imageData, width, charset, useColor);
            this.displayResult();
            this.generateButton.classList.remove('loading');
            this.showNotification('ASCII art generated successfully', 'success');
        }, 100);
    }

    convertToAscii(imageData, width, charset, useColor) {
        const height = Math.floor(imageData.height * (width / imageData.width));
        const cellWidth = imageData.width / width;
        const cellHeight = imageData.height / height;
        const pixels = imageData.data;
        
        let result = '';
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const avgBrightness = this.getAverageBrightness(
                    pixels,
                    imageData.width,
                    Math.floor(x * cellWidth),
                    Math.floor(y * cellHeight),
                    Math.ceil(cellWidth),
                    Math.ceil(cellHeight)
                );
                
                if (useColor) {
                    const color = this.getAverageColor(
                        pixels,
                        imageData.width,
                        Math.floor(x * cellWidth),
                        Math.floor(y * cellHeight),
                        Math.ceil(cellWidth),
                        Math.ceil(cellHeight)
                    );
                    result += `<span style="color: rgb(${color.join(',')})">`;
                }
                
                const charIndex = Math.floor(avgBrightness * (charset.length - 1));
                result += charset[charIndex];
                
                if (useColor) result += '</span>';
            }
            result += '\n';
        }
        
        return result;
    }

    getAverageBrightness(pixels, width, x, y, w, h) {
        let total = 0;
        let count = 0;
        
        for (let py = y; py < y + h; py++) {
            for (let px = x; px < x + w; px++) {
                const i = (py * width + px) * 4;
                const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3 / 255;
                total += brightness;
                count++;
            }
        }
        
        return total / count;
    }

    getAverageColor(pixels, width, x, y, w, h) {
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        for (let py = y; py < y + h; py++) {
            for (let px = x; px < x + w; px++) {
                const i = (py * width + px) * 4;
                r += pixels[i];
                g += pixels[i + 1];
                b += pixels[i + 2];
                count++;
            }
        }
        
        return [
            Math.round(r / count),
            Math.round(g / count),
            Math.round(b / count)
        ];
    }

    displayResult() {
        this.asciiOutput.innerHTML = this.asciiResult;
        this.outputContainer.classList.add('active');
        this.outputContainer.scrollIntoView({ behavior: 'smooth' });
    }

    copyToClipboard() {
        const plainText = this.asciiResult.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(plainText).then(() => {
            this.showNotification('Copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy to clipboard', 'error');
        });
    }

    downloadAsciiArt() {
        const plainText = this.asciiResult.replace(/<[^>]*>/g, '');
        const blob = new Blob([plainText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-art.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('Downloaded ASCII art', 'success');
    }

    openShareModal() {
        this.shareModal.classList.add('active');
    }

    closeShareModal() {
        this.shareModal.classList.remove('active');
    }

    handleShare(platform) {
        const url = window.location.href;
        const text = 'Check out this ASCII art I created!';
        
        let shareUrl = '';
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'reddit':
                shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
                break;
            case 'link':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Link copied to clipboard', 'success');
                });
                this.closeShareModal();
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
        this.closeShareModal();
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

// Initialize the ASCII art generator
document.addEventListener('DOMContentLoaded', () => {
    new AsciiArt();
}); 