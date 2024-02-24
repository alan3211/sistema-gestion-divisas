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
        <div className="row">
            <div className="text-center">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                    <tr style={{maxWidth:"300px"}}>
                        <th style={{maxWidth:"100px"}}>Moneda</th>
                        <th style={{maxWidth:"100px"}}>Compra</th>
                        <th style={{maxWidth:"100px"}}>Venta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currencies.map((currency, index) => {
                        const compraName = `compra_${currency.divisa}`;
                        const ventaName = `venta_${currency.divisa}`;

                        return (
                            <tr key={currency.divisa}>
                                <td>
                                    <img src={imageMap[currency.divisa]} width={30} height={30} className="m-3" alt={currency.divisa} />
                                    <strong>{currency.divisa}</strong>
                                </td>
                                <td style={{ maxWidth: '100px', wordWrap: 'break-word' }}>
                                    <div>
                                        <input
                                            type="text"
                                            className={`form-control mt-4 ${errors && errors[compraName] ? "is-invalid" : ""}`}
                                            name={compraName}
                                            placeholder="$"
                                            autoComplete="off"
                                            {...register(compraName, {
                                                validate: {
                                                    moneda: (value) => validarMoneda(`Compra ${currency.divisa}`, value),
                                                },
                                            })}
                                        />
                                        {errors && errors[compraName] && (
                                            <div className="invalid-feedback">
                                                <div style={{ maxWidth: '10px',wordWrap: 'break-word' }}>
                                                    {errors[compraName].message}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td style={{ maxWidth: '100px', wordWrap: 'break-word' }}>
                                    <div>
                                        <input
                                            type="text"
                                            className={`form-control mt-4 ${errors && errors[ventaName] ? "is-invalid" : ""}`}
                                            name={ventaName}
                                            placeholder="$"
                                            autoComplete="off"
                                            {...register(ventaName, {
                                                validate: {
                                                    moneda: (value) => validarMoneda(`Venta ${currency.divisa}`, value),
                                                },
                                            })}
                                        />
                                        {errors && errors[ventaName] && (
                                            <div className="invalid-feedback" style={{ maxWidth: '30px', wordWrap: 'break-word' }}>
                                                <div style={{ maxWidth: '10px',wordWrap: 'break-word' }}>
                                                    {errors[ventaName].message}
                                                </div>
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