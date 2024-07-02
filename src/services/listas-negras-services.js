import {QSQ_CONSULTA} from "../utils";

export const obtieneToken =  async() => {
    try {
        const url = `?client_id=836514-5813-4870`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer 0m5Cz1GHj5FQoxwigHIAPA6wRxyfjxxFAgABTE6coNGqTlPQafAmgaOIND0Sta4W45aR5g0lZVkwOn6aT7SJN8aeAw5gSFWXM53PSI7saU4NknywTWXBA4eyoY1Hkfh1`
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud al API DE QUIEN ES QUIEN!');
        }

        const text = await response.text();  // Obtén el texto completo de la respuesta
        return text;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const consultaLista =  async(formValues) => {
    try {
        const url = `${QSQ_CONSULTA}`;

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
        console.log("DATA: ",data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}