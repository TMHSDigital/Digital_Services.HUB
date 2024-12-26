import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import utils from '../utils/helpers.js';

/**
 * Text-to-Speech API wrapper
 */
class TextToSpeechAPI {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        this.currentUtterance = null;
        this.loadVoices();
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => {
                this.voices = this.synth.getVoices();
            };
        }
    }

    setVoice(voiceId) {
        const voice = this.voices.find(v => v.voiceURI === voiceId);
        if (voice) {
            this.currentVoice = voice;
            return true;
        }
        return false;
    }

    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!text) {
                reject(new Error('No text provided'));
                return;
            }

            this.stop();

            this.currentUtterance = new SpeechSynthesisUtterance(text);

            if (this.currentVoice) {
                this.currentUtterance.voice = this.currentVoice;
            }

            this.currentUtterance.rate = options.rate || 1;
            this.currentUtterance.pitch = options.pitch || 1;
            this.currentUtterance.volume = options.volume || 1;

            this.currentUtterance.onend = () => resolve();
            this.currentUtterance.onerror = (event) => reject(new Error(event.error));

            this.synth.speak(this.currentUtterance);
        });
    }

    stop() {
        this.synth.cancel();
        this.currentUtterance = null;
    }

    pause() {
        this.synth.pause();
    }

    resume() {
        this.synth.resume();
    }

    isSpeaking() {
        return this.synth.speaking;
    }

    isPaused() {
        return this.synth.paused;
    }
}

/**
 * Text-to-Speech UI implementation
 */
