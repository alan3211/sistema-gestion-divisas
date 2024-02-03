import {CompraVentaProvider} from "../../../../../context/compraVenta/CompraVentaProvider";
import {TipoCambioComponent} from "../../../../operacion/compraVenta";
import {TableroActividad} from "../TableroActividad";
import React, {useEffect, useState} from "react";
import {encryptRequest} from "../../../../../utils";
import {obtieneActividadReciente} from "../../../../../services/tools-services";
import {Ventas} from "../Ventas";
import {Compras} from "../Compras";
import {useEstadisticas} from "../../../../../hook/useEstadisticas";
import {UltimosMovimientos} from "../UltimosMovimientos";
import {TableroUsuariosSistema} from "../TableroUsuariosSistema";

export const TableroCoordinadorLogistico = () => {

    const [datosActividad, setDatosActividad] = useState([]);
    const [showDataActividad, setShowDataActividad] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const estadistica = useEstadisticas([2, 3, 4]);
    const getActividadReciente = async () => {

        const valores = {
            tipo: 1,
        }

        const encryptedData = encryptRequest(valores);

        const {result_set, total_rows} = await obtieneActividadReciente(encryptedData);

        if (total_rows === 0) {
            setShowDataActividad(false);
            setDatosActividad([]);
        } else {
            setShowDataActividad(true);
            setDatosActividad(result_set);
        }

    }

    useEffect(() => {
        // Simula una notificación periódica
        const interval = setInterval(() => {
            getActividadReciente()
        }, 60000);

        return () => clearInterval(interval);
    }, [datosActividad]);

    useEffect(() => {
        getActividadReciente();
    }, []);

    useEffect(() => {
        if (estadistica && estadistica.length !== 0) {
            setIsLoading(false);
        }
    }, [estadistica]);

    return (

        <section className="section dashboard">
            {!isLoading && (<>
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <Ventas data={estadistica[0]?.result_set?.[0] || {}}/>
                            </div>
                            <div className="col-md-6">
                                <Compras data={estadistica[1]?.result_set?.[0] || {}}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <CompraVentaProvider><TipoCambioComponent/></CompraVentaProvider>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <TableroUsuariosSistema/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <UltimosMovimientos data={estadistica[2] || []}/>
                    </div>
                    <div className="col-md-4">
                        <TableroActividad data={datosActividad} showDataActividad={showDataActividad}/>
                    </div>
                </div>
            </>)}
        </section>

    );
}