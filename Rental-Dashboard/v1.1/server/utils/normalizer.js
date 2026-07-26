// utils/normalize.js

/**
 * Safely normalizes a value into a real array, no matter how many layers
 * of JSON stringification it went through — handles an already-parsed
 * array, a single JSON string, a double-encoded string, null/undefined,
 * or malformed data, always returning a usable array.
 */
export function jsonArrayNormalizer(rawValue) {
    let value = rawValue;

    for (let i = 0; i < 3 && typeof value === 'string'; i++) {
        try {
            value = JSON.parse(value);
        } catch (e) {
            value = [];
            break;
        }
    }

    return Array.isArray(value) ? value : [];
}