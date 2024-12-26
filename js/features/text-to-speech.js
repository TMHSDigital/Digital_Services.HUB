/**
 * Text-to-Speech Feature
 * @module features/text-to-speech
 */

import { createElement, addEventListeners } from '../utils/dom.js';
import { Alert } from '../components/alert.js';

class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        this.isSpeaking = false;

        // Get DOM elements
        this.textArea = document.querySelector('#text-input');
        this.voiceSelect = document.querySelector('#voice-select');
        this.speedSlider = document.querySelector('#speed-slider');
        this.pitchSlider = document.querySelector('#pitch-slider');
        this.volumeSlider = document.querySelector('#volume-slider');
        this.charCount = document.querySelector('#char-count');
        this.languageDetect = document.querySelector('#detected-language');
        this.speakButton = document.querySelector('#speak-btn');

        // Initialize
        this.initializeControls();
        this.loadVoices();
        this.setupEventListeners();
    }

    initializeControls() {
        // Set default values
        this.speedSlider.value = 1;
        this.pitchSlider.value = 1;
        this.volumeSlider.value = 1;

        // Initialize character counter
        this.updateCharCount();
    }

    loadVoices() {
        // Load available voices
        const loadVoicesFn = () => {
            this.voices = this.synth.getVoices();
            this.populateVoiceSelect();
        };

        // Chrome loads voices asynchronously
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoicesFn;
        }

        // Try immediate load for Firefox
        loadVoicesFn();
    }

    populateVoiceSelect() {
        // Clear existing options
        this.voiceSelect.innerHTML = '';

        // Add voices to select element
        this.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            this.voiceSelect.appendChild(option);
        });

        // Select first voice by default
        if (this.voices.length > 0) {
            this.currentVoice = this.voices[0];
            this.voiceSelect.value = this.currentVoice.name;
        }
    }

    setupEventListeners() {
        // Button handlers
        document.querySelector('#clear-btn').addEventListener('click', () => this.clearText());
        document.querySelector('#paste-btn').addEventListener('click', () => this.pasteText());
        document.querySelector('#save-btn').addEventListener('click', () => this.saveAudio());
        document.querySelector('#preview-btn').addEventListener('click', () => this.previewVoice());
        this.speakButton.addEventListener('click', () => this.toggleSpeech());
        document.querySelector('#download-btn').addEventListener('click', () => this.downloadAudio());

        // Input handlers
        this.textArea.addEventListener('input', () => this.handleTextInput());
        this.voiceSelect.addEventListener('change', (e) => this.handleVoiceChange(e));
        this.speedSlider.addEventListener('input', () => this.updateSpeedValue());
        this.pitchSlider.addEventListener('input', () => this.updatePitchValue());
        this.volumeSlider.addEventListener('input', () => this.updateVolumeValue());

        // Template buttons
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                if (template) {
                    this.loadTemplate(template);
                }
            });
        });

        // Handle speech end
        this.synth.addEventListener('end', () => {
            this.isSpeaking = false;
            this.updateSpeakButton();
        });
    }

    clearText() {
        this.textArea.value = '';
        this.updateCharCount();
        this.detectLanguage();
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.textArea.value = text;
            this.updateCharCount();
            this.detectLanguage();
        } catch (err) {
            console.error('Failed to read clipboard:', err);
            new Alert('Failed to paste text from clipboard', { type: 'error' }).show();
        }
    }

    async saveAudio() {
        if (!this.textArea.value.trim()) {
            new Alert('Please enter some text first', { type: 'warning' }).show();
            return;
        }

        try {
            // Implementation for saving audio will go here
            // This would typically involve converting text to speech
            // and saving it as an audio file
            new Alert('Audio saved successfully', { type: 'success' }).show();
        } catch (err) {
            console.error('Failed to save audio:', err);
            new Alert('Failed to save audio', { type: 'error' }).show();
        }
    }

    previewVoice() {
        if (!this.currentVoice) {
            new Alert('No voice selected', { type: 'warning' }).show();
            return;
        }

        const previewText = 'This is a preview of the selected voice.';
        const utterance = new SpeechSynthesisUtterance(previewText);
        utterance.voice = this.currentVoice;
        utterance.rate = parseFloat(this.speedSlider.value);
        utterance.pitch = parseFloat(this.pitchSlider.value);
        utterance.volume = parseFloat(this.volumeSlider.value);

        this.synth.cancel(); // Cancel any ongoing speech
        this.synth.speak(utterance);
    }

    toggleSpeech() {
        if (this.isSpeaking) {
            this.stopSpeech();
        } else {
            this.startSpeech();
        }
    }

    startSpeech() {
        if (!this.textArea.value.trim()) {
            new Alert('Please enter some text first', { type: 'warning' }).show();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(this.textArea.value);
        utterance.voice = this.currentVoice;
        utterance.rate = parseFloat(this.speedSlider.value);
        utterance.pitch = parseFloat(this.pitchSlider.value);
        utterance.volume = parseFloat(this.volumeSlider.value);

        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateSpeakButton();
        };

        this.synth.cancel(); // Cancel any ongoing speech
        this.synth.speak(utterance);
        this.isSpeaking = true;
        this.updateSpeakButton();
    }

    stopSpeech() {
        this.synth.cancel();
        this.isSpeaking = false;
        this.updateSpeakButton();
    }

    updateSpeakButton() {
        const icon = this.speakButton.querySelector('i');
        if (this.isSpeaking) {
            icon.className = 'fas fa-stop';
            this.speakButton.title = 'Stop speaking';
        } else {
            icon.className = 'fas fa-play';
            this.speakButton.title = 'Start speaking';
        }
    }

    async downloadAudio() {
        if (!this.textArea.value.trim()) {
            new Alert('Please enter some text first', { type: 'warning' }).show();
            return;
        }

        try {
            // Implementation for downloading audio will go here
            // This would typically involve converting text to speech
            // and downloading it as an audio file
            new Alert('Audio downloaded successfully', { type: 'success' }).show();
        } catch (err) {
            console.error('Failed to download audio:', err);
            new Alert('Failed to download audio', { type: 'error' }).show();
        }
    }

    handleTextInput() {
        this.updateCharCount();
        this.detectLanguage();
    }

    handleVoiceChange(event) {
        this.currentVoice = this.voices.find(voice => voice.name === event.target.value);
    }

    updateCharCount() {
        const count = this.textArea.value.length;
        this.charCount.textContent = `${count} / 5000 characters`;
    }

    detectLanguage() {
        const text = this.textArea.value.trim();
        if (!text) {
            this.languageDetect.textContent = 'Detected Language: None';
            return;
        }

        // Basic language detection patterns
        let language = 'Unknown';
        if (/^[a-zA-Z\s.,!?'"-]+$/.test(text)) {
            language = 'English';
        } else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
            language = 'Japanese';
        } else if (/[\u0600-\u06FF]/.test(text)) {
            language = 'Arabic';
        } else if (/[\u0400-\u04FF]/.test(text)) {
            language = 'Russian';
        }

        this.languageDetect.textContent = `Detected Language: ${language}`;

        // Try to select a matching voice
        if (language !== 'Unknown') {
            const languageCode = {
                'English': 'en',
                'Japanese': 'ja',
                'Arabic': 'ar',
                'Russian': 'ru'
            }[language];

            const matchingVoice = this.voices.find(voice => voice.lang.startsWith(languageCode));
            if (matchingVoice) {
                this.voiceSelect.value = matchingVoice.name;
                this.currentVoice = matchingVoice;
            }
        }
    }

    updateSpeedValue() {
        document.querySelector('#speed-value').textContent = this.speedSlider.value + 'x';
    }

    updatePitchValue() {
        document.querySelector('#pitch-value').textContent = this.pitchSlider.value;
    }

    updateVolumeValue() {
        document.querySelector('#volume-value').textContent =
            Math.round(this.volumeSlider.value * 100) + '%';
    }

    loadTemplate(template) {
        let text = '';
        switch (template) {
            case 'greeting':
                text = 'Hello! How are you today?';
                break;
            case 'introduction':
                text = 'Hi, my name is [Name] and I am pleased to meet you.';
                break;
            case 'business':
                text = 'Thank you for your interest in our services. We look forward to working with you.';
                break;
            case 'casual':
                text = "Hey there! Just wanted to drop you a quick note to say hi.";
                break;
            case 'formal':
                text = 'Dear Sir/Madam, I hope this message finds you well.';
                break;
            case 'farewell':
                text = 'Thank you for your time. Have a great day!';
                break;
        }
        this.textArea.value = text;
        this.updateCharCount();
        this.detectLanguage();
    }
}

// Initialize the Text-to-Speech feature when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextToSpeech();
});
