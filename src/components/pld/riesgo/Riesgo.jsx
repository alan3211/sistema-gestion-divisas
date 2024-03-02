import {EnvioOperaciones} from "../../operacion/sucursalOperativa/operaciones/EnvioOperaciones";
import {DotacionCajaSucursal} from "../../operacion/sucursalOperativa/DotacionCajaSucursal";
import {EstatusOperacionesSucursal} from "../../operacion/sucursalOperativa/operaciones/EstatusOperacionesSucursal";
import {ConsultasSucursal} from "../../operacion/sucursalOperativa/ConsultasSucursal";
import {CierreSucursal} from "../../operacion/sucursalOperativa/CierreSucursal";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {CardLayout, Layout} from "../../commons";
import {TabsLayout} from "../../commons/tabs";
import {ProductosServicios} from "./productosServicios/ProductosServicios";

export const Riesgo = () => {
    const moduleName= {
        title: 'PLD',
        module: "Riesgo",
        icon: "ri ri-alert-line me-2"
    };

    const tabs = [
        {id:'productos-servicios', name:'Productos y Servicios', icon:'bi bi-cart4 me-2', element: <ProductosServicios tipo={1}/>},
        {id:'tipos-usuarios', name:'Tipos de Usuarios', icon:'bi bi-person-plus-fill me-2', element:<ProductosServicios tipo={2}/>},
        {id:'pais-area-geo', name:'Países y Áreas Geográficas', icon:'bi bi-globe me-2', element: <ProductosServicios tipo={3}/>},
        {id:'transacciones-canales', name:'Transacciones y Canales', icon:'bi bi-arrow-repeat me-2', element: <ProductosServicios tipo={4}/>},
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