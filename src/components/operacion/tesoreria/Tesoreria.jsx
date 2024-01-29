import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {ConsultaTesoreria} from "./ConsultaTesoreria";
import {OperacionTesoreria} from "./operacion/OperacionTesoreria";
import {ConsultaBovedas} from "../bovedas/ConsultaBovedas";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

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
    ];

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
        <>
            <Layout moduleName={moduleName}>
                <CardLayout title={moduleName.module} icon={moduleName.icon}>
                    <TabsLayout tabs={tabs}/>
                </CardLayout>
            </Layout>

        </>
    );

}