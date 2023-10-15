import {useState} from "react";
import {CierreComponent} from "./CierreComponent";
import {TraspasoComponent} from "./TraspasoComponent";

import './estilos.css';
import {CierreParcialComponent} from "./CierreParcialComponent";

export const EntregaComponent = () => {

    const [selectedOption, setSelectedOption] = useState("cierre_parcial");

    const handleRadioChange = ({target:{value}}) => {
        setSelectedOption(value);
    };

    const MODULO = {
        "cierre_parcial": <CierreParcialComponent/>,
        "cierre": <CierreComponent/>,
        "traspaso": <TraspasoComponent/>,

    }

    return(
        <>

            <div className="search-options d-flex justify-content-center align-items-center mt-3">
                <div className="radio-options m-2">
                    <div className="form-check custom-radio">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="cierre_parcial"
                            id="cierre_parcial"
                            value="cierre_parcial"
                            onChange={handleRadioChange}
                            checked={selectedOption === "cierre_parcial"}
                        />
                        <label className="form-check-label" htmlFor="cierre_parcial">
                            <strong>Cierre Parcial</strong>
                        </label>
                    </div>
                    <div className="form-check custom-radio">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="cierre"
                            id="cierre"
                            value="cierre"
                            onChange={handleRadioChange}
                            checked={selectedOption === "cierre"}
                        />
                        <label className="form-check-label" htmlFor="cierre">
                            <strong>Cierre</strong>
                        </label>
                    </div>
                    <div className="form-check custom-radio">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="traspaso"
                            id="traspaso"
                            value="traspaso"
                            onChange={handleRadioChange}
                            checked={selectedOption === "traspaso"}
                        />
                        <label className="form-check-label" htmlFor="traspaso">
                            <strong>Traspaso</strong>
                        </label>
                    </div>
                </div>
            </div>

            {
                MODULO[selectedOption]
            }

        </>
    );
}