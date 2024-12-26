/**
 * Tooltip Component
 * @module components/tooltip
 */

/**
 * @typedef {Object} TooltipOptions
 * @property {string} [position='top'] - Tooltip position (top, right, bottom, left)
 * @property {string} [theme='dark'] - Tooltip theme (dark, light)
 * @property {number} [showDelay=0] - Delay before showing tooltip (ms)
 * @property {number} [hideDelay=0] - Delay before hiding tooltip (ms)
 * @property {boolean} [html=false] - Whether to allow HTML in tooltip content
 */

export class Tooltip {
    /**
     * Create a tooltip instance
     * @param {HTMLElement} element - Element to attach tooltip to
     * @param {string|HTMLElement} content - Tooltip content
     * @param {TooltipOptions} options - Tooltip configuration options
     */
    constructor(element, content, options = {}) {
        this.element = element;
        this.content = content;
        this.options = {
            position: 'top',
            theme: 'dark',
            showDelay: 0,
            hideDelay: 0,
            html: false,
            ...options
        };

        this.tooltip = null;
        this.showTimeout = null;
        this.hideTimeout = null;

        this.init();
    }

    /**
     * Initialize tooltip
     * @private
     */
    init() {
        // Create tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.className = `tooltip tooltip-${this.options.theme}`;
        this.tooltip.setAttribute('role', 'tooltip');

        // Set content
        if (typeof this.content === 'string') {
            if (this.options.html) {
                this.tooltip.innerHTML = this.content;
            } else {
                this.tooltip.textContent = this.content;
            }
        } else if (this.content instanceof HTMLElement) {
            this.tooltip.appendChild(this.content.cloneNode(true));
        }

        // Add event listeners
        this.element.addEventListener('mouseenter', () => this.show());
        this.element.addEventListener('mouseleave', () => this.hide());
        this.element.addEventListener('focus', () => this.show());
        this.element.addEventListener('blur', () => this.hide());

        // Add ARIA attributes
        const id = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
        this.tooltip.id = id;
        this.element.setAttribute('aria-describedby', id);
    }

    /**
     * Show the tooltip
     */
    show() {
        clearTimeout(this.hideTimeout);

        this.showTimeout = setTimeout(() => {
            document.body.appendChild(this.tooltip);
            this.position();
            this.tooltip.classList.add('tooltip-visible');
        }, this.options.showDelay);
    }

    /**
     * Hide the tooltip
     */
    hide() {
        clearTimeout(this.showTimeout);

        this.hideTimeout = setTimeout(() => {
            this.tooltip.classList.remove('tooltip-visible');
            setTimeout(() => {
                if (this.tooltip.parentNode) {
                    this.tooltip.parentNode.removeChild(this.tooltip);
                }
            }, 200); // Match CSS transition duration
        }, this.options.hideDelay);
    }

    /**
     * Position the tooltip
     * @private
     */
    position() {
        const elementRect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let top, left;

        switch (this.options.position) {
            case 'top':
                top = elementRect.top + scrollTop - tooltipRect.height - 10;
                left = elementRect.left + scrollLeft + (elementRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = elementRect.bottom + scrollTop + 10;
                left = elementRect.left + scrollLeft + (elementRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = elementRect.top + scrollTop + (elementRect.height - tooltipRect.height) / 2;
                left = elementRect.left + scrollLeft - tooltipRect.width - 10;
                break;
            case 'right':
                top = elementRect.top + scrollTop + (elementRect.height - tooltipRect.height) / 2;
                left = elementRect.right + scrollLeft + 10;
                break;
        }

        // Keep tooltip within viewport
        const padding = 5;
        top = Math.max(padding, Math.min(top, window.innerHeight + scrollTop - tooltipRect.height - padding));
        left = Math.max(padding, Math.min(left, window.innerWidth + scrollLeft - tooltipRect.width - padding));

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    /**
     * Update tooltip content
     * @param {string|HTMLElement} content - New content
     */
    setContent(content) {
        this.content = content;

        if (typeof content === 'string') {
            if (this.options.html) {
                this.tooltip.innerHTML = content;
            } else {
                this.tooltip.textContent = content;
            }
        } else if (content instanceof HTMLElement) {
            this.tooltip.innerHTML = '';
            this.tooltip.appendChild(content.cloneNode(true));
        }
    }

    /**
     * Update tooltip position
     * @param {string} position - New position
     */
    setPosition(position) {
        this.options.position = position;
        if (this.tooltip.classList.contains('tooltip-visible')) {
            this.position();
        }
    }

    /**
     * Destroy tooltip instance
     */
    destroy() {
        clearTimeout(this.showTimeout);
        clearTimeout(this.hideTimeout);

        this.element.removeAttribute('aria-describedby');
        if (this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }

        this.element = null;
        this.tooltip = null;
    }
}
