
import {useEffect, useState} from "react";
import {dataG} from "../../../App";
import {consultaCantidadDivisasCaja, consultaCantidadDivisasSucursal} from "../../../services/operacion-sucursal";
import {ConsultaTotalesSuc} from "./ConsultaTotalesSuc";
import {encryptRequest} from "../../../utils";
import {ConsultaTotalesCajeros} from "./ConsultaTotalesCajeros";

export const ConsultasSucursal = () => {

    const [datos, setDatos] = useState([]);
    const [datosCaj, setDatosCaj] = useState([]);

    useEffect(() => {
        const getCantidadDivisasSucursal = async () => {
            const values = {
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaCantidadDivisasSucursal(encryptedData);
            if(result.total_rows > 0){
                setDatos(result.result_set);
            }else{
                setDatos([]);
            }
        }
        getCantidadDivisasSucursal();
    }, []);

    useEffect(() => {
        const getCantidadCajerosSucursal = async () => {
            const values = {
                sucursal: dataG.sucursal,
            }
            const encryptedData = encryptRequest(values);
            const result = await consultaCantidadDivisasCaja(encryptedData);
            console.log("RESULTADO: ", result);
            if(result){
                setDatosCaj(result);
            }else{
                setDatosCaj([]);
            }
        }
        getCantidadCajerosSucursal();
    }, []);

    return (
        <>
            <div className="justify-content-center mt-3">
                 <div className="card">
                     <h5 className="card-title ms-3">
                         <strong> Resumen Sucursal {dataG.sucursal}</strong>
                     </h5>
                     <div className="d-flex row">
                         <div className="col-md-4">
                             <ConsultaTotalesSuc data={datos} />
                         </div>
                         <div className="col-md-8">
                             <ConsultaTotalesCajeros data={datosCaj}/>
                         </div>
                     </div>
                 </div>
            </div>
        </>
    );
}