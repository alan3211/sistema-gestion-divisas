import {ConsultaTesoreria} from "../tesoreria/ConsultaTesoreria";
import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {Bovedas} from "../bovedas/Bovedas";
import {FondosSucursal} from "./FondosSucursal";
import {EstatusDotaciones} from "../tesoreria/EstatusDotaciones";
import {DenominacionProvider} from "../../../context/denominacion/DenominacionProvider";
import {SolicitudValores} from "./SolicitudValores";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const Logistica = () => {
    const moduleName= {
        title: 'Operación',
        module: "Logística",
        icon: "ri ri-hand-coin-fill me-2"
    };

    const tabs = [
        {id:'consulta',name:'Análisis de Fondos',icon:'bi bi-bar-chart-fill me-2', element: <ConsultaTesoreria type="logistica"/>},
        {id:'estatus-boveda',name:'Fondos Enviados a Boveda',icon:'bi bi-file-earmark-text me-2',element: <Bovedas perfil="L"/>},
        {id:'asigna-fondos',name:'Fondos Enviados a Sucursal',icon:'ri ri-store-2-line me-2',element:<FondosSucursal/>},
        {id:'estatus-dot',name:'Estatus Dotaciones',icon:'ri ri-dashboard-2-line me-2',element: <EstatusDotaciones/>},
        {id:'solicita-valores',name:'Solicitud de Valores a Sucursal',icon:'bi bi-receipt me-2',element: <SolicitudValores/>},
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
                    <DenominacionProvider>
                        <TabsLayout tabs={tabs}/>
                    </DenominacionProvider>
                </CardLayout>
            </Layout>

        </>
    );
}