import {useEffect, useState} from "react";
import {DotacionSucursales} from "./DotacionSucursales";
import {MovimientoBancario} from "./MovimientoBancario";
import {formateaMoneda, FormatoMoneda} from "../../../../utils";
import {useSaldo} from "../../../../hook/useSaldo";
import {getConsultaSaldoCuenta} from "../../../../services/operacion-tesoreria";

export const OperacionTesoreria = () => {

    const [saldoGeneral, setSaldoGeneral] = useState(0); // Inicializa con un valor predeterminado
    const [selectedOption, setSelectedOption] = useState("dotacionSuc");

    // Usa useSaldo para obtener el saldo actual
    const saldoActual = useSaldo();

    const handleRadioChange = ({ target: { value } }) => {
        setSelectedOption(value);
    };

    const actualizarSaldo = async () => {
        const {saldo_cuenta} = await getConsultaSaldoCuenta();
        setSaldoGeneral(saldo_cuenta);
    };

    useEffect(() => {
        // Actualiza el valor del saldo cuando cambie
        setSaldoGeneral(saldoActual);
    }, [saldoActual]);

    return(
        <>
        <div className="search-options d-flex justify-content-center align-items-center mt-4">
            <h5 className="text-blue text-center">
                <i className="bi bi-bank me-2"></i>
                <span>Cuenta Bancaria:</span>
                <strong className="ms-2">{FormatoMoneda(parseFloat(saldoGeneral),'MXP')}</strong>
            </h5>
        </div>
        <div className="search-options d-flex justify-content-center align-items-center mt-3">
            <div className="radio-options m-2">
                <div className="form-check custom-radio">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="dotacionSuc"
                        id="dotacionSuc"
                        value="dotacionSuc"
                        onChange={handleRadioChange}
                        checked={selectedOption === "dotacionSuc"}
                    />
                    <label className="form-check-label" htmlFor="dotacionSuc">
                        <strong>Dotación Sucursales</strong>
                    </label>
                </div>
                <div className="form-check custom-radio">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="movBancario"
                        id="movBancario"
                        value="movBancario"
                        onChange={handleRadioChange}
                        checked={selectedOption === "movBancario"}
                    />
                    <label className="form-check-label" htmlFor="movBancario">
                        <strong>Movimiento Bancario</strong>
                    </label>
                </div>
            </div>
        </div>

        {
            selectedOption === 'dotacionSuc'
                ? <DotacionSucursales  actualizarSaldo={actualizarSaldo}/>
                : <MovimientoBancario  actualizarSaldo={actualizarSaldo}/>
        }
    </>
    );
}