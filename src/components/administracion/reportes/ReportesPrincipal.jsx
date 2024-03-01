import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {CardLayout, Layout} from "../../commons";
import {AsignaReportes} from "./AsignaReportes";

export const ReportesPrincipal = ()=>{
    const moduleName = {
        title: 'Administración',
        module: 'Asignación de Reportes'
    }

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
            <CardLayout title={moduleName.module} icon="bi bi-list p-1">
                <AsignaReportes/>
            </CardLayout>
        </Layout>
    );
}


