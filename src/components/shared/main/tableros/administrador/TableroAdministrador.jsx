import React, {useEffect, useState} from "react";
import {useEstadisticas} from "../../../../../hook/useEstadisticas";
import {UltimosMovimientos} from "../UltimosMovimientos";
import {MovimientosSucursal} from "../MovimientosSucursal";
import {TableroDotacionesCaja} from "../TableroDotacionesCaja";
import {ReporteCompraVenta} from "../ReporteCompraVenta";

export const TableroAdministrador = () => {

    const [isLoading, setIsLoading] = useState(true);

    const estadistica = useEstadisticas([4,5,6,7]);

    useEffect(() => {
        if (estadistica && estadistica.length !== 0) {
            setIsLoading(false);
        }
    }, [estadistica]);

    return (

        <section className="section dashboard">
            {!isLoading && (<>

                <div className="row">
                    <div className="col-md-12">
                        <ReporteCompraVenta data={estadistica[3] || {}}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <MovimientosSucursal data={estadistica[1] || {}}/>
                    </div>
                    <div className="col-md-6">
                        <TableroDotacionesCaja data={estadistica[2] || {}}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <UltimosMovimientos data={estadistica[0] || []}/>
                    </div>
                </div>
            </>)}
        </section>

    );
}