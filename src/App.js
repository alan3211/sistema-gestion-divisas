import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {MainComponent} from "./components/shared/main/MainComponent";

import {CompraVentaComponent} from "./components/operacion/compraVenta";
import {LoginComponent} from "./components/login";
import {CajaComponent} from "./components/operacion/cajaOperativa";
import {Usuarios} from "./components/administracion/usuarios/Usuarios";
import {Catalogo} from "./components/administracion/catalogos/Catalogo";

import {CompraVentaProvider} from "./context/compraVenta/CompraVentaProvider";
import {CargaTipoCambio} from "./components/administracion/cargaTipoCambio/CargaTipoCambio";
import {CargaTipoCambioProvider} from "./context/CargaTipoCambio/CargaTipoCambioProvider";
import {MainLayout} from "./components/shared/MainLayout";
import {Tesoreria} from "./components/operacion/tesoreria/Tesoreria";
import {TesoreriaProvider} from "./context/tesoreria/TesoreriaProvider";
import {SucursalOperativa} from "./components/operacion/sucursalOperativa/SucursalOperativa";
import {ToastContainer} from "react-toastify";
import {PerfilComponent} from "./components/usuario/PerfilComponent";
import {HealthComponent} from "./components/shared/HealthComponent";
import {NotFound} from "./components/shared/NotFound";
import {Logistica} from "./components/operacion/logistica/Logistica";
import {AltaClienteFinal} from "./components/operacion/altaClientes/AltaClienteFinal";
import {Reportes} from "./components/reportes/Reportes";
import {useEffect} from "react";

export let dataG = JSON.parse(localStorage.getItem('usuario_data')) || {
    sucursal:0,
    username:"",
    perfil:"",
    id_perfil:0,
    usuario:"",
    direccion:"",
    nombre_sucursal:"",
    limite_diario:'',
    limite_mensual:'',
    estatus:0,
    menus:[],
};

const App = () => {

    // Al cargar la página, verifica si hay datos de usuario en localStorage y úsalos si están disponibles
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('v'));
        if (storedUserData) {
            dataG = storedUserData;
        }
    }, []);

    // Al cerrar la aplicación o al cambiar los datos del usuario, actualiza localStorage
    useEffect(() => {
        localStorage.setItem('usuario_data', JSON.stringify(dataG));
    }, [dataG]);

    return (
        <div className="app-root content">
            <Router>
                <Routes>
                    <Route exact  path="/" element={<LoginComponent/>}/>
                    <Route exact path="/health" element={<HealthComponent/>}/>
                    <Route path="/inicio" element={<MainLayout><MainComponent/></MainLayout>}/>
                    <Route path="/altaUsuarios" element={
                        <MainLayout><AltaClienteFinal/></MainLayout>}/>
                    <Route path="/compraVenta" element={
                        <MainLayout><CompraVentaProvider><CompraVentaComponent/></CompraVentaProvider></MainLayout>}/>
                    <Route exact path="/caja" element={<MainLayout><CajaComponent/></MainLayout>}/>
                    <Route exact path="/administracionSucursal"
                           element={<MainLayout><SucursalOperativa/></MainLayout>}/>
                    <Route exact path="/tesoreria"
                           element={<MainLayout><TesoreriaProvider><Tesoreria/></TesoreriaProvider></MainLayout>}/>
                    <Route exact path="/logistica"
                           element={<MainLayout><Logistica/></MainLayout>}/>
                    <Route exact path="/reportesEstadisticos"
                           element={<MainLayout><Reportes/></MainLayout>}/>
                    <Route exact path="/cargaTipoCambio" element={
                        <MainLayout><CargaTipoCambioProvider><CargaTipoCambio/></CargaTipoCambioProvider></MainLayout>}/>
                    <Route exact path="/usuariosSistema" element={<MainLayout><Usuarios/></MainLayout>}/>
                    <Route exact path="/catalogos" element={<MainLayout><Catalogo/></MainLayout>}/>
                    <Route exact path="/mi-perfil" element={<MainLayout><PerfilComponent/></MainLayout>}/>
                    <Route path="/*" element={<NotFound/>}/>
                </Routes>
            </Router>
            <ToastContainer/>
        </div>
  );
}
export default App;
