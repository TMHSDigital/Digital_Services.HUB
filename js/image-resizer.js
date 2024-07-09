let cropper;
const fileInput = document.getElementById('file-input');
const imageContainer = document.getElementById('image-container');
const resizeButton = document.getElementById('resize-button');
const downloadLink = document.getElementById('download-link');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageContainer.innerHTML = `<img src="${e.target.result}" id="image">`;
            const image = document.getElementById('image');
            cropper = new Cropper(image, {
                aspectRatio: NaN,
                viewMode: 1,
            });
        };
        reader.readAsDataURL(file);
    }
});

resizeButton.addEventListener('click', () => {
    if (cropper) {
        resizeButton.disabled = true;
        resizeButton.textContent = 'Processing...';
        
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        const canvas = cropper.getCroppedCanvas({
            width: width,
            height: height
        });
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = 'resized-image.png';
            downloadLink.style.display = 'inline-block';
            resizeButton.disabled = false;
            resizeButton.textContent = 'Resize Image';
        });
    }
});