export default class TextToSpeech extends BaseTool {
    constructor() {
        super();
        this.api = new TextToSpeechAPI();
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

    initializeElements() {
        return {
            // Text input elements
            textInput: document.getElementById('text-input'),
            charCount: document.getElementById('char-count'),

            // Voice options
            voiceSelect: document.getElementById('voice-select'),
            rateInput: document.getElementById('rate'),
            pitchInput: document.getElementById('pitch'),
            volumeInput: document.getElementById('volume'),

            // Action buttons
            speakButton: document.getElementById('speak-button'),
            pauseButton: document.getElementById('pause-button'),
            stopButton: document.getElementById('stop-button'),
            downloadButton: document.getElementById('download-button'),

            // Settings elements
            settingsToggle: document.getElementById('settings-toggle'),
            settingsPanel: document.getElementById('settings-panel'),

            // Notification
            notification: document.querySelector('.notification')
        };
    }

    initializeState() {
        return {
            maxLength: 5000,
            isPlaying: false,
            isPaused: false,
            settings: {
                rate: 1,
                pitch: 1,
                volume: 1,
                voice: null
            }
        };
    }

    bindEvents() {
        const { textInput, voiceSelect, rateInput, pitchInput, volumeInput, speakButton, pauseButton, stopButton, settingsToggle } = this.elements;

        // Text input events
        textInput.addEventListener('input', this.debounce(this.handleTextInput.bind(this), 300));

        // Voice options events
        voiceSelect.addEventListener('change', this.handleVoiceSelect.bind(this));
        rateInput.addEventListener('input', this.debounce(this.handleRateChange.bind(this), 100));
        pitchInput.addEventListener('input', this.debounce(this.handlePitchChange.bind(this), 100));
        volumeInput.addEventListener('input', this.debounce(this.handleVolumeChange.bind(this), 100));

        // Action button events
        speakButton.addEventListener('click', this.toggleSpeech.bind(this));
        pauseButton.addEventListener('click', this.togglePause.bind(this));
        stopButton.addEventListener('click', this.stop.bind(this));

        // Settings toggle
        settingsToggle.addEventListener('click', this.toggleSettings.bind(this));

        // Voice list update
        this.api.synth.addEventListener('voiceschanged', this.loadVoices.bind(this));

        // Keyboard shortcuts
        this.addKeyboardShortcut('space', this.toggleSpeech.bind(this));
        this.addKeyboardShortcut('p', this.togglePause.bind(this), { ctrl: true });
        this.addKeyboardShortcut('s', this.stop.bind(this), { ctrl: true });
    }

    initialize() {
        // Set initial values
        this.elements.rateInput.value = this.state.settings.rate;
        this.elements.pitchInput.value = this.state.settings.pitch;
        this.elements.volumeInput.value = this.state.settings.volume;

        // Hide settings panel initially
        this.elements.settingsPanel.style.display = 'none';

        // Load voices
        this.loadVoices();

        // Load saved settings
        this.loadSettings();
    }

    handleTextInput() {
        const text = this.elements.textInput.value;
        const length = text.length;

        this.elements.charCount.textContent = `${length}/${this.state.maxLength}`;

        if (length > this.state.maxLength) {
            this.elements.textInput.value = text.slice(0, this.state.maxLength);
            this.showNotification('Text exceeds maximum length', 'error');
        }
    }

    handleVoiceSelect() {
        const voiceId = this.elements.voiceSelect.value;
        if (this.api.setVoice(voiceId)) {
            this.state.settings.voice = voiceId;
            this.saveSettings();
        }
    }

    handleRateChange() {
        this.state.settings.rate = parseFloat(this.elements.rateInput.value);
        this.saveSettings();
    }

    handlePitchChange() {
        this.state.settings.pitch = parseFloat(this.elements.pitchInput.value);
        this.saveSettings();
    }

    handleVolumeChange() {
        this.state.settings.volume = parseFloat(this.elements.volumeInput.value);
        this.saveSettings();
    }

    loadVoices() {
        const voices = this.api.voices;
        if (voices.length === 0) return;

        this.elements.voiceSelect.innerHTML = voices
            .map(voice => `<option value="${voice.voiceURI}">${voice.name} (${voice.lang})</option>`)
            .join('');

        if (this.state.settings.voice) {
            this.elements.voiceSelect.value = this.state.settings.voice;
            this.api.setVoice(this.state.settings.voice);
        }
    }

    async toggleSpeech() {
        if (this.state.isPlaying) {
            this.stop();
            return;
        }

        const text = this.elements.textInput.value.trim();
        if (!text) {
            this.showNotification('Please enter text to speak', 'error');
            return;
        }

        try {
            this.state.isPlaying = true;
            this.updatePlayButton();

            await this.api.speak(text, this.state.settings);

            this.state.isPlaying = false;
            this.updatePlayButton();
        } catch (error) {
            console.error('Speech error:', error);
            this.showNotification('Failed to speak text', 'error');
            this.state.isPlaying = false;
            this.updatePlayButton();
        }
    }

    togglePause() {
        if (!this.state.isPlaying) return;

        if (this.state.isPaused) {
            this.api.resume();
            this.state.isPaused = false;
        } else {
            this.api.pause();
            this.state.isPaused = true;
        }

        this.updatePauseButton();
    }

    stop() {
        this.api.stop();
        this.state.isPlaying = false;
        this.state.isPaused = false;
        this.updatePlayButton();
        this.updatePauseButton();
    }

    toggleSettings() {
        const isVisible = this.elements.settingsPanel.style.display === 'block';
        this.elements.settingsPanel.style.display = isVisible ? 'none' : 'block';
        this.elements.settingsToggle.setAttribute('aria-expanded', !isVisible);
    }

    updatePlayButton() {
        const icon = this.state.isPlaying ? 'stop' : 'play';
        this.elements.speakButton.innerHTML = `<i class="fas fa-${icon}"></i>`;
        this.elements.speakButton.setAttribute('aria-label', this.state.isPlaying ? 'Stop' : 'Play');
    }

    updatePauseButton() {
        const icon = this.state.isPaused ? 'play' : 'pause';
        this.elements.pauseButton.innerHTML = `<i class="fas fa-${icon}"></i>`;
        this.elements.pauseButton.setAttribute('aria-label', this.state.isPaused ? 'Resume' : 'Pause');
    }

    loadSettings() {
        const saved = this.loadFromStorage(STORAGE_KEYS.TTS_SETTINGS);
        if (saved) {
            this.state.settings = { ...this.state.settings, ...saved };
            this.elements.rateInput.value = this.state.settings.rate;
            this.elements.pitchInput.value = this.state.settings.pitch;
            this.elements.volumeInput.value = this.state.settings.volume;
            if (this.state.settings.voice) {
                this.elements.voiceSelect.value = this.state.settings.voice;
                this.api.setVoice(this.state.settings.voice);
            }
        }
    }

    saveSettings() {
        this.saveToStorage(STORAGE_KEYS.TTS_SETTINGS, this.state.settings);
    }
}

// Initialize the tool if we're on the text-to-speech page
if (document.querySelector('.tts-container')) {
    new TextToSpeech();
}
