import {
    OPERACIONES_ALTACLIENTE_URL, TESORERIA_CONSULTA_SALDO_EFECTIVO_URL,
    TESORERIA_CONSULTA_SALDO_URL, TESORERIA_DOTACION_EFECTIVO_URL,
    TESORERIA_DOTACION_SUCURSALES_URL, TESORERIA_ENVIO_SUCURSAL_URL,
    TESORERIA_ESTATUS_DOTACIONES_URL, TESORERIA_RESUMEN_SUCURSAL_URL
} from "../utils";


export const getConsultaSaldoCuenta =  async() => {
    try {
        const url = `${TESORERIA_CONSULTA_SALDO_URL}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
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


export const getConsultaSaldoCuentaEfectivo =  async(encryptedData) => {
    try {
        const url = `${TESORERIA_CONSULTA_SALDO_EFECTIVO_URL}`;

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

export const dotaSucursales = async (encryptedData) => {
    try {
        const url = `${TESORERIA_DOTACION_SUCURSALES_URL}`;

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

export const estatusOperaciones = async (encryptedData) => {
    try {
        const url = `${TESORERIA_ESTATUS_DOTACIONES_URL}`;

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


export const consultaEnvioSucursal = async (encryptedData) => {
    try {
        const url = `${TESORERIA_ENVIO_SUCURSAL_URL}`;

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

export const getResumenSucursales = async (encryptedData) => {
    try {
        const url = `${TESORERIA_RESUMEN_SUCURSAL_URL}`;

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


export const dotaEfectivo = async (encryptedData) => {
    try {
        const url = `${TESORERIA_DOTACION_EFECTIVO_URL}`;

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