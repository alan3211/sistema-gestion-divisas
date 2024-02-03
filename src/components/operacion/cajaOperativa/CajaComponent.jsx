import {CardLayout, Layout} from "../../commons";
import {CajaProvider} from "../../../context/caja/CajaProvider";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {EntregaComponent} from "./EntregaComponent";
import {TabsLayout} from "../../commons/tabs";
import {TipoConsultas} from "./consultas/TipoConsultas";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const CajaComponent = () => {

    const moduleName= {
        title: 'Operación',
        module: "Caja",
        icon: "bi bi-cash-stack me-2"
    };

    const tabs = [
        {id:'consulta',name:'Consultas',icon:'bi bi-search me-2', element: <TipoConsultas/>},
        {id:'entrega',name:'Entrega',icon:'bi bi-arrow-right-circle me-2',element:<EntregaComponent/>},
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
        <CajaProvider>
            <Layout moduleName={moduleName}>
                <CardLayout title={moduleName.module} icon={moduleName.icon}>
                    <DenominacionProvider>
                        <TabsLayout tabs={tabs}/>
                    </DenominacionProvider>
                </CardLayout>
            </Layout>
        </CajaProvider>
    );
}