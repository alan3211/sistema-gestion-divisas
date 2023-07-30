import {formattedDate, formattedDateDD, mensajeSinElementos} from "../../../utils/utils";
import {dataG} from "../../../App";
import {useFetchTipoCambio} from "../../../hook/useFetchTipoCambio";
import {MessageComponent} from "../../commons/MessageComponent";


export const TablaDivisasComponent = ({setTipoDivisa}) => {

    const formValues = {
        "sucursal": dataG.sucursal,
        "fechaCambio": formattedDate
    }

    const {valoresTipoCambio} = useFetchTipoCambio(formValues);

    setTipoDivisa(valoresTipoCambio);

    if(valoresTipoCambio.length === 0){
        return (
            <MessageComponent estilos={mensajeSinElementos}>
                No hay información del tipo de cambio
                para el día: <strong>{formattedDateDD}</strong>
            </MessageComponent>
        );
    }else{
        return(
            <table className="table table-hover text-center">
                <thead>
                <tr>
                    <th scope="col">Divisa</th>
                    <th scope="col">Compra</th>
                    <th scope="col">Venta</th>
                </tr>
                </thead>
                <tbody>
                {valoresTipoCambio.map((ele, index) => (
                    <tr key={index}>
                        <td>
                            <img src={ele.icon} width={30} height={30} className="m-2"/>
                            {ele.nombre_divisa}
                        </td>
                        <td>{ele.compra}</td>
                        <td>{ele.venta}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}