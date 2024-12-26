/**
 * Component type definitions
 * @module components/types
 */

/**
 * Modal configuration options
 * @typedef {Object} ModalOptions
 * @property {string} [title] - Modal title
 * @property {string|HTMLElement} [content] - Modal content
 * @property {boolean} [closable=true] - Whether modal can be closed
 * @property {string} [size='md'] - Modal size (sm, md, lg)
 * @property {Function} [onOpen] - Callback when modal opens
 * @property {Function} [onClose] - Callback when modal closes
 */

/**
 * Tooltip configuration options
 * @typedef {Object} TooltipOptions
 * @property {string} [position='top'] - Tooltip position (top, right, bottom, left)
 * @property {string} [theme='dark'] - Tooltip theme (dark, light)
 * @property {number} [showDelay=0] - Delay before showing tooltip (ms)
 * @property {number} [hideDelay=0] - Delay before hiding tooltip (ms)
 * @property {boolean} [html=false] - Whether to allow HTML in tooltip content
 */

/**
 * Alert configuration options
 * @typedef {Object} AlertOptions
 * @property {string} [type='info'] - Alert type (info, success, warning, error)
 * @property {string} [title] - Alert title
 * @property {boolean} [dismissible=true] - Whether alert can be dismissed
 * @property {boolean} [animate=true] - Whether to animate alert
 * @property {number} [duration] - Auto-dismiss duration in ms (0 for no auto-dismiss)
 * @property {Function} [onClose] - Callback when alert closes
 */

export {
    ModalOptions,
    TooltipOptions,
    AlertOptions
};
