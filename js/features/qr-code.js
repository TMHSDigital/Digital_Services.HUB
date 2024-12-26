import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';

export default class QRCode extends BaseTool {
    constructor() {
        super();
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

    initializeElements() {
        return {
            textInput: document.getElementById('text-input'),
            errorCorrectionSelect: document.getElementById('error-correction'),
            sizeInput: document.getElementById('size'),
            colorInput: document.getElementById('color'),
            backgroundInput: document.getElementById('background'),
            generateButton: document.getElementById('generate-button'),
            downloadButton: document.getElementById('download-button'),
            clearButton: document.getElementById('clear-button'),
            qrContainer: document.getElementById('qr-container'),
            qrCanvas: document.getElementById('qr-canvas'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            qr: null,
            options: {
                errorCorrectionLevel: 'M',
                size: 256,
                color: '#000000',
                background: '#ffffff'
            }
        };
    }

    bindEvents() {
        const { textInput, errorCorrectionSelect, sizeInput, colorInput, backgroundInput, generateButton, downloadButton, clearButton } = this.elements;

        textInput.addEventListener('input', this.validateInput.bind(this));
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateQRCode();
        });

        errorCorrectionSelect.addEventListener('change', this.updateOptions.bind(this));
        sizeInput.addEventListener('input', this.updateOptions.bind(this));
        colorInput.addEventListener('input', this.updateOptions.bind(this));
        backgroundInput.addEventListener('input', this.updateOptions.bind(this));

        generateButton.addEventListener('click', this.generateQRCode.bind(this));
        downloadButton.addEventListener('click', this.downloadQRCode.bind(this));
        clearButton.addEventListener('click', this.clearInput.bind(this));

        this.addKeyboardShortcut('g', this.generateQRCode.bind(this), { ctrl: true });
        this.addKeyboardShortcut('d', this.downloadQRCode.bind(this), { ctrl: true });
    }

    initialize() {
        this.elements.errorCorrectionSelect.value = this.state.options.errorCorrectionLevel;
        this.elements.sizeInput.value = this.state.options.size;
        this.elements.colorInput.value = this.state.options.color;
        this.elements.backgroundInput.value = this.state.options.background;
        this.elements.qrContainer.style.display = 'none';
        this.elements.generateButton.disabled = true;
        this.elements.downloadButton.disabled = true;
    }

    validateInput() {
        const text = this.elements.textInput.value.trim();
        this.elements.generateButton.disabled = !text;
        if (this.state.qr && !text) {
            this.clearQRCode();
        }
    }

    updateOptions() {
        this.state.options = {
            errorCorrectionLevel: this.elements.errorCorrectionSelect.value,
            size: parseInt(this.elements.sizeInput.value),
            color: this.elements.colorInput.value,
            background: this.elements.backgroundInput.value
        };

        if (this.state.qr) {
            this.generateQRCode();
        }
    }

    async generateQRCode() {
        const text = this.elements.textInput.value.trim();
        if (!text) return;

        try {
            if (!this.state.qr) {
                this.state.qr = new QRCodeStyling({
                    width: this.state.options.size,
                    height: this.state.options.size,
                    type: 'canvas',
                    data: text,
                    dotsOptions: {
                        color: this.state.options.color,
                        type: 'square'
                    },
                    backgroundOptions: {
                        color: this.state.options.background
                    },
                    qrOptions: {
                        errorCorrectionLevel: this.state.options.errorCorrectionLevel
                    }
                });
            } else {
                this.state.qr.update({
                    data: text,
                    width: this.state.options.size,
                    height: this.state.options.size,
                    dotsOptions: {
                        color: this.state.options.color
                    },
                    backgroundOptions: {
                        color: this.state.options.background
                    },
                    qrOptions: {
                        errorCorrectionLevel: this.state.options.errorCorrectionLevel
                    }
                });
            }

            this.elements.qrContainer.innerHTML = '';
            await this.state.qr.append(this.elements.qrContainer);
            this.elements.qrContainer.style.display = 'block';
            this.elements.downloadButton.disabled = false;
            this.showNotification('QR code generated successfully');
        } catch (error) {
            console.error('QR code generation error:', error);
            this.showNotification('Failed to generate QR code', 'error');
        }
    }

    async downloadQRCode() {
        if (!this.state.qr) return;

        try {
            const canvas = this.elements.qrContainer.querySelector('canvas');
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Failed to download QR code', 'error');
        }
    }

    clearInput() {
        this.elements.textInput.value = '';
        this.validateInput();
        this.clearQRCode();
    }

    clearQRCode() {
        if (this.state.qr) {
            this.elements.qrContainer.innerHTML = '';
            this.elements.qrContainer.style.display = 'none';
            this.elements.downloadButton.disabled = true;
            this.state.qr = null;
        }
    }
}

// Initialize the tool if we're on the QR code page
if (document.querySelector('.qr-controls')) {
    new QRCode();
}
