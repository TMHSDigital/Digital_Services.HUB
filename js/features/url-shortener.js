import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import utils from '../utils/helpers.js';

class URLShortener extends BaseTool {
    constructor() {
        super();
        this.initializeElements();
        this.setupEventListeners();
        this.loadSavedUrls();
        this.loadQRCodeLibrary();
    }

    initializeElements() {
        this.elements = {
            longUrlInput: document.getElementById('long-url'),
            shortenButton: document.getElementById('shorten-button'),
            customAlias: document.getElementById('custom-alias'),
            expiryTime: document.getElementById('expiry-time'),
            customExpiry: document.getElementById('custom-expiry'),
            resultSection: document.getElementById('result-section'),
            shortenedUrl: document.getElementById('shortened-url'),
            copyButton: document.getElementById('copy-button'),
            qrButton: document.getElementById('qr-button'),
            qrModal: document.getElementById('qr-modal'),
            closeModal: document.querySelector('.close-button'),
            downloadQr: document.getElementById('download-qr'),
            qrCode: document.getElementById('qr-code'),
            clickCount: document.getElementById('click-count'),
            createdDate: document.getElementById('created-date'),
            expiryDate: document.getElementById('expiry-date'),
            historySection: document.getElementById('history-section'),
            historyList: document.querySelector('.history-list')
        };
    }

    setupEventListeners() {
        this.elements.shortenButton.addEventListener('click', () => this.shortenUrl());
        this.elements.copyButton.addEventListener('click', () => this.copyToClipboard());
        this.elements.qrButton.addEventListener('click', () => this.showQRCode());
        this.elements.closeModal.addEventListener('click', () => this.hideQRCode());
        this.elements.downloadQr.addEventListener('click', () => this.downloadQRCode());
        this.elements.expiryTime.addEventListener('change', () => this.toggleCustomExpiry());
        
        // Handle Enter key in URL input
        this.elements.longUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.shortenUrl();
            }
        });
    }

    async shortenUrl() {
        const longUrl = this.elements.longUrlInput.value.trim();
        const customAlias = this.elements.customAlias.value.trim();
        
        if (!this.validateUrl(longUrl)) {
            notifications.error('Please enter a valid URL');
            return;
        }

        try {
            // In a real implementation, this would call an API
            const shortUrl = await this.generateShortUrl(longUrl, customAlias);
            this.displayResult(shortUrl);
            this.saveUrl(shortUrl, longUrl);
            notifications.success('URL shortened successfully!');
        } catch (error) {
            notifications.error('Failed to shorten URL. Please try again.');
            console.error('Error shortening URL:', error);
        }
    }

    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    async generateShortUrl(longUrl, customAlias) {
        // In a real implementation, this would use a URL shortening service
        // For demo purposes, we'll create a mock short URL
        const baseUrl = 'https://short.dsh/';
        const alias = customAlias || this.generateRandomAlias();
        return baseUrl + alias;
    }

    generateRandomAlias() {
        return Math.random().toString(36).substring(2, 8);
    }

    displayResult(shortUrl) {
        this.elements.resultSection.classList.remove('hidden');
        this.elements.shortenedUrl.value = shortUrl;
        
        // Update stats
        this.elements.clickCount.textContent = '0';
        this.elements.createdDate.textContent = new Date().toLocaleDateString();
        
        const expiry = this.getExpiryDate();
        this.elements.expiryDate.textContent = expiry ? expiry.toLocaleDateString() : 'Never';
    }

    getExpiryDate() {
        const expiryValue = this.elements.expiryTime.value;
        if (expiryValue === 'never') return null;
        if (expiryValue === 'custom') return new Date(this.elements.customExpiry.value);
        
        const now = new Date();
        switch (expiryValue) {
            case '24h': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
            case '7d': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            case '30d': return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            default: return null;
        }
    }

    toggleCustomExpiry() {
        const isCustom = this.elements.expiryTime.value === 'custom';
        this.elements.customExpiry.classList.toggle('hidden', !isCustom);
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.elements.shortenedUrl.value);
            notifications.success('URL copied to clipboard!');
        } catch (error) {
            notifications.error('Failed to copy URL');
            console.error('Error copying to clipboard:', error);
        }
    }

    showQRCode() {
        const shortUrl = this.elements.shortenedUrl.value;
        if (!shortUrl) return;

        if (window.QRCode) {
            // Clear previous QR code
            this.elements.qrCode.innerHTML = '';
            
            // Generate new QR code
            QRCode.toCanvas(this.elements.qrCode, shortUrl, {
                width: 256,
                margin: 2,
                color: {
                    dark: getComputedStyle(document.documentElement)
                        .getPropertyValue('--primary-color')
                        .trim(),
                    light: '#ffffff'
                }
            }, (error) => {
                if (error) {
                    notifications.error('Failed to generate QR code');
                    console.error('Error generating QR code:', error);
                }
            });
        }

        this.elements.qrModal.classList.remove('hidden');
    }

    hideQRCode() {
        this.elements.qrModal.classList.add('hidden');
    }

    downloadQRCode() {
        const canvas = this.elements.qrCode.querySelector('canvas');
        if (!canvas) {
            notifications.error('No QR code to download');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            notifications.success('QR code downloaded successfully!');
        } catch (error) {
            notifications.error('Failed to download QR code');
            console.error('Error downloading QR code:', error);
        }
    }

    saveUrl(shortUrl, longUrl) {
        const savedUrls = this.getSavedUrls();
        savedUrls.unshift({
            shortUrl,
            longUrl,
            created: new Date().toISOString(),
            clicks: 0
        });
        
        // Keep only the last 10 URLs
        if (savedUrls.length > 10) savedUrls.pop();
        
        localStorage.setItem('shortened_urls', JSON.stringify(savedUrls));
    }

    getSavedUrls() {
        try {
            return JSON.parse(localStorage.getItem('shortened_urls')) || [];
        } catch {
            return [];
        }
    }

    loadSavedUrls() {
        const savedUrls = this.getSavedUrls();
        if (savedUrls.length > 0) {
            this.elements.historySection.classList.remove('hidden');
            this.displayUrlHistory(savedUrls);
        }
    }

    displayUrlHistory(urls) {
        this.elements.historyList.innerHTML = urls.map(url => `
            <div class="history-item">
                <div class="url-info">
                    <div class="short-url">${utils.sanitizeHTML(url.shortUrl)}</div>
                    <div class="long-url">${utils.sanitizeHTML(url.longUrl)}</div>
                    <div class="meta-info">
                        Created: ${new Date(url.created).toLocaleDateString()} | 
                        Clicks: ${url.clicks}
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="secondary-button" onclick="urlShortener.copyHistoryUrl('${url.shortUrl}')" 
                            aria-label="Copy shortened URL">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="secondary-button" onclick="urlShortener.showHistoryQR('${url.shortUrl}')"
                            aria-label="Show QR code">
                        <i class="fas fa-qrcode"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    copyHistoryUrl(url) {
        navigator.clipboard.writeText(url)
            .then(() => notifications.success('URL copied to clipboard!'))
            .catch(() => notifications.error('Failed to copy URL'));
    }

    showHistoryQR(url) {
        this.elements.shortenedUrl.value = url;
        this.showQRCode();
    }

    loadQRCodeLibrary() {
        // Load QRCode.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
        script.async = true;
        document.head.appendChild(script);
    }
}

// Initialize the URL shortener
const urlShortener = new URLShortener(); 