import {useEffect, useState} from "react";
import {getConsultaSaldoCuenta} from "../services/operacion-tesoreria";

export const useSaldo =  () => {

    const [saldoGeneral,setSaldoGeneral] = useState();

    useEffect(() => {
        const getConsultaTesoreria = async ()=> {
            const {saldo_cuenta} = await getConsultaSaldoCuenta();
            setSaldoGeneral(saldo_cuenta);
        }
        getConsultaTesoreria();
    }, [saldoGeneral]);

    return saldoGeneral;
}