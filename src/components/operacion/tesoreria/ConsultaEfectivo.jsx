import {useEffect, useState} from "react";
import {useSaldo} from "../../../hook";
import {getConsultaSaldoCuentaEfectivo} from "../../../services/operacion-tesoreria";
import {FormatoMoneda} from "../../../utils";
import {SyncLoader} from "react-spinners";
import {MovimientoEfectivo} from "./operacion/MovimientoEfectivo";

export const ConsultaEfectivo = () =>{
    const [saldoNuevo, setSaldoNuevo] = useState(0); // Inicializa con un valor predeterminado

    // Usa useSaldo para obtener el saldo actual
    const saldoGeneral = useSaldo(2);

    const actualizarSaldo = async () => {
        const {saldo_cuenta} = await getConsultaSaldoCuentaEfectivo();
        setSaldoNuevo(saldo_cuenta);
    };

    useEffect(() => {
        console.log("SALDO ACTUAL: ", saldoGeneral);
        setSaldoNuevo(saldoGeneral !== undefined ? saldoGeneral : 0);
    }, [saldoGeneral]);

    return(
        <>
            <div className="search-options d-flex justify-content-center align-items-center mt-4">
                <h5 className="text-blue text-center">
                    <i className="bi bi-bank me-2"></i>
                    <span>Fondos Físicos:</span>
                    {saldoNuevo ? (
                        <strong className="ms-2">{FormatoMoneda(parseFloat(saldoNuevo), 'USD')}</strong>
                    ) : saldoNuevo !== 0 ? (
                        <strong className="ms-2">{FormatoMoneda(parseFloat(saldoNuevo), 'USD')}</strong>
                    ) : (
                        <strong className="ms-2"><SyncLoader color="#012970" size={5} /></strong>
                    )}
                </h5>
            </div>
            <MovimientoEfectivo  actualizarSaldo={actualizarSaldo}/>
        </>
    );
}