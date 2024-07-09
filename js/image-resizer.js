document.getElementById('resize-button').addEventListener('click', () => {
    const imageInput = document.getElementById('image-input');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const imagePreview = document.getElementById('image-preview');
    const downloadLink = document.getElementById('download-link');

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = widthInput.value;
                canvas.height = heightInput.value;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const resizedImageUrl = canvas.toDataURL('image/png');
                imagePreview.src = resizedImageUrl;
                downloadLink.href = resizedImageUrl;
                downloadLink.download = 'resized-image.png';
                downloadLink.classList.remove('hidden');
            };
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
});
