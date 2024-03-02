import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {CardLayout, Layout} from "../../commons";
import {AsignaReportes} from "./AsignaReportes";
import {TabsLayout} from "../../commons/tabs";
import {ConsultaReporte} from "./ConsultaReporte";

export const ReportesPrincipal = ()=>{
    const moduleName = {
        title: 'Administración',
        module: 'Asignación de Reportes',
        icon: "ri ri-file-chart-line me-2"
    }

    const tabs = [
        {id:'asignacion',name:'Distribución',icon:'bi bi-arrow-right-circle me-2', element: <AsignaReportes/>},
        {id:'consulta',name:'Consulta',icon:'bi bi-search me-2 me-2',element:<ConsultaReporte/>},
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

        <Layout moduleName={moduleName}>
            <CardLayout title={moduleName.module} icon={moduleName.icon}>
                <TabsLayout tabs={tabs}/>
            </CardLayout>
        </Layout>
    );
}


