import {
    ADMINISTRACION_CARGATIPOCAMBIO_URL, ADMINISTRACION_USUARIO_ACCIONES_URL,
    ADMINISTRACION_USUARIO_ALTA_URL, ADMINISTRACION_USUARIO_ASIGNACION_REPORTES_URL,
    ADMINISTRACION_USUARIO_CONSULTA_URL, ADMINISTRACION_USUARIO_GUARDA_ASIGNACION_REPORTES_URL, TOOLS_ACCIONES_CAJA_URL
} from "../utils";

// Valida si existe el tipo de cambio en la sucursal indicada
export const getCargaTipoCambio = async (formValues) => {
    try {
        const url = `${ADMINISTRACION_CARGATIPOCAMBIO_URL}`;

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

export const accionesUsuario = async (formValues) => {
    try {
        const url = `${ADMINISTRACION_USUARIO_ALTA_URL}`;

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

export const consultaUsuarios = async (formValues) => {
    try {
        const url = `${ADMINISTRACION_USUARIO_CONSULTA_URL}`;

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

export const accionesUsuarios = async (encryptedData) => {
    try {
        const url = `${ADMINISTRACION_USUARIO_ACCIONES_URL}`;

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

export const guardaAsignacion = async (encryptedData) => {
    try {
        const url = `${ADMINISTRACION_USUARIO_ASIGNACION_REPORTES_URL}`;

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

