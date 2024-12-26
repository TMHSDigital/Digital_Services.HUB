# Technical Documentation

## UI Components

### Button Component
```javascript
import { Button } from '../components/button.js';

// Basic usage
const button = new Button({
    text: 'Click me',
    variant: 'primary',
    size: 'md',
    onClick: () => console.log('Clicked!')
});

// Available variants
- primary
- secondary
- success
- warning
- error

// Available sizes
- sm (small)
- md (medium)
- lg (large)
```

### Alert Component
```javascript
import { Alert } from '../components/alert.js';

// Show alert
Alert.show('Operation successful!', {
    type: 'success',
    duration: 3000,
    dismissible: true
});

// Available types
- info
- success
- warning
- error
```

### Modal Component
```javascript
import { Modal } from '../components/modal.js';

const modal = new Modal({
    title: 'Confirmation',
    content: 'Are you sure?',
    closable: true,
    size: 'md',
    onOpen: () => console.log('Modal opened'),
    onClose: () => console.log('Modal closed')
});

modal.open();
```

### Tooltip Component
```javascript
import { Tooltip } from '../components/tooltip.js';

const tooltip = new Tooltip(element, 'Helpful text', {
    position: 'top',
    theme: 'dark',
    showDelay: 200,
    hideDelay: 200
});
```

### Progress Component
```css
/* Basic progress bar */
<div class="progress">
    <div class="progress-bar" style="width: 50%"></div>
</div>

/* With label */
<div class="progress-labeled">
    <div class="progress-label">
        <span>Progress</span>
        <span>50%</span>
    </div>
    <div class="progress">
        <div class="progress-bar" style="width: 50%"></div>
    </div>
</div>
```

### Form Components
```html
<!-- Input with label -->
<div class="form-group">
    <label class="form-label" for="name">Name</label>
    <input type="text" id="name" class="form-input">
</div>

<!-- Select -->
<div class="form-group">
    <label class="form-label" for="option">Select Option</label>
    <select id="option" class="form-select">
        <option>Option 1</option>
        <option>Option 2</option>
    </select>
</div>

<!-- Checkbox -->
<label class="form-check">
    <input type="checkbox" class="form-checkbox">
    <span>Remember me</span>
</label>
```

## Theme System

### Theme Variables
```css
:root {
    /* Colors */
    --primary-color: #3b82f6;
    --success-color: #22c55e;
    --warning-color: #f59e0b;
    --error-color: #ef4444;

    /* Typography */
    --font-family: 'Roboto', sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;

    /* Spacing */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
}
```

### Theme Switching
```javascript
import { setTheme, getTheme } from '../utils/theme.js';

// Switch theme
setTheme('dark');

// Get current theme
const currentTheme = getTheme(); // 'light' | 'dark' | 'system'

// Listen for theme changes
addThemeObserver((theme) => {
    console.log(`Theme changed to: ${theme}`);
});
```

## Utility Functions

### DOM Utilities
```javascript
import { createElement, addEventListeners } from '../utils/dom.js';

// Create element with attributes and children
const button = createElement('button', {
    className: 'btn btn-primary',
    onClick: () => console.log('Clicked!')
}, ['Click me']);

// Add multiple event listeners
addEventListeners(element, {
    click: () => console.log('Clicked'),
    mouseenter: () => console.log('Mouse entered'),
    mouseleave: () => console.log('Mouse left')
});
```

### Storage Utilities
```javascript
import { setStorageItem, getStorageItem } from '../utils/storage.js';

// Save data
setStorageItem('user-preferences', { theme: 'dark' });

// Get data
const preferences = getStorageItem('user-preferences');
```

### Format Utilities
```javascript
import { formatFileSize, formatDate } from '../utils/format.js';

// Format file size
const size = formatFileSize(1024); // '1 KB'

// Format date
const date = formatDate(new Date(), {
    dateStyle: 'full',
    timeStyle: 'short'
});
```

## Base Tool Class

All tools extend the `BaseTool` class which provides common functionality:

```javascript
import { BaseTool } from './base-tool.js';

class MyTool extends BaseTool {
    constructor() {
        super();
        this.elements = this.initializeElements();
        this.state = this.initializeState();
        this.initialize();
        this.bindEvents();
    }

    // Required methods
    initializeElements() {
        return {
            // DOM elements
        };
    }

    initializeState() {
        return {
            // Initial state
        };
    }

    bindEvents() {
        // Bind event listeners
    }

    initialize() {
        // Initialize tool
    }
}
```

## Build System

### Commands
```bash
# Development
npm run dev       # Start development server
npm run build     # Build for production
npm run test      # Run tests
npm run lint      # Lint code
npm run validate  # Validate project structure
```

### Build Configuration
```javascript
// rollup.config.js
export default {
    input: 'js/utils/app.js',
    output: {
        file: 'dist/bundle.js',
        format: 'es',
        sourcemap: true
    },
    plugins: [
        nodeResolve(),
        terser({
            format: {
                comments: false
            }
        })
    ]
};
```

## Testing

### Component Testing
```javascript
import { Modal } from '../components/modal.js';

describe('Modal', () => {
    test('opens and closes correctly', () => {
        const modal = new Modal({
            title: 'Test',
            content: 'Content'
        });

        modal.open();
        expect(modal.isOpen).toBe(true);

        modal.close();
        expect(modal.isOpen).toBe(false);
    });
});
```

### Tool Testing
```javascript
import { TextToSpeech } from '../features/text-to-speech.js';

describe('TextToSpeech', () => {
    test('initializes correctly', () => {
        const tts = new TextToSpeech();
        expect(tts.isInitialized).toBe(true);
        expect(tts.elements.textInput).toBeDefined();
    });
});
