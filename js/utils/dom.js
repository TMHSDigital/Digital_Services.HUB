/**
 * DOM manipulation and browser utilities
 */

/**
 * Sanitize HTML string to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @param {number} offset - Offset from viewport edges
 * @returns {boolean} Whether element is in viewport
 */
export function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 - offset &&
        rect.left >= 0 - offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

/**
 * Check if device is mobile
 * @returns {boolean} Whether device is mobile
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Get browser language
 * @returns {string} Browser language code
 */
export function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage;
} 