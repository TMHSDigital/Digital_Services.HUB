/**
 * DOM Utilities
 * @module utils/dom
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML string
 */
export function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Create an element with attributes and children
 * @param {string} tag - Element tag name
 * @param {Object} [attrs={}] - Element attributes
 * @param {Array} [children=[]] - Child elements or text
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

/**
 * Add multiple event listeners to an element
 * @param {HTMLElement} element - Target element
 * @param {Object} listeners - Event listeners object
 */
export function addEventListeners(element, listeners) {
    Object.entries(listeners).forEach(([event, callback]) => {
        element.addEventListener(event, callback);
    });
}

/**
 * Remove multiple event listeners from an element
 * @param {HTMLElement} element - Target element
 * @param {Object} listeners - Event listeners object
 */
export function removeEventListeners(element, listeners) {
    Object.entries(listeners).forEach(([event, callback]) => {
        element.removeEventListener(event, callback);
    });
}

/**
 * Check if an element is visible in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element is visible
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
