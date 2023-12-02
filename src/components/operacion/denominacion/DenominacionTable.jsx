import {FormatoMoneda} from "../../../utils";

export const DenominacionTable = ({data=[],monto,moneda}) => {
    return (
        <div className="table-responsive text-center mt-2">
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th className="col-1">Denominación ({moneda})</th>
                    <th className="col-1">Cantidad a Recibir</th>
                    <th className="col-1">Recibido</th>
                    <th className="col-1">Total</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((elemento) => {
                    let name = elemento.Denominacion;
                    return (
                        <tr key={`denominacion_${name}`}>
                            <td>{name}</td>
                            <td>{parseInt(elemento["Cantidad a Recibir"])}</td>
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