import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import utils from '../utils/helpers.js';

export default class URLShortener extends BaseTool {
    constructor() {
        super();
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

    initializeElements() {
        return {
            urlInput: document.getElementById('url-input'),
            customSlugInput: document.getElementById('custom-slug'),
            shortenButton: document.getElementById('shorten-button'),
            copyButton: document.getElementById('copy-button'),
            clearButton: document.getElementById('clear-button'),
            resultContainer: document.getElementById('result-container'),
            shortUrlDisplay: document.getElementById('short-url'),
            qrCodeContainer: document.getElementById('qr-code'),
            historyContainer: document.getElementById('history-container'),
            historyList: document.getElementById('history-list'),
            clearHistoryButton: document.getElementById('clear-history'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            history: [],
            maxHistory: 10,
            isProcessing: false,
            apiEndpoint: 'https://api.tinyurl.com/create'
        };
    }

    bindEvents() {
        const { urlInput, shortenButton, copyButton, clearButton, clearHistoryButton } = this.elements;

        urlInput.addEventListener('input', this.validateInput.bind(this));
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.state.isProcessing) {
                this.shortenURL();
            }
        });

        shortenButton.addEventListener('click', this.shortenURL.bind(this));
        copyButton.addEventListener('click', this.copyToClipboard.bind(this));
        clearButton.addEventListener('click', this.clearInput.bind(this));
        clearHistoryButton.addEventListener('click', this.clearHistory.bind(this));

        this.addKeyboardShortcut('s', this.shortenURL.bind(this), { ctrl: true });
        this.addKeyboardShortcut('c', this.copyToClipboard.bind(this), { ctrl: true });
    }

    initialize() {
        this.loadHistory();
        this.elements.resultContainer.style.display = 'none';
        this.elements.shortenButton.disabled = true;
        this.elements.copyButton.disabled = true;
        this.updateHistoryDisplay();
    }

    validateInput() {
        const url = this.elements.urlInput.value.trim();
        const isValid = utils.isValidURL(url);
        this.elements.shortenButton.disabled = !isValid || this.state.isProcessing;
        return isValid;
    }

    async shortenURL() {
        if (!this.validateInput() || this.state.isProcessing) return;

        const url = this.elements.urlInput.value.trim();
        const customSlug = this.elements.customSlugInput.value.trim();

        this.state.isProcessing = true;
        this.elements.shortenButton.disabled = true;

        try {
            const response = await fetch(this.state.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url,
                    ...(customSlug && { alias: customSlug })
                })
            });

            if (!response.ok) {
                throw new Error('Failed to shorten URL');
            }

            const data = await response.json();
            this.handleShortenSuccess(data.data.tiny_url, url);
        } catch (error) {
            console.error('URL shortening error:', error);
            this.showNotification('Failed to shorten URL', 'error');
        } finally {
            this.state.isProcessing = false;
            this.elements.shortenButton.disabled = !this.validateInput();
        }
    }

    handleShortenSuccess(shortUrl, originalUrl) {
        this.elements.shortUrlDisplay.value = shortUrl;
        this.elements.resultContainer.style.display = 'block';
        this.elements.copyButton.disabled = false;

        this.addToHistory({
            original: originalUrl,
            shortened: shortUrl,
            timestamp: Date.now()
        });

        this.showNotification('URL shortened successfully');
    }

    addToHistory(entry) {
        this.state.history.unshift(entry);
        if (this.state.history.length > this.state.maxHistory) {
            this.state.history.pop();
        }
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (!this.elements.historyList) return;

        this.elements.historyList.innerHTML = '';
        this.state.history.forEach(entry => {
            const item = this.createHistoryItem(entry);
            this.elements.historyList.appendChild(item);
        });

        this.elements.historyContainer.style.display =
            this.state.history.length ? 'block' : 'none';
    }

    createHistoryItem(entry) {
        const item = document.createElement('div');
        item.className = 'history-item';

        const urlInfo = document.createElement('div');
        urlInfo.className = 'url-info';
        urlInfo.innerHTML = `
            <a href="${entry.shortened}" class="short-url" target="_blank" rel="noopener">${entry.shortened}</a>
            <span class="long-url" title="${entry.original}">${entry.original}</span>
            <span class="meta-info">${new Date(entry.timestamp).toLocaleString()}</span>
        `;

        const actions = document.createElement('div');
        actions.className = 'action-buttons';
        actions.innerHTML = `
            <button class="copy-button" aria-label="Copy shortened URL">
                <i class="fas fa-copy"></i>
            </button>
            <button class="delete-button" aria-label="Delete from history">
                <i class="fas fa-trash"></i>
            </button>
        `;

        actions.querySelector('.copy-button').addEventListener('click', () => {
            this.copyToClipboard(entry.shortened);
        });

        actions.querySelector('.delete-button').addEventListener('click', () => {
            this.removeFromHistory(entry);
        });

        item.appendChild(urlInfo);
        item.appendChild(actions);
        return item;
    }

    removeFromHistory(entry) {
        this.state.history = this.state.history.filter(item =>
            item.timestamp !== entry.timestamp);
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    clearHistory() {
        this.state.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
        this.showNotification('History cleared');
    }

    loadHistory() {
        const savedHistory = this.loadFromStorage('urlShortenerHistory');
        if (savedHistory) {
            this.state.history = savedHistory;
            this.updateHistoryDisplay();
        }
    }

    saveHistory() {
        this.saveToStorage('urlShortenerHistory', this.state.history);
    }

    copyToClipboard() {
        const shortUrl = this.elements.shortUrlDisplay.value;
        if (!shortUrl) return;

        navigator.clipboard.writeText(shortUrl)
            .then(() => this.showNotification('URL copied to clipboard'))
            .catch(() => this.showNotification('Failed to copy URL', 'error'));
    }

    clearInput() {
        this.elements.urlInput.value = '';
        this.elements.customSlugInput.value = '';
        this.elements.resultContainer.style.display = 'none';
        this.elements.copyButton.disabled = true;
        this.validateInput();
    }
}

// Initialize the tool if we're on the URL shortener page
if (document.querySelector('.url-shortener')) {
    new URLShortener();
}
