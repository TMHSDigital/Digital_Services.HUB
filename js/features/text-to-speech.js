import { BaseTool } from './base-tool.js';
import { notifications } from '../utils/ui.js';
import { STORAGE_KEYS } from '../utils/constants.js';

/**
 * Text-to-Speech API wrapper
 */
class TextToSpeechAPI {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        this.loadVoices();
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.voices = this.synth.getVoices();
            };
        }
    }

    getVoices() {
        return this.voices;
    }

    getVoicesForLanguage(langCode) {
        return this.voices.filter(voice => voice.lang.startsWith(langCode));
    }

    setVoice(voice) {
        if (typeof voice === 'string') {
            const foundVoice = this.voices.find(v => v.name === voice);
            if (foundVoice) {
                this.currentVoice = foundVoice;
                return true;
            }
            return false;
        }

        if (voice instanceof SpeechSynthesisVoice) {
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

            const utterance = new SpeechSynthesisUtterance(text);

            if (this.currentVoice) {
                utterance.voice = this.currentVoice;
            }

            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;

            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(new Error(event.error));

            this.synth.speak(utterance);
        });
    }

    stop() {
        this.synth.cancel();
    }

    isSpeaking() {
        return this.synth.speaking;
    }

    pause() {
        this.synth.pause();
    }

    resume() {
        this.synth.resume();
    }

    getSupportedLanguages() {
        const languages = new Set();
        this.voices.forEach(voice => {
            languages.add(voice.lang);
        });
        return Array.from(languages);
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
            synthesis: window.speechSynthesis,
            voices: [],
            currentUtterance: null,
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
        const { textInput, voiceSelect, rateInput, pitchInput, volumeInput, speakButton, pauseButton, stopButton, downloadButton, settingsToggle } = this.elements;

        // Text input events
        textInput.addEventListener('input', this.handleTextInput.bind(this));

        // Voice options events
        voiceSelect.addEventListener('change', this.handleVoiceSelect.bind(this));
        rateInput.addEventListener('input', this.handleRateChange.bind(this));
        pitchInput.addEventListener('input', this.handlePitchChange.bind(this));
        volumeInput.addEventListener('input', this.handleVolumeChange.bind(this));

        // Action button events
        speakButton.addEventListener('click', this.speak.bind(this));
        pauseButton.addEventListener('click', this.pause.bind(this));
        stopButton.addEventListener('click', this.stop.bind(this));
        downloadButton.addEventListener('click', this.download.bind(this));

        // Settings toggle
        settingsToggle.addEventListener('click', this.toggleSettings.bind(this));

        // Voice list update
        this.state.synthesis.addEventListener('voiceschanged', this.loadVoices.bind(this));

        // Keyboard shortcuts
        this.addKeyboardShortcut('space', this.togglePlayPause.bind(this));
        this.addKeyboardShortcut('s', this.stop.bind(this), { ctrl: true });
        this.addKeyboardShortcut('d', this.download.bind(this), { ctrl: true });
    }

    initialize() {
        // Load available voices
        this.loadVoices();

        // Set initial values
        this.elements.rateInput.value = this.state.settings.rate;
        this.elements.pitchInput.value = this.state.settings.pitch;
        this.elements.volumeInput.value = this.state.settings.volume;

        // Hide settings panel initially
        this.elements.settingsPanel.style.display = 'none';
    }

    // ... rest of the class implementation ...
}

// Initialize the tool if we're on the text-to-speech page
if (document.querySelector('.tts-container')) {
    new TextToSpeech();
}
