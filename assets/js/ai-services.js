// Image Classification
let imageModel;
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const classificationResult = document.getElementById('classificationResult');

// Load MobileNet model
mobilenet.load().then(model => {
    imageModel = model;
    console.log('MobileNet model loaded');
});

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
            classifyImage(img);
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

async function classifyImage(imgElement) {
    if (!imageModel) return;

    const predictions = await imageModel.classify(imgElement);
    classificationResult.innerHTML = `
        <p>Top prediction: ${predictions[0].className} (${(predictions[0].probability * 100).toFixed(2)}% confidence)</p>
    `;
}

// Text Sentiment Analysis
let sentimentModel;
const textInput = document.getElementById('textInput');
const analyzeButton = document.getElementById('analyzeButton');
const sentimentResult = document.getElementById('sentimentResult');

// Load sentiment analysis model
sentiment.load().then(model => {
    sentimentModel = model;
    console.log('Sentiment model loaded');
});

analyzeButton.addEventListener('click', () => {
    analyzeSentiment(textInput.value);
});

async function analyzeSentiment(text) {
    if (!sentimentModel) return;

    const result = await sentimentModel.predict(text);
    const sentiment = result.score > 0.5 ? 'Positive' : (result.score < 0.5 ? 'Negative' : 'Neutral');
    sentimentResult.innerHTML = `
        <p>Sentiment: ${sentiment} (Score: ${result.score.toFixed(2)})</p>
    `;
}
