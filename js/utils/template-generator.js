import { getToolById } from '../features/tools-manager.js';
import { CATEGORIES } from '../config/tools.js';

/**
 * Generate tool page template
 * @param {string} toolId - Tool ID
 * @returns {string} Tool page HTML
 */
export function generateToolPage(toolId) {
    const tool = getToolById(toolId);
    if (!tool) {
        return generateErrorPage('Tool not found');
    }

    const category = CATEGORIES[tool.category];
    return `
        <div class="tool-page">
            <!-- Tool Header -->
            <header class="tool-header" style="--category-color: ${category.color}">
                <div class="tool-header-content">
                    <div class="tool-icon">
                        <i class="${tool.icon}"></i>
                    </div>
                    <h1>${tool.name}</h1>
                    <p class="tool-description">${tool.description}</p>
                    <div class="tool-features">
                        ${tool.features.map(feature => `
                            <span class="feature-tag" title="${feature.description}">
                                <i class="${feature.icon}"></i>
                                ${feature.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </header>

            <!-- Tool Content -->
            <main class="tool-content">
                <div class="tool-container">
                    <!-- Tool Interface -->
                    <div class="tool-interface">
                        <div id="${toolId}-app"></div>
                    </div>

                    <!-- Tool Options -->
                    <aside class="tool-options">
                        <div class="options-card">
                            <h2>Options</h2>
                            <div id="${toolId}-options"></div>
                        </div>
                    </aside>
                </div>

                <!-- Share Section -->
                <section class="share-section">
                    <div class="share-card">
                        <h3>Share this tool</h3>
                        <div class="share-buttons">
                            <button class="share-button twitter" onclick="shareOnTwitter()">
                                <i class="fab fa-twitter"></i>
                                Twitter
                            </button>
                            <button class="share-button facebook" onclick="shareOnFacebook()">
                                <i class="fab fa-facebook"></i>
                                Facebook
                            </button>
                            <button class="share-button reddit" onclick="shareOnReddit()">
                                <i class="fab fa-reddit"></i>
                                Reddit
                            </button>
                            <button class="share-button copy-link" onclick="copyToolLink()">
                                <i class="fas fa-link"></i>
                                Copy Link
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    `;
}

/**
 * Generate error page template
 * @param {string} message - Error message
 * @returns {string} Error page HTML
 */
function generateErrorPage(message) {
    return `
        <div class="error-page">
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <h1>Oops!</h1>
                <p>${message}</p>
                <a href="/" class="back-button">
                    <i class="fas fa-arrow-left"></i>
                    Back to Home
                </a>
            </div>
        </div>
    `;
}

/**
 * Share functions
 */
window.shareOnTwitter = function() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
};

window.shareOnFacebook = function() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

window.shareOnReddit = function() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://reddit.com/submit?url=${url}&title=${title}`, '_blank');
};

window.copyToolLink = function() {
    const button = document.querySelector('.share-button.copy-link');
    navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('success');
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('success');
        }, 2000);
    });
};
