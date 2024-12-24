import { TOOLS, CATEGORIES } from '../js/config/tools.js';
import fs from 'fs/promises';
import path from 'path';

async function validateProject() {
    const errors = [];
    const warnings = [];

    try {
        // Validate tool configuration
        validateToolConfig(errors, warnings);

        // Validate file structure
        await validateFileStructure(errors, warnings);

        // Validate HTML files
        await validateHtmlFiles(errors, warnings);

        // Validate JavaScript files
        await validateJavaScriptFiles(errors, warnings);

        // Validate CSS files
        await validateCssFiles(errors, warnings);

        // Report results
        if (errors.length > 0) {
            console.error('\nValidation Errors:');
            errors.forEach(error => console.error(`❌ ${error}`));
        }

        if (warnings.length > 0) {
            console.warn('\nValidation Warnings:');
            warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
        }

        if (errors.length === 0 && warnings.length === 0) {
            console.log('✅ Validation passed successfully!');
            return true;
        }

        if (errors.length > 0) {
            process.exit(1);
        }

        return warnings.length === 0;
    } catch (error) {
        console.error('Validation failed:', error);
        process.exit(1);
    }
}

function validateToolConfig(errors, warnings) {
    // Check for duplicate IDs
    const ids = TOOLS.map(tool => tool.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        errors.push(`Duplicate tool IDs found: ${duplicateIds.join(', ')}`);
    }

    // Check for valid categories
    TOOLS.forEach(tool => {
        if (!CATEGORIES[tool.category]) {
            errors.push(`Invalid category '${tool.category}' for tool '${tool.id}'`);
        }
    });

    // Check for required fields
    TOOLS.forEach(tool => {
        ['id', 'name', 'description', 'icon', 'features', 'path', 'category', 'order'].forEach(field => {
            if (!tool[field]) {
                errors.push(`Missing required field '${field}' in tool '${tool.id}'`);
            }
        });
    });

    // Check for unique order values
    const orders = TOOLS.map(tool => tool.order);
    const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
    if (duplicateOrders.length > 0) {
        errors.push(`Duplicate order values found: ${duplicateOrders.join(', ')}`);
    }
}

async function validateFileStructure(errors, warnings) {
    const requiredDirs = [
        'pages',
        'js',
        'js/features',
        'js/utils',
        'js/config',
        'css',
        'css/components',
        'css/utils',
        'css/themes'
    ];

    for (const dir of requiredDirs) {
        try {
            await fs.access(dir);
        } catch {
            errors.push(`Missing required directory: ${dir}`);
        }
    }

    // Check for required base files
    const requiredFiles = [
        'index.html',
        'js/common.js',
        'css/styles.css',
        'js/utils/helpers.js',
        'js/utils/validation.js',
        'js/utils/ui.js'
    ];

    for (const file of requiredFiles) {
        try {
            await fs.access(file);
        } catch {
            errors.push(`Missing required file: ${file}`);
        }
    }
}

async function validateHtmlFiles(errors, warnings) {
    // Check each tool's HTML file
    for (const tool of TOOLS) {
        const htmlPath = path.join('pages', tool.path);
        try {
            const content = await fs.readFile(htmlPath, 'utf-8');

            // Check for required meta tags
            if (!content.includes('<meta name="description"')) {
                warnings.push(`Missing meta description in ${tool.path}`);
            }

            // Check for required CSS links
            if (!content.includes(`href="../css/components/${tool.id}.css"`)) {
                errors.push(`Missing tool-specific CSS link in ${tool.path}`);
            }

            // Check for required JS imports
            if (!content.includes(`src="../js/features/${tool.id}.js"`)) {
                errors.push(`Missing tool-specific JS import in ${tool.path}`);
            }

            // Check for accessibility attributes
            if (!content.includes('aria-label')) {
                warnings.push(`No ARIA labels found in ${tool.path}`);
            }
        } catch (error) {
            errors.push(`Failed to validate HTML file ${tool.path}: ${error.message}`);
        }
    }
}

async function validateJavaScriptFiles(errors, warnings) {
    // Check each tool's JS file
    for (const tool of TOOLS) {
        const jsPath = path.join('js', 'features', `${tool.id}.js`);
        try {
            const content = await fs.readFile(jsPath, 'utf-8');

            // Check for class extension
            if (!content.includes('extends BaseTool')) {
                errors.push(`Tool class in ${jsPath} must extend BaseTool`);
            }

            // Check for required methods
            ['initializeElements', 'setupEventListeners'].forEach(method => {
                if (!content.includes(method)) {
                    errors.push(`Missing required method '${method}' in ${jsPath}`);
                }
            });

            // Check for proper initialization
            const className = tool.id.split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('');
            if (!content.includes(`new ${className}()`)) {
                errors.push(`Missing tool initialization in ${jsPath}`);
            }
        } catch (error) {
            errors.push(`Failed to validate JS file ${jsPath}: ${error.message}`);
        }
    }
}

async function validateCssFiles(errors, warnings) {
    // Check each tool's CSS file
    for (const tool of TOOLS) {
        const cssPath = path.join('css', 'components', `${tool.id}.css`);
        try {
            const content = await fs.readFile(cssPath, 'utf-8');

            // Check for responsive design
            if (!content.includes('@media')) {
                warnings.push(`No media queries found in ${cssPath}`);
            }

            // Check for CSS variables usage
            if (!content.includes('var(--')) {
                warnings.push(`No CSS variables used in ${cssPath}`);
            }

            // Check for proper naming convention
            const mainClass = `.${tool.id}`;
            if (!content.includes(mainClass)) {
                warnings.push(`Missing main tool class '${mainClass}' in ${cssPath}`);
            }
        } catch (error) {
            errors.push(`Failed to validate CSS file ${cssPath}: ${error.message}`);
        }
    }
}

// Run validation
validateProject(); 