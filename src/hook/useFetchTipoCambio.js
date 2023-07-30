import {getTipoCambio} from "../services/operaciones-services";
import {useEffect, useState} from "react";
import USASVG from "../assets/USA.svg";
import EuroSVG from "../assets/Europa.svg";
import LibraSVG from "../assets/GranBretana.svg";

export const useFetchTipoCambio = (formValues) => {

    const [valorTipoCambio,setValorTipoCambio] =  useState([]);

    const currencyMapping = {
        USD: { nombre_divisa: 'Dólar', icon: USASVG },
        EUR: { nombre_divisa: 'Euro', icon: EuroSVG },
        GBR: { nombre_divisa: 'Libra', icon: LibraSVG },
    };

    const obtieneTipoCambio = async () => {
        const  valoresTipoCambio = await getTipoCambio(formValues);

        if(valoresTipoCambio === null){
            setValorTipoCambio([]);
            return;
        }

        valoresTipoCambio.map((elemento) => {
            const mapping = currencyMapping[elemento.divisa];
            if (mapping) {
                elemento.nombre_divisa = mapping.nombre_divisa;
                elemento.icon = mapping.icon;
            }
            return elemento;
        });
        setValorTipoCambio(valoresTipoCambio);
    }

    useEffect( () => {
        obtieneTipoCambio();
    },[]);

    return {
        valoresTipoCambio: valorTipoCambio
    }
}