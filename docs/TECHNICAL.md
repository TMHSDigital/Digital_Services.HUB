# Technical Documentation

## Architecture Overview

### Core Components

1. **Tools Manager**
   - Handles tool registration and configuration
   - Manages tool state and lifecycle
   - Provides tool discovery and filtering

2. **Theme System**
   - Manages light/dark theme switching
   - Handles CSS variable customization
   - Provides theme persistence

3. **Storage System**
   - Manages local storage operations
   - Handles data persistence
   - Provides storage cleanup

### Directory Structure

```
js/
├── build/              # Build and validation scripts
│   ├── generate-pages.js
│   └── validate.js
├── components/         # Reusable UI components
│   ├── modal.js
│   └── tooltip.js
├── config/            # Configuration files
│   ├── app.js
│   └── tools.js
├── features/          # Tool implementations
│   └── tools-manager.js
└── utils/            # Utility functions
    ├── dom.js
    ├── format.js
    └── storage.js

css/
├── base/             # Base styles
│   ├── reset.css
│   └── layout.css
├── components/       # Component styles
│   ├── alerts.css
│   ├── buttons.css
│   └── cards.css
├── themes/          # Theme styles
│   └── variables.css
└── utils/          # Utility styles
    ├── animations.css
    └── utilities.css

images/
├── icons/          # Tool and UI icons
├── logos/          # Project logos and branding
├── tools/          # Tool-specific images
├── previews/       # Tool preview images
└── misc/           # Miscellaneous images
```

### Asset Organization

#### Image Guidelines

1. **Format Standards**
   - Icons: SVG preferred, PNG fallback (max 64x64)
   - Logos: SVG and PNG (multiple sizes)
   - Tool Images: WebP with PNG fallback
   - Previews: WebP with JPEG fallback

2. **Naming Conventions**
   - All lowercase with hyphens
   - Include dimensions for raster images
   - Format: `name-WxH.ext`
   - Example: `tool-preview-800x600.webp`

3. **Optimization Requirements**
   - SVGs should be optimized (SVGO)
   - Raster images should be compressed
   - WebP for modern browsers
   - Fallback formats for compatibility

### Tool Configuration

Tools are configured in `js/config/tools.js`:

```javascript
export const TOOLS = [
    {
        id: 'tool-id',
        name: 'Tool Name',
        description: 'Tool description',
        icon: 'fa-icon-name',
        features: ['Feature 1', 'Feature 2'],
        path: './pages/tool-page.html',
        category: TOOL_CATEGORIES.CATEGORY,
        order: 1
    }
];
```

### Theme System

Themes are managed through CSS variables and data attributes:

```css
[data-theme="dark"] {
    --bg-primary: var(--bg-dark);
    --text-primary: var(--text-light);
}

[data-theme="light"] {
    --bg-primary: var(--bg-light);
    --text-primary: var(--text-dark);
}
```

### Storage System

Data persistence is handled through the Storage API:

```javascript
export function setStorageItem(key, value, type = 'local') {
    try {
        const storage = type === 'local' ? localStorage : sessionStorage;
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting ${key}:`, error);
        return false;
    }
}
```

## Build System

### Scripts

- `build:bundle`: Bundles JavaScript using Rollup
- `build:pages`: Generates tool pages
- `validate`: Validates project structure
- `test`: Runs Jest tests
- `lint`: Runs ESLint

### Page Generation

Pages are generated using the template system:

```javascript
async function generatePages() {
    for (const tool of TOOLS) {
        const pageContent = await generateToolPage(tool.id);
        await fs.writeFile(
            path.join('pages', tool.path),
            pageContent,
            'utf-8'
        );
    }
}
```

## Testing

Tests are written using Jest:

```javascript
describe('ToolsManager', () => {
    test('getAllTools returns all tools', () => {
        const tools = ToolsManager.getAllTools();
        expect(Array.isArray(tools)).toBe(true);
        expect(tools.length).toBeGreaterThan(0);
    });
});
```

## Performance Considerations

1. **Code Splitting**
   - Each tool is loaded independently
   - Common utilities are shared
   - CSS is modularized

2. **Caching**
   - Static assets are cached
   - Tool configurations are cached
   - User preferences are persisted

3. **Optimization**
   - Images are optimized
   - CSS is minified
   - JavaScript is bundled and minified

## Security

1. **Input Validation**
   - All user input is sanitized
   - File uploads are validated
   - URLs are checked

2. **Output Encoding**
   - HTML is escaped
   - JSON is validated
   - Files are safely downloaded

3. **Data Protection**
   - No server storage
   - Client-side processing
   - Secure defaults

## Accessibility

1. **ARIA Support**
   - Proper roles
   - State management
   - Focus management

2. **Keyboard Navigation**
   - Focus trapping
   - Shortcut keys
   - Tab order

3. **Screen Readers**
   - Alt text
   - ARIA labels
   - Semantic HTML 