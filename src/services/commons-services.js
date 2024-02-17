
// Servicio para cargar archivos
import {TOOLS_CARGA_ARCHIVOS_URL} from "../utils";

export const cargaArchivos = async (archivos) => {
    try {
        const url = `${TOOLS_CARGA_ARCHIVOS_URL}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: archivos,
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