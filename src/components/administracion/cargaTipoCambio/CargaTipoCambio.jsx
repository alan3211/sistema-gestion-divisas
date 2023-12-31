import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {CargaTipoCambioOpera} from "./CargaTipoCambioOpera";

export const CargaTipoCambio = () => {

    const moduleName= {
        title: "Tipo Cambio",
        icon: "bi bi-currency-exchange me-2",
        module:'Carga'
    }

    const tabs = [
        {id:'Todos',name:'Todos',icon:'bi bi-box me-2',pestania:0,element: <CargaTipoCambioOpera id="Todos"/>},
        {id:'Region',name:'Región',icon:'bi bi-globe-americas me-2',pestania:1,element: <CargaTipoCambioOpera id="Region"/>},
        {id:'Sucursal',name:'Sucursal',icon:'bi bi-building me-2',pestania:2,element: <CargaTipoCambioOpera id="Sucursal"/>},
    ]

    return (
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.title} icon={moduleName.icon}>
                <TabsLayout tabs={tabs}/>
            </CardLayout>
        </Layout>
    )
}