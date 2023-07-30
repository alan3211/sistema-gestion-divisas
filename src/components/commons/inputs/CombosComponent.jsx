import { FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import { GiMexico } from "react-icons/gi";
import './CombosComponent';

import USASVG from "../../../assets/USA.svg";
import EuroSVG from "../../../assets/Europa.svg";
import LibraSVG from "../../../assets/GranBretana.svg";

export const CombosComponent = ({name,valorInput,handleChange,nombre}) => {

    const currencies = [
        { name: "USD", icon:  USASVG },
        { name: "EUR", icon: EuroSVG },
        { name: "GBP", icon: LibraSVG },
        { name: "MXN", icon: <GiMexico /> },
    ];

    return (

        <div className="col-md-6">
            <div className="form-floating mb-3">
                <div className="select-container">
                    <div className="icon">
                        <FaDollarSign />
                    </div>
                    <select className="form-select input-group has-validation"
                        defaultValue=""
                        id={name}
                        name={name}
                        aria-label="moneda"
                        value={valorInput}
                        onChange={handleChange}
                        required
                    >
                        {currencies.map((currency) => (
                            <option key={currency.name} value={currency.name}>
                                {currency.icon} {currency.name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor={name}>{nombre}</label>
                </div>
            </div>
        </div>
    );

}