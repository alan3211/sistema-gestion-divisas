import {useContext, useEffect, useState} from "react";
import {
    eliminarDenominacionesConCantidadCero, encryptRequest, formattedDate,
    formattedDateWS, getDenominacion,
    obtenerObjetoDenominaciones,
    validarMoneda,
} from "../../../utils";

import {CajaContext} from "../../../context/caja/CajaContext";
import {useCatalogo} from "../../../hook/useCatalogo";
import {realizarOperacion} from "../../../services";
import {dataG} from "../../../App";
import {toast} from "react-toastify";
import {Denominacion} from "../denominacion";
import {DenominacionContext} from "../../../context/denominacion/DenominacionContext";
import {getDotaciones} from "../../../services/operacion-caja";
import {TableComponent} from "../../commons/tables";
import {consultaDotacionSucursal} from "../../../services/operacion-sucursal";

export const DotacionComponent = () => {

    const [data,setData] = useState({});
    const [showData,setShowData] = useState(false);
    const [formData,setFormData] = useState('');


    useEffect(()=>{

        const valores = {
            fecha: formattedDate,
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
        }
        const encryptedData = encryptRequest(valores);

        const getConsultaDotaciones = async () =>{
            setFormData(encryptedData);
            const data_response = await getDotaciones(encryptedData);
            data_response.headers = [...data_response.headers,'Acciones'];
            setData(data_response);
            setShowData(true);
        }
        getConsultaDotaciones();
    },[]);

    const refreshQuery = async () =>{
        const data_response = await getDotaciones(formData);
        data_response.headers = [...data_response.headers,'Acciones'];
        setData(data_response);
    }

    const options = {
        showMostrar:true,
        buscar: true,
        paginacion: true,
        tools:[
            {columna:"Estatus",tool:"estatus"},
            {columna:"Acciones",tool:"acciones-caja", refresh:refreshQuery},
            {columna:"Detalle",tool:"detalle",  params:{opcion:1}},

        ]
    }

    console.log(data);

    return(
        <div className="mt-4">
            {showData ? (
                <TableComponent data={data} options={options} />
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
}