import {CATALOGOS_URL, INICIO_URL, LOGIN_URL, REFRESH_TOKEN_URL, TOKEN_URL} from "../utils";

// Valida si existe el tipo de cambio en la sucursal indicada
export const getValidaTipoCambioDia = async (formValues) => {
    try {
        const url = `${INICIO_URL}`;
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
        const url = `${TOKEN_URL}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        // Verificar si la respuesta está vacía
        const text = await response.text();
        if (text.trim() === "") {
            throw new Error("La respuesta del servidor está vacía.");
        }

        const data = JSON.parse(text);

        if (data.hasOwnProperty("error")) {
            return data;
        }
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const renovarToken = async (refresh_token) => {
    try {
        const url = `${REFRESH_TOKEN_URL}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'refresh': `${refresh_token}`
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getEstadistica = async (idCatalogo) => {
    try {
        const url = `${CATALOGOS_URL}estadistica/${idCatalogo}`;

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

export const getSucursalUsuarios = async (formValues) => {
    try {
        const url = `${CATALOGOS_URL}estadistica/usuariosSistema`;

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