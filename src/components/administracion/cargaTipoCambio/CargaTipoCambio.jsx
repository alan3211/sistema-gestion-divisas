import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {CargaTipoCambioOpera} from "./CargaTipoCambioOpera";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

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

    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el localStorage está vacío
        const localStorageIsEmpty = Object.keys(localStorage).length === 0;
        // Si está vacío, redirigir a "/"
        if (localStorageIsEmpty) {
            navigate("/")
        }
    }, [Object.keys(localStorage).length]);

    return (
        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.title} icon={moduleName.icon}>
                <TabsLayout tabs={tabs}/>
            </CardLayout>
        </Layout>
    )
}