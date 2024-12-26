import { TOOLS, TOOL_CATEGORIES, CATEGORIES, TOOL_STATS } from '../config/tools.js';

/**
 * Tools Manager class to handle tool-related operations
 */
export class ToolsManager {
    /**
     * Get all available tools
     * @returns {Tool[]}
     */
    static getAllTools() {
        return TOOLS;
    }

    /**
     * Get tools by category
     * @param {string} category - Category to filter by
     * @returns {Tool[]}
     */
    static getToolsByCategory(category) {
        return TOOLS.filter(tool => tool.category === category);
    }

    /**
     * Get tool by ID
     * @param {string} id - Tool ID to find
     * @returns {Tool|undefined}
     */
    static getToolById(id) {
        return TOOLS.find(tool => tool.id === id);
    }

    /**
     * Get all available categories with their metadata
     * @returns {Record<string, CategoryInfo>}
     */
    static getCategoriesWithInfo() {
        return CATEGORIES;
    }

    /**
     * Get category information
     * @param {string} category - Category to get info for
     * @returns {CategoryInfo|undefined}
     */
    static getCategoryInfo(category) {
        return CATEGORIES[category];
    }

    /**
     * Get tool statistics
     * @returns {ToolStats}
     */
    static getStats() {
        return TOOL_STATS;
    }

    /**
     * Validate if a category exists
     * @param {string} category - Category to validate
     * @returns {boolean}
     */
    static isValidCategory(category) {
        return Object.values(TOOL_CATEGORIES).includes(category);
    }

    /**
     * Get tools sorted by order
     * @returns {Tool[]}
     */
    static getToolsSortedByOrder() {
        return [...TOOLS].sort((a, b) => a.order - b.order);
    }

    /**
     * Search tools by name or description
     * @param {string} query - Search query
     * @returns {Tool[]}
     */
    static searchTools(query) {
        const lowercaseQuery = query.toLowerCase();
        return TOOLS.filter(tool => 
            tool.name.toLowerCase().includes(lowercaseQuery) ||
            tool.description.toLowerCase().includes(lowercaseQuery)
        );
    }
} 