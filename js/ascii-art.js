const textInput = document.getElementById('text-input');
const convertButton = document.getElementById('convert-button');
const asciiOutput = document.getElementById('ascii-output');

const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];

function textToAscii(text) {
    return text.split('').map(char => {
        const index = Math.floor(Math.random() * asciiChars.length);
        return asciiChars[index];
    }).join('');
}

convertButton.addEventListener('click', () => {
    const inputText = textInput.value;
    const asciiArt = inputText.split('\n').map(line => textToAscii(line)).join('\n');
    asciiOutput.textContent = asciiArt;
});
