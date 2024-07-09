const fileInput = document.getElementById('file-input');
const imageContainer = document.getElementById('image-container');
const paletteContainer = document.getElementById('palette-container');
const generateButton = document.getElementById('generate-button');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageContainer.innerHTML = `<img src="${e.target.result}" id="image" class="max-w-full">`;
        };
        reader.readAsDataURL(file);
    }
});

generateButton.addEventListener('click', () => {
    const image = document.getElementById('image');
    if (image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorMap = {};

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const rgb = `rgb(${r},${g},${b})`;
            colorMap[rgb] = (colorMap[rgb] || 0) + 1;
        }

        const sortedColors = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
        const topColors = sortedColors.slice(0, 5);

        paletteContainer.innerHTML = topColors.map(([color, count]) => `
            <div class="color-item">
                <div class="color-swatch" style="background-color: ${color};"></div>
                <div class="color-info">${color}</div>
            </div>
        `).join('');
    }
});
