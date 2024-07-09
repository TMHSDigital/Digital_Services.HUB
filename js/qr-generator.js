const qrInput = document.getElementById('qr-input');
const generateButton = document.getElementById('generate-button');
const qrOutput = document.getElementById('qr-output');
const downloadLink = document.getElementById('download-link');

let qr = null;

generateButton.addEventListener('click', () => {
    const inputText = qrInput.value;
    if (inputText) {
        if (qr) {
            qr.clear();
            qr.makeCode(inputText);
        } else {
            qr = new QRCode(qrOutput, {
                text: inputText,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
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
