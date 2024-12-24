import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, FILE_LIMITS, UI_CONSTANTS } from '../utils/constants.js';
import { fileValidation } from '../utils/validation.js';
import utils from '../utils/helpers.js';

class ImageResizer extends BaseTool {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.setupEventListeners();
    }

    initializeElements() {
        // Drop zone elements
        this.dropZone = document.getElementById('drop-zone');
        this.fileInput = document.getElementById('file-input');

        // Preview elements
        this.previewContainer = document.getElementById('preview-container');
        this.previewImage = document.getElementById('preview-image');
        this.fileInfo = document.getElementById('file-info');
        this.changeImageBtn = document.getElementById('change-image');

        // Settings elements
        this.settingsPanel = document.getElementById('settings-panel');
        this.widthInput = document.getElementById('width');
        this.heightInput = document.getElementById('height');
        this.aspectRatioLock = document.getElementById('aspect-ratio-lock');
        this.formatSelect = document.getElementById('format');
        this.qualityInput = document.getElementById('quality');
        this.qualityValue = document.getElementById('quality-value');

        // Action buttons
        this.resizeButton = document.getElementById('resize-button');
        this.downloadButton = document.getElementById('download-button');

        // Notification
        this.notification = document.querySelector('.notification');
    }

    initializeState() {
        this.currentImage = null;
        this.originalDimensions = { width: 0, height: 0 };
        this.aspectRatio = 1;
        this.isAspectRatioLocked = true;
        this.resizedImage = null;
    }

    setupEventListeners() {
        // File input events
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', () => this.handleFileSelect());
        this.changeImageBtn.addEventListener('click', () => this.resetImage());

        // Dimension inputs
        this.widthInput.addEventListener('input', () => this.handleDimensionChange('width'));
        this.heightInput.addEventListener('input', () => this.handleDimensionChange('height'));
        this.aspectRatioLock.addEventListener('click', () => this.toggleAspectRatio());

        // Quality slider
        this.qualityInput.addEventListener('input', () => {
            this.qualityValue.textContent = `${this.qualityInput.value}%`;
        });

        // Action buttons
        this.resizeButton.addEventListener('click', () => this.resizeImage());
        this.downloadButton.addEventListener('click', () => this.downloadImage());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect() {
        const files = this.fileInput.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.originalDimensions = {
                    width: img.width,
                    height: img.height
                };
                this.aspectRatio = img.width / img.height;
                this.updatePreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        this.fileInfo.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
    }

    updatePreview() {
        this.previewImage.src = this.currentImage.src;
        this.previewContainer.style.display = 'block';
        this.settingsPanel.style.display = 'block';
        this.dropZone.style.display = 'none';

        this.widthInput.value = this.originalDimensions.width;
        this.heightInput.value = this.originalDimensions.height;
        this.downloadButton.disabled = true;
    }

    handleDimensionChange(dimension) {
        if (!this.currentImage) return;

        const value = parseInt(this[`${dimension}Input`].value);
        if (this.isAspectRatioLocked) {
            if (dimension === 'width') {
                this.heightInput.value = Math.round(value / this.aspectRatio);
            } else {
                this.widthInput.value = Math.round(value * this.aspectRatio);
            }
        }
    }

    toggleAspectRatio() {
        this.isAspectRatioLocked = !this.isAspectRatioLocked;
        this.aspectRatioLock.innerHTML = `<i class="fas fa-${this.isAspectRatioLocked ? 'lock' : 'lock-open'}"></i>`;
    }

    async resizeImage() {
        if (!this.currentImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width = parseInt(this.widthInput.value);
        const height = parseInt(this.heightInput.value);
        const quality = parseInt(this.qualityInput.value) / 100;
        const format = this.formatSelect.value;

        canvas.width = width;
        canvas.height = height;

        // Use better quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image with resize
        ctx.drawImage(this.currentImage, 0, 0, width, height);

        // Convert to blob
        try {
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, `image/${format}`, quality);
            });

            // Create preview URL
            if (this.resizedImage) {
                URL.revokeObjectURL(this.resizedImage);
            }
            this.resizedImage = URL.createObjectURL(blob);
            this.previewImage.src = this.resizedImage;
            this.downloadButton.disabled = false;

            this.showNotification('Image resized successfully', 'success');
        } catch (error) {
            console.error('Resize error:', error);
            this.showNotification('Error resizing image', 'error');
        }
    }

    downloadImage() {
        if (!this.resizedImage) return;

        const format = this.formatSelect.value;
        const link = document.createElement('a');
        link.href = this.resizedImage;
        link.download = `resized.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    resetImage() {
        this.currentImage = null;
        this.resizedImage = null;
        this.previewContainer.style.display = 'none';
        this.settingsPanel.style.display = 'none';
        this.dropZone.style.display = 'block';
        this.fileInput.value = '';
        this.downloadButton.disabled = true;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

// Initialize the image resizer
const imageResizer = new ImageResizer(); 