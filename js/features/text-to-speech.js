import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, UI_CONSTANTS, KEYBOARD_SHORTCUTS } from '../utils/constants.js';
import utils from '../utils/helpers.js';

class TextToSpeech extends BaseTool {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.setupEventListeners();
        this.loadVoices();
    }

    initializeElements() {
        // Text input elements
        this.textInput = document.getElementById('text-input');
        this.charCount = document.querySelector('.char-count');
        this.languageDetect = document.getElementById('language-detect');
        
        // Control elements
        this.voiceSelect = document.getElementById('voice-select');
        this.rateInput = document.getElementById('rate');
        this.pitchInput = document.getElementById('pitch');
        this.volumeInput = document.getElementById('volume');
        this.rateValue = document.getElementById('rate-value');
        this.pitchValue = document.getElementById('pitch-value');
        this.volumeValue = document.getElementById('volume-value');

        // Button elements
        this.clearButton = document.getElementById('clear-button');
        this.pasteButton = document.getElementById('paste-button');
        this.saveButton = document.getElementById('save-text');
        this.previewButton = document.getElementById('preview-voice');
        this.speakButton = document.getElementById('speak-button');
        this.downloadButton = document.getElementById('download-audio');

        // Progress elements
        this.progressContainer = document.querySelector('.progress-container');
        this.progressBar = this.progressContainer.querySelector('.progress');
        this.progressText = this.progressContainer.querySelector('.progress-text');

        // History and templates
        this.historyList = document.getElementById('history-list');
        this.templateButtons = document.querySelectorAll('.template-button');

        // Notification
        this.notification = document.querySelector('.notification');
    }

    initializeState() {
        this.synthesis = window.speechSynthesis;
        this.voices = [];
        this.currentUtterance = null;
        this.isPlaying = false;
        this.history = this.loadHistory();
        this.templates = {
            greeting: "Hello! How are you today?",
            introduction: "Hi, my name is [Name] and I'm pleased to meet you.",
            business: "Dear [Name], I hope this message finds you well. I'm writing regarding...",
            casual: "Hey there! Just wanted to drop you a quick note about...",
            formal: "Dear Sir/Madam, I am writing to formally request...",
            farewell: "Thank you for your time. I look forward to hearing from you soon."
        };
    }

    setupEventListeners() {
        // Voice loading
        this.synthesis.addEventListener('voiceschanged', () => this.loadVoices());

        // Text input events
        this.textInput.addEventListener('input', () => this.handleTextInput());
        this.clearButton.addEventListener('click', () => this.clearText());
        this.pasteButton.addEventListener('click', () => this.pasteText());
        this.saveButton.addEventListener('click', () => this.saveText());

        // Control events
        this.voiceSelect.addEventListener('change', () => this.previewVoice());
        ['rate', 'pitch', 'volume'].forEach(control => {
            const input = this[`${control}Input`];
            const value = this[`${control}Value`];
            input.addEventListener('input', () => this.updateControlValue(control, input, value));
        });

        // Action events
        this.previewButton.addEventListener('click', () => this.previewVoice());
        this.speakButton.addEventListener('click', () => this.toggleSpeech());
        this.downloadButton.addEventListener('click', () => this.downloadAudio());

        // Template events
        this.templateButtons.forEach(button => {
            button.addEventListener('click', () => this.loadTemplate(button.dataset.template));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'enter':
                        e.preventDefault();
                        this.toggleSpeech();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveText();
                        break;
                    case 'v':
                        if (document.activeElement !== this.textInput) {
                            e.preventDefault();
                            this.pasteText();
                        }
                        break;
                }
            }
            if (e.key === 'Escape' && this.isPlaying) {
                this.stopSpeech();
            }
        });
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.voiceSelect.innerHTML = this.voices
            .map((voice, index) => `
                <option value="${index}">
                    ${voice.name} (${voice.lang})
                </option>
            `)
            .join('');
    }

    handleTextInput() {
        const text = this.textInput.value;
        const length = text.length;
        this.charCount.textContent = `${length} / 5000 characters`;
        
        if (length > 0) {
            const language = this.detectLanguage(text);
            this.languageDetect.querySelector('span').textContent = language;
            
            // Auto-select appropriate voice
            const matchingVoice = this.voices.findIndex(voice => 
                voice.lang.startsWith(language.toLowerCase())
            );
            if (matchingVoice !== -1) {
                this.voiceSelect.value = matchingVoice;
            }
        } else {
            this.languageDetect.querySelector('span').textContent = 'None';
        }
    }

    detectLanguage(text) {
        const lngDetector = new LanguageDetector();
        const [detected] = lngDetector.detect(text, 1);
        return detected ? detected[0].toUpperCase() : 'Unknown';
    }

    updateControlValue(control, input, display) {
        const value = input.value;
        switch (control) {
            case 'rate':
                display.textContent = `${value}x`;
                break;
            case 'pitch':
                display.textContent = value;
                break;
            case 'volume':
                display.textContent = `${Math.round(value * 100)}%`;
                break;
        }
        if (this.isPlaying) {
            this.currentUtterance[control] = parseFloat(value);
        }
    }

    createUtterance(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voices[this.voiceSelect.value];
        utterance.rate = parseFloat(this.rateInput.value);
        utterance.pitch = parseFloat(this.pitchInput.value);
        utterance.volume = parseFloat(this.volumeInput.value);

        utterance.onstart = () => {
            this.isPlaying = true;
            this.speakButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
            this.speakButton.classList.add('active');
        };

        utterance.onend = () => {
            this.isPlaying = false;
            this.speakButton.innerHTML = '<i class="fas fa-play"></i> Speak';
            this.speakButton.classList.remove('active');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.showNotification('Error during speech synthesis', 'error');
            this.stopSpeech();
        };

        return utterance;
    }

    previewVoice() {
        const text = "Hello, this is a preview of my voice.";
        const utterance = this.createUtterance(text);
        this.synthesis.cancel();
        this.synthesis.speak(utterance);
    }

    toggleSpeech() {
        if (this.isPlaying) {
            this.stopSpeech();
        } else {
            this.startSpeech();
        }
    }

    startSpeech() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showNotification('Please enter some text', 'error');
            return;
        }

        this.currentUtterance = this.createUtterance(text);
        this.synthesis.cancel();
        this.synthesis.speak(this.currentUtterance);
    }

    stopSpeech() {
        this.synthesis.cancel();
        this.isPlaying = false;
        this.speakButton.innerHTML = '<i class="fas fa-play"></i> Speak';
        this.speakButton.classList.remove('active');
    }

    async downloadAudio() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showNotification('Please enter some text', 'error');
            return;
        }

        this.downloadButton.classList.add('loading');
        this.progressContainer.classList.add('active');

        try {
            const audioBlob = await this.textToAudioBlob(text);
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'speech.mp3';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Audio downloaded successfully', 'success');
        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Error downloading audio', 'error');
        } finally {
            this.downloadButton.classList.remove('loading');
            this.progressContainer.classList.remove('active');
            this.updateProgress(0);
        }
    }

    async textToAudioBlob(text) {
        // This is a mock implementation
        // In a real application, you would use a proper TTS API
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                this.updateProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    // Create a mock audio blob
                    const blob = new Blob([text], { type: 'audio/mp3' });
                    resolve(blob);
                }
            }, 200);
        });
    }

    updateProgress(value) {
        this.progressBar.style.width = `${value}%`;
        this.progressText.textContent = `${value}%`;
        this.progressContainer.setAttribute('aria-valuenow', value);
    }

    clearText() {
        this.textInput.value = '';
        this.handleTextInput();
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.textInput.value = text;
            this.handleTextInput();
            this.showNotification('Text pasted successfully', 'success');
        } catch (error) {
            console.error('Paste error:', error);
            this.showNotification('Error pasting text', 'error');
        }
    }

    saveText() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showNotification('Please enter some text', 'error');
            return;
        }

        const item = {
            id: Date.now(),
            text: text,
            timestamp: new Date().toISOString()
        };

        this.history.unshift(item);
        if (this.history.length > 10) {
            this.history.pop();
        }

        this.saveHistory();
        this.displayHistory();
        this.showNotification('Text saved successfully', 'success');
    }

    loadTemplate(template) {
        const text = this.templates[template];
        if (text) {
            this.textInput.value = text;
            this.handleTextInput();
            this.showNotification('Template loaded', 'success');
        }
    }

    loadHistory() {
        const saved = localStorage.getItem('tts-history');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('tts-history', JSON.stringify(this.history));
    }

    displayHistory() {
        this.historyList.innerHTML = this.history
            .map(item => `
                <div class="history-item" role="listitem">
                    <div class="history-text">${this.escapeHtml(item.text)}</div>
                    <div class="history-meta">
                        <span>${new Date(item.timestamp).toLocaleDateString()}</span>
                        <div class="history-actions">
                            <button 
                                class="tech-button small"
                                aria-label="Load saved text"
                                onclick="tts.loadHistoryItem(${item.id})"
                            >
                                <i class="fas fa-upload" aria-hidden="true"></i>
                            </button>
                            <button 
                                class="tech-button small"
                                aria-label="Delete saved text"
                                onclick="tts.deleteHistoryItem(${item.id})"
                            >
                                <i class="fas fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `)
            .join('');
    }

    loadHistoryItem(id) {
        const item = this.history.find(item => item.id === id);
        if (item) {
            this.textInput.value = item.text;
            this.handleTextInput();
            this.showNotification('Text loaded from history', 'success');
        }
    }

    deleteHistoryItem(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
        this.displayHistory();
        this.showNotification('Text deleted from history', 'success');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'success') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type}`;
        this.notification.style.display = 'block';
        
        setTimeout(() => {
            this.notification.style.display = 'none';
        }, 3000);
    }
}

// Initialize the text-to-speech converter
const tts = new TextToSpeech();
window.tts = tts; // Make it accessible for history item actions 