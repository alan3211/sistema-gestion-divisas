import {useEffect, useState} from "react";
import {dataG} from "../App";
import {encryptRequest, formattedDate} from "../utils";
import {consultaCaja} from "../services";
import {useCatalogo} from "./useCatalogo";

export const useCaja = () => {
    const [data, setData] = useState([]);
    const catalogo = useCatalogo([15]);

    // Crear objeto para almacenar los objetos agrupados por moneda

    const groupedData = {};

// Iterar a través de los objetos y agruparlos por moneda
    for (const obj of data) {
        const moneda = obj.moneda;
        if (!groupedData[moneda]) {
            groupedData[moneda] = [];
        }
        groupedData[moneda].push(obj);
    }

    // Extraer cuatro objetos de cada grupo de moneda
    const extractedData = {};
    for (const moneda in groupedData) {
        if (groupedData.hasOwnProperty(moneda)) {
            extractedData[moneda] = groupedData[moneda];
        }
    }

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

    return{
        extractedData,
        catalogo,
        getIconAndClass,
        getCurrencyIcon
    }

}