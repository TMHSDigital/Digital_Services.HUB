/**
 * Modal Component
 * @module components/modal
 */

import { sanitizeHTML } from '../utils/dom.js';

/**
 * @typedef {Object} ModalOptions
 * @property {string} [title] - Modal title
 * @property {string|HTMLElement} [content] - Modal content
 * @property {boolean} [closable=true] - Whether modal can be closed
 * @property {string} [size='md'] - Modal size (sm, md, lg)
 * @property {Function} [onOpen] - Callback when modal opens
 * @property {Function} [onClose] - Callback when modal closes
 */

export class Modal {
    /**
     * Create a modal instance
     * @param {ModalOptions} options - Modal configuration options
     */
    constructor(options = {}) {
        this.options = {
            title: '',
            content: '',
            closable: true,
            size: 'md',
            onOpen: null,
            onClose: null,
            ...options
        };

        this.isOpen = false;
        this.element = null;
        this.init();
    }

    /**
     * Initialize modal
     * @private
     */
    init() {
        // Create modal element
        this.element = document.createElement('div');
        this.element.className = `modal modal-${this.options.size}`;
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');

        // Create modal content
        this.element.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">${sanitizeHTML(this.options.title)}</h2>
                    ${this.options.closable ? '<button class="modal-close" aria-label="Close">&times;</button>' : ''}
                </div>
                <div class="modal-content"></div>
            </div>
        `;

        // Set content
        const contentEl = this.element.querySelector('.modal-content');
        if (typeof this.options.content === 'string') {
            contentEl.innerHTML = sanitizeHTML(this.options.content);
        } else if (this.options.content instanceof HTMLElement) {
            contentEl.appendChild(this.options.content);
        }

        // Add event listeners
        if (this.options.closable) {
            this.element.querySelector('.modal-close').addEventListener('click', () => this.close());
            this.element.querySelector('.modal-backdrop').addEventListener('click', () => this.close());
        }

        // Handle keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.options.closable && this.isOpen) {
                this.close();
            }
        });

        // Trap focus within modal when open
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isOpen) {
                const focusable = this.element.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    /**
     * Open the modal
     */
    open() {
        if (this.isOpen) return;

        document.body.appendChild(this.element);
        this.isOpen = true;
        document.body.style.overflow = 'hidden';

        // Focus first focusable element
        const focusable = this.element.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) focusable.focus();

        if (this.options.onOpen) this.options.onOpen();
    }

    /**
     * Close the modal
     */
    close() {
        if (!this.isOpen) return;

        this.element.remove();
        this.isOpen = false;
        document.body.style.overflow = '';

        if (this.options.onClose) this.options.onClose();
    }

    /**
     * Update modal content
     * @param {string|HTMLElement} content - New content
     */
    setContent(content) {
        const contentEl = this.element.querySelector('.modal-content');
        contentEl.innerHTML = '';

        if (typeof content === 'string') {
            contentEl.innerHTML = sanitizeHTML(content);
        } else if (content instanceof HTMLElement) {
            contentEl.appendChild(content);
        }
    }

    /**
     * Update modal title
     * @param {string} title - New title
     */
    setTitle(title) {
        const titleEl = this.element.querySelector('.modal-title');
        titleEl.textContent = title;
    }
}
