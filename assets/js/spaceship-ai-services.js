// Load models
let objectDetectionModel, faceDetectionModel, sentenceEncoderModel, audioModel;

Promise.all([
    cocoSsd.load(),
    faceDetection.createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector),
    use.load(),
    speechCommands.create('BROWSER_FFT')
]).then(models => {
    [objectDetectionModel, faceDetectionModel, sentenceEncoderModel, audioModel] = models;
    console.log('All AI modules initialized');
    document.querySelectorAll('.ai-button').forEach(btn => btn.classList.add('ready'));
});

// Helper function for animations
function animateResult(element) {
    element.classList.remove('fade-in');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('fade-in');
}

// Image Analysis
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const imageAnalysisResult = document.getElementById('imageAnalysisResult');

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            animateResult(imagePreview);
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

document.getElementById('detectObjects').addEventListener('click', async () => {
    const img = imagePreview.querySelector('img');
    if (!img) return;

    imageAnalysisResult.innerHTML = '<div class="loading">Analyzing... <div class="spinner"></div></div>';
    animateResult(imageAnalysisResult);

    const predictions = await objectDetectionModel.detect(img);
    imageAnalysisResult.innerHTML = predictions.map(pred => 
        `<div class="prediction">${pred.class} (${(pred.score * 100).toFixed(2)}%)</div>`
    ).join('');
    animateResult(imageAnalysisResult);
});

document.getElementById('detectFaces').addEventListener('click', async () => {
    const img = imagePreview.querySelector('img');
    if (!img) return;

    imageAnalysisResult.innerHTML = '<div class="loading">Analyzing... <div class="spinner"></div></div>';
    animateResult(imageAnalysisResult);

    const faces = await faceDetectionModel.estimateFaces(img, false);
    imageAnalysisResult.innerHTML = `<div class="prediction">Detected ${faces.length} face(s)</div>`;
    animateResult(imageAnalysisResult);
});

// NLP
const textInput = document.getElementById('textInput');
const nlpResult = document.getElementById('nlpResult');

document.getElementById('entityRecognition').addEventListener('click', async () => {
    const text = textInput.value;
    if (!text) return;

    nlpResult.innerHTML = '<div class="loading">Analyzing... <div class="spinner"></div></div>';
    animateResult(nlpResult);

    const embeddings = await sentenceEncoderModel.embed(text);
    nlpResult.innerHTML = '<div class="prediction">Embeddings generated. Entity recognition simulation complete.</div>';
    animateResult(nlpResult);
});

document.getElementById('textSummarize').addEventListener('click', () => {
    const text = textInput.value;
    if (!text) return;

    nlpResult.innerHTML = '<div class="loading">Summarizing... <div class="spinner"></div></div>';
    animateResult(nlpResult);

    // This is a placeholder. Real summarization would require a more complex model.
    setTimeout(() => {
        const summary = text.split('.').slice(0, 3).join('.') + '.';
        nlpResult.innerHTML = `<div class="prediction">Summary: ${summary}</div>`;
        animateResult(nlpResult);
    }, 1500);
});

// Audio Processing
const audioUpload = document.getElementById('audioUpload');
const audioResult = document.getElementById('audioResult