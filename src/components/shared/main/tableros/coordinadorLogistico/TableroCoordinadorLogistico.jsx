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
import {MovimientosSucursal} from "../MovimientosSucursal";
import {TableroDotacionesCaja} from "../TableroDotacionesCaja";
import {ReporteCompraVenta} from "../ReporteCompraVenta";

export const TableroCoordinadorLogistico = () => {

    const [datosActividad, setDatosActividad] = useState([]);
    const [showDataActividad, setShowDataActividad] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const estadistica = useEstadisticas([2, 3, 4,5,6,7]);
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
        getActividadReciente();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getActividadReciente();
        }, 60000);

        return () => clearInterval(interval);
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
                        <ReporteCompraVenta data={estadistica[5] || {}}/>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-12">
                        <TableroUsuariosSistema/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <MovimientosSucursal data={estadistica[3] || {}}/>
                    </div>
                    <div className="col-md-6">
                        <TableroDotacionesCaja data={estadistica[4] || {}}/>
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