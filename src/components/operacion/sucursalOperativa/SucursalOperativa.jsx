import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {DotacionCajaSucursal} from "./DotacionCajaSucursal";
import {EstatusOperacionesSucursal} from "./operaciones/EstatusOperacionesSucursal";
import {ConsultasSucursal} from "./ConsultasSucursal";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {CierreSucursal} from "./CierreSucursal";
import {EnvioOperaciones} from "./operaciones/EnvioOperaciones";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const SucursalOperativa = () => {
    const moduleName= {
        title: 'Operación',
        module: "Sucursal Operativa",
        icon: "bi bi-building me-2"
    };

    const tabs = [
        {id:'envio-valores',name:'Envío de Valores',icon:'bi bi-truck me-2', element: <EnvioOperaciones opcion={2}/>},
        {id:'dota-caja',name:'Dotar Caja',icon:'ri ri-store-2-line me-2',element:<DotacionCajaSucursal/>},
        {id:'estatus-opera',name:'Estatus Operaciones',icon:'ri ri-dashboard-2-line me-2',element: <EstatusOperacionesSucursal/>},
        {id:'consultas',name:'Consultas de Fondos',icon:'ri ri-search-line me-2',element: <ConsultasSucursal/>},
        {id:'cierre-sucursal',name:'Cierre Sucursal',icon:'bi bi-door-closed-fill me-2',element: <CierreSucursal/>},
    ];

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);

    return (
        <>
            <Layout moduleName={moduleName}>
                <CardLayout title={moduleName.module} icon={moduleName.icon}>
                    <DenominacionProvider>
                        <TabsLayout tabs={tabs}/>
                    </DenominacionProvider>
                </CardLayout>
            </Layout>

        </>
    );
}