import { BaseTool } from '../utils/base-tool.js';
import { showNotification, formatFileSize } from '../utils/ui.js';
import { FILE_LIMITS } from '../utils/constants.js';

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
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input'),
            previewContainer: document.getElementById('preview-container'),
            previewImage: document.getElementById('preview-image'),
            fileInfo: document.getElementById('file-info'),
            changeImageBtn: document.getElementById('change-image'),
            settingsPanel: document.getElementById('settings-panel'),
            widthInput: document.getElementById('width'),
            heightInput: document.getElementById('height'),
            aspectRatioLock: document.getElementById('aspect-ratio-lock'),
            formatSelect: document.getElementById('format'),
            qualityInput: document.getElementById('quality'),
            qualityValue: document.getElementById('quality-value'),
            resizeButton: document.getElementById('resize-button'),
            downloadButton: document.getElementById('download-button'),
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

        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('drop', this.handleDrop.bind(this));
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        changeImageBtn.addEventListener('click', this.resetImage.bind(this));

        widthInput.addEventListener('input', this.debounce(() => this.handleDimensionChange('width'), 300));
        heightInput.addEventListener('input', this.debounce(() => this.handleDimensionChange('height'), 300));
        aspectRatioLock.addEventListener('click', this.toggleAspectRatio.bind(this));

        qualityInput.addEventListener('input', this.debounce(() => {
            this.elements.qualityValue.textContent = `${qualityInput.value}%`;
        }, 100));

        resizeButton.addEventListener('click', this.resizeImage.bind(this));
        downloadButton.addEventListener('click', this.downloadImage.bind(this));

        this.addKeyboardShortcut('s', this.downloadImage.bind(this), { ctrl: true });
    }

    initialize() {
        this.elements.settingsPanel.style.display = 'none';
        this.elements.downloadButton.disabled = true;
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
            this.showNotification(`File size must be less than ${formatFileSize(this.state.maxFileSize)}`, 'error');
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

        this.elements.fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
    }

    updatePreview() {
        this.elements.previewImage.src = this.state.currentImage.src;
        this.elements.previewContainer.style.display = 'block';
        this.elements.settingsPanel.style.display = 'block';
        this.elements.dropZone.style.display = 'none';

        this.elements.widthInput.value = this.state.originalDimensions.width;
        this.elements.heightInput.value = this.state.originalDimensions.height;
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

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const width = parseInt(this.elements.widthInput.value);
            const height = parseInt(this.elements.heightInput.value);
            const quality = parseInt(this.elements.qualityInput.value) / 100;
            const format = this.elements.formatSelect.value;

            canvas.width = width;
            canvas.height = height;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(this.state.currentImage, 0, 0, width, height);

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
        this.elements.downloadButton.disabled = true;
    }
}

// Initialize the tool if we're on the image resizer page
if (document.querySelector('.resizer-controls')) {
    new ImageResizer();
}
