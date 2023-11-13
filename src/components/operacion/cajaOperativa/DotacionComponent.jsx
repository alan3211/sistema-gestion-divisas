import { useEffect, useState} from "react";
import {
    encryptRequest, formattedDate,
} from "../../../utils";
import {dataG} from "../../../App";
import {getDotaciones} from "../../../services/operacion-caja";
import {TableComponent} from "../../commons/tables";

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

        ],
        filters:[{columna:'Monto',filter:'currency'}]
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