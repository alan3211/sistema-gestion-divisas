import {useState} from "react";
import {CierreComponent} from "./CierreComponent";
import {TraspasoComponent} from "./TraspasoComponent";

import './estilos.css';

export const EntregaComponent = () => {

    const [selectedOption, setSelectedOption] = useState("cierre");

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
                selectedOption === 'cierre'
                ? <CierreComponent/>
                : <TraspasoComponent/>
            }

        </>
    );
}