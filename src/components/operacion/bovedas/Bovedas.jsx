import {useState} from "react";

import {SolicitaDotacionBoveda} from "./SolicitaDotacionBoveda";
import {ConsultaBovedas} from "./ConsultaBovedas";
import {DotacionesProvider} from "../../../context/dotaciones/DotacionesProvider";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";

export const Bovedas = ({perfil}) => {

    const [selectedOption, setSelectedOption] = useState("solBoveda");

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
                            name="solBoveda"
                            id="solBoveda"
                            value="solBoveda"
                            onChange={handleRadioChange}
                            checked={selectedOption === "solBoveda"}
                            autoComplete="off"
                        />
                        <label className="form-check-label" htmlFor="solBoveda">
                            <strong>Solicitud Dotación a Bóvedas</strong>
                        </label>
                    </div>
                    <div className="form-check custom-radio">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="consultaBovedas"
                            id="consultaBovedas"
                            value="consultaBovedas"
                            onChange={handleRadioChange}
                            checked={selectedOption === "consultaBovedas"}
                            autoComplete="off"
                        />
                        <label className="form-check-label" htmlFor="consultaBovedas">
                            <strong>Consulta Dotación a Bóvedas</strong>
                        </label>
                    </div>
                </div>
            </div>

            {
                selectedOption === 'solBoveda'
                    ?   <DenominacionProvider><SolicitaDotacionBoveda perfil={perfil}/></DenominacionProvider>
                    : <ConsultaBovedas perfil={perfil}/>
            }
        </>
    );
}