import { ToolsManager } from '../tools-manager.js';
import { TOOL_CATEGORIES } from '../../config/tools.js';

describe('ToolsManager', () => {
    test('getAllTools returns all tools', () => {
        const tools = ToolsManager.getAllTools();
        expect(Array.isArray(tools)).toBe(true);
        expect(tools.length).toBeGreaterThan(0);
    });

    test('getToolsByCategory returns correct tools', () => {
        const imageTools = ToolsManager.getToolsByCategory(TOOL_CATEGORIES.IMAGE);
        expect(Array.isArray(imageTools)).toBe(true);
        imageTools.forEach(tool => {
            expect(tool.category).toBe(TOOL_CATEGORIES.IMAGE);
        });
    });

    test('getToolById returns correct tool', () => {
        const tool = ToolsManager.getToolById('image-resizer');
        expect(tool).toBeDefined();
        expect(tool.id).toBe('image-resizer');
    });

    test('getCategoryInfo returns correct info', () => {
        const info = ToolsManager.getCategoryInfo(TOOL_CATEGORIES.IMAGE);
        expect(info).toBeDefined();
        expect(info.name).toBe('Image Tools');
    });

    test('isValidCategory validates categories correctly', () => {
        expect(ToolsManager.isValidCategory(TOOL_CATEGORIES.IMAGE)).toBe(true);
        expect(ToolsManager.isValidCategory('invalid-category')).toBe(false);
    });

    test('getToolsSortedByOrder returns sorted tools', () => {
        const tools = ToolsManager.getToolsSortedByOrder();
        for (let i = 1; i < tools.length; i++) {
            expect(tools[i].order).toBeGreaterThanOrEqual(tools[i-1].order);
        }
    });

    test('searchTools finds tools by name and description', () => {
        const results = ToolsManager.searchTools('image');
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
        results.forEach(tool => {
            const matchesName = tool.name.toLowerCase().includes('image');
            const matchesDesc = tool.description.toLowerCase().includes('image');
            expect(matchesName || matchesDesc).toBe(true);
        });
    });
}); 