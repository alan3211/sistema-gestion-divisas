import {useEffect, useState} from "react";
import {getConsultaSaldoCuenta} from "../services/operacion-tesoreria";

export const useSaldo =  () => {

    const [saldoGeneral,setSaldoGeneral] = useState();

    useEffect(() => {
        const getConsultaTesoreria = async ()=> {
            const {saldo_cuenta} = await getConsultaSaldoCuenta();
            if (saldo_cuenta){
                setSaldoGeneral(saldo_cuenta);
            }else{
                setSaldoGeneral(0);
            }
        }
        getConsultaTesoreria();
    }, []);

    console.log("saldoGeneral");
    console.log(saldoGeneral);
    return saldoGeneral;
}