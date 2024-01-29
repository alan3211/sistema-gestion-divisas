import {ConsultaTesoreria} from "../operacion/tesoreria/ConsultaTesoreria";
import {Bovedas} from "../operacion/bovedas/Bovedas";
import {FondosSucursal} from "../operacion/logistica/FondosSucursal";
import {EstatusDotaciones} from "../operacion/tesoreria/EstatusDotaciones";
import {RecepcionValores} from "../operacion/tesoreria/RecepcionValores";
import {CardLayout, Layout} from "../commons";
import {TabsLayout} from "../commons/tabs";
import {Consulta} from "./Consulta";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const Reportes = () => {
    const moduleName= {
        title: 'Reportes',
        module: "Consulta Reportes",
        icon: "bi bi-file-earmark-text me-2"
    };

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
                    <Consulta/>
                </CardLayout>
            </Layout>

        </>
    );
}