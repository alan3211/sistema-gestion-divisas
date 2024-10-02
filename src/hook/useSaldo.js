import {useEffect, useState} from "react";
import {getConsultaSaldoCuenta, getConsultaSaldoCuentaEfectivo} from "../services/operacion-tesoreria";
import {encryptRequest} from "../utils";

export const useSaldo =  (tipo,data) => {

    const [saldoGeneral,setSaldoGeneral] = useState();

    useEffect(() => {
        const getConsultaTesoreria = async ()=> {
            let res;
            if(tipo === 1){
                res = await getConsultaSaldoCuenta();
            }else{
                console.log("DATA OPERATION ---> ",data)
                const values = {
                    moneda: data === 'efectivoUSD' ? 'USD':'MXP'
                }
                console.log("VALUES: ", values)
                const encryptedData = encryptRequest(values);
                res = await getConsultaSaldoCuentaEfectivo(encryptedData);
                console.log("VALORES ---> ",res)
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