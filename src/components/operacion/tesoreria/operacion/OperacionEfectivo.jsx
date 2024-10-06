import {useEffect, useState} from "react";
import {DotacionSucursales} from "./DotacionSucursales";
import {MovimientoBancario} from "./MovimientoBancario";
import {encryptRequest, FormatoMoneda} from "../../../../utils";
import {useSaldo} from "../../../../hook";
import {getConsultaSaldoCuenta} from "../../../../services/operacion-tesoreria";
import {SyncLoader} from "react-spinners";
import {isNullOrUndef} from "chart.js/helpers";
import {ConsultaEfectivo} from "../ConsultaEfectivo";

export const OperacionEfectivo = () => {

    const [selectedOption, setSelectedOption] = useState('efectivoUSD');

    const handleRadioChange = ({ target: { value } }) => {
        setSelectedOption(value);
    };

    return(
        <>
        <div className="search-options d-flex justify-content-center align-items-center mt-3">
            <div className="radio-options m-2">
                <div className="form-check custom-radio">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="efectivoUSD"
                        id="efectivoUSD"
                        value="efectivoUSD"
                        onChange={handleRadioChange}
                        checked={selectedOption === "efectivoUSD"}
                        autoComplete="off"
                    />
                    <label className="form-check-label" htmlFor="efectivoUSD">
                        <strong>USD</strong>
                    </label>
                </div>
                <div className="form-check custom-radio">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="efectivoMXP"
                        id="efectivoMXP"
                        value="efectivoMXP"
                        onChange={handleRadioChange}
                        checked={selectedOption === "efectivoMXP"}
                        autoComplete="off"
                    />
                    <label className="form-check-label" htmlFor="efectivoMXP">
                        <strong>MXP</strong>
                    </label>
                </div>
            </div>
        </div>
        <ConsultaEfectivo operacion={selectedOption}/>
    </>
    );
}