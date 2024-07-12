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
});

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
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

document.getElementById('detectObjects').addEventListener('click', async () => {
    const img = imagePreview.querySelector('img');
    if (!img) return;

    imageAnalysisResult.innerHTML = 'Analyzing...';
    const predictions = await objectDetectionModel.detect(img);
    imageAnalysisResult.innerHTML = predictions.map(pred => 
        `<div>${pred.class} (${(pred.score * 100).toFixed(2)}%)</div>`
    ).join('');
});

document.getElementById('detectFaces').addEventListener('click', async () => {
    const img = imagePreview.querySelector('img');
    if (!img) return;

    imageAnalysisResult.innerHTML = 'Analyzing...';
    const faces = await faceDetectionModel.estimateFaces(img, false);
    imageAnalysisResult.innerHTML = `Detected ${faces.length} face(s)`;
});

document.getElementById('removeBackground').addEventListener('click', async () => {
    const img = imagePreview.querySelector('img');
    if (!img) return;

    imageAnalysisResult.innerHTML = 'Processing...';

    const formData = new FormData();
    formData.append('image_file', await fetch(img.src).then(r => r.blob()), 'image.jpg');
    formData.append('size', 'auto');

    try {
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': '{{ site.env.REMOVE_BG_API_KEY }}'
            },
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const resultImage = new Image();
            resultImage.src = url;
            imageAnalysisResult.innerHTML = '';
            imageAnalysisResult.appendChild(resultImage);
        } else {
            const error = await response.json();
            imageAnalysisResult.innerHTML = `Error: ${error.errors[0].title}`;
        }
    } catch (error) {
        imageAnalysisResult.innerHTML = `Error: ${error.message}`;
    }
});

// NLP
const textInput = document.getElementById('textInput');
const nlpResult = document.getElementById('nlpResult');

document.getElementById('entityRecognition').addEventListener('click', async () => {
    const text = textInput.value;
    if (!text) return;

    nlpResult.innerHTML = 'Analyzing...';
    const embeddings = await sentenceEncoderModel.embed(text);
    nlpResult.innerHTML = 'Embeddings generated. Entity recognition would use these for classification.';
});

document.getElementById('textSummarize').addEventListener('click', () => {
    const text = textInput.value;
    if (!text) return;

    nlpResult.innerHTML = 'Summarizing...';
    // This is a placeholder. Real summarization would require a more complex model.
    const summary = text.split('.').slice(0, 3).join('.') + '.';
    nlpResult.innerHTML = `Summary: ${summary}`;
});

document.getElementById('translateText').addEventListener('click', () => {
    const text = textInput.value;
    if (!text) return;

    nlpResult.innerHTML = 'Translating...';
    // Placeholder for translation. Would require integration with a translation API or model.
    nlpResult.innerHTML = 'Translation feature coming soon!';
});

// Audio Processing
const audioUpload = document.getElementById('audioUpload');
const audioResult = document.getElementById('audioResult');

document.getElementById('transcribeAudio').addEventListener('click', () => {
    const file = audioUpload.files[0];
    if (!file) return;

    audioResult.innerHTML = 'Transcribing...';
    // Placeholder for audio transcription. Would require a more complex speech-to-text model.
    audioResult.innerHTML = 'Audio transcription feature coming soon!';
});

document.getElementById('classifyGenre').addEventListener('click', async () => {
    const file = audioUpload.files[0];
    if (!file) return;

    audioResult.innerHTML = 'Analyzing...';
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();
    reader.onload = async (event) => {
        const audioBuffer = await audioContext.decodeAudioData(event.target.result);
        const tensorBuffer = tf.tensor(audioBuffer.getChannelData(0));
        const prediction = audioModel.predict(tensorBuffer);
        const genre = prediction.argMax().dataSync()[0];
        audioResult.innerHTML = `Predicted genre: ${genre}`;
    };
    reader.readAsArrayBuffer(file);
});