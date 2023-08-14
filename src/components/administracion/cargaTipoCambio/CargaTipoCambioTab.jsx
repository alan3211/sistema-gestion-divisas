import {Layout, CardLayout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {CargaTipoCambio} from "./CargaTipoCambio";
import {CargaTipoCambioProvider} from "../../../context/CargaTipoCambio/CargaTipoCambioProvider";
import {useState} from "react";

export const CargaTipoCambioTab = () => {

    const [pestania,setPestania] = useState(0)


    const moduleName = {
        title: 'Administración',
        module: 'Carga tipo de cambio'
    }

    const options = [
        {icon:'bi bi-box p-2',name:'Todas',id:'todos',pestania:0},
        {icon:'bi bi-globe-americas p-2',name:'Región',id:'region',pestania:1},
        {icon:'bi bi-building p-2',name:'Sucursal',id:'sucursal',pestania:2},
    ]

    return(
        <CargaTipoCambioProvider>
            <Layout moduleName={moduleName}>
                <CardLayout title={moduleName.module} icon="bx bxs-cloud-upload p-2">
                    <TabsLayout options={options}>
                        <CargaTipoCambio/>
                    </TabsLayout>
                </CardLayout>
            </Layout>
        </CargaTipoCambioProvider>
    )
}