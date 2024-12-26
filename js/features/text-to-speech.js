/**
 * Text-to-Speech feature implementation
 * Combines the API and UI functionality
 */

// Base class for tool functionality
class BaseTool {
    constructor() {
        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        // Override in child class
    }

    setupEventListeners() {
        // Override in child class
    }
}

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
        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        this.elements = {
            textInput: document.getElementById('text-input'),
            voiceSelect: document.getElementById('voice-select'),
            speedSlider: document.getElementById('speed-slider'),
            pitchSlider: document.getElementById('pitch-slider'),
            volumeSlider: document.getElementById('volume-slider'),
            clearBtn: document.getElementById('clear-btn'),
            pasteBtn: document.getElementById('paste-btn'),
            saveBtn: document.getElementById('save-btn'),
            previewBtn: document.getElementById('preview-btn'),
            speakBtn: document.getElementById('speak-btn'),
            downloadBtn: document.getElementById('download-btn'),
            detectedLanguage: document.getElementById('detected-language'),
            charCount: document.getElementById('char-count'),
            templateBtns: document.querySelectorAll('.template-btn')
        };

        this.updateVoiceList();
        this.updateCharCount();
    }

    setupEventListeners() {
        // Voice selection
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.updateVoiceList();
        }

        // Text input
        this.elements.textInput.addEventListener('input', () => {
            this.updateCharCount();
            this.detectLanguage();
        });

        // Button actions
        this.elements.clearBtn.addEventListener('click', () => this.clearText());
        this.elements.pasteBtn.addEventListener('click', () => this.pasteText());
        this.elements.saveBtn.addEventListener('click', () => this.saveAudio());
        this.elements.previewBtn.addEventListener('click', () => this.previewVoice());
        this.elements.speakBtn.addEventListener('click', () => this.toggleSpeech());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadAudio());

        // Template buttons
        this.elements.templateBtns.forEach(btn => {
            btn.addEventListener('click', () => this.loadTemplate(btn.dataset.template));
        });
    }

    updateVoiceList() {
        const voices = this.api.getVoices();
        this.elements.voiceSelect.innerHTML = voices
            .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
            .join('');
    }

    updateCharCount() {
        const count = this.elements.textInput.value.length;
        this.elements.charCount.textContent = `${count} / 5000 characters`;
    }

    detectLanguage() {
        // Implement language detection logic
        this.elements.detectedLanguage.textContent = 'Detected Language: Auto';
    }

    clearText() {
        this.elements.textInput.value = '';
        this.updateCharCount();
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.elements.textInput.value = text;
            this.updateCharCount();
        } catch (error) {
            console.error('Failed to paste text:', error);
        }
    }

    previewVoice() {
        const previewText = "This is a preview of the selected voice.";
        this.speak(previewText);
    }

    toggleSpeech() {
        if (this.api.isSpeaking()) {
            this.api.stop();
            this.elements.speakBtn.innerHTML = '<i class="fas fa-play"></i> Speak';
        } else {
            this.speak(this.elements.textInput.value);
            this.elements.speakBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
        }
    }

    speak(text) {
        if (!text) return;

        const options = {
            rate: parseFloat(this.elements.speedSlider.value),
            pitch: parseFloat(this.elements.pitchSlider.value),
            volume: parseFloat(this.elements.volumeSlider.value)
        };

        this.api.setVoice(this.elements.voiceSelect.value);
        this.api.speak(text, options)
            .then(() => {
                this.elements.speakBtn.innerHTML = '<i class="fas fa-play"></i> Speak';
            })
            .catch(error => {
                console.error('Speech error:', error);
            });
    }

    loadTemplate(templateName) {
        const templates = {
            greeting: "Hello! How are you today?",
            introduction: "Let me introduce myself...",
            business: "Dear valued customer...",
            casual: "Hey there! Just wanted to let you know...",
            formal: "To whom it may concern...",
            farewell: "Thank you for your time. Best regards."
        };

        this.elements.textInput.value = templates[templateName] || '';
        this.updateCharCount();
    }

    // Additional methods for saving and downloading audio can be added here
}

// Initialize the tool if we're on the text-to-speech page
if (document.querySelector('.tts-container')) {
    new TextToSpeech();
}
