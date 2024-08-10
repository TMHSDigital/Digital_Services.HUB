// Initialize speech synthesis
const synth = window.speechSynthesis;

// Get DOM elements
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const speakButton = document.getElementById('speak-button');

// Populate voice list
function populateVoiceList() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach((voice, i) => {
        const option = new Option(voice.name, i);
        voiceSelect.options.add(option);
    });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Speak function
function speak() {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (textInput.value !== '') {
        const utterThis = new SpeechSynthesisUtterance(textInput.value);
        utterThis.voice = voices[voiceSelect.selectedIndex];
        synth.speak(utterThis);
    }
}

// Event listener
speakButton.addEventListener('click', speak);
