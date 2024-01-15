import {useState} from "react";
import {EnvioOperaciones} from "../sucursalOperativa/operaciones/EnvioOperaciones";
import {EnvioValoresSucursal} from "./EnvioValoresSucursal";
import {RecepcionValores} from "../tesoreria/RecepcionValores";

export const SolicitudValores = () => {
        const [selectedOption, setSelectedOption] = useState('solicitud_valores');

    const handleRadioChange = ({target:{value}}) => {
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
                            name="solicitud_valores"
                            id="solicitud_valores"
                            value="solicitud_valores"
                            onChange={handleRadioChange}
                            checked={selectedOption === "solicitud_valores"}
                            autoComplete="off"
                        />
                        <label className="form-check-label" htmlFor="solicitud_valores">
                            <strong>Solicitud de valores a Sucursal</strong>
                        </label>
                    </div>
                    <div className="form-check custom-radio">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="consulta_valores"
                            id="consulta_valores"
                            value="consulta_valores"
                            onChange={handleRadioChange}
                            checked={selectedOption === "consulta_valores"}
                            autoComplete="off"
                        />
                        <label className="form-check-label" htmlFor="consulta_valores">
                            <strong>Consulta de valores a Sucursal</strong>
                        </label>
                    </div>
                </div>
            </div>

            {
                (selectedOption === 'solicitud_valores')
                    ? <EnvioValoresSucursal/>
                    : <RecepcionValores/>
            }

        </>
    );
}