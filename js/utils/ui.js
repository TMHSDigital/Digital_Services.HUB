/**
 * UI utilities for Digital Services Hub
 */

import { UI_CONSTANTS, THEMES } from './constants.js';

// Notification container
let notificationContainer = null;

// Create notification container
function createNotificationContainer() {
    if (notificationContainer) return;

    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.setAttribute('role', 'alert');
    notificationContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(notificationContainer);
}

// Show notification
export function showNotification(message, type = 'info', duration = 3000) {
    createNotificationContainer();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-atomic', 'true');

    const icon = document.createElement('i');
    icon.className = getNotificationIcon(type);
    notification.appendChild(icon);

    const text = document.createElement('span');
    text.textContent = message;
    notification.appendChild(text);

    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', () => removeNotification(notification));
    notification.appendChild(closeButton);

    notificationContainer.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('notification-show');
    });

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => removeNotification(notification), duration);
    }

    return notification;
}

// Remove notification
function removeNotification(notification) {
    notification.classList.remove('notification-show');
    notification.addEventListener('transitionend', () => {
        notification.remove();
        if (notificationContainer && notificationContainer.children.length === 0) {
            notificationContainer.remove();
            notificationContainer = null;
        }
    });
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        default:
            return 'fas fa-info-circle';
    }
}

// Create loading spinner
export function createLoadingSpinner(container, size = 'medium', text = 'Loading...') {
    const spinner = document.createElement('div');
    spinner.className = `loading-spinner loading-spinner-${size}`;
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', text);

    const spinnerInner = document.createElement('div');
    spinnerInner.className = 'loading-spinner-inner';
    spinner.appendChild(spinnerInner);

    if (text) {
        const spinnerText = document.createElement('div');
        spinnerText.className = 'loading-spinner-text';
        spinnerText.textContent = text;
        spinner.appendChild(spinnerText);
    }

    if (container) {
        container.appendChild(spinner);
    }

    return spinner;
}

// Remove loading spinner
export function removeLoadingSpinner(spinner) {
    if (spinner && spinner.parentNode) {
        spinner.remove();
    }
}

// Create modal
export function createModal(options = {}) {
    const {
        title = '',
        content = '',
        buttons = [],
        size = 'medium',
        closeOnOverlayClick = true,
        showCloseButton = true
    } = options;

    const modal = document.createElement('div');
    modal.className = `modal modal-${size}`;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    if (title) {
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        const modalTitle = document.createElement('h2');
        modalTitle.id = 'modal-title';
        modalTitle.className = 'modal-title';
        modalTitle.textContent = title;
        modalHeader.appendChild(modalTitle);

        if (showCloseButton) {
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.setAttribute('aria-label', 'Close modal');
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.addEventListener('click', () => closeModal(modal));
            modalHeader.appendChild(closeButton);
        }

        modalContent.appendChild(modalHeader);
    }

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    if (typeof content === 'string') {
        modalBody.innerHTML = content;
    } else {
        modalBody.appendChild(content);
    }
    modalContent.appendChild(modalBody);

    if (buttons.length > 0) {
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `btn btn-${button.type || 'secondary'}`;
            btn.textContent = button.text;
            if (button.onClick) {
                btn.addEventListener('click', () => button.onClick(modal));
            }
            modalFooter.appendChild(btn);
        });

        modalContent.appendChild(modalFooter);
    }

    modal.appendChild(modalContent);

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    if (closeOnOverlayClick) {
        modalOverlay.addEventListener('click', () => closeModal(modal));
    }

    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal-wrapper';
    modalWrapper.appendChild(modalOverlay);
    modalWrapper.appendChild(modal);

    document.body.appendChild(modalWrapper);

    // Trigger animation
    requestAnimationFrame(() => {
        modalWrapper.classList.add('modal-show');
    });

    return modal;
}

// Close modal
export function closeModal(modal) {
    const modalWrapper = modal.closest('.modal-wrapper');
    modalWrapper.classList.remove('modal-show');
    modalWrapper.addEventListener('transitionend', () => {
        modalWrapper.remove();
    });
}

// Create tooltip
export function createTooltip(element, text, position = 'top') {
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position}`;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent = text;

    element.addEventListener('mouseenter', () => {
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        positionTooltip(tooltip, rect, position);
        requestAnimationFrame(() => {
            tooltip.classList.add('tooltip-show');
        });
    });

    element.addEventListener('mouseleave', () => {
        tooltip.classList.remove('tooltip-show');
        tooltip.addEventListener('transitionend', () => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        });
    });

    return tooltip;
}

// Position tooltip
function positionTooltip(tooltip, targetRect, position) {
    const tooltipRect = tooltip.getBoundingClientRect();
    const spacing = 8;

    let top, left;

    switch (position) {
        case 'top':
            top = targetRect.top - tooltipRect.height - spacing;
            left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
            break;
        case 'bottom':
            top = targetRect.bottom + spacing;
            left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
            break;
        case 'left':
            top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
            left = targetRect.left - tooltipRect.width - spacing;
            break;
        case 'right':
            top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
            left = targetRect.right + spacing;
            break;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

// Create confirmation dialog
export function createConfirmDialog(options = {}) {
    const {
        title = 'Confirm',
        message = 'Are you sure?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmType = 'primary',
        onConfirm,
        onCancel
    } = options;

    return createModal({
        title,
        content: message,
        buttons: [
            {
                text: cancelText,
                type: 'secondary',
                onClick: (modal) => {
                    closeModal(modal);
                    if (onCancel) onCancel();
                }
            },
            {
                text: confirmText,
                type: confirmType,
                onClick: (modal) => {
                    closeModal(modal);
                    if (onConfirm) onConfirm();
                }
            }
        ]
    });
}

// Toggle element visibility
export function toggleVisibility(element, show) {
    if (show) {
        element.classList.remove('hidden');
        element.setAttribute('aria-hidden', 'false');
    } else {
        element.classList.add('hidden');
        element.setAttribute('aria-hidden', 'true');
    }
}

// Format file size
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Format date
export function formatDate(date, options = {}) {
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Format number
export function formatNumber(number, options = {}) {
    return new Intl.NumberFormat('en-US', options).format(number);
}

// Validate email
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate URL
export function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Throttle function
export function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
