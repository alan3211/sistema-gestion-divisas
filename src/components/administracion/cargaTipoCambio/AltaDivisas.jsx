import {validarMoneda} from "../../../utils";
import {useContext} from "react";
import {CargaTipoCambioContext} from "../../../context/CargaTipoCambio/CargaTipoCambioContext";
import USASVG from "../../../assets/USA.svg";
import EuroSVG from "../../../assets/Europa.svg";
import LibraSVG from "../../../assets/GranBretana.svg";

export const AltaDivisas = () => {

    const {register, errors, currencies} = useContext(CargaTipoCambioContext);

    const imageMap = {
        USD: USASVG,
        EUR: EuroSVG,
        GBR: LibraSVG,
    };


    return (
        <div className="row text-center">
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>Moneda</th>
                        <th>Compra</th>
                        <th>Venta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currencies.map((currency, index) => {
                        const compraName = `compra_${currency.divisa}`;
                        const ventaName = `venta_${currency.divisa}`;

                        return (
                            <tr key={currency.divisa}>
                                <td>
                                    <img src={imageMap[currency.divisa]} width={30} height={30} className="m-2" alt={currency.divisa} />
                                    <strong>{currency.divisa}</strong>
                                </td>
                                <td>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors && errors[compraName] ? "is-invalid" : ""}`}
                                            name={compraName}
                                            placeholder="$"
                                            {...register(compraName, {
                                                validate: {
                                                    moneda: (value) => validarMoneda(`Compra ${currency.divisa}`, value),
                                                },
                                            })}
                                        />
                                        {errors && errors[compraName] && (
                                            <div className="invalid-feedback">
                                                {errors[compraName].message}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${errors && errors[ventaName] ? "is-invalid" : ""}`}
                                            name={ventaName}
                                            placeholder="$"
                                            {...register(ventaName, {
                                                validate: {
                                                    moneda: (value) => validarMoneda(`Venta ${currency.divisa}`, value),
                                                },
                                            })}
                                        />
                                        {errors && errors[ventaName] && (
                                            <div className="invalid-feedback">
                                                {errors[ventaName].message}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}