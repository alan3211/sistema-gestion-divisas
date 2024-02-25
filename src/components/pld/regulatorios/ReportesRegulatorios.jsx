import {EnvioOperaciones} from "../../operacion/sucursalOperativa/operaciones/EnvioOperaciones";
import {DotacionCajaSucursal} from "../../operacion/sucursalOperativa/DotacionCajaSucursal";
import {EstatusOperacionesSucursal} from "../../operacion/sucursalOperativa/operaciones/EstatusOperacionesSucursal";
import {ConsultasSucursal} from "../../operacion/sucursalOperativa/ConsultasSucursal";
import {CierreSucursal} from "../../operacion/sucursalOperativa/CierreSucursal";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {Relevantes} from "./relevantes/Relevantes";

export const ReportesRegulatorios = () => {
    const moduleName= {
        title: 'PLD',
        module: "Reportes Regulatorios",
        icon: "bi bi-file-earmark-text me-2"
    };

    const tabs = [
        {id:'relevantes', name:'Relevantes $5,000 USD', icon:'bi bi-currency me-2', element: <Relevantes/>},
        {id:'dolares-efectivo', name:'Dolares en Efectivo $1,000 USD', icon:'bi bi-currency-dollar me-2', element:<Relevantes/>},
        {id:'montos-totales', name:'Montos Totales', icon:'bi bi-bar-chart-line me-2', element: <Relevantes/>},
        {id:'inusuales', name:'Inusuales', icon:'bi bi-binoculars-fill me-2', element: <Relevantes/>},
        {id:'interna-preocupante', name:'Interna Preocupante', icon:'bi bi-door-closed-fill me-2', element: <Relevantes/>},
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