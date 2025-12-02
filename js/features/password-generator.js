import { BaseTool } from '../utils/base-tool.js';
import { showNotification } from '../utils/ui.js';
import { STORAGE_KEYS } from '../utils/constants.js';

class PasswordGenerator extends BaseTool {
    constructor() {
        super();
        this.initializeElements();
        this.initializeState();
        this.bindEvents();
    }

    initializeElements() {
        return {
            // Password display
            passwordDisplay: document.getElementById('password-display'),
            strengthMeter: document.getElementById('strength-meter'),
            strengthText: document.getElementById('strength-text'),

            // Length control
            lengthInput: document.getElementById('length'),
            lengthValue: document.getElementById('length-value'),

            // Character options
            uppercaseCheck: document.getElementById('uppercase'),
            lowercaseCheck: document.getElementById('lowercase'),
            numbersCheck: document.getElementById('numbers'),
            symbolsCheck: document.getElementById('symbols'),

            // Action buttons
            generateButton: document.getElementById('generate-button'),
            copyButton: document.getElementById('copy-button'),

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
            currentPassword: '',
            history: [],
            maxHistory: 10,
            defaultLength: 16,
            minLength: 8,
            maxLength: 128,
            characterSets: {
                uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                lowercase: 'abcdefghijklmnopqrstuvwxyz',
                numbers: '0123456789',
                symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
            }
        };
    }

    bindEvents() {
        const { lengthInput, uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck, generateButton, copyButton, clearHistoryButton } = this.elements;

        // Length input events
        lengthInput.addEventListener('input', this.updateLengthValue.bind(this));

        // Character option events
        uppercaseCheck.addEventListener('change', this.validateOptions.bind(this));
        lowercaseCheck.addEventListener('change', this.validateOptions.bind(this));
        numbersCheck.addEventListener('change', this.validateOptions.bind(this));
        symbolsCheck.addEventListener('change', this.validateOptions.bind(this));

        // Button events
        generateButton.addEventListener('click', this.generatePassword.bind(this));
        copyButton.addEventListener('click', this.copyToClipboard.bind(this));
        clearHistoryButton.addEventListener('click', this.clearHistory.bind(this));

        // Keyboard shortcuts
        this.addKeyboardShortcut('g', this.generatePassword.bind(this), { ctrl: true });
        this.addKeyboardShortcut('c', this.copyToClipboard.bind(this), { ctrl: true });
    }

    initialize() {
        // Set initial values
        this.elements.lengthInput.value = this.state.defaultLength;
        this.elements.lengthValue.textContent = this.state.defaultLength;

        // Set min/max values
        this.elements.lengthInput.min = this.state.minLength;
        this.elements.lengthInput.max = this.state.maxLength;

        // Check default options
        this.elements.uppercaseCheck.checked = true;
        this.elements.lowercaseCheck.checked = true;
        this.elements.numbersCheck.checked = true;

        // Load history
        this.loadHistory();

        // Generate initial password
        this.generatePassword();
    }

    // ... rest of the class implementation ...
}

// Initialize the password generator
const passwordGenerator = new PasswordGenerator();
window.passwordGenerator = passwordGenerator; // Make it accessible for history item actions
