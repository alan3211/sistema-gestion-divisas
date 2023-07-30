import {LOGIN_URL} from "../utils/constantes";

// Obtiene los catalogos
export const getUser = async (user,pass) => {
    try {
        const url = `${LOGIN_URL}?usuario=${user}&pass=${pass}`;
        console.log(url);

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
