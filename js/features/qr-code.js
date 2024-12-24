import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, UI_CONSTANTS } from '../utils/constants.js';
import { inputValidation } from '../utils/validation.js';
import utils from '../utils/helpers.js';

class QRCode extends BaseTool {
    initializeElements() {
        return {
            textInput: document.getElementById('text-input'),
            sizeInput: document.getElementById('size-input'),
            errorCorrectionSelect: document.getElementById('error-correction-select'),
            darkColorInput: document.getElementById('dark-color-input'),
            lightColorInput: document.getElementById('light-color-input'),
            generateButton: document.getElementById('generate-button'),
            downloadButton: document.getElementById('download-button'),
            qrContainer: document.getElementById('qr-container'),
            themeButton: document.getElementById('theme-button'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            currentTheme: utils.getStorageItem(STORAGE_KEYS.THEME) || 'dark',
            qrInstance: null,
            defaultOptions: {
                width: 256,
                height: 256,
                type: 'svg',
                data: '',
                margin: 1,
                qrOptions: {
                    errorCorrectionLevel: 'H'
                },
                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 0
                },
                dotsOptions: {
                    type: 'rounded',
                    color: '#000000',
                    gradient: null
                },
                backgroundOptions: {
                    color: '#ffffff',
                }
            }
        };
    }

    validateInput() {
        try {
            const text = this.elements.textInput.value.trim();
            inputValidation.validateRequired(text, 'Text or URL');

            // If it looks like a URL, validate it
            if (text.includes('://') || text.includes('www.')) {
                inputValidation.validateURL(text);
            }

            const size = parseInt(this.elements.sizeInput.value);
            inputValidation.validateNumberRange(size, 128, 1024, 'QR Code size');

            return true;
        } catch (error) {
            notifications.error(error.message);
            return false;
        }
    }

    getQROptions() {
        const size = parseInt(this.elements.sizeInput.value) || 256;
        const errorLevel = this.elements.errorCorrectionSelect.value;
        const darkColor = this.elements.darkColorInput.value;
        const lightColor = this.elements.lightColorInput.value;

        return {
            ...this.state.defaultOptions,
            width: size,
            height: size,
            data: this.elements.textInput.value.trim(),
            qrOptions: {
                ...this.state.defaultOptions.qrOptions,
                errorCorrectionLevel: errorLevel
            },
            dotsOptions: {
                ...this.state.defaultOptions.dotsOptions,
                color: darkColor
            },
            backgroundOptions: {
                ...this.state.defaultOptions.backgroundOptions,
                color: lightColor
            }
        };
    }

    async generateQRCode() {
        if (!this.validateInput()) return;

        try {
            const options = this.getQROptions();
            
            // Clear previous QR code
            this.elements.qrContainer.innerHTML = '';
            
            // Generate new QR code
            const qrCode = await QRCodeStyling.create(options);
            this.state.qrInstance = qrCode;
            
            // Render QR code
            await qrCode.append(this.elements.qrContainer);
            
            this.elements.downloadButton.disabled = false;
            notifications.success('QR code generated successfully!');
        } catch (error) {
            console.error('Error generating QR code:', error);
            notifications.error('Error generating QR code. Please try again.');
            this.resetState();
        }
    }

    resetState() {
        this.state.qrInstance = null;
        this.elements.qrContainer.innerHTML = '';
        this.elements.downloadButton.disabled = true;
    }

    async downloadQRCode() {
        if (!this.state.qrInstance) {
            notifications.error('Please generate a QR code first.');
            return;
        }

        try {
            const text = this.elements.textInput.value.trim();
            const sanitizedText = text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `qr_${sanitizedText}_${new Date().toISOString().slice(0,10)}.png`;
            
            await this.state.qrInstance.download({
                extension: 'png',
                name: fileName
            });
            
            notifications.success('QR code downloaded successfully!');
        } catch (error) {
            console.error('Error downloading QR code:', error);
            notifications.error('Error downloading QR code. Please try again.');
        }
    }

    bindEvents() {
        // Generate QR code
        this.elements.generateButton.addEventListener('click', 
            this.debounce(() => this.generateQRCode(), UI_CONSTANTS.DEBOUNCE_DELAY)
        );

        // Auto-generate on input change
        const inputElements = [
            this.elements.textInput,
            this.elements.sizeInput,
            this.elements.errorCorrectionSelect,
            this.elements.darkColorInput,
            this.elements.lightColorInput
        ];

        inputElements.forEach(element => {
            element.addEventListener('input', 
                this.debounce(() => {
                    if (this.elements.textInput.value.trim()) {
                        this.generateQRCode();
                    }
                }, UI_CONSTANTS.DEBOUNCE_DELAY)
            );
        });

        // Download QR code
        this.elements.downloadButton.addEventListener('click', () => {
            this.downloadQRCode();
        });

        // Theme toggle
        this.elements.themeButton.addEventListener('click', () => {
            this.toggleTheme(STORAGE_KEYS.THEME);
        });

        // Enter key in text input
        this.elements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.generateQRCode();
            }
        });

        // Keyboard shortcuts
        this.addKeyboardShortcut('g', () => this.generateQRCode(), { ctrl: true });
        this.addKeyboardShortcut('s', () => this.downloadQRCode(), { ctrl: true });
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        this.elements.downloadButton.disabled = true;
    }
}

// Initialize the feature when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QRCode();
}); 