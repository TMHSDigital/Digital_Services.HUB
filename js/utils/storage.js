/**
 * Storage utilities for managing local and session storage
 */

/**
 * Check if storage type is available
 * @param {string} type - Storage type ('localStorage' or 'sessionStorage')
 * @returns {boolean} Whether storage is available
 */
export function isStorageAvailable(type) {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Get item from storage
 * @param {string} key - Storage key
 * @param {'local'|'session'} type - Storage type
 * @returns {any} Stored value or null
 */
export function getStorageItem(key, type = 'local') {
    try {
        const storage = type === 'local' ? localStorage : sessionStorage;
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error getting ${key} from ${type} storage:`, error);
        return null;
    }
}

/**
 * Set item in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {'local'|'session'} type - Storage type
 * @returns {boolean} Whether operation was successful
 */
export function setStorageItem(key, value, type = 'local') {
    try {
        const storage = type === 'local' ? localStorage : sessionStorage;
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting ${key} in ${type} storage:`, error);
        return false;
    }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key
 * @param {'local'|'session'} type - Storage type
 * @returns {boolean} Whether operation was successful
 */
export function removeStorageItem(key, type = 'local') {
    try {
        const storage = type === 'local' ? localStorage : sessionStorage;
        storage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing ${key} from ${type} storage:`, error);
        return false;
    }
}

/**
 * Clear all items from storage
 * @param {'local'|'session'} type - Storage type
 * @returns {boolean} Whether operation was successful
 */
export function clearStorage(type = 'local') {
    try {
        const storage = type === 'local' ? localStorage : sessionStorage;
        storage.clear();
        return true;
    } catch (error) {
        console.error(`Error clearing ${type} storage:`, error);
        return false;
    }
} 