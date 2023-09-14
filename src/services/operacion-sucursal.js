import {
    SUCURSAL_CONSULTA_DOTACIONES_URL,
    SUCURSAL_DOTA_CAJA_URL,
    SUCURSAL_ENVIO_VALORES_URL, SUCURSAL_MOVIMIENTOS_URL,
    TESORERIA_ENVIO_SUCURSAL_URL
} from "../utils";

export const realizarOperacionSucursal =  async(formValues) => {
    try {
        const url = `${SUCURSAL_ENVIO_VALORES_URL}`;

        const response = await fetch(url, {
            method: 'PUT',
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
}

export const realizarOperacionSucursalDotacion =  async(formValues) => {
    try {
        const url = `${SUCURSAL_DOTA_CAJA_URL}`;

        const response = await fetch(url, {
            method: 'PUT',
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
}

export const consultaDotacionSucursal = async (encryptedData) => {
    try {
        const url = `${SUCURSAL_CONSULTA_DOTACIONES_URL}`;

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

export const consultaMovimientoSucursal = async (encryptedData) => {
    try {
        const url = `${SUCURSAL_MOVIMIENTOS_URL}`;

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