import { TOOLS, TOOL_CATEGORIES } from '../config/tools.js';

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
            </div>
        </div>
    `).join('');

    // Generate tool cards with a slight delay to show loading state
    setTimeout(() => {
        try {
            const toolCards = generateToolCards();
            toolsGrid.innerHTML = toolCards;

            // Add click handlers
            document.querySelectorAll('.tool-card').forEach(card => {
                card.addEventListener('click', () => {
                    const toolId = card.dataset.toolId;
                    if (toolId) {
                        window.location.href = `tools/${toolId}`;
                    }
                });
            });
        } catch (error) {
            console.error('Failed to generate tool cards:', error);
            toolsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load tools. Please try refreshing the page.</p>
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
            const category = TOOL_CATEGORIES[tool.category];
            return `
                <div class="tool-card" data-tool-id="${tool.id}">
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
                            ${tool.features.map(feature => `
                                <span class="tool-feature" title="${feature.description}">
                                    <i class="${feature.icon}"></i>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        })
        .join('');
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
