const qrInput = document.getElementById('qr-input');
const qrSize = document.getElementById('qr-size');
const qrCorrection = document.getElementById('qr-correction');
const qrColor = document.getElementById('qr-color');
const qrBgColor = document.getElementById('qr-bg-color');
const qrRounded = document.getElementById('qr-rounded');
const generateButton = document.getElementById('generate-button');
const qrOutput = document.getElementById('qr-output');
const downloadLink = document.getElementById('download-link');

let qr = null;

generateButton.addEventListener('click', () => {
    const inputText = qrInput.value;
    if (inputText) {
        qrOutput.innerHTML = '';  // Clear previous QR code
        
        qr = new QRCode(qrOutput, {
            text: inputText,
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            colorDark: qrColor.value,
            colorLight: qrBgColor.value,
            correctLevel: QRCode.CorrectLevel[qrCorrection.value]
        });
        
        // Apply rounded corners if selected
        if (qrRounded.checked) {
            setTimeout(() => {
                const qrImage = qrOutput.querySelector('img');
                qrImage.style.borderRadius = '15px';
            }, 50);
        }
        
        // Enable download after a short delay to ensure QR code is generated
        setTimeout(() => {
            const qrImage = qrOutput.querySelector('img');
            downloadLink.href = qrImage.src;
            downloadLink.download = 'qrcode.png';
            downloadLink.style.display = 'inline-block';
        }, 100);
    }
});

// Update QR code in real-time as options change
[qrSize, qrCorrection, qrColor, qrBgColor, qrRounded].forEach(element => {
    element.addEventListener('change', () => generateButton.click());
});
