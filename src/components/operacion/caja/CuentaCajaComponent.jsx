import {dataG} from "../../../App";
import {encryptRequest, formattedDate, formattedDateDD, mensajeSinElementos} from "../../../utils";
import {consultaCaja} from "../../../services";
import {useEffect, useState} from "react";
import {MessageComponent} from "../../commons/";

export const CuentaCajaComponent = () => {

    const [data, setData] = useState([]);

    const obtieneCajaActual = async () => {

        const values = {
            usuario: dataG.usuario,
            fecha: formattedDate
        }
        const encryptedData = encryptRequest(values)
        const data = await consultaCaja(encryptedData);
        console.log("CAJA: ", data);
        setData(data);

    }

    const getIconAndClass = (noBilletesValue) => {
        const conditions = [
            {condition: noBilletesValue <= 0, icon: 'arrow-down-circle-fill me-2', class: 'text-danger'},
            {
                condition: noBilletesValue > 0 && noBilletesValue < 5,
                icon: 'exclamation-diamond-fill me-2',
                class: 'text-warning'
            },
            {condition: noBilletesValue >= 5, icon: 'arrow-up-circle-fill me-2', class: 'text-success'}
        ];

        const {icon, class: iconClass} = conditions.find(cond => cond.condition) || {};

        return {icon, iconClass};
    };

    const getCurrencyIcon = (moneda) => {
        switch (moneda) {
            case 'USD':
                return <i className="bi bi-currency-dollar me-2"></i>;
            case 'EUR':
                return <i className="bi bi-currency-euro me-2"></i>;
            case 'MXP':
                return <i className="bx bx-dollar me-2"></i>;
            case 'GBR':
                return <i className="bi bi-currency-pound me-2"></i>;
            default:
                return '';
        }
    };

    useEffect(() => {
        obtieneCajaActual();
    }, [])


    if (data.length === 0) {
        return (
            <>
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4">
                        <MessageComponent estilos={mensajeSinElementos}>
                            No hay información de cierre de este usuario del día: <strong>{formattedDateDD}</strong>
                        </MessageComponent>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <table className="table table-bordered table-hover text-center">
                    <thead className="table-dark">
                    <tr>
                        <th className="col-1">
                            <i className="ri ri-coin-fill me-2"></i>
                            Moneda
                        </th>
                        <th className="col-1">
                            <i className="bi bi-currency-exchange me-2"></i>
                            Denominación
                        </th>
                        <th className="col-1">
                            <i className="bi bi-arrow-up-circle-fill me-2"></i>
                            Entradas
                        </th>
                        <th className="col-1">
                            <i className="bi bi-arrow-down-circle-fill me-2"></i>
                            Salidas
                        </th>
                        <th className="col-1">
                            <i className="bi bi-hash me-2"></i>
                            No. de Billetes
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((elemento, index) => {
                        const noBilletesValue = parseInt(elemento.no_billetes, 10);
                        const {icon, iconClass} = getIconAndClass(noBilletesValue);

                        return (
                            <tr key={index} data-index={index}>
                                <td>
                                    {elemento.moneda}
                                </td>
                                <td>
                                    {getCurrencyIcon(elemento.moneda)}
                                    {parseFloat(elemento.denominacion).toFixed(2)}
                                </td>
                                <td>
                                    {parseFloat(elemento.entradas) !== 0 && (
                                        <strong>
                                            <i className="bi bi-arrow-up-circle-fill me-2 text-success"></i>
                                        </strong>
                                    )}
                                    {parseFloat(elemento.entradas).toFixed(2)}
                                </td>
                                <td>
                                    {parseFloat(elemento.salidas) !== 0 && (
                                        <strong>
                                            <i className="bi bi-arrow-down-circle-fill me-2 text-danger"></i>
                                        </strong>
                                    )}
                                    {parseFloat(elemento.salidas).toFixed(2)}
                                </td>
                                <td>
                                    <strong>
                                        <i className={`bi bi-${icon} ${iconClass}`}></i>
                                        {noBilletesValue}
                                    </strong>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </>);
    }
}