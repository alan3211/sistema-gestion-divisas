import {INICIO_URL, LOGIN_URL} from "../utils/constantes";

// Valida si existe el tipo de cambio en la sucursal indicada
export const getValidaTipoCambioDia = async (formValues) => {
    try {
        const url = `${INICIO_URL}`;
        console.log("INICIO: " ,formValues)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({encryptedData:formValues}),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud al backend');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const validaToken = async (token) => {
    try {
        const url = `${INICIO_URL}validaToken`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};