import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import utils from '../utils/helpers.js';

class PasswordGenerator extends BaseTool {
    constructor() {
        super();
        this.initializeElements();
        this.initializeState();
        this.setupEventListeners();
        this.loadHistory();
        this.updateRequirements();
    }

    initializeElements() {
        // Output elements
        this.passwordOutput = document.getElementById('password-output');
        this.strengthText = document.getElementById('strength-text');
        this.strengthBars = document.querySelectorAll('.strength-bar');
        
        // Control elements
        this.lengthInput = document.getElementById('password-length');
        this.lengthValue = document.getElementById('length-value');
        this.uppercaseCheck = document.getElementById('uppercase');
        this.lowercaseCheck = document.getElementById('lowercase');
        this.numbersCheck = document.getElementById('numbers');
        this.symbolsCheck = document.getElementById('symbols');
        this.excludeSimilarCheck = document.getElementById('exclude-similar');
        this.excludeAmbiguousCheck = document.getElementById('exclude-ambiguous');
        this.customCharsInput = document.getElementById('custom-chars-input');
        
        // Button elements
        this.generateButton = document.getElementById('generate-password');
        this.copyButton = document.getElementById('copy-password');
        this.clearHistoryButton = document.getElementById('clear-history');
        
        // History elements
        this.historyList = document.getElementById('history-list');
        
        // Requirement elements
        this.requirements = {
            length: document.getElementById('req-length'),
            uppercase: document.getElementById('req-uppercase'),
            lowercase: document.getElementById('req-lowercase'),
            number: document.getElementById('req-number'),
            symbol: document.getElementById('req-symbol')
        };
    }

    initializeState() {
        this.characterSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            similar: 'il1Lo0O',
            ambiguous: '{}[]()/\\\'"`~,;:.<>'
        };
        
