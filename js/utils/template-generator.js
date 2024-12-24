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
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/components/${tool.id}.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header class="hero">
        <nav id="main-nav" class="nav-container">
            <div class="logo">
                <a href="../index.html">
                    <h1>Digital Services Hub</h1>
                </a>
            </div>
            <div class="theme-toggle">
                <button id="theme-button" aria-label="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </nav>
        <div class="hero-content">
            <h2 class="hero-title">${tool.name}</h2>
            <p class="hero-subtitle">${tool.description}</p>
        </div>
    </header>

    <main class="container">
        <!-- Tool content will be injected here -->
        <div id="${tool.id}-container" class="tool-container">
            <!-- Tool-specific content -->
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
                    <li><a href="about.html">About</a></li>
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

    <script src="../js/features/${tool.id}.js" type="module"></script>
</body>
</html>`;
}

export function generateToolCard(tool) {
    return `
<article class="tool-card" onclick="window.location.href='${tool.path}'">
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
        ${categoryTools.map(tool => generateToolCard(tool)).join('')}
    </div>
</section>`;
}

export function generateToolList() {
    return Object.keys(CATEGORIES)
        .map(category => generateCategorySection(category))
        .join('');
} 