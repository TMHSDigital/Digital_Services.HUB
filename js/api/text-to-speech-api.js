/**
 * Text-to-Speech API wrapper for the Digital Services Hub
 * Provides a clean interface for using text-to-speech functionality in other applications
 */
export default class TextToSpeechAPI {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.currentVoice = null;
        this.loadVoices();
    }

    /**
     * Load available voices and set up voice change listener
     * @private
     */
    loadVoices() {
        // Load initial voices
        this.voices = this.synth.getVoices();

        // Chrome loads voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.voices = this.synth.getVoices();
            };
        }
    }

    /**
     * Get all available voices
     * @returns {Array} Array of SpeechSynthesisVoice objects
     */
    getVoices() {
        return this.voices;
    }

    /**
     * Get voices for a specific language
     * @param {string} langCode - Language code (e.g., 'en-US', 'es-ES')
     * @returns {Array} Array of voices matching the language code
     */
    getVoicesForLanguage(langCode) {
        return this.voices.filter(voice => voice.lang.startsWith(langCode));
    }

    /**
     * Set the voice to use for speech
     * @param {string|SpeechSynthesisVoice} voice - Voice name or SpeechSynthesisVoice object
     * @returns {boolean} True if voice was set successfully
     */
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

    /**
     * Speak the provided text
     * @param {string} text - Text to speak
     * @param {Object} options - Speech options
     * @param {number} options.rate - Speech rate (0.1 to 10)
     * @param {number} options.pitch - Speech pitch (0 to 2)
     * @param {number} options.volume - Speech volume (0 to 1)
     * @returns {Promise} Resolves when speech is complete, rejects on error
     */
    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!text) {
                reject(new Error('No text provided'));
                return;
            }

            // Stop any current speech
            this.stop();

            const utterance = new SpeechSynthesisUtterance(text);

            // Set voice if one is selected
            if (this.currentVoice) {
                utterance.voice = this.currentVoice;
            }

            // Set options with defaults
            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;

            // Handle events
            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(new Error(event.error));

            // Start speaking
            this.synth.speak(utterance);
        });
    }

    /**
     * Stop any current speech
     */
    stop() {
        this.synth.cancel();
    }

    /**
     * Check if currently speaking
     * @returns {boolean} True if speaking
     */
    isSpeaking() {
        return this.synth.speaking;
    }

    /**
     * Pause speech
     */
    pause() {
        this.synth.pause();
    }

    /**
     * Resume speech
     */
    resume() {
        this.synth.resume();
    }

    /**
     * Get supported languages
     * @returns {Array} Array of unique language codes
     */
    getSupportedLanguages() {
        const languages = new Set();
        this.voices.forEach(voice => {
            languages.add(voice.lang);
        });
        return Array.from(languages);
    }
}

// Usage example:
/*
import TextToSpeechAPI from './text-to-speech-api.js';

const tts = new TextToSpeechAPI();

// Basic usage
tts.speak('Hello, world!');

// Advanced usage
tts.speak('Custom voice and options', {
    rate: 1.2,
    pitch: 1.0,
    volume: 0.8
}).then(() => {
    console.log('Speech completed');
}).catch(error => {
    console.error('Speech error:', error);
});

// Get available voices
const voices = tts.getVoices();

// Get voices for a specific language
const englishVoices = tts.getVoicesForLanguage('en-US');

// Set a specific voice
tts.setVoice('Microsoft David - English (United States)');

// Control playback
tts.pause();
tts.resume();
tts.stop();

// Check status
const isSpeaking = tts.isSpeaking();

// Get supported languages
const languages = tts.getSupportedLanguages();
*/
