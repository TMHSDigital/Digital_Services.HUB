document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const speakButton = document.getElementById('speak-button');
    let voices = [];
    let synthesis = window.speechSynthesis;

    // Function to populate voice list
    function populateVoiceList() {
        voices = synthesis.getVoices();
        voiceSelect.innerHTML = '';
        
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = index;
            voiceSelect.appendChild(option);
        });
    }

    // Initialize voices
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Speak function
    function speak() {
        if (synthesis.speaking) {
            synthesis.cancel();
        }

        const text = textInput.value.trim();
        if (!text) {
            alert('Please enter some text to speak.');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices[voiceSelect.value];
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Add event handlers
        utterance.onstart = () => {
            speakButton.textContent = 'Stop';
            speakButton.classList.add('speaking');
        };

        utterance.onend = () => {
            speakButton.textContent = 'Speak';
            speakButton.classList.remove('speaking');
        };

        utterance.onerror = (event) => {
            console.error('SpeechSynthesis Error:', event);
            speakButton.textContent = 'Speak';
            speakButton.classList.remove('speaking');
        };

        synthesis.speak(utterance);
    }

    // Event listeners
    speakButton.addEventListener('click', () => {
        if (synthesis.speaking) {
            synthesis.cancel();
            speakButton.textContent = 'Speak';
            speakButton.classList.remove('speaking');
        } else {
            speak();
        }
    });

    // Add keyboard shortcuts
    textInput.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to speak
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            speak();
        }
    });
});
