# API Documentation

## Core APIs

### ToolsManager

The `ToolsManager` class provides methods for managing and interacting with tools.

```typescript
interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
    path: string;
    category: string;
    order: number;
}

class ToolsManager {
    static getAllTools(): Tool[];
    static getToolsByCategory(category: string): Tool[];
    static getToolById(id: string): Tool | undefined;
    static getCategoriesWithInfo(): Record<string, CategoryInfo>;
    static getCategoryInfo(category: string): CategoryInfo | undefined;
    static getStats(): ToolStats;
    static isValidCategory(category: string): boolean;
    static getToolsSortedByOrder(): Tool[];
    static searchTools(query: string): Tool[];
}
```

### Storage Utilities

The storage utilities provide a consistent interface for data persistence.

```typescript
interface StorageOptions {
    type?: 'local' | 'session';
}

function isStorageAvailable(type: string): boolean;
function getStorageItem<T>(key: string, type?: 'local' | 'session'): T | null;
function setStorageItem(key: string, value: any, type?: 'local' | 'session'): boolean;
function removeStorageItem(key: string, type?: 'local' | 'session'): boolean;
function clearStorage(type?: 'local' | 'session'): boolean;
```

### DOM Utilities

Utilities for DOM manipulation and browser interactions.

```typescript
function sanitizeHTML(html: string): string;
function isInViewport(element: Element, offset?: number): boolean;
function copyToClipboard(text: string): Promise<void>;
function isMobile(): boolean;
function getBrowserLanguage(): string;
```

### Format Utilities

Utilities for data formatting and conversion.

```typescript
interface DateFormatOptions extends Intl.DateTimeFormatOptions {}

function formatDate(date: Date | string | number, options?: DateFormatOptions): string;
function formatRelativeTime(date: Date | string | number): string;
function formatFileSize(bytes: number): string;
function getFileExtension(filename: string): string;
function rgbToHex(r: number, g: number, b: number): string;
function hexToRgb(hex: string): { r: number; g: number; b: number } | null;
function isLightColor(color: string): boolean;
```

## Component APIs

### Card Component

The card component provides a flexible container for content.

```typescript
interface CardProps {
    variant?: 'default' | 'hover' | 'interactive' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    theme?: 'primary' | 'secondary';
    className?: string;
}

// Usage example:
<div class="card card-hover card-lg card-primary">
    <div class="card-header">...</div>
    <div class="card-content">...</div>
    <div class="card-footer">...</div>
</div>
```

### Alert Component

The alert component provides feedback messages.

```typescript
interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    dismissible?: boolean;
    animate?: boolean;
}

// Usage example:
<div class="alert alert-success alert-dismissible alert-animate">
    <div class="alert-icon">...</div>
    <div class="alert-content">
        <div class="alert-title">...</div>
        <div class="alert-message">...</div>
    </div>
    <button class="alert-dismiss">...</button>
</div>
```

## Configuration

### Theme Configuration

Theme variables and customization options.

```typescript
interface ThemeConfig {
    colors: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    radius: {
        sm: string;
        md: string;
        lg: string;
        full: string;
    };
}

// Usage example:
const theme: ThemeConfig = {
    colors: {
        primary: '#00ffff',
        secondary: '#ff00de',
        // ...
    },
    // ...
};
```

### Tool Configuration

Configuration options for tools.

```typescript
interface ToolConfig {
    id: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
    path: string;
    category: keyof typeof TOOL_CATEGORIES;
    order: number;
}

// Usage example:
const toolConfig: ToolConfig = {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to natural-sounding speech',
    icon: 'fa-volume-up',
    features: ['Multiple voices', 'Download audio'],
    path: './pages/text-to-speech.html',
    category: TOOL_CATEGORIES.AUDIO,
    order: 1
};
```

## Events

### Custom Events

The application uses custom events for communication.

```typescript
interface ToolEvent extends CustomEvent {
    detail: {
        toolId: string;
        action: 'load' | 'unload' | 'update';
        data?: any;
    };
}

// Dispatch event
window.dispatchEvent(new CustomEvent('tool:load', {
    detail: {
        toolId: 'text-to-speech',
        action: 'load'
    }
}));

// Listen for event
window.addEventListener('tool:load', (event: ToolEvent) => {
    const { toolId, action } = event.detail;
    // Handle event
});
```

## Error Handling

Standard error types and handling patterns.

```typescript
interface ToolError extends Error {
    code: string;
    toolId?: string;
    data?: any;
}

class ValidationError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Usage example:
try {
    // Tool operation
} catch (error) {
    if (error instanceof ValidationError) {
        // Handle validation error
    } else {
        // Handle other errors
    }
}
``` 