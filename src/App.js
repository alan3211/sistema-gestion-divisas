import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {useState} from "react";

import {HeaderComponent} from "./components/shared/header/HeaderComponent";
import {AsideComponent} from "./components/shared/aside/AsideComponent";
import {FooterComponent} from "./components/shared/footer/FooterComponent";
import {MainComponent} from "./components/shared/main/MainComponent";

import {AltaClientesComponent} from "./components/operacion/altaClientes";
import {CompraVentaComponent} from "./components/operacion/compraVenta";
import {LoginComponent} from "./components/login";
import {CajaComponent} from "./components/operacion/caja";
import {ToastContainer} from "react-toastify";
import {Usuarios} from "./components/administracion/Usuarios";
import {Sucursales} from "./components/administracion/Sucursales";
import {Catalogo} from "./components/administracion/Catalogo";
import {AltaClienteProvider} from "./context/AltaCliente/AltaClienteProvider";
import {CompraVentaProvider} from "./context/compraVenta/CompraVentaProvider";
import {CargaTipoCambio} from "./components/administracion/cargaTipoCambio/CargaTipoCambio";
import {CargaTipoCambioProvider} from "./context/CargaTipoCambio/CargaTipoCambioProvider";

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

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token,setToken] = useState({});

    return (
        <Router>
            {isLoggedIn && <HeaderComponent setIsLoggedIn={setIsLoggedIn} />}
            {isLoggedIn && <AsideComponent />}
            <Routes>
                <Route
                    exact
                    path="/"
                    element={<LoginComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
                />

                {
                    isLoggedIn ? (
                        <Route exact path="/inicio" element={<MainComponent/>} />
                    )
                    : null
                }

                <Route exact path="/altaClientes" element={<AltaClienteProvider><AltaClientesComponent /></AltaClienteProvider>} />
                <Route exact path="/compraVenta" element={<CompraVentaProvider><CompraVentaComponent /></CompraVentaProvider>} />
                <Route exact path="/caja" element={<CajaComponent />} />
                <Route exact path="/cargaTipoCambio" element={<CargaTipoCambioProvider><CargaTipoCambio /></CargaTipoCambioProvider>} />
                <Route exact path="/usuarios" element={<Usuarios />} />
                <Route exact path="/sucursales" element={<Sucursales />} />
                <Route exact path="/catalogos" element={<Catalogo />} />

                <Route path="/*" element={<Navigate to="/inicio"/>} />
            </Routes>
            {isLoggedIn && <FooterComponent />}
            <ToastContainer />
        </Router>
  );
}
export default App;
