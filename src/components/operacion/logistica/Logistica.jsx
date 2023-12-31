import {ConsultaTesoreria} from "../tesoreria/ConsultaTesoreria";
import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {Bovedas} from "../bovedas/Bovedas";
import {FondosSucursal} from "./FondosSucursal";
import {EstatusDotaciones} from "../tesoreria/EstatusDotaciones";
import {RecepcionValores} from "../tesoreria/RecepcionValores";

export const Logistica = () => {
    const moduleName= {
        title: 'Operación',
        module: "Logística",
        icon: "ri ri-hand-coin-fill me-2"
    };

    const tabs = [
        {id:'consulta',name:'Análisis de Fondos',icon:'bi bi-bar-chart-fill me-2', element: <ConsultaTesoreria type="logistica"/>},
        {id:'estatus-boveda',name:'Fondos Enviados a Boveda',icon:'bi bi-file-earmark-text me-2',element: <Bovedas perfil="L"/>},
        {id:'asigna-fondos',name:'Fondos Enviados a Sucursal',icon:'ri ri-store-2-line me-2',element:<FondosSucursal/>},
        {id:'estatus-dot',name:'Estatus Dotaciones',icon:'ri ri-dashboard-2-line me-2',element: <EstatusDotaciones/>},
        {id:'recep-valores',name:'Recepción de Valores',icon:'bi bi-receipt me-2',element: <RecepcionValores/>},
    ];

    return (
        <>
            <Layout moduleName={moduleName}>
                <CardLayout title={moduleName.module} icon={moduleName.icon}>
                    <TabsLayout tabs={tabs}/>
                </CardLayout>
            </Layout>

        </>
    );
}