import {FormatoMoneda} from "../../../utils";

export const DenominacionTableCaja = ({data=[],monto,moneda}) => {
    console.log("TABLA CAJA", data)
    return (
        <div className="table-responsive text-center mt-2">
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th className="col-1">Denominación ({moneda})</th>
                    <th className="col-1">Cantidad</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((elemento) => {
                    let name = elemento.nombre;
                    return (
                        <tr key={`denominacion_${name}`}>
                            <td>{parseFloat(elemento.nombre)}</td>
                            <td>{parseInt(elemento.cantidad)}</td>
                        </tr>
                    )
                })}
                </tbody>
                <tfoot>
                <tr>
                    <th>Monto Total</th>
                    <th>{FormatoMoneda(parseFloat(monto))}</th>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}