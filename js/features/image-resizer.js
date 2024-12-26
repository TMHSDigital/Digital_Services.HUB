import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { FILE_LIMITS } from '../utils/constants.js';
import { fileValidation } from '../utils/validation.js';
import utils from '../utils/helpers.js';

export default class ImageResizer extends BaseTool {
    constructor() {
        super();
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

    initializeElements() {
        return {
            // Drop zone elements
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input'),

            // Preview elements
            previewContainer: document.getElementById('preview-container'),
            previewImage: document.getElementById('preview-image'),
            fileInfo: document.getElementById('file-info'),
            changeImageBtn: document.getElementById('change-image'),

            // Settings elements
            settingsPanel: document.getElementById('settings-panel'),
            widthInput: document.getElementById('width'),
            heightInput: document.getElementById('height'),
            aspectRatioLock: document.getElementById('aspect-ratio-lock'),
            formatSelect: document.getElementById('format'),
            qualityInput: document.getElementById('quality'),
            qualityValue: document.getElementById('quality-value'),

            // Action buttons
            resizeButton: document.getElementById('resize-button'),
            downloadButton: document.getElementById('download-button'),

            // Notification
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            currentImage: null,
            originalDimensions: { width: 0, height: 0 },
            aspectRatio: 1,
            isAspectRatioLocked: true,
            resizedImage: null,
            maxFileSize: FILE_LIMITS.IMAGE_MAX_SIZE,
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        };
    }

    bindEvents() {
        const { dropZone, fileInput, changeImageBtn, widthInput, heightInput, aspectRatioLock, qualityInput, resizeButton, downloadButton } = this.elements;

        // File input events
        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('drop', this.handleDrop.bind(this));
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        changeImageBtn.addEventListener('click', this.resetImage.bind(this));

        // Dimension inputs
        widthInput.addEventListener('input', this.debounce(() => this.handleDimensionChange('width'), 300));
        heightInput.addEventListener('input', this.debounce(() => this.handleDimensionChange('height'), 300));
        aspectRatioLock.addEventListener('click', this.toggleAspectRatio.bind(this));

        // Quality slider
        qualityInput.addEventListener('input', this.debounce(() => {
            this.elements.qualityValue.textContent = `${qualityInput.value}%`;
        }, 100));

        // Action buttons
        resizeButton.addEventListener('click', this.resizeImage.bind(this));
        downloadButton.addEventListener('click', this.downloadImage.bind(this));

        // Keyboard shortcuts
        this.addKeyboardShortcut('r', this.resizeImage.bind(this), { ctrl: true });
        this.addKeyboardShortcut('s', this.downloadImage.bind(this), { ctrl: true });
    }

    initialize() {
        // Hide settings panel initially
        this.elements.settingsPanel.style.display = 'none';
        this.elements.downloadButton.disabled = true;

        // Set initial quality value
        this.elements.qualityValue.textContent = `${this.elements.qualityInput.value}%`;
    }

    validateFile(file) {
        if (!file) {
            this.showNotification('No file selected', 'error');
            return false;
        }

        if (!this.state.allowedTypes.includes(file.type)) {
            this.showNotification('Please select a valid image file (JPEG, PNG, WebP, or GIF)', 'error');
            return false;
        }

        if (file.size > this.state.maxFileSize) {
            this.showNotification(`File size must be less than ${utils.formatFileSize(this.state.maxFileSize)}`, 'error');
            return false;
        }

        return true;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.elements.dropZone.classList.add('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.elements.dropZone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect() {
        const files = this.elements.fileInput.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        if (!this.validateFile(file)) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.state.currentImage = img;
                this.state.originalDimensions = {
                    width: img.width,
                    height: img.height
                };
                this.state.aspectRatio = img.width / img.height;
                this.updatePreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        this.elements.fileInfo.textContent = `${file.name} (${utils.formatFileSize(file.size)})`;
    }

    updatePreview() {
        this.elements.previewImage.src = this.state.currentImage.src;
        this.elements.previewContainer.style.display = 'block';
        this.elements.settingsPanel.style.display = 'block';
        this.elements.dropZone.style.display = 'none';

        this.elements.widthInput.value = this.state.originalDimensions.width;
        this.elements.heightInput.value = this.state.originalDimensions.height;
        this.elements.downloadButton.disabled = true;
    }

    handleDimensionChange(dimension) {
        if (!this.state.currentImage) return;

        const value = parseInt(this.elements[`${dimension}Input`].value);
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
        this.elements.aspectRatioLock.innerHTML = `<i class="fas fa-${this.state.isAspectRatioLocked ? 'lock' : 'lock-open'}"></i>`;
    }

    async resizeImage() {
        if (!this.state.currentImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const width = parseInt(this.elements.widthInput.value);
        const height = parseInt(this.elements.heightInput.value);
        const quality = parseInt(this.elements.qualityInput.value) / 100;
        const format = this.elements.formatSelect.value;

        canvas.width = width;
        canvas.height = height;

        // Use better quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image with resize
        ctx.drawImage(this.state.currentImage, 0, 0, width, height);

        try {
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, `image/${format}`, quality);
            });

            if (this.state.resizedImage) {
                URL.revokeObjectURL(this.state.resizedImage);
            }
            this.state.resizedImage = URL.createObjectURL(blob);
            this.elements.previewImage.src = this.state.resizedImage;
            this.elements.downloadButton.disabled = false;

            this.showNotification('Image resized successfully');
        } catch (error) {
            console.error('Resize error:', error);
            this.showNotification('Error resizing image', 'error');
        }
    }

    downloadImage() {
        if (!this.state.resizedImage) return;

        const format = this.elements.formatSelect.value;
        const link = document.createElement('a');
        link.href = this.state.resizedImage;
        link.download = `resized.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    resetImage() {
        if (this.state.resizedImage) {
            URL.revokeObjectURL(this.state.resizedImage);
        }

        this.state.currentImage = null;
        this.state.resizedImage = null;
        this.elements.previewContainer.style.display = 'none';
        this.elements.settingsPanel.style.display = 'none';
        this.elements.dropZone.style.display = 'block';
        this.elements.fileInput.value = '';
        this.elements.downloadButton.disabled = true;
    }

    showNotification(message, type = 'success') {
        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        this.elements.notification.style.display = 'block';

        setTimeout(() => {
            this.elements.notification.style.display = 'none';
        }, 3000);
    }
}

// Initialize the image resizer
if (document.querySelector('.image-resizer-container')) {
    new ImageResizer();
}
