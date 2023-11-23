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
        {id:'consulta',name:'Análisis de Fondos',icon:'bi bi-bar-chart-fill me-2', element: <ConsultaTesoreria type="logistica"/>},
        {id:'estatus-reportes',name:'Reportes',icon:'bi bi-file-earmark-text me-2',element: <EstatusDotaciones/>},
        {id:'asigna-fondos',name:'Estatus Fondos Enviados a Sucursal',icon:'ri ri-store-2-line me-2',element:<OperacionTesoreria/>},
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