import {useEffect, useState} from "react";
import {getConsultaSaldoCuenta, getConsultaSaldoCuentaEfectivo} from "../services/operacion-tesoreria";

export const useSaldo =  (tipo) => {

    const [saldoGeneral,setSaldoGeneral] = useState();

    useEffect(() => {
        const getConsultaTesoreria = async ()=> {
            let res;
            if(tipo === 1){
                res = await getConsultaSaldoCuenta();
            }else{
                res = await getConsultaSaldoCuentaEfectivo();
            }

            if (res.saldo_cuenta){
                setSaldoGeneral(res.saldo_cuenta);
            }else{
                setSaldoGeneral(0);
            }
        }
        getConsultaTesoreria();
    }, []);


    return saldoGeneral;
}