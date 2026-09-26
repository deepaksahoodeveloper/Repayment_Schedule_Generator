/**
 * Converts FormData entries into a plain object.
 * When a field occurs multiple times, its values are represented as an
 * array. Single-value fields remain unchanged.
 * 
 * @param {FormData} formData - The FormData instance to convert.
 * @returns {Record<string, FormDataEntryValue | FormDataEntryValue[]>}
 * 
 * An object containing the FormData fields and their corresponding values.
*/
export function formDataToObject(formData) {
    const result = {};

    // Iterate over each key-value pair in the FormData.
    // If a key appears multiple times, store its values in an array.
    for (const [key, value] of formData.entries()) {
        if (!(key in result)) {
            // First occurrence of the key.
            result[key] = value;
        } else if (Array.isArray(result[key])) {
            // Key already has multiple values; append the new value.
            result[key].push(value);
        } else {
            // Key has a single existing value; convert it to an array.
            result[key] = [result[key], value];
        }
    }

    return result;
}