        this.history = this.loadHistoryFromStorage();
        this.displayHistory();
    }

    setupEventListeners() {
        // Generate and copy events
        this.generateButton.addEventListener('click', () => this.generatePassword());
        this.copyButton.addEventListener('click', () => this.copyPassword());
        
        // Length control events
        this.lengthInput.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthInput.value;
            this.updateRequirements();
        });
        
        // Checkbox events
        [
            this.uppercaseCheck,
            this.lowercaseCheck,
            this.numbersCheck,
            this.symbolsCheck,
            this.excludeSimilarCheck,
            this.excludeAmbiguousCheck
        ].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRequirements();
                if (this.passwordOutput.value) {
                    this.generatePassword();
                }
            });
        });
        
        // Custom characters event
        this.customCharsInput.addEventListener('input', () => {
            if (this.passwordOutput.value) {
                this.generatePassword();
            }
        });
        
        // History events
        this.clearHistoryButton.addEventListener('click', () => this.clearHistory());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'g') {
                    e.preventDefault();
                    this.generatePassword();
                } else if (e.key === 'c' && document.activeElement === this.passwordOutput) {
                    this.copyPassword();
                }
            }
        });
    }

    generatePassword() {
        try {
            // Validate options
            if (!this.validateOptions()) {
                notifications.error('Please select at least one character type');
                return;
            }

            // Get available characters
            let chars = this.getAvailableCharacters();
            if (!chars.length) {
                notifications.error('No characters available with current settings');
                return;
            }

            // Generate password
            const length = parseInt(this.lengthInput.value);
            let password = '';
            
            // Ensure at least one character of each selected type
            if (this.uppercaseCheck.checked) {
                password += this.getRandomChar(this.characterSets.uppercase);
            }
            if (this.lowercaseCheck.checked) {
                password += this.getRandomChar(this.characterSets.lowercase);
            }
            if (this.numbersCheck.checked) {
                password += this.getRandomChar(this.characterSets.numbers);
            }
            if (this.symbolsCheck.checked) {
                password += this.getRandomChar(this.characterSets.symbols);
            }

            // Fill remaining length with random characters
            while (password.length < length) {
                password += this.getRandomChar(chars);
            }

            // Shuffle the password
            password = this.shuffleString(password);

            // Update UI
            this.passwordOutput.value = password;
            this.updateStrengthMeter(password);
            this.addToHistory(password);
            
            notifications.success('Password generated successfully');
        } catch (error) {
            console.error('Error generating password:', error);
            notifications.error('Failed to generate password');
        }
    }

    validateOptions() {
        return this.uppercaseCheck.checked ||
               this.lowercaseCheck.checked ||
               this.numbersCheck.checked ||
               this.symbolsCheck.checked ||
               this.customCharsInput.value.trim().length > 0;
    }

    getAvailableCharacters() {
        let chars = '';
        
        if (this.uppercaseCheck.checked) chars += this.characterSets.uppercase;
        if (this.lowercaseCheck.checked) chars += this.characterSets.lowercase;
        if (this.numbersCheck.checked) chars += this.characterSets.numbers;
        if (this.symbolsCheck.checked) chars += this.characterSets.symbols;
        
        const customChars = this.customCharsInput.value.trim();
        if (customChars) chars += customChars;

        if (this.excludeSimilarCheck.checked) {
            chars = this.removeCharacters(chars, this.characterSets.similar);
        }
        
        if (this.excludeAmbiguousCheck.checked) {
            chars = this.removeCharacters(chars, this.characterSets.ambiguous);
        }

        return chars;
    }

    removeCharacters(source, charsToRemove) {
        return source.split('').filter(char => !charsToRemove.includes(char)).join('');
    }

    getRandomChar(chars) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return chars[array[0] % chars.length];
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const array2 = new Uint32Array(1);
            crypto.getRandomValues(array2);
            const j = array2[0] % (i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    updateStrengthMeter(password) {
        const strength = this.calculatePasswordStrength(password);
        let strengthClass = '';
        let strengthText = '';
        let activeBars = 0;

        if (strength >= 80) {
            strengthClass = 'very-strong';
            strengthText = 'Very Strong';
            activeBars = 4;
        } else if (strength >= 60) {
            strengthClass = 'strong';
            strengthText = 'Strong';
            activeBars = 3;
        } else if (strength >= 40) {
            strengthClass = 'medium';
            strengthText = 'Medium';
            activeBars = 2;
        } else {
            strengthClass = 'weak';
            strengthText = 'Weak';
            activeBars = 1;
        }

        this.strengthText.textContent = strengthText;
        this.strengthBars.forEach((bar, index) => {
            bar.className = 'strength-bar';
            if (index < activeBars) {
                bar.classList.add(strengthClass);
            }
        });

        // Update ARIA value
        document.querySelector('.strength-meter').setAttribute('aria-valuenow', strength);
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length contribution (up to 30 points)
        strength += Math.min(30, password.length * 2);

        // Character type contribution (up to 40 points)
        if (/[A-Z]/.test(password)) strength += 10;
        if (/[a-z]/.test(password)) strength += 10;
        if (/[0-9]/.test(password)) strength += 10;
        if (/[^A-Za-z0-9]/.test(password)) strength += 10;

        // Complexity contribution (up to 30 points)
        const uniqueChars = new Set(password).size;
        strength += Math.min(15, uniqueChars);

        const hasRepeatingChars = /(.).*\1/.test(password);
        if (!hasRepeatingChars) strength += 15;

        return Math.min(100, strength);
    }

    updateRequirements() {
        const password = this.passwordOutput.value;
        const length = parseInt(this.lengthInput.value);

        // Update length requirement
        this.updateRequirement('length', length >= 8 && length <= 64);

        // Update character type requirements
        this.updateRequirement('uppercase', !this.uppercaseCheck.checked || /[A-Z]/.test(password));
        this.updateRequirement('lowercase', !this.lowercaseCheck.checked || /[a-z]/.test(password));
        this.updateRequirement('number', !this.numbersCheck.checked || /[0-9]/.test(password));
        this.updateRequirement('symbol', !this.symbolsCheck.checked || /[^A-Za-z0-9]/.test(password));
    }

    updateRequirement(requirement, isValid) {
        const element = this.requirements[requirement];
        if (isValid) {
            element.classList.add('valid');
            element.querySelector('i').className = 'fas fa-check';
        } else {
            element.classList.remove('valid');
            element.querySelector('i').className = 'fas fa-times';
        }
    }

    async copyPassword() {
        const password = this.passwordOutput.value;
        if (!password) {
            notifications.error('No password to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            this.copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 1000);
            notifications.success('Password copied to clipboard');
        } catch (error) {
            console.error('Error copying password:', error);
            notifications.error('Failed to copy password');
        }
    }

    loadHistoryFromStorage() {
        const saved = localStorage.getItem(STORAGE_KEYS.PASSWORD_HISTORY);
        return saved ? JSON.parse(saved) : [];
    }

    saveHistoryToStorage() {
        localStorage.setItem(STORAGE_KEYS.PASSWORD_HISTORY, JSON.stringify(this.history));
    }

    addToHistory(password) {
        const timestamp = new Date().toISOString();
        this.history.unshift({ password, timestamp });
        
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        this.saveHistoryToStorage();
        this.displayHistory();
    }

    displayHistory() {
        this.historyList.innerHTML = this.history
            .map(({ password, timestamp }) => `
                <div class="history-item">
                    <span class="history-password">${utils.sanitizeHTML(password)}</span>
                    <div class="history-actions">
                        <button class="tech-button small" onclick="passwordGenerator.useHistoryPassword('${password}')" aria-label="Use this password">
                            <i class="fas fa-upload"></i>
                        </button>
                        <button class="tech-button small" onclick="passwordGenerator.copyHistoryPassword('${password}')" aria-label="Copy this password">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            `)
            .join('');
    }

    useHistoryPassword(password) {
        this.passwordOutput.value = password;
        this.updateStrengthMeter(password);
        this.updateRequirements();
        notifications.success('Password loaded from history');
    }

    async copyHistoryPassword(password) {
        try {
            await navigator.clipboard.writeText(password);
            notifications.success('Password copied to clipboard');
        } catch (error) {
            console.error('Error copying password:', error);
            notifications.error('Failed to copy password');
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistoryToStorage();
        this.displayHistory();
        notifications.success('History cleared');
    }
}

// Initialize the password generator
const passwordGenerator = new PasswordGenerator();
window.passwordGenerator = passwordGenerator; // Make it accessible for history item actions 