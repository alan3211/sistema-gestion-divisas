import {
    LOGISTICA_ACCIONES_DOTACION_BOVEDA,
    LOGISTICA_CONSULTA_DOTACION_BOVEDA,
    LOGISTICA_GENERA_DOTACION_BOVEDA,
    LOGISTICA_REALIZA_DOTACION_BOVEDA
} from "../utils";


export const solicitaDotacionBoveda = async (encryptedData) => {
    try {
        const url = `${LOGISTICA_REALIZA_DOTACION_BOVEDA}`;

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

export const generaSolicitudDotacionBoveda = async (encryptedData) => {
    try {
        const url = `${LOGISTICA_GENERA_DOTACION_BOVEDA}`;

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

export const accionesSolicitudBoveda = async (encryptedData) => {
    try {
        const url = `${LOGISTICA_ACCIONES_DOTACION_BOVEDA}`;

        const response = await fetch(url, {
            method: 'PUT',
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