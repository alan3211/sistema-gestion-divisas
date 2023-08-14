import {useContext, useState} from "react";
import {CargaTipoCambioContext} from "../../../context/CargaTipoCambio/CargaTipoCambioContext";

export const TipoCambioForm = () => {

    const  currencies = [
        {divisa:'USD',compra:0.0,venta:0.0},
        {divisa:'EUR',compra:0.0,venta:0.0},
        {divisa:'GBR',compra:0.0,venta:0.0},
    ]
    const [newCurrency, setNewCurrency] = useState({ divisa: "", compra: "", venta: "" });

    const {formValues,handleInputChange} = useContext(CargaTipoCambioContext);

    return(
            <div className="container text-center">
                <table className="table table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th>Moneda</th>
                        <th>Compra</th>
                        <th>Venta</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currencies.map((currency, index) => (
                        <tr key={index}>
                            <td>{currency.divisa}</td>
                            <td> <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="compra"
                                    placeholder="$"
                                    value={newCurrency.compra}
                                    onChange={handleInputChange}
                                />
                            </div>
                            </td>
                            <td>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="venta"
                                        placeholder="$"
                                        value={newCurrency.venta}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            )
}