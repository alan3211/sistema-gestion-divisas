import {ConsultaTesoreria} from "../tesoreria/ConsultaTesoreria";
import {OperacionTesoreria} from "../tesoreria/operacion/OperacionTesoreria";
import {EstatusDotaciones} from "../tesoreria/EstatusDotaciones";
import {RecepcionValores} from "../tesoreria/RecepcionValores";
import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {Bovedas} from "../bovedas/Bovedas";

export const Logistica = () => {
    const moduleName= {
        title: 'Operación',
        module: "Logística",
        icon: "ri ri-hand-coin-fill me-2"
    };

    const tabs = [
        {id:'consulta',name:'Análisis de Fondos',icon:'bi bi-bar-chart-fill me-2', element: <ConsultaTesoreria type="logistica"/>},
        {id:'estatus-boveda',name:'Fondos Enviados a Boveda',icon:'bi bi-file-earmark-text me-2',element: <Bovedas perfil="L"/>},
        {id:'asigna-fondos',name:'Fondos Enviados a Sucursal',icon:'ri ri-store-2-line me-2',element:<OperacionTesoreria perfil="L"/>},
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