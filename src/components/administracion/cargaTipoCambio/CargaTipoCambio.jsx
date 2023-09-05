import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {useContext} from "react";
import {CargaTipoCambioContext} from "../../../context/CargaTipoCambio/CargaTipoCambioContext";
import {CargaTipoCambioOpera} from "./CargaTipoCambioOpera";
import {ToastContainer} from "react-toastify";


export const CargaTipoCambio = () => {

    const {showTab} = useContext(CargaTipoCambioContext);

    const moduleName= {
        title: "Carga Tipo Cambio",
        icon: "bi bi-currency-exchange me-2"
    }

    const options = [
        {id:'Todos',defecto:showTab.tab1,name:'Todos',icon:'bi bi-box me-2',pestania:0},
        {id:'Region',defecto:showTab.tab2,name:'Región',icon:'bi bi-globe-americas me-2',pestania:1},
        {id:'Sucusal',defecto:showTab.tab3,name:'Sucursal',icon:'bi bi-building me-2',pestania:2},
    ]

    return (
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.title} icon={moduleName.icon}>
                <TabsLayout options={options}>
                    <CargaTipoCambioOpera/>
                </TabsLayout>
            </CardLayout>
            <ToastContainer/>
        </Layout>
    )
}