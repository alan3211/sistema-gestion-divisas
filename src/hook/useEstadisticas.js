import { useState, useEffect } from "react";
import {getEstadistica} from "../services/inicio-services";

export const useEstadisticas = (id_catalogos) => {
    const [catalogos, setCatalogos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.all(id_catalogos.map(id => getEstadistica(id)));
                setCatalogos(results);
            } catch (error) {
                // Manejar el error de obtener los datos del catálogo
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return catalogos;
};
