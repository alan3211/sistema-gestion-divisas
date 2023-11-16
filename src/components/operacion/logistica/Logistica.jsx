import {ConsultaTesoreria} from "../tesoreria/ConsultaTesoreria";
import {OperacionTesoreria} from "../tesoreria/operacion/OperacionTesoreria";
import {EstatusDotaciones} from "../tesoreria/EstatusDotaciones";
import {RecepcionValores} from "../tesoreria/RecepcionValores";
import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";

export const Logistica = () => {
    const moduleName= {
        title: 'Operación',
        module: "Logística",
        icon: "ri ri-hand-coin-fill me-2"
    };

    const tabs = [
        {id:'consulta',name:'Consulta',icon:'ri ri-search-line me-2', element: <ConsultaTesoreria type="logistica"/>},
        {id:'asigna-fondos',name:'Asignación de Fondos',icon:'ri ri-store-2-line me-2',element:<OperacionTesoreria/>},
        {id:'estatus-reportes',name:'Reportes',icon:'ri ri-dashboard-2-line me-2',element: <EstatusDotaciones/>},
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