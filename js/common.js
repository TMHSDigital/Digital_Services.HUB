import { generateToolList } from './utils/template-generator.js';
import { initializeTheme } from './utils/theme.js';

/**
 * Initialize the application
 * @returns {void}
 */
function initializeApp() {
    try {
        // Initialize theme
        initializeTheme();

        // Generate tool listings if on index page
        const toolsContainer = document.getElementById('tools-container');
        if (toolsContainer) {
            toolsContainer.innerHTML = generateToolList();
        }
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
