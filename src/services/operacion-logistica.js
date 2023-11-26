import {LOGISTICA_CONSULTA_DOTACION_BOVEDA} from "../utils";

export const consultaDotacionBoveda = async (encryptedData) => {
    try {
        const url = `${LOGISTICA_CONSULTA_DOTACION_BOVEDA}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({encryptedData:encryptedData})
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
}