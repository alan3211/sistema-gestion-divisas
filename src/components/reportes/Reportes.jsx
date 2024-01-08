import {ConsultaTesoreria} from "../operacion/tesoreria/ConsultaTesoreria";
import {Bovedas} from "../operacion/bovedas/Bovedas";
import {FondosSucursal} from "../operacion/logistica/FondosSucursal";
import {EstatusDotaciones} from "../operacion/tesoreria/EstatusDotaciones";
import {RecepcionValores} from "../operacion/tesoreria/RecepcionValores";
import {CardLayout, Layout} from "../commons";
import {TabsLayout} from "../commons/tabs";
import {Consulta} from "./Consulta";

export const Reportes = () => {
    const moduleName= {
        title: 'Reportes',
        module: "Consulta Reportes",
        icon: "bi bi-file-earmark-text me-2"
    };

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