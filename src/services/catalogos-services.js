import {CATALOGOS_LOCALIDAD_URL, CATALOGOS_URL, CATALOGOSUSUARIOS_URL} from "../utils/constantes";

// Obtiene los catalogos
export const getCatalogo = async (idCatalogo) => {
    try {
        const url = `${CATALOGOS_URL}${idCatalogo}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
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



// Obtiene los catalogos
export const getUsuariosSistema = async (idSucursal,idUsuario) => {
    try {
        const url = `${CATALOGOSUSUARIOS_URL}${idSucursal}/${idUsuario}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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

