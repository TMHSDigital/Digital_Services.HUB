/**
 * Validation utilities for Digital Services Hub
 */

import { FILE_LIMITS, ERROR_MESSAGES } from './constants.js';

class ValidationError extends Error {
    constructor(message, field = null) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

export const fileValidation = {
    /**
     * Validate file size
     * @param {File} file - File to validate
     * @throws {ValidationError} If file size exceeds limit
     */
    validateFileSize(file) {
        if (file.size > FILE_LIMITS.MAX_FILE_SIZE) {
            throw new ValidationError(ERROR_MESSAGES.FILE_TOO_LARGE, 'file');
        }
    },

    /**
     * Validate file type
     * @param {File} file - File to validate
     * @param {Array<string>} allowedTypes - Array of allowed MIME types
     * @throws {ValidationError} If file type is not supported
     */
    validateFileType(file, allowedTypes) {
        if (!allowedTypes.includes(file.type)) {
            throw new ValidationError(ERROR_MESSAGES.UNSUPPORTED_FILE_TYPE, 'file');
        }
    },

    /**
     * Validate image dimensions
     * @param {File} imageFile - Image file to validate
     * @returns {Promise<void>}
     * @throws {ValidationError} If image dimensions exceed limits
     */
    async validateImageDimensions(imageFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(img.src);
                if (img.width > FILE_LIMITS.MAX_IMAGE_DIMENSION || 
                    img.height > FILE_LIMITS.MAX_IMAGE_DIMENSION) {
                    reject(new ValidationError(ERROR_MESSAGES.INVALID_DIMENSIONS, 'image'));
                }
                resolve();
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                reject(new ValidationError('Failed to load image for validation', 'image'));
            };
            img.src = URL.createObjectURL(imageFile);
        });
    }
};

export const inputValidation = {
    /**
     * Validate required field
     * @param {string} value - Field value
     * @param {string} fieldName - Name of the field
     * @throws {ValidationError} If field is empty
     */
    validateRequired(value, fieldName) {
        if (!value || value.trim() === '') {
            throw new ValidationError(`${fieldName} is required`, fieldName);
        }
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @throws {ValidationError} If email format is invalid
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(String(email).toLowerCase())) {
            throw new ValidationError('Invalid email format', 'email');
        }
    },

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @throws {ValidationError} If URL format is invalid
     */
    validateURL(url) {
        try {
            new URL(url);
        } catch {
            throw new ValidationError('Invalid URL format', 'url');
        }
    },

    /**
     * Validate number range
     * @param {number} value - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {string} fieldName - Name of the field
     * @throws {ValidationError} If number is out of range
     */
    validateNumberRange(value, min, max, fieldName) {
        const num = Number(value);
        if (isNaN(num)) {
            throw new ValidationError(`${fieldName} must be a number`, fieldName);
        }
        if (num < min || num > max) {
            throw new ValidationError(
                `${fieldName} must be between ${min} and ${max}`,
                fieldName
            );
        }
    },

    /**
     * Validate string length
     * @param {string} value - String to validate
     * @param {number} minLength - Minimum length
     * @param {number} maxLength - Maximum length
     * @param {string} fieldName - Name of the field
     * @throws {ValidationError} If string length is out of range
     */
    validateStringLength(value, minLength, maxLength, fieldName) {
        if (value.length < minLength || value.length > maxLength) {
            throw new ValidationError(
                `${fieldName} must be between ${minLength} and ${maxLength} characters`,
                fieldName
            );
        }
    }
};

export const errorHandler = {
    /**
     * Handle validation errors
     * @param {Error} error - Error to handle
     * @returns {Object} Formatted error object
     */
    handleValidationError(error) {
        if (error instanceof ValidationError) {
            return {
                type: 'validation',
                message: error.message,
                field: error.field
            };
        }
        return {
            type: 'error',
            message: ERROR_MESSAGES.GENERIC_ERROR
        };
    },

    /**
     * Format validation errors for display
     * @param {Object} errors - Object containing validation errors
     * @returns {string} Formatted error message
     */
    formatValidationErrors(errors) {
        if (!errors || typeof errors !== 'object') {
            return ERROR_MESSAGES.GENERIC_ERROR;
        }

        return Object.entries(errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
    }
};

export { ValidationError }; 