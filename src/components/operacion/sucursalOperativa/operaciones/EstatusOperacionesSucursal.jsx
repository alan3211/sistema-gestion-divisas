import { useState} from "react";
import {EnvioOperaciones} from "./EnvioOperaciones";
import {RecepcionOperacion} from "./RecepcionOperacion";

export const EstatusOperacionesSucursal = () => {
    const [selectedOption, setSelectedOption] = useState("recepcionOp");

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
                            name="recepcionOp"
                            id="recepcionOp"
                            value="recepcionOp"
                            onChange={handleRadioChange}
                            checked={selectedOption === "recepcionOp"}
                        />
                        <label className="form-check-label" htmlFor="recepcionOp">
                            <strong>Recepción de Operaciones</strong>
                        </label>
                    </div>
                    <div className="form-check custom-radio">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="envioOp"
                            id="envioOp"
                            value="envioOp"
                            onChange={handleRadioChange}
                            checked={selectedOption === "envioOp"}
                        />
                        <label className="form-check-label" htmlFor="envioOp">
                            <strong>Envío Operaciones</strong>
                        </label>
                    </div>
                </div>
            </div>

            {
                selectedOption === 'recepcionOp'
                    ? <RecepcionOperacion/>
                    : <EnvioOperaciones/>
            }
        </>);
}