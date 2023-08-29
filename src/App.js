import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {useState} from "react";

import {HeaderComponent} from "./components/shared/header/HeaderComponent";
import {AsideComponent} from "./components/shared/aside/AsideComponent";
import {FooterComponent} from "./components/shared/footer/FooterComponent";
import {MainComponent} from "./components/shared/main/MainComponent";

import {AltaClientesComponent} from "./components/operacion/altaClientes";
import {CompraVentaComponent} from "./components/operacion/compraVenta";
import {LoginComponent} from "./components/login";
import {CajaComponent} from "./components/operacion/cajaOperativa";
import {Usuarios} from "./components/administracion/Usuarios";
import {Catalogo} from "./components/administracion/Catalogo";

import {AltaClienteProvider} from "./context/AltaCliente/AltaClienteProvider";
import {CompraVentaProvider} from "./context/compraVenta/CompraVentaProvider";
import {CargaTipoCambio} from "./components/administracion/cargaTipoCambio/CargaTipoCambio";
import {CargaTipoCambioProvider} from "./context/CargaTipoCambio/CargaTipoCambioProvider";
import {CajaSucursal} from "./components/operacion/cajaSucursal/CajaSucursal";
import {useAuth} from "./hook/useAuth";

export let dataG = {
    sucursal:0,
    username:"",
    perfil:"",
    usuario:"",
    direccion:"",
    nombre_sucursal:"",
    limite_diario:'',
    limite_mensual:''
};

const App = () => {
    const authenticated = useAuth();
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<LoginComponent/>}/>
                <Route
                    element={
                    authenticated ? (
                        <>
                          <HeaderComponent/>
                          <AsideComponent/>
                            <Route path="/inicio" element={<MainComponent />} />
                            <Route path="/altaClientes" element={<AltaClienteProvider><AltaClientesComponent /></AltaClienteProvider>}/>
                            <Route path="/compraVenta" element={<CompraVentaProvider><CompraVentaComponent /></CompraVentaProvider>}/>
                            <Route exact path="/caja" element={<CajaComponent />}/>
                            <Route exact path="/cajaSucursal" element={<CajaSucursal />} />
                            <Route exact path="/cargaTipoCambio" element={<CargaTipoCambioProvider><CargaTipoCambio /></CargaTipoCambioProvider>} />
                            <Route exact path="/usuarios" element={<Usuarios />} />
                            <Route exact path="/catalogos" element={<Catalogo />}/>
                            <Route path="/*" element={<Navigate to="/inicio"/>} />
                          <FooterComponent />
                        </>
                    )
                  : <Navigate to="/"/>}
                />
            </Routes>
        </Router>
  );
}
export default App;
