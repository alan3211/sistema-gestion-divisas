import {FormatoMoneda, formattedDate} from "../../../../utils";
import {EstatusTool} from "../../../commons/tables/componentes-tools";

export const UltimosMovimientos = ({data}) => {
    return (
        <div className="col-12">
            <div className="card recent-sales overflow-auto">

                <div className="card-body">
                    <h5 className="card-title">
                        <i className="bi bi-currency-exchange me-2"></i>
                        Últimos Movimientos <span>|  {formattedDate}</span>
                    </h5>

                    <table className="table table-blue table-striped datatable text-center">
                        <thead>
                        <tr>
                            {data.headers?.map((elemento, index) => (
                                <th className="col-1" key={elemento}>
                                    {elemento}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.result_set?.map((elemento, index) => {
                            return (
                                 <tr key={`${elemento["No Usuario"]}_${index}}`}>
                                    <td>{elemento["No Usuario"]}</td>
                                     <td>{elemento.Sucursal}</td>
                                     <td>{elemento["Nombre Sucursal"]}</td>
                                     <td>{elemento["Operación"]}</td>
                                     <td>{elemento.Hora}</td>
                                     <td>{elemento.Moneda}</td>
                                     <td>{FormatoMoneda(parseFloat(elemento.Monto))}</td>
                                     <td>{FormatoMoneda(parseFloat(elemento["Monto Entregado"]))}</td>
                                     <td>
                                         <EstatusTool item={elemento} columna="Estatus"/>
                                     </td>
                                 </tr>
                            )
                        })}
                        </tbody>
                    </table>

                </div>

            </div>
        </div>
    );
}