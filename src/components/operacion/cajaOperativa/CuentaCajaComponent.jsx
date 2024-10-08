import {encryptRequest, formattedDateDD, mensajeSinElementos} from "../../../utils";
import {MessageComponent} from "../../commons";
import {useCaja} from "../../../hook/";
import {useState} from "react";
import {TableComponent} from "../../commons/tables";
import {ResumenCaja} from "./ResumenCaja";
import {consultaCaja} from "../../../services/operacion-caja";
import {dataG} from "../../../App";
import {ResumenCajaParcial} from "./ResumenCajaParcial";
import {LoaderTable} from "../../commons/LoaderTable";

export const CuentaCajaComponent = ({tipo}) => {

    const {data,setData,showTable} = useCaja();
    const [showDetalle,setShowDetalle] = useState(false);
    const [dataDenominacion,setDataDenominacion] = useState({});
    const [moneda,setMoneda] = useState('');
    const refreshQuery = async () =>{
           const values = {
                usuario: dataG.usuario,
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values)
            const data = await consultaCaja(encryptedData);
            setData(data);
    }

    const [resetFunction, setResetFunction] = useState();

    // Función para recibir la función reset desde ResumenCaja
    const receiveResetFunction = (reset) => {
        setResetFunction(reset);
    };

    const options = {
        tools: [
            {columna:"Denominaciones",tool:'ver-denominaciones', deps:{setShowDetalle,setDataDenominacion,setMoneda,resetForm:resetFunction}},
        ],
        filters:[{columna:'Monto',filter:'currency'}]
    }

    if (data.total_rows === 0) {
        return (<div className="row d-flex justify-content-center">
            <div className="col-md-4 mb-3">
                <MessageComponent estilos={mensajeSinElementos}>
                    No hay información de cierre de este usuario del día: <strong>{formattedDateDD()}</strong>
                </MessageComponent>
            </div>
        </div>);
    } else {
        return (
           <>
               {
                  showTable
                      ? <TableComponent data={data} options={options}/>
                      : <LoaderTable/>

               }

               {
                   showDetalle && (
                       <>
                           {
                               tipo !== 'Cierre Parcial'
                                   ? (
                                       <ResumenCaja
                                           data={dataDenominacion}
                                           moneda={moneda}
                                           setShowDetalle={setShowDetalle}
                                           tipo={tipo}
                                           refresh={refreshQuery}
                                           resetForm={receiveResetFunction}
                                       />
                                   ):
                                   <>
                                       <ResumenCajaParcial
                                           data={dataDenominacion}
                                           moneda={moneda}
                                           setShowDetalle={setShowDetalle}
                                           refresh={refreshQuery}
                                           resetForm={receiveResetFunction}
                                       />
                                   </>
                           }
                       </>
                   )
               }
           </>
        );
    }
}