import {formattedDateDD, mensajeSinElementos} from "../../../utils";
import {useFetchTipoCambio} from "../../../hook";
import {MessageComponent} from "../../commons";
import {useContext} from "react";
import {CompraVentaContext} from "../../../context/compraVenta/CompraVentaContext";


export const TablaDivisasComponent = () => {

    const {setTipoDivisa} = useContext(CompraVentaContext);
    const {dataTipoCambio,headers} = useFetchTipoCambio();
    setTipoDivisa(dataTipoCambio);

    if(dataTipoCambio.length === 0){
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
                    {headers?.map(elemento => {
                        return <th scope="col">{elemento}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {dataTipoCambio.map((ele, index) => (
                    <tr key={index}>
                        <td>
                            <img src={ele.icon} width={30} height={30} className="m-2" alt={ele.Divisa}/>
                            {ele.Divisa}
                        </td>
                        <td>{ele.Compra}</td>
                        <td>{ele.Venta}</td>
                        <td> <i className="bi bi-sync text-success"></i> {ele["Hora Actualización"]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}