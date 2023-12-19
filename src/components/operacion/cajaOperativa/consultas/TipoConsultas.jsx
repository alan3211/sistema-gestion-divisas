import {useState} from "react";

import {DotacionComponent} from "../DotacionComponent";
import {ConsultaCaja} from "./ConsultaCaja";

import './estilos.css';

export const TipoConsultas = () => {

    const [selectedOption, setSelectedOption] = useState('dotacion');

    const handleRadioChange = ({target:{value}}) => {
        console.log("DE!",value)
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
                            name="dotacion"
                            id="dotacion"
                            value="dotacion"
                            onChange={handleRadioChange}
                            checked={selectedOption === "dotacion"}
                            autoComplete="off"
                        />
                        <label className="form-check-label" htmlFor="dotacion">
                            <strong>Dotación</strong>
                        </label>
                    </div>
                    <div className="form-check custom-radio">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="consulta_caja"
                            id="consulta_caja"
                            value="consulta_caja"
                            onChange={handleRadioChange}
                            checked={selectedOption === "consulta_caja"}
                            autoComplete="off"
                        />
                        <label className="form-check-label" htmlFor="consulta_caja">
                            <strong>Consulta</strong>
                        </label>
                    </div>
                </div>
            </div>

            {
                (selectedOption === 'dotacion')
                    ? <DotacionComponent/>
                    : <ConsultaCaja/>
            }

        </>
    );
}