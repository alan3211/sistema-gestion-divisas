import {TableComponent} from "../../commons/tables/TableComponent";
import {dataG} from "../../../App";
import {formattedDate, formattedDateDD, mensajeSinElementos} from "../../../utils/utils";
import {consultaCaja} from "../../../services/operaciones-services";
import {useEffect, useState} from "react";
import {MessageComponent} from "../../commons/MessageComponent";

export const CuentaCajaComponent = () => {

   const [data,setData] = useState([]);

   const obtieneCajaActual = async() => {

       const values = {
           usuario: dataG.usuario,
           fecha: formattedDate
       }
       const data = await consultaCaja(values);
       console.log("CAJA: ",data);
       setData(data);

   }

   useEffect(()=>{
       obtieneCajaActual();
   },[])


    if(data.length === 0){
        return (
            <>
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4">
                        <MessageComponent estilos={mensajeSinElementos}>
                            No hay información de cierre de este usuario del día: <strong>{formattedDateDD}</strong>
                        </MessageComponent>
                    </div>
                </div>
            </>
        );
    }else{
        return(
            <>

        </>);
    }
}