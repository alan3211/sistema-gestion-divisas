import {useEffect, useState} from "react";
import {dataG} from "../App";
import {encryptRequest} from "../utils";
import {useCatalogo} from "./useCatalogo";
import {consultaCaja} from "../services/operacion-caja";

export const useCaja = () => {
    const [data, setData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const catalogo = useCatalogo([15]);

    const obtieneCajaActual = async () => {

        const values = {
            usuario: dataG.usuario,
            sucursal: dataG.sucursal,
        }
        const encryptedData = encryptRequest(values)
        const data = await consultaCaja(encryptedData);
        console.log("CAJA: ",data);
        setData(data);
        setShowTable(true);

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

    return{
        data,
        showTable,
        catalogo,
        getIconAndClass,
        getCurrencyIcon
    }

}