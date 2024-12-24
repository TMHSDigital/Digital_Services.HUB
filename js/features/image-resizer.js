import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, FILE_LIMITS, UI_CONSTANTS } from '../utils/constants.js';
import { fileValidation } from '../utils/validation.js';
import utils from '../utils/helpers.js';

class ImageResizer extends BaseTool {
    constructor() {
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

    initializeElements() {
        return {
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input'),
            previewContainer: document.getElementById('preview-container'),
            previewImage: document.getElementById('preview-image'),
            settingsPanel: document.getElementById('settings-panel'),
            widthInput: document.getElementById('width'),
            heightInput: document.getElementById('height'),
            aspectRatioLock: document.getElementById('aspect-ratio-lock'),
            formatSelect: document.getElementById('format'),
            qualityInput: document.getElementById('quality'),
            qualityValue: document.getElementById('quality-value'),
            resizeButton: document.getElementById('resize-button'),
            downloadButton: document.getElementById('download-button'),
            changeImageButton: document.getElementById('change-image'),
            fileInfo: document.getElementById('file-info'),
            themeButton: document.getElementById('theme-button'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            currentTheme: localStorage.getItem('theme') || 'dark',
            originalImage: null,
            aspectRatio: 1,
            isAspectRatioLocked: true,
            resizedImage: null,
            currentFile: null
        };
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        this.elements.aspectRatioLock.classList.add('locked');
        this.elements.downloadButton.disabled = true;
    }

    showNotification(message, type = 'info') {
        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        this.elements.notification.style.display = 'block';

        setTimeout(() => {
            this.elements.notification.style.display = 'none';
        }, 3000);
    }

    updateFileInfo(file) {
        const size = this.formatFileSize(file.size);
        this.elements.fileInfo.textContent = `${file.name} (${size})`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file.', 'error');
            return;
        }

        this.state.currentFile = file;
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.state.originalImage = img;
                this.state.aspectRatio = img.width / img.height;
                
                // Update inputs with original dimensions
                this.elements.widthInput.value = img.width;
                this.elements.heightInput.value = img.height;
                
                // Show preview and settings
                this.elements.previewImage.src = e.target.result;
                this.elements.previewContainer.style.display = 'block';
                this.elements.settingsPanel.style.display = 'block';
                this.elements.dropZone.style.display = 'none';
                
                this.updateFileInfo(file);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }

    updateDimension(dimension, value) {
        if (this.state.isAspectRatioLocked) {
            if (dimension === 'width') {
                this.elements.heightInput.value = Math.round(value / this.state.aspectRatio);
            } else {
                this.elements.widthInput.value = Math.round(value * this.state.aspectRatio);
            }
        }
    }

    toggleAspectRatio() {
        this.state.isAspectRatioLocked = !this.state.isAspectRatioLocked;
        this.elements.aspectRatioLock.classList.toggle('locked');
        const icon = this.elements.aspectRatioLock.querySelector('i');
        icon.className = this.state.isAspectRatioLocked ? 'fas fa-lock' : 'fas fa-lock-open';
    }

    async resizeImage() {
        if (!this.state.originalImage) {
            this.showNotification('Please select an image first.', 'error');
            return;
        }

        const width = parseInt(this.elements.widthInput.value);
        const height = parseInt(this.elements.heightInput.value);
        const format = this.elements.formatSelect.value;
        const quality = parseInt(this.elements.qualityInput.value) / 100;

        try {
            // Create canvas for resizing
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Enable image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw resized image
            ctx.drawImage(this.state.originalImage, 0, 0, width, height);

            // Convert to blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, `image/${format}`, quality);
            });

            // Create object URL for preview and download
            if (this.state.resizedImage) {
                URL.revokeObjectURL(this.state.resizedImage);
            }
            this.state.resizedImage = URL.createObjectURL(blob);
            this.elements.previewImage.src = this.state.resizedImage;
            this.elements.downloadButton.disabled = false;

            this.showNotification('Image resized successfully!', 'success');
        } catch (error) {
            console.error('Error resizing image:', error);
            this.showNotification('Error resizing image. Please try again.', 'error');
        }
    }

    downloadImage() {
        if (!this.state.resizedImage) {
            this.showNotification('Please resize the image first.', 'error');
            return;
        }

        const format = this.elements.formatSelect.value;
        const link = document.createElement('a');
        link.href = this.state.resizedImage;
        link.download = `resized_${this.state.currentFile.name.replace(/\.[^/.]+$/, '')}.${format}`;
        link.click();
    }

    resetUI() {
        this.elements.previewContainer.style.display = 'none';
        this.elements.settingsPanel.style.display = 'none';
        this.elements.dropZone.style.display = 'block';
        this.elements.downloadButton.disabled = true;
        this.elements.fileInput.value = '';
        if (this.state.resizedImage) {
            URL.revokeObjectURL(this.state.resizedImage);
        }
    }

    toggleTheme() {
        const newTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
        this.state.currentTheme = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    bindEvents() {
        // File input change
        this.elements.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleFile(file);
        });

        // Drag and drop
        this.elements.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.add('drag-over');
        });

        this.elements.dropZone.addEventListener('dragleave', () => {
            this.elements.dropZone.classList.remove('drag-over');
        });

        this.elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) this.handleFile(file);
        });

        // Dimension inputs
        this.elements.widthInput.addEventListener('input', (e) => {
            this.updateDimension('width', parseInt(e.target.value));
        });

        this.elements.heightInput.addEventListener('input', (e) => {
            this.updateDimension('height', parseInt(e.target.value));
        });

        // Aspect ratio lock
        this.elements.aspectRatioLock.addEventListener('click', () => {
            this.toggleAspectRatio();
        });

        // Quality slider
        this.elements.qualityInput.addEventListener('input', (e) => {
            this.elements.qualityValue.textContent = `${e.target.value}%`;
        });

        // Resize button
        this.elements.resizeButton.addEventListener('click', () => {
            this.resizeImage();
        });

        // Download button
        this.elements.downloadButton.addEventListener('click', () => {
            this.downloadImage();
        });

        // Change image button
        this.elements.changeImageButton.addEventListener('click', () => {
            this.resetUI();
        });

        // Theme toggle
        this.elements.themeButton.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + O to open file
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                this.elements.fileInput.click();
            }
            // Ctrl/Cmd + R to resize
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.resizeImage();
            }
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.downloadImage();
            }
        });
    }
}

// Initialize the feature when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageResizer();
}); 