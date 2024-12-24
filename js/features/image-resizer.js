import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, FILE_LIMITS, UI_CONSTANTS } from '../utils/constants.js';
import { fileValidation } from '../utils/validation.js';
import utils from '../utils/helpers.js';

class ImageResizer extends BaseTool {
    initializeElements() {
        return {
            container: document.querySelector('.image-container'),
            preview: document.querySelector('.preview-container img'),
            widthInput: document.getElementById('width'),
            heightInput: document.getElementById('height'),
            qualityInput: document.getElementById('quality'),
            qualityValue: document.getElementById('quality-value'),
            formatSelect: document.getElementById('format'),
            aspectRatioLock: document.querySelector('.aspect-ratio-lock'),
            downloadButton: document.getElementById('download-button'),
            fileInfo: document.querySelector('.file-info'),
            dropMessage: document.querySelector('.drop-message'),
            themeButton: document.getElementById('theme-button'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            currentImage: null,
            originalDimensions: { width: 0, height: 0 },
            aspectRatioLocked: true,
            aspectRatio: 1,
            currentTheme: utils.getStorageItem(STORAGE_KEYS.THEME) || 'dark',
            supportedFormats: FILE_LIMITS.SUPPORTED_IMAGE_TYPES
        };
    }

    updateFileInfo(file) {
        const size = this.formatFileSize(file.size);
        this.elements.fileInfo.textContent = `${file.name} - ${size}`;
    }

    handleImageLoad(img) {
        try {
            // Validate image dimensions
            if (img.naturalWidth > FILE_LIMITS.MAX_IMAGE_DIMENSION || 
                img.naturalHeight > FILE_LIMITS.MAX_IMAGE_DIMENSION) {
                throw new Error(`Image dimensions exceed the maximum limit of ${FILE_LIMITS.MAX_IMAGE_DIMENSION}px`);
            }

            this.state.originalDimensions = {
                width: img.naturalWidth,
                height: img.naturalHeight
            };
            this.state.aspectRatio = img.naturalWidth / img.naturalHeight;

            this.elements.widthInput.value = img.naturalWidth;
            this.elements.heightInput.value = img.naturalHeight;
            this.elements.preview.src = img.src;
            this.elements.container.classList.remove('drag-over');
            this.elements.downloadButton.disabled = false;

            notifications.success('Image loaded successfully');
        } catch (error) {
            console.error('Error loading image:', error);
            notifications.error(error.message || 'Failed to load image');
            this.resetState();
        }
    }

    async loadImage(file) {
        try {
            // Validate file
            await fileValidation.validateFileSize(file);
            fileValidation.validateFileType(file, this.state.supportedFormats);

            this.state.currentImage = file;
            this.updateFileInfo(file);

            const img = await utils.loadImage(URL.createObjectURL(file));
            this.handleImageLoad(img);
        } catch (error) {
            console.error('Error loading image:', error);
            notifications.error(error.message || 'Failed to load image');
            this.resetState();
        }
    }

    resetState() {
        this.state.currentImage = null;
        this.state.originalDimensions = { width: 0, height: 0 };
        this.state.aspectRatio = 1;
        this.elements.preview.src = '';
        this.elements.fileInfo.textContent = '';
        this.elements.downloadButton.disabled = true;
        this.elements.container.classList.remove('drag-over');
    }

    updateDimension(dimension, value) {
        if (this.state.aspectRatioLocked) {
            if (dimension === 'width') {
                this.elements.heightInput.value = Math.round(value / this.state.aspectRatio);
            } else {
                this.elements.widthInput.value = Math.round(value * this.state.aspectRatio);
            }
        }
    }

    toggleAspectRatio() {
        this.state.aspectRatioLocked = !this.state.aspectRatioLocked;
        this.elements.aspectRatioLock.classList.toggle('locked', this.state.aspectRatioLocked);
        this.elements.aspectRatioLock.textContent = 
            this.state.aspectRatioLocked ? '🔒' : '🔓';
        
        notifications.info(
            this.state.aspectRatioLocked ? 
            'Aspect ratio locked' : 
            'Aspect ratio unlocked'
        );
    }

    async resizeImage() {
        if (!this.state.currentImage) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = parseInt(this.elements.widthInput.value);
        const height = parseInt(this.elements.heightInput.value);

        canvas.width = width;
        canvas.height = height;

        const img = await utils.loadImage(this.elements.preview.src);
        ctx.drawImage(img, 0, 0, width, height);

        const format = this.elements.formatSelect.value;
        const quality = parseInt(this.elements.qualityInput.value) / 100;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => resolve(blob),
                `image/${format}`,
                format === 'jpeg' ? quality : undefined
            );
        });
    }

    async downloadImage() {
        try {
            const blob = await this.resizeImage();
            if (!blob) {
                notifications.error('No image to download');
                return;
            }

            const format = this.elements.formatSelect.value;
            const filename = this.state.currentImage.name.replace(
                /\.[^/.]+$/,
                `.${format}`
            );

            this.downloadFile(blob, filename);
            notifications.success('Image downloaded successfully');
        } catch (error) {
            console.error('Error downloading image:', error);
            notifications.error('Failed to download image. Please try again.');
        }
    }

    bindEvents() {
        // Drag and drop events
        const dragOverHandler = this.debounce((e) => {
            e.preventDefault();
            this.elements.container.classList.add('drag-over');
        }, UI_CONSTANTS.DEBOUNCE_DELAY);

        this.elements.container.addEventListener('dragover', dragOverHandler);

        this.elements.container.addEventListener('dragleave', () => {
            this.elements.container.classList.remove('drag-over');
        });

        this.elements.container.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) this.loadImage(file);
        });

        // File input event
        this.elements.container.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) this.loadImage(file);
            };
            input.click();
        });

        // Dimension inputs
        this.elements.widthInput.addEventListener('input', 
            this.debounce((e) => this.updateDimension('width', parseInt(e.target.value)), 
            UI_CONSTANTS.DEBOUNCE_DELAY)
        );

        this.elements.heightInput.addEventListener('input',
            this.debounce((e) => this.updateDimension('height', parseInt(e.target.value)),
            UI_CONSTANTS.DEBOUNCE_DELAY)
        );

        // Quality slider
        this.elements.qualityInput.addEventListener('input', (e) => {
            this.elements.qualityValue.textContent = `${e.target.value}%`;
        });

        // Aspect ratio lock
        this.elements.aspectRatioLock.addEventListener('click', () => {
            this.toggleAspectRatio();
        });

        // Download button
        this.elements.downloadButton.addEventListener('click', () => {
            this.downloadImage();
        });

        // Theme toggle
        this.elements.themeButton.addEventListener('click', () => {
            this.toggleTheme(STORAGE_KEYS.THEME);
        });

        // Keyboard shortcuts
        this.addKeyboardShortcut('s', () => this.downloadImage(), { ctrl: true });
        this.addKeyboardShortcut('l', () => this.toggleAspectRatio(), { ctrl: true });
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        this.elements.aspectRatioLock.textContent = '🔒';
        this.elements.downloadButton.disabled = true;
    }
}

// Initialize the feature when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageResizer();
}); 