/**
 * Alert Component
 * @module components/alert
 */

import { sanitizeHTML } from '../utils/dom.js';

/**
 * @typedef {Object} AlertOptions
 * @property {string} [type='info'] - Alert type (info, success, warning, error)
 * @property {string} [title] - Alert title
 * @property {boolean} [dismissible=true] - Whether alert can be dismissed
 * @property {boolean} [animate=true] - Whether to animate alert
 * @property {number} [duration] - Auto-dismiss duration in ms (0 for no auto-dismiss)
 * @property {Function} [onClose] - Callback when alert closes
 */

export class Alert {
    /**
     * Create an alert instance
     * @param {string|HTMLElement} message - Alert message
     * @param {AlertOptions} options - Alert configuration options
     */
    constructor(message, options = {}) {
        this.message = message;
        this.options = {
            type: 'info',
            title: '',
            dismissible: true,
            animate: true,
            duration: 0,
            onClose: null,
            ...options
        };

        this.element = null;
        this.closeTimeout = null;
        this.init();
    }

    /**
     * Initialize alert
     * @private
     */
    init() {
        // Create alert element
        this.element = document.createElement('div');
        this.element.className = `alert alert-${this.options.type}`;
        if (this.options.animate) {
            this.element.classList.add('alert-animate');
        }
        this.element.setAttribute('role', 'alert');

        // Create alert content
        this.element.innerHTML = `
            <div class="alert-content">
                ${this.options.title ? `<div class="alert-title">${sanitizeHTML(this.options.title)}</div>` : ''}
                <div class="alert-message"></div>
            </div>
            ${this.options.dismissible ? '<button class="alert-dismiss" aria-label="Close">&times;</button>' : ''}
        `;

        // Set message
        const messageEl = this.element.querySelector('.alert-message');
        if (typeof this.message === 'string') {
            messageEl.innerHTML = sanitizeHTML(this.message);
        } else if (this.message instanceof HTMLElement) {
            messageEl.appendChild(this.message);
        }

        // Add event listeners
        if (this.options.dismissible) {
            this.element.querySelector('.alert-dismiss').addEventListener('click', () => this.close());
        }

        // Set up auto-dismiss
        if (this.options.duration > 0) {
            this.closeTimeout = setTimeout(() => this.close(), this.options.duration);
        }
    }

    /**
     * Show the alert
     * @param {HTMLElement} [container=document.body] - Container to append alert to
     */
    show(container = document.body) {
        container.appendChild(this.element);
    }

    /**
     * Close the alert
     */
    close() {
        clearTimeout(this.closeTimeout);

        if (this.options.animate) {
            this.element.classList.add('alert-closing');
            setTimeout(() => {
                this.destroy();
            }, 300); // Match CSS transition duration
        } else {
            this.destroy();
        }

        if (this.options.onClose) {
            this.options.onClose();
        }
    }

    /**
     * Update alert message
     * @param {string|HTMLElement} message - New message
     */
    setMessage(message) {
        this.message = message;
        const messageEl = this.element.querySelector('.alert-message');
        messageEl.innerHTML = '';

        if (typeof message === 'string') {
            messageEl.innerHTML = sanitizeHTML(message);
        } else if (message instanceof HTMLElement) {
            messageEl.appendChild(message);
        }
    }

    /**
     * Update alert type
     * @param {string} type - New type
     */
    setType(type) {
        this.element.className = this.element.className.replace(/alert-\w+/, `alert-${type}`);
        this.options.type = type;
    }

    /**
     * Destroy alert instance
     * @private
     */
    destroy() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }

    /**
     * Create and show an alert (static method)
     * @param {string|HTMLElement} message - Alert message
     * @param {AlertOptions} options - Alert configuration options
     * @returns {Alert} Alert instance
     */
    static show(message, options = {}) {
        const alert = new Alert(message, options);
        alert.show();
        return alert;
    }
}
