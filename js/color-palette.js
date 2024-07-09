document.getElementById('image-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const colors = getDominantColors(imageData.data);
                displayColors(colors);
            };
        };
        reader.readAsDataURL(file);
    }
});

function getDominantColors(data) {
    const colorCount = {};
    for (let i = 0; i < data.length; i += 4) {
        const rgb = `${data[i]},${data[i + 1]},${data[i + 2]}`;
        if (colorCount[rgb]) {
            colorCount[rgb]++;
        } else {
            colorCount[rgb] = 1;
        }
    }

    const sortedColors = Object.keys(colorCount).sort((a, b) => colorCount[b] - colorCount[a]);
    return sortedColors.slice(0, 5);
}

function displayColors(colors) {
    const container = document.getElementById('color-palette-container');
    container.innerHTML = '';
    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = `rgb(${color})`;
        container.appendChild(colorBox);
    });
}
