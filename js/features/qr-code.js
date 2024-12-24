class QRCode {
    constructor() {
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

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
            currentTheme: localStorage.getItem('theme') || 'dark',
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

    showNotification(message, type = 'info') {
        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        this.elements.notification.style.display = 'block';

        setTimeout(() => {
            this.elements.notification.style.display = 'none';
        }, 3000);
    }

    validateInput() {
        const text = this.elements.textInput.value.trim();
        if (!text) {
            this.showNotification('Please enter text or URL', 'error');
            return false;
        }

        // If it looks like a URL, validate it
        if (text.includes('://') || text.includes('www.')) {
            try {
                new URL(text.startsWith('http') ? text : `http://${text}`);
            } catch {
                this.showNotification('Please enter a valid URL', 'error');
                return false;
            }
        }

        const size = parseInt(this.elements.sizeInput.value);
        if (isNaN(size) || size < 128 || size > 1024) {
            this.showNotification('Size must be between 128 and 1024 pixels', 'error');
            return false;
        }

        return true;
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
            this.state.qrInstance = new QRCodeStyling(options);
            
            // Render QR code
            await this.state.qrInstance.append(this.elements.qrContainer);
            
            this.elements.downloadButton.disabled = false;
            this.showNotification('QR code generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showNotification('Error generating QR code. Please try again.', 'error');
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
            this.showNotification('Please generate a QR code first.', 'error');
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
            
            this.showNotification('QR code downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading QR code:', error);
            this.showNotification('Error downloading QR code. Please try again.', 'error');
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    toggleTheme() {
        const newTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
        this.state.currentTheme = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    bindEvents() {
        // Generate QR code
        this.elements.generateButton.addEventListener('click', 
            this.debounce(() => this.generateQRCode(), 300)
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
                }, 300)
            );
        });

        // Download QR code
        this.elements.downloadButton.addEventListener('click', () => {
            this.downloadQRCode();
        });

        // Theme toggle
        this.elements.themeButton.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Enter key in text input
        this.elements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generateQRCode();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + G to generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                this.generateQRCode();
            }
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.downloadQRCode();
            }
        });
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