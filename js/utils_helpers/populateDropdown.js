/**
 * Populates a dropdown with the provided options.
 *
 * @param {HTMLSelectElement} dropdown - The <select> element to populate.
 * @param {Array<{value: string, label: string}>} options - Dropdown options.
 */
export function populateDropdown(dropdown, options) {

    // Create and append an <option> for each item.
    options.forEach(({ value, label }) => {
        const option = document.createElement("option");

        // Value used internally/submitted with the form.
        option.value = value;

        // Label displayed to the user.
        option.textContent = label;

        // Add the option to the dropdown.
        dropdown.appendChild(option);
    });
}
