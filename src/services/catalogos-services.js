import {CATALOGOS_GUARDADO_URL, CATALOGOS_LOCALIDAD_URL, CATALOGOS_URL, CATALOGOSUSUARIOS_URL} from "../utils";

// Obtiene los catalogos
export const getCatalogo = async (idCatalogo) => {
    try {
        const url = `${CATALOGOS_URL}${idCatalogo}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
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

export const getLocalidad = async (formValues) => {
    try {
        const url = `${CATALOGOS_LOCALIDAD_URL}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({encryptedData:formValues})
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



// Obtiene los usuarios del sistema
export const getUsuariosSistema = async (encryptedData) => {
    try {
        const url = CATALOGOSUSUARIOS_URL;

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
};

// Guarda los nuevos catalogos del sistema
export const guardaCatalogo = async (encryptedData) => {
    try {
        const url = CATALOGOS_GUARDADO_URL;

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
};
