import { getCatalogo } from "../services";
import { useState, useEffect } from "react";

export const useCatalogo = (id_catalogos) => {
    const [catalogos, setCatalogos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.all(id_catalogos.map(id => getCatalogo(id)));
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
