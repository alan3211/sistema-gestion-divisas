import {useEffect, useState} from "react";
import {getSucursalUsuarios} from "../services/inicio-services";
import {encryptRequest} from "../utils";

export const useGetUsuariosSistema = (valores) => {

    const options = {
        showMostrar:true,
        paginacion: true,
        buscar:true,
        tools:[
            {columna:"Usuarios",tool:"usuarios-sistema"},
            {columna:"Operacion",tool:"operacion-estatus"},
        ]
    }

    const [activo,setActivo] = useState(false);
    const [dataSucUsu,setDataSucUsu] = useState([]);


    const fetchData = async () => {
        const response = await getSucursalUsuarios(encryptRequest(valores));
        setActivo(true);
        setDataSucUsu(response);
    };

    useEffect(() => {
        fetchData();
    }, []);


    return {
        options,activo,dataSucUsu
    }
}