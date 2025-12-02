import { BaseTool } from '../utils/base-tool.js';
import { showNotification } from '../utils/ui.js';

export class TextToSpeech extends BaseTool {
    constructor() {
        super('text-to-speech');
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.voices = [];
        this.isPlaying = false;
        this.isPaused = false;
        this.progress = 0;

        // Initialize UI elements
        this.textInput = document.querySelector('#text-input');
        this.voiceSelect = document.querySelector('#voice-select');
        this.rateInput = document.querySelector('#speed-slider');
        this.pitchInput = document.querySelector('#pitch-slider');
        this.volumeInput = document.querySelector('#volume-slider');
        this.playButton = document.querySelector('#speak-btn');
        // Preview is our "pause" equivalent for now based on available buttons, or we hide pause
        // The UI has: Preview, Speak, Download. 
        // BaseTool expects standard controls but we need to map to existing UI
        this.previewButton = document.querySelector('#preview-btn');
        this.downloadButton = document.querySelector('#download-btn');
        
        // Elements not present in current HTML but required by logic:
        // We will create dummy elements or update logic. Updating logic is better.
        this.pauseButton = null; 
        this.stopButton = null;
        this.progressBar = null;
        this.progressText = null;

        // Bind event handlers
        this.handleVoicesChanged = this.handleVoicesChanged.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleBoundaryEvent = this.handleBoundaryEvent.bind(this);
        this.handleEndEvent = this.handleEndEvent.bind(this);
        this.handleErrorEvent = this.handleErrorEvent.bind(this);

        // Initialize voices
        this.initVoices();
        
        // Initialize listeners
        this.init();
    }

    async init() {
        try {
            // Add event listeners
            if (this.playButton) this.playButton.addEventListener('click', this.handlePlay);
            // We don't have a dedicated pause button in the new UI, map preview to pause/resume or speak?
            // The UI has "Speak" and "Preview Voice". 
            // Let's assume Speak is Play.
            
            // this.pauseButton.addEventListener('click', this.handlePause);
            // this.stopButton.addEventListener('click', this.handleStop);
            
            this.synth.addEventListener('voiceschanged', this.handleVoicesChanged);

            // Initialize voices
            await this.loadVoices();

            // Enable controls
            this.enableControls();
        } catch (error) {
            console.error('Failed to initialize Text-to-Speech:', error);
            showNotification('Failed to initialize Text-to-Speech. Please try again.', 'error');
        }
    }

    async loadVoices() {
        return new Promise((resolve) => {
            const voices = this.synth.getVoices();
            if (voices.length > 0) {
                this.voices = voices;
                this.populateVoiceList();
                resolve();
            } else {
                this.synth.addEventListener('voiceschanged', () => {
                    this.voices = this.synth.getVoices();
                    this.populateVoiceList();
                    resolve();
                }, { once: true });
            }
        });
    }

    populateVoiceList() {
        // Clear existing options
        this.voiceSelect.innerHTML = '';

        // Add voices to select element
        this.voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            this.voiceSelect.appendChild(option);
        });

        // Select default voice
        const defaultVoice = this.voices.findIndex(voice => voice.default);
        if (defaultVoice !== -1) {
            this.voiceSelect.value = defaultVoice;
        }
    }

    handleVoicesChanged() {
        this.voices = this.synth.getVoices();
        this.populateVoiceList();
    }

    handlePlay() {
        if (this.isPlaying) return;

        const text = this.textInput.value.trim();
        if (!text) {
            showNotification('Please enter some text to speak.', 'warning');
            return;
        }

        try {
            // Create new utterance
            this.utterance = new SpeechSynthesisUtterance(text);

            // Set voice
            const selectedVoice = this.voices[this.voiceSelect.value];
            if (selectedVoice) {
                this.utterance.voice = selectedVoice;
            }

            // Set speech properties
            this.utterance.rate = parseFloat(this.rateInput.value);
            this.utterance.pitch = parseFloat(this.pitchInput.value);
            this.utterance.volume = parseFloat(this.volumeInput.value);

            // Add event listeners
            this.utterance.onboundary = this.handleBoundaryEvent;
            this.utterance.onend = this.handleEndEvent;
            this.utterance.onerror = this.handleErrorEvent;

            // Start speaking
            this.synth.speak(this.utterance);
            this.isPlaying = true;
            this.isPaused = false;

            // Update UI
            this.updatePlaybackState();
        } catch (error) {
            console.error('Failed to start speech:', error);
            showNotification('Failed to start speech. Please try again.', 'error');
        }
    }

    handlePause() {
        if (!this.isPlaying) return;

        if (this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
        } else {
            this.synth.pause();
            this.isPaused = true;
        }

        this.updatePlaybackState();
    }

    handleStop() {
        if (!this.isPlaying) return;

        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.progress = 0;

        this.updatePlaybackState();
        this.updateProgress();
    }

    handleBoundaryEvent(event) {
        if (event.name === 'word') {
            const text = this.textInput.value;
            const wordCount = text.trim().split(/\s+/).length;
            const currentWord = Math.ceil(event.charIndex / (text.length / wordCount));
            this.progress = (currentWord / wordCount) * 100;
            this.updateProgress();
        }
    }

    handleEndEvent() {
        this.isPlaying = false;
        this.isPaused = false;
        this.progress = 100;

        this.updatePlaybackState();
        this.updateProgress();

        showNotification('Speech completed successfully.', 'success');
    }

    handleErrorEvent(error) {
        console.error('Speech synthesis error:', error);
        showNotification('An error occurred during speech synthesis.', 'error');

        this.isPlaying = false;
        this.isPaused = false;
        this.progress = 0;

        this.updatePlaybackState();
        this.updateProgress();
    }

    updatePlaybackState() {
        if (this.playButton) this.playButton.disabled = this.isPlaying;
        if (this.pauseButton) this.pauseButton.disabled = !this.isPlaying;
        if (this.stopButton) this.stopButton.disabled = !this.isPlaying;

        // Update pause button text
        if (this.pauseButton) {
            this.pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
            this.pauseButton.className = this.isPaused ? 'action-button resume' : 'action-button pause';
        }
    }

    updateProgress() {
        if (this.progressBar) this.progressBar.style.width = `${this.progress}%`;
        if (this.progressText) this.progressText.textContent = `${Math.round(this.progress)}%`;
    }

    enableControls() {
        if (this.textInput) this.textInput.disabled = false;
        if (this.voiceSelect) this.voiceSelect.disabled = false;
        if (this.rateInput) this.rateInput.disabled = false;
        if (this.pitchInput) this.pitchInput.disabled = false;
        if (this.volumeInput) this.volumeInput.disabled = false;
        if (this.playButton) this.playButton.disabled = false;
    }

    destroy() {
        // Remove event listeners
        if (this.playButton) this.playButton.removeEventListener('click', this.handlePlay);
        if (this.pauseButton) this.pauseButton.removeEventListener('click', this.handlePause);
        if (this.stopButton) this.stopButton.removeEventListener('click', this.handleStop);
        this.synth.removeEventListener('voiceschanged', this.handleVoicesChanged);

        // Stop any ongoing speech
        if (this.isPlaying) {
            this.synth.cancel();
        }
    }
}

// Initialize the tool if we're on the text-to-speech page
if (document.querySelector('.tts-container')) {
    new TextToSpeech();
}
