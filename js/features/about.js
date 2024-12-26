import { generateToolList } from '/js/utils/template-generator.js';
import { initializeTheme } from '/js/utils/theme.js';

// Initialize theme
initializeTheme();

// Generate tool listings
const toolsContainer = document.getElementById('tools-container');
if (toolsContainer) {
    toolsContainer.innerHTML = generateToolList();
}
