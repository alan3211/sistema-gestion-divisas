import {
    PLD_ALARMA_CONSULTA_URL, PLD_CONSULTA_ANALISIS_URL, PLD_CONSULTA_MOVIMIENTOS_URL, PLD_GUARDA_ANALISIS_URL,
    REPORTES_CONSULTA_REPORTES_CAJA_URL,
    REPORTES_CONSULTA_REPORTES_URL,
    REPORTES_CONSULTA_TITULO_URL,
    REPORTES_CONSULTA_URL
} from "../utils";

export const consultaAlarmas =  async(formValues) => {
    try {
        const url = `${PLD_ALARMA_CONSULTA_URL}`;

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

export const guardaAnalisis =  async(formValues) => {
    try {
        const url = `${PLD_GUARDA_ANALISIS_URL}`;

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

export const consultaAnalisis =  async(formValues) => {
    try {
        const url = `${PLD_CONSULTA_ANALISIS_URL}`;

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

export const consultaMovimientos =  async(formValues) => {
    try {
        const url = `${PLD_CONSULTA_MOVIMIENTOS_URL}`;

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

