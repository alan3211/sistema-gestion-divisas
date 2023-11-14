import {getTipoCambio} from "../services/operaciones-services";
import {useEffect, useState} from "react";
import USASVG from "../assets/USA.svg";
import EuroSVG from "../assets/Europa.svg";
import LibraSVG from "../assets/GranBretana.svg";
import {dataG} from "../App";
import {encryptRequest, formattedDate} from "../utils";

export const useFetchTipoCambio = () => {

    const formValues = {
        "sucursal": dataG.sucursal,
        "fechaCambio": formattedDate
    }

    const [valorTipoCambio,setValorTipoCambio] =  useState([]);
    const [valoresTipoCambio,setValoresTipoCambio] =  useState([]);

    const currencyMapping = {
        USD: { nombre_divisa: 'Dólar', icon: USASVG },
        EUR: { nombre_divisa: 'Euro', icon: EuroSVG },
        GBR: { nombre_divisa: 'Libra', icon: LibraSVG },
    };

    const obtieneTipoCambio = async () => {

        const encryptedData = encryptRequest(formValues);
        const valoresTipoCambio = await getTipoCambio(encryptedData);

        if(valoresTipoCambio.total_rows === 0){
            setValorTipoCambio([]);
            return;
        }

        valoresTipoCambio.result_set.map((elemento) => {
            const mapping = currencyMapping[elemento.Divisa];
            if (mapping) {
                elemento.nombre_divisa = mapping.nombre_divisa;
                elemento.icon = mapping.icon;
            }
            return elemento;
        });
        setValorTipoCambio(valoresTipoCambio.result_set);
        setValoresTipoCambio(valoresTipoCambio.headers);
        console.log(valorTipoCambio);
    }

    useEffect( () => {
        obtieneTipoCambio();
    },[]);

    return {
        dataTipoCambio: valorTipoCambio,
        headers: valoresTipoCambio,
    }
}