import {LOGIN_URL} from "../utils";

// Obtiene los catalogos
export const getUser = async (formValues) => {
    try {
        const url = `${LOGIN_URL}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({encryptedData:formValues}),
        });

        if (!response.ok && response.status !== 400) {
            throw new Error('Error en la solicitud al backend');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};