export const validateInput = (formValues) => {
    const errors = {};

    for (let key in formValues) {
        if (!formValues[key]) {
            errors[key] = "Este campo es obligatorio";
        }
    }

    return errors;
};