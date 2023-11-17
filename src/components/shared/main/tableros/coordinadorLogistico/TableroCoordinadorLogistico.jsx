import {CompraVentaProvider} from "../../../../../context/compraVenta/CompraVentaProvider";
import {TipoCambioComponent} from "../../../../operacion/compraVenta";
import {TableroActividad} from "../TableroActividad";
import React, {useEffect, useState} from "react";
import {encryptRequest} from "../../../../../utils";
import {obtieneActividadReciente} from "../../../../../services/tools-services";

export const TableroCoordinadorLogistico = () => {

    const [datosActividad, setDatosActividad] = useState([]);
    const [showDataActividad,setShowDataActividad] = useState(false);

    const getActividadReciente = async () =>{

        const valores = {
            tipo: 1,
        }

        const encryptedData = encryptRequest(valores);

        const {result_set,total_rows} = await obtieneActividadReciente(encryptedData);

        if (total_rows === 0){
            setShowDataActividad(false);
            setDatosActividad([]);
        }else{
            setShowDataActividad(true);
            setDatosActividad(result_set);
        }

    }



    useEffect(() => {
        // Simula una notificación periódica
        const interval = setInterval(() => {
            getActividadReciente()
        }, 1000);

        return () => clearInterval(interval);
    }, [datosActividad]);

    return(

        <section className="section dashboard">
            <div className="row">
                <div className="col-md-4">
                    <TableroActividad data={datosActividad} showDataActividad={showDataActividad}/>
                </div>
                <div className="col-md-8">
                    <CompraVentaProvider><TipoCambioComponent/></CompraVentaProvider>
                </div>
            </div>
        </section>

    );
}