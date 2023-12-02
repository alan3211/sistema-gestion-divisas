import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {ConsultaTesoreria} from "./ConsultaTesoreria";
import {EstatusDotaciones} from "./EstatusDotaciones";
import {OperacionTesoreria} from "./operacion/OperacionTesoreria";
import {RecepcionValores} from "./RecepcionValores";
import {Bovedas} from "../bovedas/Bovedas";
import {ConsultaBovedas} from "../bovedas/ConsultaBovedas";

export const Tesoreria = () => {

    const moduleName= {
        title: 'Operación',
        module: "Tesorería",
        icon: "bi bi-safe me-2"
    };

    const tabs = [
        {id:'consulta',name:'Consulta',icon:'ri ri-search-line me-2', element: <ConsultaTesoreria type="tesoreria"/>},
        {id:'dota-suc',name:'Operación Tesorería',icon:'ri ri-store-2-line me-2',element:<OperacionTesoreria perfil="T"/>},
        {id:'estatus-boveda',name:'Fondos Enviados a Boveda',icon:'bi bi-file-earmark-text me-2',element: <ConsultaBovedas perfil="T"/>},
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