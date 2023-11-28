import {useState} from "react";

import {SolicitaDotacionBoveda} from "./SolicitaDotacionBoveda";
import {ConsultaBovedas} from "./ConsultaBovedas";
import {DotacionesProvider} from "../../../context/dotaciones/DotacionesProvider";

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
                        />
                        <label className="form-check-label" htmlFor="consultaBovedas">
                            <strong>Consulta Dotación a Bóvedas</strong>
                        </label>
                    </div>
                </div>
            </div>

            {
                selectedOption === 'solBoveda'
                    ?   <DotacionesProvider><SolicitaDotacionBoveda perfil={perfil}/></DotacionesProvider>
                    : <ConsultaBovedas perfil={perfil}/>
            }
        </>
    );
}