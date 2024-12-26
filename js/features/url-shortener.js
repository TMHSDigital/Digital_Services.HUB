import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import utils from '../utils/helpers.js';

class URLShortener extends BaseTool {
    constructor() {
        super();
        this.initializeElements();
        this.initializeState();
        this.bindEvents();
    }

    initializeElements() {
        return {
            // Input elements
            urlInput: document.getElementById('url-input'),
            customSlugInput: document.getElementById('custom-slug'),

            // Action buttons
            shortenButton: document.getElementById('shorten-button'),
            copyButton: document.getElementById('copy-button'),
            clearButton: document.getElementById('clear-button'),

            // Result elements
            resultContainer: document.getElementById('result-container'),
            shortUrlDisplay: document.getElementById('short-url'),
            qrCodeContainer: document.getElementById('qr-code'),

            // History elements
            historyContainer: document.getElementById('history-container'),
            historyList: document.getElementById('history-list'),
            clearHistoryButton: document.getElementById('clear-history'),

            // Notification
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

        // Input events
        urlInput.addEventListener('input', this.validateInput.bind(this));
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.shortenURL();
        });

        // Button events
        shortenButton.addEventListener('click', this.shortenURL.bind(this));
        copyButton.addEventListener('click', this.copyToClipboard.bind(this));
        clearButton.addEventListener('click', this.clearInput.bind(this));
        clearHistoryButton.addEventListener('click', this.clearHistory.bind(this));

        // Keyboard shortcuts
        this.addKeyboardShortcut('s', this.shortenURL.bind(this), { ctrl: true });
        this.addKeyboardShortcut('c', this.copyToClipboard.bind(this), { ctrl: true });
    }

    initialize() {
        // Load history from local storage
        this.loadHistory();

        // Hide result container initially
        this.elements.resultContainer.style.display = 'none';

        // Disable buttons initially
        this.elements.shortenButton.disabled = true;
        this.elements.copyButton.disabled = true;
    }

    // ... rest of the class implementation ...
}

// Initialize the URL shortener
const urlShortener = new URLShortener();
