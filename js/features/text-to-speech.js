import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS, UI_CONSTANTS, KEYBOARD_SHORTCUTS } from '../utils/constants.js';
import utils from '../utils/helpers.js';

class TextToSpeech extends BaseTool {
    initializeElements() {
        return {
            textInput: document.getElementById('text-input'),
            voiceSelect: document.getElementById('voice-select'),
            speakButton: document.getElementById('speak-button'),
            rateInput: document.getElementById('rate'),
            pitchInput: document.getElementById('pitch'),
            volumeInput: document.getElementById('volume'),
            rateValue: document.getElementById('rate-value'),
            pitchValue: document.getElementById('pitch-value'),
            volumeValue: document.getElementById('volume-value'),
            charCount: document.getElementById('char-count'),
            progressContainer: document.querySelector('.progress-container'),
            progress: document.querySelector('.progress'),
            progressText: document.querySelector('.progress-text'),
            historyList: document.getElementById('history-list'),
            languageDetect: document.getElementById('language-detect').querySelector('span'),
            themeButton: document.getElementById('theme-button'),
            clearButton: document.getElementById('clear-button'),
            saveTextButton: document.getElementById('save-text'),
            previewButton: document.getElementById('preview-voice'),
            downloadButton: document.getElementById('download-audio'),
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            voices: [],
            synthesis: window.speechSynthesis,
            currentTheme: utils.getStorageItem(STORAGE_KEYS.THEME) || 'dark',
            history: utils.getStorageItem('tts-history') || [],
            templates: {
                greeting: "Hello! How are you today?",
                introduction: "My name is [Name] and I'm pleased to meet you.",
                farewell: "Thank you for your time. Have a great day!"
            },
            lngDetector: new LanguageDetector()
        };
    }

    populateVoiceList() {
        this.state.voices = this.state.synthesis.getVoices();
        this.elements.voiceSelect.innerHTML = this.state.voices
            .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
            .join('');
    }

    updateTextInfo() {
        const text = this.elements.textInput.value;
        this.elements.charCount.textContent = `(${text.length} characters)`;
        
        const detected = text.trim() ? this.state.lngDetector.detect(text, 1) : [];
        this.elements.languageDetect.textContent = detected.length ? detected[0][0] : 'None';
    }

    addToHistory(text) {
        if (!text.trim() || this.state.history.includes(text)) return;
        
        this.state.history.unshift(text);
        if (this.state.history.length > UI_CONSTANTS.MAX_RECENT_FILES) {
            this.state.history.pop();
        }
        utils.setStorageItem('tts-history', this.state.history);
        this.updateHistoryList();
    }

