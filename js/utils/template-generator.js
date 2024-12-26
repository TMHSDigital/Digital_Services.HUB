import { TOOLS, CATEGORIES } from '../config/tools.js';

export function generateToolPage(toolId) {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) throw new Error(`Tool with id ${toolId} not found`);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tool.name} - Digital Services Hub</title>
    <meta name="description" content="${tool.description}">

    <!-- Base and Theme styles -->
    <link rel="stylesheet" href="../css/base/reset.css">
    <link rel="stylesheet" href="../css/base/layout.css">
    <link rel="stylesheet" href="../css/themes/variables.css">

    <!-- Common UI Components -->
    <link rel="stylesheet" href="../css/components/ui.css">

    <!-- Utility styles -->
    <link rel="stylesheet" href="../css/utils/utilities.css">
    <link rel="stylesheet" href="../css/utils/animations.css">

    <!-- Component styles -->
    <link rel="stylesheet" href="../css/components/alerts.css">
    <link rel="stylesheet" href="../css/components/cards.css">

    <!-- Tool-specific styles -->
    <link rel="stylesheet" href="../css/components/${tool.id}.css">

    <!-- Main styles -->
    <link rel="stylesheet" href="../css/styles.css">

    <!-- External fonts and icons -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav id="main-nav" class="nav-container">
        <div class="logo">
            <a href="../index.html">
                <h1>Digital Services Hub</h1>
            </a>
        </div>
        <div class="nav-links">
            <a href="../index.html#tools" class="nav-link">Tools</a>
            <a href="../index.html#features" class="nav-link">Features</a>
            <a href="../index.html#about" class="nav-link">About</a>
            <a href="https://github.com/TMHDigital/Digital_Services.HUB" class="nav-link" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i>
            </a>
        </div>
        <div class="theme-toggle">
            <button id="theme-button" aria-label="Toggle theme">
                <i class="fas fa-moon"></i>
            </button>
        </div>
    </nav>

    <!-- Tool Content -->
    <main class="container">
        <div class="tool-header">
            <h1>${tool.name}</h1>
            <p class="tool-description">${tool.description}</p>
        </div>
        <div id="${tool.id}-container" class="tool-container">
            <!-- Tool-specific content will be injected here -->
        </div>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h4>Digital Services Hub</h4>
                <p>Free web-based tools for everyday digital tasks.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="../index.html#tools">Tools</a></li>
                    <li><a href="../index.html#features">Features</a></li>
                    <li><a href="../index.html#about">About</a></li>
                    <li><a href="https://github.com/TMHDigital/Digital_Services.HUB">GitHub</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Use</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Digital Services Hub. All rights reserved.</p>
        </div>
    </footer>

    <!-- Load scripts -->
    <script src="../js/utils/app.js" type="module"></script>
    <script src="../js/features/${tool.id}.js" type="module"></script>
</body>
</html>`;
}

export function generateToolCard(tool, index) {
    return `
<article class="tool-card" onclick="window.location.href='${tool.path}'" style="--animation-order: ${index}">
    <div class="tool-icon">
        <i class="fas ${tool.icon}"></i>
    </div>
    <h3>${tool.name}</h3>
    <p>${tool.description}</p>
    <div class="tool-features">
        ${tool.features.map(feature => `<span>${feature}</span>`).join('')}
    </div>
</article>`;
}

export function generateCategorySection(category) {
    const categoryTools = TOOLS.filter(tool => tool.category === category);
    const categoryInfo = CATEGORIES[category];

    return `
<section class="category-section" id="${category}-tools">
    <div class="category-header">
        <i class="fas ${categoryInfo.icon}"></i>
        <h2>${categoryInfo.name}</h2>
        <p>${categoryInfo.description}</p>
    </div>
    <div class="tools-grid">
        ${categoryTools.map((tool, index) => generateToolCard(tool, index)).join('')}
    </div>
</section>`;
}

export function generateToolList() {
    return Object.keys(CATEGORIES)
        .map(category => generateCategorySection(category))
        .join('');
}

export function generateSocialShare(url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return `
<div class="social-share">
    <h3>Share</h3>
    <div class="share-buttons">
        <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}"
           target="_blank"
           rel="noopener noreferrer"
           class="share-button twitter"
           aria-label="Share on Twitter">
            <i class="fab fa-twitter"></i>
            Twitter
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}"
           target="_blank"
           rel="noopener noreferrer"
           class="share-button facebook"
           aria-label="Share on Facebook">
            <i class="fab fa-facebook"></i>
            Facebook
        </a>
        <a href="https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}"
           target="_blank"
           rel="noopener noreferrer"
           class="share-button reddit"
           aria-label="Share on Reddit">
            <i class="fab fa-reddit"></i>
            Reddit
        </a>
        <button class="share-button copy-link"
                data-url="${url}"
                aria-label="Copy link to clipboard">
            <i class="fas fa-link"></i>
            Copy Link
        </button>
    </div>
</div>`;
}
