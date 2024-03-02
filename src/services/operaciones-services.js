import {
    CAJA_CONSULTA_URL,
    OPERACIONES_ALTACLIENTE_URL,
    OPERACIONES_BUSCACLIENTE_URL, OPERACIONES_CONSULTA_TIPOCAMBIO_URL,
    OPERACIONES_CONSULTALDENOMINACIONES_URL,
    OPERACIONES_CONVERSION_URL, OPERACIONES_ENVIAMENSAJES_DOTA_PARCIAL_URL,
    OPERACIONES_ENVIAMENSAJES_URL,
    OPERACIONES_HACEROPERACION_URL,
    OPERACIONES_REALIZAOPERACION_URL, OPERACIONES_RESGUARDA_FACTURA_URL,
    OPERACIONES_TIPOCAMBIO_URL, OPERACIONES_VALIDA_DOTACION_PARCIAL_URL, OPERACIONES_VALIDA_INFORMACION_URL,
    OPERACIONES_VALIDACLIENTE_URL
} from "../utils";

export const validaCliente = async (formValues) => {
    try {
        const url = `${OPERACIONES_VALIDACLIENTE_URL}`;

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
}

export const guardaCliente = async (formValues) => {
    try {
        const url = `${OPERACIONES_ALTACLIENTE_URL}`;

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
}

export const getTipoCambio =  async(formValues) => {
    try {
        const url = `${OPERACIONES_TIPOCAMBIO_URL}`;

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
}

export const realizaConversion =  async(formValues) => {
    try {
        const url = `${OPERACIONES_CONVERSION_URL}`;

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
}

export const buscaCliente = async (formValues) =>{
    try {
        const url = `${OPERACIONES_BUSCACLIENTE_URL}`;

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
}

export const obtieneDenominaciones = async (formValues) =>{
    try {
        const url = `${OPERACIONES_CONSULTALDENOMINACIONES_URL}`;

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
}

export const hacerOperacion =  async(formValues) => {
    try {
        const url = `${OPERACIONES_HACEROPERACION_URL}`;

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
}

export const realizarOperacion =  async(formValues) => {
    try {
        const url = `${OPERACIONES_REALIZAOPERACION_URL}`;

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
}

export const enviaMensaje =  async(formValues) => {
    try {
        const url = `${OPERACIONES_ENVIAMENSAJES_URL}`;

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
}

export const consultaSucursalesTPCambio =  async(formValues) => {
    try {
        const url = `${OPERACIONES_CONSULTA_TIPOCAMBIO_URL}`;

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
}

export const consultaInformacionCarga =  async(formValues) => {
    try {
        const url = `${OPERACIONES_VALIDA_INFORMACION_URL}`;

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
}
export const guardaConfirmacionFactura =  async(formValues) => {
    try {
        const url = `${OPERACIONES_RESGUARDA_FACTURA_URL}`;

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


export const enviaMensajeDotacionParcial =  async(formValues) => {
    try {
        const url = `${OPERACIONES_ENVIAMENSAJES_DOTA_PARCIAL_URL}`;

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
}

export const validaDotParcial =  async(formValues) => {
    try {
        const url = `${OPERACIONES_VALIDA_DOTACION_PARCIAL_URL}`;

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
}
