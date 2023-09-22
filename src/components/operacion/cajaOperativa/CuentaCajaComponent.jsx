import {formattedDateDD, mensajeSinElementos} from "../../../utils";
import {MessageComponent} from "../../commons";
import {useCaja} from "../../../hook/useCaja";
import {useState} from "react";
import {TableComponent} from "../../commons/tables";
import {ResumenCaja} from "./ResumenCaja";

export const CuentaCajaComponent = ({tipo}) => {

    const {data,showTable} = useCaja();
    const [showDetalle,setShowDetalle] = useState(false);
    const [dataDenominacion,setDataDenominacion] = useState({});
    const [moneda,setMoneda] = useState('');


    const options = {
        tools: [
            {columna:"Denominaciones",tool:'ver-denominaciones',deps:{setShowDetalle,setDataDenominacion,setMoneda}},
        ]
    }

    console.log(dataDenominacion)

    if (data.total_rows === 0) {
        return (<div className="row d-flex justify-content-center">
            <div className="col-md-4 mb-3">
                <MessageComponent estilos={mensajeSinElementos}>
                    No hay información de cierre de este usuario del día: <strong>{formattedDateDD}</strong>
                </MessageComponent>
            </div>
        </div>);
    } else {
        return (
           <>
               {
                  showTable && (<TableComponent data={data} options={options}/>)
               }

               {
                   showDetalle && (
                       <>
                           <ResumenCaja data={dataDenominacion} moneda={moneda} setShowDetalle={setShowDetalle} tipo={tipo}/>
                       </>
                   )
               }
           </>
        );
    }
}