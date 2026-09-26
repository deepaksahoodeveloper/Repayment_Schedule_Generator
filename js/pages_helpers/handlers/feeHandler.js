export function updateFeeField(typeElement, valueElement, helpElement, feeName) {
    const type = typeElement.value;

    if (type === "percentage") {
        valueElement.placeholder = "Enter percentage";
        valueElement.max = "100";
        helpElement.textContent =
            `Enter the ${feeName} as a percentage of the principal.`;

        return;
    }

    if (type === "flat") {
        valueElement.placeholder = "Enter amount";
        valueElement.removeAttribute("max");
        helpElement.textContent =
            `Enter the ${feeName} as a flat amount.`;

        return;
    }

    valueElement.placeholder = `Enter ${feeName}`;
    valueElement.removeAttribute("max");
    helpElement.textContent =
        "Select a fee type to determine how the fee is calculated.";
}