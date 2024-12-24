import { generateToolList } from './utils/template-generator.js';
import { initializeTheme } from './utils/theme.js';

// Initialize theme
initializeTheme();

// Generate tool listings if on index page
const toolsContainer = document.getElementById('tools-container');
if (toolsContainer) {
    toolsContainer.innerHTML = generateToolList();
}
