
import {useEffect, useState} from "react";
import {encryptRequest, } from "../../../utils";

import {TableComponent} from "../../commons/tables";
import {LoaderTable} from "../../commons/LoaderTable";
import {guardaAsignacion} from "../../../services/administracion-services";

export const ConsultaReporte = ()=>{
    const [data,setData] = useState({});
    const [showData,setShowData] = useState(false);

    const options = {
        showMostrar:true,
        excel:true,
        tableName:'Consulta Asignacion de Reportes',
        buscar: true,
        paginacion: true,
    }

    useEffect(() => {
        const onHandleConsultaReporte = async () => {
            const valores = {
                opcion:1,
                idReporte:'0',
                perfiles: ''
            }

            const encryptedData = encryptRequest(valores);
            const data_response = await guardaAsignacion(encryptedData)
            if(data_response.result_set){
                setData(data_response);
            }else{
                setData([]);
            }
            setShowData(true);
        }
        onHandleConsultaReporte();
    }, []);

    return(
        <div className="container justify-content-center align-items-center mt-4">
            {showData
                ? <TableComponent data={data} options={options} />
                : <LoaderTable/>
            }
        </div>
    );
}