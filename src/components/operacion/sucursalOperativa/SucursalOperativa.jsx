import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {DotacionCajaSucursal} from "./DotacionCajaSucursal";
import {EstatusOperacionesSucursal} from "./operaciones/EstatusOperacionesSucursal";
import {ConsultasSucursal} from "./ConsultasSucursal";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {CierreSucursal} from "./CierreSucursal";
import {RecepcionValores} from "../tesoreria/RecepcionValores";

export const SucursalOperativa = () => {
    const moduleName= {
        title: 'Operación',
        module: "Sucursal Operativa",
        icon: "bi bi-building me-2"
    };

    const tabs = [
        {id:'envio-valores',name:'Envío de Valores',icon:'bi bi-truck me-2', element: <RecepcionValores/>},
        {id:'dota-caja',name:'Dotar Caja',icon:'ri ri-store-2-line me-2',element:<DotacionCajaSucursal/>},
        {id:'estatus-opera',name:'Estatus Operaciones',icon:'ri ri-dashboard-2-line me-2',element: <EstatusOperacionesSucursal/>},
        {id:'consultas',name:'Consultas',icon:'ri ri-search-line me-2',element: <ConsultasSucursal/>},
        {id:'cierre-sucursal',name:'Cierre Sucursal',icon:'bi bi-door-closed-fill me-2',element: <CierreSucursal/>},
    ];

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