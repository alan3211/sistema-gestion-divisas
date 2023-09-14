import {ConsultaTesoreria} from "../tesoreria/ConsultaTesoreria";
import {OperacionTesoreria} from "../tesoreria/operacion/OperacionTesoreria";
import {EstatusDotaciones} from "../tesoreria/EstatusDotaciones";
import {RecepcionValores} from "../tesoreria/RecepcionValores";
import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {ToastContainer} from "react-toastify";
import {EnvioValoresSucursal} from "./EnvioValoresSucursal";
import {DotacionCajaSucursal} from "./DotacionCajaSucursal";
import {EstatusOperacionesSucursal} from "./operaciones/EstatusOperacionesSucursal";
import {ConsultasSucursal} from "./ConsultasSucursal";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";

export const SucursalOperativa = () => {
    const moduleName= {
        title: 'Operación',
        module: "Sucursal Operativa",
        icon: "bi bi-building me-2"
    };

    const tabs = [
        {id:'envio-valores',name:'Envío de Valores',icon:'bi bi-truck me-2', element: <EnvioValoresSucursal/>},
        {id:'dota-caja',name:'Dotar Caja',icon:'ri ri-store-2-line me-2',element:<DotacionCajaSucursal/>},
        {id:'estatus-opera',name:'Estatus Operaciones',icon:'ri ri-dashboard-2-line me-2',element: <EstatusOperacionesSucursal/>},
        {id:'consultas',name:'Consultas',icon:'ri ri-search-line me-2',element: <ConsultasSucursal/>},
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