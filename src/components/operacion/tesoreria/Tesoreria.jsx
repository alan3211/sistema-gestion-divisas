import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {ToastContainer} from "react-toastify";
import {ConsultaTesoreria} from "./ConsultaTesoreria";
import {EstatusDotaciones} from "./EstatusDotaciones";
import {OperacionTesoreria} from "./operacion/OperacionTesoreria";
import {RecepcionValores} from "./RecepcionValores";

export const Tesoreria = () => {

    const moduleName= {
        title: 'Operación',
        module: "Tesorería",
        icon: "bi bi-safe me-2"
    };

    const tabs = [
        {id:'consulta',name:'Consulta',icon:'ri ri-search-line me-2', element: <ConsultaTesoreria/>},
        {id:'dota-suc',name:'Operación Tesorería',icon:'ri ri-store-2-line me-2',element:<OperacionTesoreria/>},
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