    updateHistoryList() {
        this.elements.historyList.innerHTML = this.state.history
            .map(text => {
                const displayText = text.substring(0, 50) + (text.length > 50 ? '...' : '');
                return `<div class="history-item">${utils.sanitizeHTML(displayText)}</div>`;
            })
            .join('');

        this.elements.historyList.querySelectorAll('.history-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.elements.textInput.value = this.state.history[index];
                this.updateTextInfo();
            });
        });
    }

    createUtterance(text, isPreview = false) {
        const utterance = new SpeechSynthesisUtterance(
            isPreview ? "This is a preview of the selected voice." : text
        );

        const selectedVoice = this.state.voices[this.elements.voiceSelect.value];
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.rate = parseFloat(this.elements.rateInput.value);
        utterance.pitch = parseFloat(this.elements.pitchInput.value);
        utterance.volume = parseFloat(this.elements.volumeInput.value);

        return utterance;
    }

    updateProgress(value) {
        this.elements.progress.style.width = `${value}%`;
        this.elements.progressText.textContent = `${Math.round(value)}%`;
    }

    async speak(isPreview = false) {
        if (this.state.synthesis.speaking) {
            this.state.synthesis.cancel();
            return;
        }

        const text = this.elements.textInput.value.trim();
        if (!text && !isPreview) {
            notifications.error('Please enter some text to speak.');
            return;
        }

        const utterance = this.createUtterance(text, isPreview);

        utterance.onstart = () => {
            this.elements.speakButton.textContent = 'Stop';
            this.elements.speakButton.classList.add('speaking');
            if (!isPreview) {
                this.elements.progressContainer.classList.remove('hidden');
                this.updateProgress(0);
            }
        };

        utterance.onend = () => {
            this.elements.speakButton.textContent = 'Speak';
            this.elements.speakButton.classList.remove('speaking');
            this.elements.progressContainer.classList.add('hidden');
            if (!isPreview) {
                this.addToHistory(text);
                notifications.success('Speech completed successfully');
            }
        };

        utterance.onboundary = (event) => {
            if (!isPreview) {
                this.updateProgress((event.charIndex / event.target.text.length) * 100);
            }
        };

        utterance.onerror = (event) => {
            console.error('SpeechSynthesis Error:', event);
            this.elements.speakButton.textContent = 'Speak';
            this.elements.speakButton.classList.remove('speaking');
            this.elements.progressContainer.classList.add('hidden');
            notifications.error('An error occurred while speaking. Please try again.');
        };

        this.state.synthesis.speak(utterance);
    }

    async downloadAudio() {
        const text = this.elements.textInput.value.trim();
        if (!text) {
            notifications.error('Please enter some text to convert.');
            return;
        }

        try {
            const utterance = this.createUtterance(text);
            const audioBlob = await new Promise((resolve, reject) => {
                const audioChunks = [];
                const mediaRecorder = new MediaRecorder(
                    new AudioContext().createMediaStreamDestination().stream
                );
                
                mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
                mediaRecorder.onstop = () => resolve(new Blob(audioChunks, { type: 'audio/wav' }));

                this.state.synthesis.speak(utterance);
                mediaRecorder.start();
                utterance.onend = () => mediaRecorder.stop();
            });

            const filename = `speech_${new Date().toISOString().slice(0,10)}.wav`;
            this.downloadFile(audioBlob, filename);
            notifications.success('Audio file downloaded successfully');
        } catch (error) {
            console.error('Error downloading audio:', error);
            notifications.error('Failed to download audio. Please try again.');
        }
    }

    bindEvents() {
        // Voice events
        if (this.state.synthesis.onvoiceschanged !== undefined) {
            this.state.synthesis.onvoiceschanged = () => this.populateVoiceList();
        }

        // Control events
        this.elements.rateInput.addEventListener('input', () => {
            this.elements.rateValue.textContent = `${this.elements.rateInput.value}x`;
        });

        this.elements.pitchInput.addEventListener('input', () => {
            this.elements.pitchValue.textContent = this.elements.pitchInput.value;
        });

        this.elements.volumeInput.addEventListener('input', () => {
            this.elements.volumeValue.textContent = 
                `${Math.round(this.elements.volumeInput.value * 100)}%`;
        });

        // Button events
        this.elements.speakButton.addEventListener('click', () => this.speak());
        this.elements.previewButton.addEventListener('click', () => this.speak(true));
        this.elements.themeButton.addEventListener('click', () => this.toggleTheme(STORAGE_KEYS.THEME));
        this.elements.clearButton.addEventListener('click', () => {
            this.elements.textInput.value = '';
            this.updateTextInfo();
        });
        this.elements.saveTextButton.addEventListener('click', () => {
            const text = this.elements.textInput.value.trim();
            if (text) {
                this.addToHistory(text);
                notifications.success('Text saved to history');
            }
        });
        this.elements.downloadButton.addEventListener('click', () => this.downloadAudio());

        // Template buttons
        document.querySelectorAll('[data-template]').forEach(button => {
            button.addEventListener('click', () => {
                this.elements.textInput.value = this.state.templates[button.dataset.template];
                this.updateTextInfo();
            });
        });

        // Text input events
        this.elements.textInput.addEventListener('input', this.debounce(() => this.updateTextInfo(), 300));
        
        // Keyboard shortcuts
        this.addKeyboardShortcut('Enter', () => this.speak(), { ctrl: true });
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        this.populateVoiceList();
        this.updateTextInfo();
        this.updateHistoryList();
    }
}

// Initialize the feature when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TextToSpeech();
}); 