import { TOOLS, TOOL_CATEGORIES, CATEGORIES } from '../config/tools.js';

/**
 * Initialize the tools grid
 */
export function initializeTools() {
    const toolsGrid = document.getElementById('tools-grid');
    if (!toolsGrid) return;

    // Add loading state
    toolsGrid.innerHTML = Array(6).fill(0).map(() => `
        <div class="tool-card loading">
            <div class="tool-icon"></div>
            <div class="tool-content">
                <div class="tool-title"></div>
                <div class="tool-description"></div>
                <div class="tool-features"></div>
            </div>
        </div>
    `).join('');

    // Generate tool cards with a slight delay to show loading state
    setTimeout(() => {
        try {
            const toolCards = generateToolCards();
            toolsGrid.innerHTML = toolCards;

            // Add click handlers and animations
            document.querySelectorAll('.tool-card').forEach((card, index) => {
                // Add animation delay
                card.style.animationDelay = `${index * 0.1}s`;

                // Add click handler
                card.addEventListener('click', () => {
                    const toolId = card.dataset.toolId;
                    if (toolId) {
                        navigateToTool(toolId);
                    }
                });

                // Add hover effects for features
                card.querySelectorAll('.tool-feature').forEach(feature => {
                    const tooltip = feature.querySelector('.feature-tooltip');
                    if (tooltip) {
                        feature.addEventListener('mouseenter', () => {
                            tooltip.style.opacity = '1';
                            tooltip.style.transform = 'translateY(0)';
                        });
                        feature.addEventListener('mouseleave', () => {
                            tooltip.style.opacity = '0';
                            tooltip.style.transform = 'translateY(5px)';
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Failed to generate tool cards:', error);
            toolsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load tools. Please try refreshing the page.</p>
                    <button onclick="window.location.reload()" class="retry-button">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }, 500);
}

/**
 * Generate HTML for tool cards
 */
function generateToolCards() {
    return TOOLS.sort((a, b) => a.order - b.order)
        .map(tool => {
            const category = CATEGORIES[tool.category];
            const categoryStyle = `style="--category-color: ${category.color}"`;

            return `
                <div class="tool-card" data-tool-id="${tool.id}" ${categoryStyle}>
                    <div class="tool-icon">
                        <i class="${tool.icon}"></i>
                    </div>
                    <div class="tool-content">
                        <h3 class="tool-title">${tool.name}</h3>
                        <p class="tool-description">${tool.description}</p>
                        <div class="tool-meta">
                            <span class="tool-category">
                                <i class="${category.icon}"></i>
                                ${category.name}
                            </span>
                            <div class="tool-features">
                                ${tool.features.map(feature => `
                                    <span class="tool-feature" title="${feature.name}">
                                        <i class="${feature.icon}"></i>
                                        <div class="feature-tooltip">
                                            <strong>${feature.name}</strong>
                                            <p>${feature.description}</p>
                                        </div>
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');
}

/**
 * Navigate to a tool page
 * @param {string} toolId - Tool ID to navigate to
 */
function navigateToTool(toolId) {
    const tool = getToolById(toolId);
    if (tool) {
        // For GitHub Pages, we need to handle the full URL
        const isGitHubPages = window.location.hostname.includes('github.io');
        const baseUrl = isGitHubPages ? '/Digital_Services.HUB' : '';
        const fullPath = `${baseUrl}/${tool.path}`;
        window.location.href = fullPath;
    }
}

/**
 * Get a tool by its ID
 * @param {string} id - Tool ID
 * @returns {Object|null} Tool object or null if not found
 */
export function getToolById(id) {
    return TOOLS.find(tool => tool.id === id) || null;
}

/**
 * Get tools by category
 * @param {string} category - Category ID
 * @returns {Array} Array of tools in the category
 */
export function getToolsByCategory(category) {
    return TOOLS.filter(tool => tool.category === category);
}

/**
 * Get all available tools
 * @returns {Array} Array of all tools
 */
export function getAllTools() {
    return TOOLS;
}
